"use client";

import { Box, Flex, Text, Button, HStack, VStack, Input, Textarea, } from "@chakra-ui/react";
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { useCartStoreHydrated } from "@/shared/stores/useCartStore";
import { useRouter } from "next/navigation";
import { shippingApi, ShippingRate, ShippingItem } from "@/shared/api/shipping";
import { createPaymentIntent, CreatePaymentIntentRequest, CreatePaymentIntentResponse, } from "@/shared/api/payments";
import { completeOrder } from "@/shared/api/orders";
import PaymentFormWithElements from "./PaymentFormWithElements";

/* ---------- helpers to keep types strict (no any) ---------- */
type ErrorWithArrayMessage = { message: string[] };

function hasStringMessage(x: unknown): x is { message: string } {
  return (
    typeof x === "object" &&
    x !== null &&
    "message" in x &&
    typeof (x as { message: unknown }).message === "string"
  );
}

function hasArrayMessage(x: unknown): x is { message: string[] } {
  if (typeof x !== "object" || x === null || !("message" in x)) return false;
  const msg = (x as { message: unknown }).message;
  return Array.isArray(msg) && (msg as unknown[]).every((m) => typeof m === "string");
}

function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  if (hasStringMessage(e)) return e.message;
  return "Unknown error";
}

function getErrorMessageMaybeArray(e: unknown): string {
  if (hasArrayMessage(e)) return e.message.join("\n");
  return getErrorMessage(e);
}

function hasValidDims(item: {
  weight?: number | string;
  length?: number | string;
  width?: number | string;
  height?: number | string;
}) {
  const w = Number(item.weight);
  const l = Number(item.length);
  const wi = Number(item.width);
  const h = Number(item.height);
  return (
    Number.isFinite(w) &&
    w > 0 &&
    Number.isFinite(l) &&
    l > 0 &&
    Number.isFinite(wi) &&
    wi > 0 &&
    Number.isFinite(h) &&
    h > 0
  );
}

/* ---------- size map (same normalization as ShippingCalculator) ---------- */
type SizeRow = {
  dbItem: string;
  normalized: string;
  found: boolean;
  _weight: string;
  _length: string;
  _width: string;
  _height: string;
  _package: string;
};

type SizeFile = {
  matches: SizeRow[];
  nonMatches: SizeRow[];
};

function normalizeKey(s: string): string {
  return (s || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  inventoryId?: string;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  category: string;
};

function applySizeMapIfMissing(
  item: CartItem,
  sizeMap: Map<string, SizeRow> | null
): CartItem {
  if (hasValidDims(item) || !sizeMap) return item;
  // 🔎 add these logs:
  /*if (!item.category || !item.category.trim()) {
    console.log("[SIZE] missing category; skip map:", { id: item.id, name: item.name });
    return item;
  }*/
  const key = normalizeKey(item.category);
  const hit = sizeMap.get(key);
  //console.log("[SIZE] lookup(category):", { category: item.category, key, hit: !!hit });
  if (!hit) return item;
  //console.log("[SIZE] hit row:", { _w: hit._weight, _l: hit._length, _wi: hit._width, _h: hit._height });
  const next: CartItem = {
    ...item,
    weight: Number(hit._weight),
    length: Number(hit._length),
    width: Number(hit._width),
    height: Number(hit._height),
  };
  return next;
}

/* ----------------------------------------------------------------------- */

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCartStoreHydrated();
  const items = cart.items as CartItem[];
  const clearCart = cart.clear;

  // Log cart items whenever they change
  /* useEffect(() => {
    console.log("[CHK] cart items:", items);
  }, [items]);*/

  // Form states
  const [billingData, setBillingData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    country: "Australia",
    streetAddress: "",
    apartment: "",
    suburb: "",
    state: "New South Wales",
    postcode: "",
    phone: "",
    email: "",
  });

  const [shippingData, setShippingData] = useState({
    streetAddress: "",
    apartment: "",
    suburb: "",
    state: "New South Wales",
    postcode: "",
    phone: "",
  });

  const [orderNotes, setOrderNotes] = useState("");
  const [createAccount, setCreateAccount] = useState(false);
  const [emailSubscription, setEmailSubscription] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(true);

  // Shipping states
  const [selectedShipping, setSelectedShipping] = useState<ShippingRate | null>(null);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);

  // Error states
  const [billingErrors, setBillingErrors] = useState<Record<string, string>>({});
  const [shippingErrors, setShippingErrors] = useState<Record<string, string>>({});

  const [paymentIntentData, setPaymentIntentData] = useState<CreatePaymentIntentResponse | null>(null);
  const [isCreatingPaymentIntent, setIsCreatingPaymentIntent] = useState(false);

  // Calculations
  const subtotal = paymentIntentData
    ? paymentIntentData.subtotal
    : items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = paymentIntentData ? paymentIntentData.shippingCost : selectedShipping?.cost || 0;
  const total = paymentIntentData ? paymentIntentData.total : subtotal + shipping;

  // ===== Load size map (best-effort; do NOT block checkout if missing) =====
  const sizeMapRef = useRef<Map<string, SizeRow> | null>(null);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/matches_all_minparcel.json", { cache: "force-cache" });
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as SizeFile;
        const map = new Map<string, SizeRow>();
        for (const r of [...(data.matches || []), ...(data.nonMatches || [])]) {
          map.set(normalizeKey(r.normalized || r.dbItem), r);
        }
        if (mounted) sizeMapRef.current = map;
        //console.log("[CHK] size-map loaded, entries:", map.size);
      } catch {
        if (mounted) sizeMapRef.current = null; // silently continue
        //console.log("[CHK] size-map load FAILED");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Calculate shipping rates (attempt to auto-fill dims via size map first)
  const calculateShipping = useCallback(
    async (deliveryAddress: {
      suburb: string;
      state: string;
      postcode: string;
      streetAddress: string;
      country: string;
    }) => {
      //console.log("[SHIP] called with address:", deliveryAddress);
      if (!deliveryAddress.suburb || !deliveryAddress.postcode || !deliveryAddress.state) {
        console.warn("[Checkout] calculateShipping: missing address fields -> abort");
        return;
      }
      // First pass: try to fill missing dims from size map
      const sizeMap = sizeMapRef.current;
      const prepared: CartItem[] = items.map((it) => applySizeMapIfMissing(it, sizeMap));
      //console.log("[SHIP] prepared items:", prepared);
      // HARD BLOCK: don't call API if any item lacks dims AFTER fill attempt
      const invalid = prepared.filter((i) => !hasValidDims(i));
      if (invalid.length > 0) {
        setSelectedShipping(null);
        setPaymentIntentData(null);
        const errorMsg = `Missing weight/dimensions for: ${invalid.map((i) => i.name).join(", ")}. 
Please contact us for a shipping quote.`;
        setShippingError(errorMsg);
        /* console.log(
          "[SHIP] BLOCKED missing dims:",
          invalid.map(i => ({ name: i.name, weight: i.weight, length: i.length, width: i.width, height: i.height }))
        );*/
        return;
      }
      setIsCalculatingShipping(true);
      setShippingError(null);
      setSelectedShipping(null);
      setPaymentIntentData(null);
      try {
        const shippingItems: ShippingItem[] = prepared.map((item) => ({
          weight: Number(item.weight),
          length: Number(item.length),
          width: Number(item.width),
          height: Number(item.height),
          quantity: item.quantity,
          description: item.name,
        }));
        const warehouseAddress = {
          name: process.env.NEXT_PUBLIC_WAREHOUSE_NAME || "S-Twins Warehouse",
          streetAddress: process.env.NEXT_PUBLIC_WAREHOUSE_STREET || "755 The Horsley drv",
          suburb: process.env.NEXT_PUBLIC_WAREHOUSE_SUBURB || "Smithfield",
          state: process.env.NEXT_PUBLIC_WAREHOUSE_STATE || "NSW",
          postcode: process.env.NEXT_PUBLIC_WAREHOUSE_POSTCODE || "2164",
          country: process.env.NEXT_PUBLIC_WAREHOUSE_COUNTRY || "AU",
        };
        //console.log("[SHIP] warehouse env:", warehouseAddress);
        const requestPayload = {
          origin: warehouseAddress,
          destination: {
            name: "Customer",
            streetAddress: deliveryAddress.streetAddress,
            suburb: deliveryAddress.suburb,
            state: deliveryAddress.state,
            postcode: deliveryAddress.postcode,
            country: deliveryAddress.country,
          },
          items: shippingItems,
        };
        //console.log("[SHIP] request payload:", requestPayload);
        const _tShip = performance.now();
        const quote = await shippingApi.calculateRates(requestPayload);
        const sorted = [...quote.rates].sort((a, b) => a.cost - b.cost);
        //console.log("[SHIP] rates response (ms):", Math.round(performance.now() - _tShip), quote);
        if (sorted.length > 0) {
          setSelectedShipping(sorted[0]);
        } else {
          setSelectedShipping(null);
          setShippingError("No shipping rates available for this address.");
        }
      } catch (err: unknown) {
        const msg =
          typeof err === "object" && err && "message" in err
            ? String((err as { message?: unknown }).message)
            : "Unable to calculate shipping rates. Please check your address and product dimensions.";
        setShippingError(msg);
        setSelectedShipping(null);
        setPaymentIntentData(null);
        //console.log("[SHIP] ERROR:", err);
      } finally {
        setIsCalculatingShipping(false);
      }
    },
    [items]
  );

  useEffect(() => {
    const deliveryAddress = sameAsBilling ? billingData : shippingData;
    if (deliveryAddress.suburb && deliveryAddress.postcode && deliveryAddress.state) {
      //console.log("[SHIP] trigger:", { sameAsBilling, delivery: deliveryAddress });
      const timeoutId = setTimeout(() => {
        calculateShipping({
          suburb: deliveryAddress.suburb,
          state: deliveryAddress.state,
          postcode: deliveryAddress.postcode,
          streetAddress: deliveryAddress.streetAddress,
          country: "AU",
        });
      }, 1000);
      return () => {
        clearTimeout(timeoutId);
      };
    } else {
      setSelectedShipping(null);
    }
  }, [
    billingData.suburb,
    billingData.postcode,
    billingData.state,
    billingData.streetAddress,
    shippingData.suburb,
    shippingData.postcode,
    shippingData.state,
    shippingData.streetAddress,
    sameAsBilling,
    calculateShipping,
  ]);

  // Auto-create payment intent when all required data is available
  useEffect(() => {
    const createPaymentIntentAutomatically = async () => {
      if (
        !paymentIntentData &&
        !isCreatingPaymentIntent &&
        billingData.firstName &&
        billingData.lastName &&
        billingData.streetAddress &&
        billingData.suburb &&
        billingData.postcode &&
        billingData.phone &&
        billingData.email &&
        selectedShipping
      ) {
        //console.log("[PI] guard check has selectedShipping:", !!selectedShipping);
        // Try to fill missing dims from size map before the guard
        const sizeMap = sizeMapRef.current;
        const prepared: CartItem[] = items.map((it) => applySizeMapIfMissing(it, sizeMap));
        //console.log("[PI] prepared items:", prepared);
        // Guard: block PI if any item invalid AFTER fill attempt
        const invalidForPayment = prepared.filter((i) => !hasValidDims(i));
        if (invalidForPayment.length > 0) {
          //console.log("[PI] BLOCKED invalid items:", invalidForPayment);
          toast.error(
            `Missing weight/dimensions for: ${invalidForPayment
              .map((i) => i.name)
              .join(", ")}. We can't prepare payment until shipping can be calculated.`
          );
          return;
        }
        setIsCreatingPaymentIntent(true);
        try {
          // ***** coerce potentially undefined fields to strings *****
          const cartItems = prepared.map((item) => ({
            id: item.id,
            name: item.name || "Item",
            inventoryId: item.inventoryId ?? "",
            price: item.price,
            quantity: item.quantity,
            image: item.image ?? "",
            weight: Number(item.weight),
            length: Number(item.length),
            width: Number(item.width),
            height: Number(item.height),
          }));
          const shippingAddressData = sameAsBilling ? billingData : shippingData;
          const paymentIntentRequest: CreatePaymentIntentRequest = {
            items: cartItems,
            billingAddress: {
              firstName: billingData.firstName,
              lastName: billingData.lastName,
              companyName: billingData.companyName,
              country: billingData.country,
              streetAddress: billingData.streetAddress,
              apartment: billingData.apartment,
              suburb: billingData.suburb,
              state: billingData.state,
              postcode: billingData.postcode,
              phone: billingData.phone,
              email: billingData.email,
            },
            shippingAddress: sameAsBilling
              ? undefined
              : {
                  firstName: billingData.firstName,
                  lastName: billingData.lastName,
                  companyName: billingData.companyName,
                  country: "Australia",
                  streetAddress: shippingAddressData.streetAddress,
                  apartment: shippingAddressData.apartment,
                  suburb: shippingAddressData.suburb,
                  state: shippingAddressData.state,
                  postcode: shippingAddressData.postcode,
                  phone: shippingAddressData.phone || billingData.phone,
                  email: billingData.email,
                },
            shippingOption: {
              serviceType: "standard",
              cost: selectedShipping.cost,
              estimatedDays: selectedShipping.estimatedDays,
              carrier: selectedShipping.carrier || "Direct Freight",
            },
            currency: "aud",
          };
          //console.log("[PI] request:", paymentIntentRequest);
          const _tPi = performance.now();
          const response = await createPaymentIntent(paymentIntentRequest);
          //console.log("[PI] response (ms):", Math.round(performance.now() - _tPi), response);
          setPaymentIntentData(response);
        } catch (e: unknown) {
          //console.log("[PI] ERROR:", e);
          const errorMessage =
            e instanceof Error
              ? e.message
              : typeof e === "object" && e && "message" in e
              ? String((e as { message?: unknown }).message)
              : "Failed to create payment intent. Please try again.";
          toast.error(errorMessage);
        } finally {
          setIsCreatingPaymentIntent(false);
        }
      }
    };
    const timeoutId = setTimeout(createPaymentIntentAutomatically, 1000);
    return () => clearTimeout(timeoutId);
  }, [
    billingData,
    shippingData,
    sameAsBilling,
    selectedShipping,
    paymentIntentData,
    isCreatingPaymentIntent,
    items,
  ]);

  const handleBillingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBillingData((prev) => ({ ...prev, [name]: value }));
    if (billingErrors[name]) setBillingErrors((prev) => ({ ...prev, [name]: "" }));
    if (paymentIntentData) setPaymentIntentData(null);
  };

  const handleBillingSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBillingData((prev) => ({ ...prev, [name]: value }));
    if (billingErrors[name]) setBillingErrors((prev) => ({ ...prev, [name]: "" }));
    if (paymentIntentData) setPaymentIntentData(null);
  };

  const handleShippingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setShippingData((prev) => ({ ...prev, [name]: value }));
    if (shippingErrors[name]) setShippingErrors((prev) => ({ ...prev, [name]: "" }));
    if (paymentIntentData) setPaymentIntentData(null);
  };

  const handleShippingSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingData((prev) => ({ ...prev, [name]: value }));
    if (shippingErrors[name]) setShippingErrors((prev) => ({ ...prev, [name]: "" }));
    if (paymentIntentData) setPaymentIntentData(null);
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      //console.log("[ORDER] paymentIntentId:", paymentIntentId);
      toast.success("Payment successful! Processing your order...");
      const completeOrderData = {
        paymentIntentId,
        customer: {
          firstName: billingData.firstName,
          lastName: billingData.lastName,
          email: billingData.email,
          phone: billingData.phone,
          address: {
            street: billingData.streetAddress,
            apartment: billingData.apartment || "",
            city: billingData.suburb,
            state: billingData.state,
            postcode: billingData.postcode,
            country: billingData.country,
          },
        },
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          inventoryId: item.inventoryId,
          image: item.image,
        })),
        totalAmount: paymentIntentData?.total || 0,
        shippingMethod: selectedShipping?.serviceType,
        shippingCost: selectedShipping?.cost,
      };
      //console.log("[ORDER] complete request:", completeOrderData);
      const _tOrder = performance.now();
      const completeResponse = await completeOrder(completeOrderData);
      /*console.log(
        "[ORDER] complete response (ms):",
        Math.round(performance.now() - _tOrder),
        completeResponse
      );*/
      if (completeResponse.success) {
        if (completeResponse.externalSubmissionSuccess) {
          toast.success(
            "Order confirmed and sent to inventory system! You'll receive confirmation emails shortly."
          );
        } else {
          toast.success(
            "Order confirmed! Processing for fulfillment... You'll receive confirmation emails shortly."
          );
          console.warn("External system submission failed:", completeResponse.externalOrderReference);
        }
        clearCart();
        router.push(
          `/order-confirmation?paymentIntentId=${paymentIntentId}&externalRef=${
            completeResponse.externalOrderReference || ""
          }&success=true`
        );
      } else {
        toast.error(
          "Payment successful, but order processing encountered an issue. Please contact support with your payment ID: " +
            paymentIntentId
        );
        router.push(
          `/order-confirmation?paymentIntentId=${paymentIntentId}&error=processing`
        );
      }
    } catch (error) {
      //console.log("[ORDER] ERROR:", error);
      toast.error(
        "Payment successful, but order processing failed. Please contact support with your payment ID: " +
          paymentIntentId
      );
      router.push(
        `/order-confirmation?paymentIntentId=${paymentIntentId}&error=processing`
      );
    }
  };

  const handlePaymentError = (error: string) => {
    toast.error(error);
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    type: "number" | "phone"
  ) => {
    if (type === "number") {
      if (
        !/[0-9]/.test(e.key) &&
        !["Backspace", "Delete", "Tab", "Enter", "ArrowLeft", "ArrowRight"].includes(e.key)
      ) {
        e.preventDefault();
      }
    } else if (type === "phone") {
      if (
        !/[0-9\s\-\+\(\)]/.test(e.key) &&
        !["Backspace", "Delete", "Tab", "Enter", "ArrowLeft", "ArrowRight"].includes(e.key)
      ) {
        e.preventDefault();
      }
    }
  };

  if (items.length === 0) {
    return (
      <Box as="section" bg="gray.50" minH="100vh" py={20}>
        <Box maxW="1200px" mx="auto" px={{ base: 6, md: 12, lg: 16 }} textAlign="center">
          <Text fontSize="2xl" fontWeight="bold" color="gray.600" mb={4}>
            Your cart is empty
          </Text>
          <Text fontSize="lg" color="gray.500" mb={8}>
            Add some products to proceed to checkout
          </Text>
          <Button
            bg="#d80c19"
            color="white"
            _hover={{ bg: "#b30915" }}
            size="lg"
            onClick={() => router.push("/parts")}
          >
            Browse Products
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box as="section" bg="linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)" minH="100vh" py={10}>
      <Box maxW="1400px" mx="auto" px={{ base: 6, md: 12, lg: 16 }}>
        {/* Page Title */}
        <Box textAlign="center" mb={12}>
          <Text
            fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
            fontWeight="bold"
            bgGradient="linear(to-r, #d80c19, #ff6b6b)"
            bgClip="text"
            mb={4}
          >
            Checkout
          </Text>
          <Box w="100px" h="4px" bgGradient="linear(to-r, #d80c19, #ff6b6b)" mx="auto" borderRadius="full" />
        </Box>

        <Flex direction={{ base: "column", lg: "row" }} gap={8}>
          {/* Left Column - Forms */}
          <Box flex="1" maxW={{ base: "100%", lg: "60%" }}>
            {/* Returning Customer */}
            <Box
              bg="white"
              p={6}
              borderRadius="xl"
              mb={6}
              boxShadow="0 4px 20px rgba(0,0,0,0.08)"
              border="1px solid"
              borderColor="gray.100"
            >
              <HStack gap={3}>
                <input type="checkbox" style={{ accentColor: "#d80c19", width: "18px", height: "18px" }} />
                <Text fontSize="md" color="gray.700" fontWeight="500">
                  Returning customer? Click here to login
                </Text>
              </HStack>
            </Box>

            {/* Coupon Code */}
            <Box
              bg="white"
              p={6}
              borderRadius="xl"
              mb={6}
              boxShadow="0 4px 20px rgba(0,0,0,0.08)"
              border="1px solid"
              borderColor="gray.100"
            >
              <HStack gap={3}>
                <input type="checkbox" style={{ accentColor: "#d80c19", width: "18px", height: "18px" }} />
                <Text fontSize="md" color="gray.700" fontWeight="500">
                  Have a coupon? Click here to enter your code
                </Text>
              </HStack>
            </Box>

            {/* Billing Details */}
            <Box
              bg="white"
              p={8}
              borderRadius="xl"
              mb={8}
              boxShadow="0 4px 20px rgba(0,0,0,0.08)"
              border="1px solid"
              borderColor="gray.100"
            >
              <Box mb={6}>
                <Text fontSize="2xl" fontWeight="bold" mb={2} color="gray.800">
                  Billing Details
                </Text>
                <Box w="60px" h="3px" bgGradient="linear(to-r, #d80c19, #ff6b6b)" borderRadius="full" />
              </Box>

              <VStack gap={4} align="stretch">
                {/* Name Row */}
                <Flex direction={{ base: "column", md: "row" }} gap={4}>
                  <Box flex="1">
                    <Text mb={2} fontWeight="500" color="gray.700">
                      First name *
                    </Text>
                    <Input
                      name="firstName"
                      value={billingData.firstName}
                      onChange={handleBillingChange}
                      borderColor={billingErrors.firstName ? "red.500" : "gray.300"}
                      _focus={{
                        borderColor: billingErrors.firstName ? "red.500" : "#d80c19",
                        boxShadow: billingErrors.firstName ? "0 0 0 1px red.500" : "0 0 0 1px #d80c19",
                      }}
                    />
                    {billingErrors.firstName && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {billingErrors.firstName}
                      </Text>
                    )}
                  </Box>
                  <Box flex="1">
                    <Text mb={2} fontWeight="500" color="gray.700">
                      Last name *
                    </Text>
                    <Input
                      name="lastName"
                      value={billingData.lastName}
                      onChange={handleBillingChange}
                      borderColor={billingErrors.lastName ? "red.500" : "gray.300"}
                      _focus={{
                        borderColor: billingErrors.lastName ? "red.500" : "#d80c19",
                        boxShadow: billingErrors.lastName ? "0 0 0 1px red.500" : "0 0 0 1px #d80c19",
                      }}
                    />
                    {billingErrors.lastName && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {billingErrors.lastName}
                      </Text>
                    )}
                  </Box>
                </Flex>

                {/* Company Name */}
                <Box>
                  <Text mb={2} fontWeight="500" color="gray.700">
                    Company name (optional)
                  </Text>
                  <Input
                    name="companyName"
                    value={billingData.companyName}
                    onChange={handleBillingChange}
                    borderColor="gray.300"
                    _focus={{ borderColor: "#d80c19", boxShadow: "0 0 0 1px #d80c19" }}
                  />
                </Box>

                {/* Street Address */}
                <Box>
                  <Text mb={2} fontWeight="500" color="gray.700">
                    Street address *
                  </Text>
                  <Input
                    name="streetAddress"
                    value={billingData.streetAddress}
                    onChange={handleBillingChange}
                    placeholder="House number and street name"
                    borderColor={billingErrors.streetAddress ? "red.500" : "gray.300"}
                    _focus={{
                      borderColor: billingErrors.streetAddress ? "red.500" : "#d80c19",
                      boxShadow: billingErrors.streetAddress ? "0 0 0 1px red.500" : "0 0 0 1px #d80c19",
                    }}
                  />
                  {billingErrors.streetAddress && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {billingErrors.streetAddress}
                    </Text>
                  )}
                </Box>

                {/* Apartment */}
                <Box>
                  <Text mb={2} fontWeight="500" color="gray.700">
                    Apartment, suite, unit, etc. (optional)
                  </Text>
                  <Input
                    name="apartment"
                    value={billingData.apartment}
                    onChange={handleBillingChange}
                    borderColor="gray.300"
                    _focus={{ borderColor: "#d80c19", boxShadow: "0 0 0 1px #d80c19" }}
                  />
                </Box>

                {/* Suburb, State, Postcode Row */}
                <Flex direction={{ base: "column", md: "row" }} gap={4}>
                  <Box flex="1">
                    <Text mb={2} fontWeight="500" color="gray.700">
                      Suburb *
                    </Text>
                    <Input
                      name="suburb"
                      value={billingData.suburb}
                      onChange={handleBillingChange}
                      borderColor={billingErrors.suburb ? "red.500" : "gray.300"}
                      _focus={{
                        borderColor: billingErrors.suburb ? "red.500" : "#d80c19",
                        boxShadow: billingErrors.suburb ? "0 0 0 1px red.500" : "0 0 0 1px #d80c19",
                      }}
                    />
                    {billingErrors.suburb && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {billingErrors.suburb}
                      </Text>
                    )}
                  </Box>
                  <Box flex="1">
                    <Text mb={2} fontWeight="500" color="gray.700">
                      State *
                    </Text>
                    <select
                      name="state"
                      value={billingData.state}
                      onChange={handleBillingSelectChange}
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "1px solid #E2E8F0",
                        borderRadius: "6px",
                        backgroundColor: "white",
                        fontSize: "16px",
                      }}
                    >
                      <option value="New South Wales">New South Wales</option>
                      <option value="Victoria">Victoria</option>
                      <option value="Queensland">Queensland</option>
                      <option value="Western Australia">Western Australia</option>
                      <option value="South Australia">South Australia</option>
                      <option value="Tasmania">Tasmania</option>
                      <option value="Australian Capital Territory">Australian Capital Territory</option>
                      <option value="Northern Territory">Northern Territory</option>
                    </select>
                  </Box>
                  <Box flex="1">
                    <Text mb={2} fontWeight="500" color="gray.700">
                      Postcode *
                    </Text>
                    <Input
                      name="postcode"
                      value={billingData.postcode}
                      onChange={handleBillingChange}
                      onKeyPress={(e) => handleKeyPress(e, "number")}
                      borderColor={billingErrors.postcode ? "red.500" : "gray.300"}
                      _focus={{
                        borderColor: billingErrors.postcode ? "red.500" : "#d80c19",
                        boxShadow: billingErrors.postcode ? "0 0 0 1px red.500" : "0 0 0 1px #d80c19",
                      }}
                    />
                    {billingErrors.postcode && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {billingErrors.postcode}
                      </Text>
                    )}
                  </Box>
                </Flex>

                {/* Phone and Email Row */}
                <Flex direction={{ base: "column", md: "row" }} gap={4}>
                  <Box flex="1">
                    <Text mb={2} fontWeight="500" color="gray.700">
                      Phone *
                    </Text>
                    <Input
                      name="phone"
                      value={billingData.phone}
                      onChange={handleBillingChange}
                      onKeyPress={(e) => handleKeyPress(e, "phone")}
                      borderColor={billingErrors.phone ? "red.500" : "gray.300"}
                      _focus={{
                        borderColor: billingErrors.phone ? "red.500" : "#d80c19",
                        boxShadow: billingErrors.phone ? "0 0 0 1px red.500" : "0 0 0 1px #d80c19",
                      }}
                    />
                    {billingErrors.phone && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {billingErrors.phone}
                      </Text>
                    )}
                  </Box>
                  <Box flex="1">
                    <Text mb={2} fontWeight="500" color="gray.700">
                      Email address *
                    </Text>
                    <Input
                      name="email"
                      type="email"
                      value={billingData.email}
                      onChange={handleBillingChange}
                      borderColor={billingErrors.email ? "red.500" : "gray.300"}
                      _focus={{
                        borderColor: billingErrors.email ? "red.500" : "#d80c19",
                        boxShadow: billingErrors.email ? "0 0 0 1px red.500" : "0 0 0 1px #d80c19",
                      }}
                    />
                    {billingErrors.email && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {billingErrors.email}
                      </Text>
                    )}
                  </Box>
                </Flex>

                {/* Create Account */}
                <HStack gap={3}>
                  <input
                    type="checkbox"
                    checked={createAccount}
                    onChange={(e) => setCreateAccount(e.target.checked)}
                    style={{ accentColor: "#d80c19" }}
                  />
                  <Text>Create an account?</Text>
                </HStack>
              </VStack>
            </Box>

            {/* Shipping Details */}
            <Box
              bg="white"
              p={8}
              borderRadius="xl"
              mb={8}
              boxShadow="0 4px 20px rgba(0,0,0,0.08)"
              border="1px solid"
              borderColor="gray.100"
            >
              <Box mb={6}>
                <Text fontSize="2xl" fontWeight="bold" mb={2} color="gray.800">
                  Shipping Details
                </Text>
                <Box w="60px" h="3px" bgGradient="linear(to-r, #d80c19, #ff6b6b)" borderRadius="full" />
              </Box>

              <HStack gap={3} mb={4}>
                <input
                  type="checkbox"
                  checked={sameAsBilling}
                  onChange={(e) => setSameAsBilling(e.target.checked)}
                  style={{ accentColor: "#d80c19" }}
                />
                <Text>Ship to a different address?</Text>
              </HStack>

              {!sameAsBilling && (
                <VStack gap={4} align="stretch">
                  {/* Street Address */}
                  <Box>
                    <Text mb={2} fontWeight="500" color="gray.700">
                      Street address *
                    </Text>
                    <Input
                      name="streetAddress"
                      value={shippingData.streetAddress}
                      onChange={handleShippingChange}
                      placeholder="House number and street name"
                      borderColor={shippingErrors.streetAddress ? "red.500" : "gray.300"}
                      _focus={{
                        borderColor: shippingErrors.streetAddress ? "red.500" : "#d80c19",
                        boxShadow: shippingErrors.streetAddress ? "0 0 0 1px red.500" : "0 0 0 1px #d80c19",
                      }}
                    />
                    {shippingErrors.streetAddress && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {shippingErrors.streetAddress}
                      </Text>
                    )}
                  </Box>

                  {/* Apartment */}
                  <Box>
                    <Text mb={2} fontWeight="500" color="gray.700">
                      Apartment, suite, unit, etc. (optional)
                    </Text>
                    <Input
                      name="apartment"
                      value={shippingData.apartment}
                      onChange={handleShippingChange}
                      borderColor="gray.300"
                      _focus={{ borderColor: "#d80c19", boxShadow: "0 0 0 1px #d80c19" }}
                    />
                  </Box>

                  {/* Suburb, State, Postcode Row */}
                  <Flex direction={{ base: "column", md: "row" }} gap={4}>
                    <Box flex="1">
                      <Text mb={2} fontWeight="500" color="gray.700">
                        Suburb *
                      </Text>
                      <Input
                        name="suburb"
                        value={shippingData.suburb}
                        onChange={handleShippingChange}
                        borderColor={shippingErrors.suburb ? "red.500" : "gray.300"}
                        _focus={{
                          borderColor: shippingErrors.suburb ? "red.500" : "#d80c19",
                          boxShadow: shippingErrors.suburb ? "0 0 0 1px red.500" : "0 0 0 1px #d80c19",
                        }}
                      />
                      {shippingErrors.suburb && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {shippingErrors.suburb}
                        </Text>
                      )}
                    </Box>
                    <Box flex="1">
                      <Text mb={2} fontWeight="500" color="gray.700">
                        State *
                      </Text>
                      <select
                        name="state"
                        value={shippingData.state}
                        onChange={handleShippingSelectChange}
                        style={{
                          width: "100%",
                          padding: "12px",
                          border: "1px solid #E2E8F0",
                          borderRadius: "6px",
                          backgroundColor: "white",
                          fontSize: "16px",
                        }}
                      >
                        <option value="New South Wales">New South Wales</option>
                        <option value="Victoria">Victoria</option>
                        <option value="Queensland">Queensland</option>
                        <option value="Western Australia">Western Australia</option>
                        <option value="South Australia">South Australia</option>
                        <option value="Tasmania">Tasmania</option>
                        <option value="Australian Capital Territory">Australian Capital Territory</option>
                        <option value="Northern Territory">Northern Territory</option>
                      </select>
                    </Box>
                    <Box flex="1">
                      <Text mb={2} fontWeight="500" color="gray.700">
                        Postcode *
                      </Text>
                      <Input
                        name="postcode"
                        value={shippingData.postcode}
                        onChange={handleShippingChange}
                        onKeyPress={(e) => handleKeyPress(e, "number")}
                        borderColor={shippingErrors.postcode ? "red.500" : "gray.300"}
                        _focus={{
                          borderColor: shippingErrors.postcode ? "red.500" : "#d80c19",
                          boxShadow: shippingErrors.postcode ? "0 0 0 1px red.500" : "0 0 0 1px #d80c19",
                        }}
                      />
                      {shippingErrors.postcode && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {shippingErrors.postcode}
                        </Text>
                      )}
                    </Box>
                  </Flex>

                  {/* Phone */}
                  <Box>
                    <Text mb={2} fontWeight="500" color="gray.700">
                      Phone (optional)
                    </Text>
                    <Input
                      name="phone"
                      value={shippingData.phone}
                      onChange={handleShippingChange}
                      onKeyPress={(e) => handleKeyPress(e, "phone")}
                      borderColor={shippingErrors.phone ? "red.500" : "gray.300"}
                      _focus={{
                        borderColor: shippingErrors.phone ? "red.500" : "#d80c19",
                        boxShadow: shippingErrors.phone ? "0 0 0 1px red.500" : "0 0 0 1px #d80c19",
                      }}
                    />
                    {shippingErrors.phone && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {shippingErrors.phone}
                      </Text>
                    )}
                  </Box>
                </VStack>
              )}
            </Box>

            {/* Order Notes */}
            <Box
              bg="white"
              p={8}
              borderRadius="xl"
              mb={8}
              boxShadow="0 4px 20px rgba(0,0,0,0.08)"
              border="1px solid"
              borderColor="gray.100"
            >
              <Box mb={6}>
                <Text fontSize="2xl" fontWeight="bold" mb={2} color="gray.800">
                  Order Notes
                </Text>
                <Text fontSize="sm" color="gray.500" mb={4}>
                  (Optional)
                </Text>
                <Box w="60px" h="3px" bgGradient="linear(to-r, #d80c19, #ff6b6b)" borderRadius="full" />
              </Box>

              <Textarea
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Notes about your order, e.g. special notes for delivery."
                rows={4}
                resize="vertical"
                borderColor="gray.300"
                _focus={{ borderColor: "#d80c19", boxShadow: "0 0 0 1px #d80c19" }}
              />
            </Box>
          </Box>

          {/* Right Column - Order Summary & Payment */}
          <Box flex="1" maxW={{ base: "100%", lg: "40%" }}>
            <Box
              bg="white"
              p={8}
              borderRadius="xl"
              mb={8}
              boxShadow="0 4px 20px rgba(0,0,0,0.08)"
              border="1px solid"
              borderColor="gray.100"
            >
              <Box mb={6}>
                <Text fontSize="2xl" fontWeight="bold" mb={2} color="gray.800">
                  Your Order
                </Text>
                <Box w="60px" h="3px" bgGradient="linear(to-r, #d80c19, #ff6b6b)" borderRadius="full" />
              </Box>

              <VStack gap={3} align="stretch" mb={4}>
                {items.map((item) => (
                  <Flex key={item.id} justify="space-between" align="center">
                    <Box flex="1" minW="0">
                      <Text fontSize="sm" color="gray.800" lineHeight="1.3">
                        {item.name}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        x {item.quantity}
                      </Text>
                    </Box>
                    <Text fontWeight="bold" color="black" fontSize="sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </Flex>
                ))}
              </VStack>

              <Box w="full" h="1px" bg="gray.200" mb={4} />

              <VStack gap={2} align="stretch" mb={6}>
                <Flex justify="space-between">
                  <Text color="gray.600">Subtotal</Text>
                  <Text fontWeight="bold" color="black">
                    ${subtotal.toFixed(2)}
                  </Text>
                </Flex>
                <Flex justify="space-between">
                  <Text color="gray.600">Shipping</Text>
                  {isCalculatingShipping ? (
                    <Text fontSize="sm" color="gray.500">
                      Calculating...
                    </Text>
                  ) : shippingError ? (
                    <Text fontSize="sm" color="red.500" textAlign="right" maxW="240px">
                      {shippingError}
                    </Text>
                  ) : selectedShipping ? (
                    <VStack align="end" gap={0}>
                      <Text fontWeight="bold" color="black">
                        ${selectedShipping.cost.toFixed(2)}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {selectedShipping.serviceName}
                      </Text>
                    </VStack>
                  ) : (
                    <Text fontSize="sm" color="gray.500">
                      Enter address
                    </Text>
                  )}
                </Flex>
                <Box w="full" h="1px" bg="gray.200" />
                <Flex justify="space-between" fontSize="lg">
                  <Text fontWeight="bold" color="black">
                    Total
                  </Text>
                  <Text fontWeight="bold" color="black">
                    ${total.toFixed(2)}
                  </Text>
                </Flex>
              </VStack>

              {/* Email Subscription */}
              <Box mb={6}>
                <HStack gap={3}>
                  <input
                    type="checkbox"
                    checked={emailSubscription}
                    onChange={(e) => setEmailSubscription(e.target.checked)}
                    style={{ accentColor: "#d80c19" }}
                  />
                  <Text fontSize="sm">
                    I would like to receive exclusive emails with discounts and product information
                  </Text>
                </HStack>
              </Box>

              {/* Payment Form */}
              {paymentIntentData ? (
                <PaymentFormWithElements
                  clientSecret={paymentIntentData.clientSecret}
                  amount={paymentIntentData.total}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              ) : (
                <Box
                  bg="gray.50"
                  p={6}
                  borderRadius="xl"
                  textAlign="center"
                  border="1px solid"
                  borderColor="gray.200"
                >
                  <Text color="gray.600" mb={2}>
                    {isCreatingPaymentIntent
                      ? "Preparing payment form..."
                      : "Complete your billing details above to enable payment"}
                  </Text>
                  {isCreatingPaymentIntent && (
                    <Box display="flex" justifyContent="center" mt={2}>
                      <Box w="4" h="4" borderRadius="full" bg="#d80c19" />
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}