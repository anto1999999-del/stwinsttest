"use client";

import {
  Box,
  Flex,
  Text,
  Button,
  VStack,
  HStack,
  Tabs,
  useTabs,
  Input,
  Textarea,
} from "@chakra-ui/react";
import Image from "next/image";
import { useCartStore } from "@/shared/stores/useCartStore";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { submitOffer } from "@/shared/api/parts";

interface SingleProductPageProps {
  product: {
    id: string;
    title: string;
    price: number;
    stock: string;
    model: string;
    year: number;
    stockNumber: string;
    tagNumber: string;
    odometer: number;
    make: string;
    description: string;
    mainImage: string;
    thumbnailImage: string;
    gallery: string[];
    tag: number | string | null;
    odo: number | string | null;
    desc: string;
    manufacturer: string;
    weight?: number | string | null;
    warranty?: string;
    length?: number | string | null;
    width?: number | string | null;
    height?: number | string | null;
    inventoryId?: string;
    oemnumber?: string;
    category: string;
  };
}

/* ---------- helpers ---------- */
const defaultImage =
  "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500";

function resolveImageSrc(raw?: string): string {
  if (!raw || !raw.trim()) return defaultImage;

  if (raw.startsWith("/")) {
    const backend =
      process.env.NEXT_PUBLIC_BACK_END ||
      process.env.BACK_END ||
      (typeof window !== "undefined" ? window.location.origin : "");
    return `${backend}${raw}`;
  }

  try {
    const u = new URL(raw);
    const needsProxy =
      u.hostname.includes("pinpro") ||
      (typeof window !== "undefined" && u.origin !== window.location.origin);

    if (needsProxy) {
      const origin =
        (typeof window !== "undefined" && window.location.origin) || "";
      return `${origin}/api/image-proxy?url=${encodeURIComponent(raw)}`;
    }
    return raw;
  } catch {
    const backend =
      process.env.NEXT_PUBLIC_BACK_END ||
      process.env.BACK_END ||
      (typeof window !== "undefined" ? window.location.origin : "");
    return `${backend}/${raw.replace(/^\/+/, "")}`;
  }
}

/** number|string|null|undefined -> number|null */
const parseDim = (v: unknown): number | null => {
  if (v === null || v === undefined || v === "") return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  const n = parseFloat(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
};
/* ----------------------------- */

const SingleProductPage = ({ product }: SingleProductPageProps) => {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);

  // Normalize all image sources once
  const normalizedMain = useMemo(
    () => resolveImageSrc(product.mainImage),
    [product.mainImage]
  );
  const normalizedGallery = useMemo(
    () => (product.gallery ?? []).map(resolveImageSrc),
    [product.gallery]
  );

  // Use normalized main image as initial/current
  const [currentImage, setCurrentImage] = useState<string>(normalizedMain);
  useEffect(() => {
    setCurrentImage(normalizedMain);
  }, [normalizedMain]);

  const tabs = useTabs({ defaultValue: "details" });
  const infoTabs = useTabs({ defaultValue: "description" });

  const isInCart = items.some((item) => item.id === product.id);

  const handleToggleCart = () => {
    if (isInCart) {
      removeItem(product.id);
    } else {
      addItem({
        id: product.id,
        name: product.title,
        price: product.price,
        quantity: 1,
        image: normalizedMain || defaultImage,
        inventoryId: product.inventoryId,
        weight: parseDim(product.weight) ?? 0,
        length: parseDim(product.length) ?? 0,
        width: parseDim(product.width) ?? 0,
        height: parseDim(product.height) ?? 0,
        category: product.category,
      });
    }
  };

  const WarrantyInfo = () => (
    <VStack align="flex-start" gap={4}>
      <Text fontSize="sm" color="white">
        All our used mechanical parts come with a standard 6-month parts-only
        warranty. Extended warranty options are available for 6-month or
        12-month coverage, with choices of parts-only or parts-and-labour
        protection. We also supply a wide range of quality rebuilt and brand-new
        replacement parts.
      </Text>
      <Box borderTop="1px solid" borderColor="gray.600" w="full" />
      <Box>
        <Text fontSize="sm" fontWeight="semibold" color="white" mb={2}>
          - All second-hand mechanical parts include a 6-month parts-only
          warranty.
        </Text>
        <Text fontSize="sm" fontWeight="semibold" color="white" mb={2}>
          - Extended warranties available: 6 or 12 months, parts-only or
          parts-and-labour.
        </Text>
        <Text fontSize="sm" fontWeight="semibold" color="white">
          - Rebuilt, reconditioned, and new parts also available with 6 to 12
          months coverage.
        </Text>
      </Box>
    </VStack>
  );

  // derived dims once for reuse in both UI sections
  const L = parseDim(product.length);
  const W = parseDim(product.width);
  const H = parseDim(product.height);
  const Weight = parseDim(product.weight);

  const volumeCm3 = L !== null && W !== null && H !== null ? L * W * H : null;
  const volumeM3 = volumeCm3 !== null ? volumeCm3 / 1_000_000 : null;

  // --- Make an Offer: state + "soft" reCAPTCHA + submit handler ---
  const [isOfferOpen, setOfferOpen] = useState(false);
  const [offerName, setOfferName] = useState("");
  const [offerEmail, setOfferEmail] = useState("");
  const [offerPrice, setOfferPrice] = useState<string>("");
  const [offerMessage, setOfferMessage] = useState("");
  const [offerLoading, setOfferLoading] = useState(false);

  /**
   * For now we **bypass** calling the real reCAPTCHA on this form.
   * The backend treats this token as optional, so a static value is fine,
   * and avoids intermittent "Invalid site key or not loaded in api.js" errors.
   */
  async function getRecaptchaToken(): Promise<string> {
    return "offer-form-bypass";
  }

  const onSubmitOffer = async () => {
    if (offerLoading) return;
    const priceNum = Number(offerPrice);
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      toast.error("Enter a valid offer amount");
      return;
    }
    if (!offerName.trim() || !offerEmail.trim()) {
      toast.error("Name and email are required");
      return;
    }

    setOfferLoading(true);
    try {
      const recaptchaToken = await getRecaptchaToken();

      const res = await submitOffer(product.id, {
        inventoryId: product.inventoryId,
        askingPrice: Number(product.price),
        offerPrice: priceNum,
        name: offerName.trim(),
        email: offerEmail.trim(),
        message: offerMessage.trim(),
        recaptchaToken,
      });

      if (res?.success) {
        toast.success("Offer submitted. We’ll get back to you shortly.");
        setOfferOpen(false);
        setOfferName("");
        setOfferEmail("");
        setOfferPrice("");
        setOfferMessage("");
      } else {
        toast.error(res?.message || res?.error || "Failed to submit offer");
      }
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : typeof e === "string"
          ? e
          : "Failed to submit offer";
      toast.error(msg);
    } finally {
      setOfferLoading(false);
    }
  };

  return (
    <Box bg="black" minH="100vh" color="white" p={8}>
      <Box maxW="1400px" mx="auto">
        {/* Main Product Section */}
        <Flex direction={{ base: "column", lg: "row" }} gap={8} mb={8}>
          {/* Left: Images */}
          <Box w={{ base: "100%", lg: "60%" }}>
            <Box position="relative" mb={4} borderRadius="lg" overflow="hidden">
              {currentImage ? (
                <Image
                  src={currentImage}
                  alt={product.title}
                  width={800}
                  height={500}
                  unoptimized
                  style={{ width: "100%", height: "500px", objectFit: "cover" }}
                />
              ) : (
                <Box
                  width="100%"
                  height="500px"
                  bg="gray.200"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="gray.500"
                  fontSize="lg"
                >
                  No Image Available
                </Box>
              )}

              <Box
                position="absolute"
                top="4"
                right="4"
                bg="white"
                color="black"
                px={3}
                py={2}
                borderRadius="md"
                fontSize="lg"
                fontWeight="bold"
              >
                S TWINS
              </Box>
              <Box
                position="absolute"
                bottom="4"
                left="4"
                color="white"
                fontSize="md"
                fontWeight="600"
                textShadow="2px 2px 4px rgba(0,0,0,0.8)"
              >
                S TWINS (SYDNEY)
              </Box>
            </Box>

            {/* Thumbnails */}
            <Box
              mx="auto"
              maxW={{ base: "100%", lg: "calc(6 * 100px + 5 * 16px)" }}
              overflowX="auto"
              pb={2}
            >
              <HStack
                gap={4}
                justify="flex-start"
                flexWrap="nowrap"
                style={{ scrollSnapType: "x mandatory" }}
              >
                {/* Main thumb */}
                <Box
                  border="2px solid"
                  borderColor={
                    currentImage === normalizedMain ? "#d80c19" : "gray.400"
                  }
                  borderRadius="md"
                  overflow="hidden"
                  w="100px"
                  h="80px"
                  cursor="pointer"
                  transition="all 0.2s"
                  _hover={{ borderColor: "#d80c19" }}
                  onClick={() => setCurrentImage(normalizedMain)}
                  flex="0 0 auto"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <Image
                    src={normalizedMain}
                    alt="Main image"
                    width={100}
                    height={100}
                    unoptimized
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Box>

                {/* Gallery */}
                {normalizedGallery.length > 0 &&
                  normalizedGallery.map((imageUrl, index) => (
                    <Box
                      key={index}
                      border="2px solid"
                      borderColor={
                        currentImage === imageUrl ? "#d80c19" : "gray.400"
                      }
                      borderRadius="md"
                      overflow="hidden"
                      w="100px"
                      h="80px"
                      cursor="pointer"
                      transition="all 0.2s"
                      _hover={{ borderColor: "#d80c19" }}
                      onClick={() => setCurrentImage(imageUrl)}
                      flex="0 0 auto"
                      style={{ scrollSnapAlign: "start" }}
                    >
                      <Image
                        src={imageUrl}
                        alt={`Gallery image ${index + 1}`}
                        width={100}
                        height={100}
                        unoptimized
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  ))}
              </HStack>
            </Box>
          </Box>

          {/* Right: Info */}
          <Box w={{ base: "100%", lg: "40%" }}>
            <VStack align="flex-start" gap={6} h="full">
              <Text
                fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
                fontWeight="bold"
                color="#d80c19"
                lineHeight="1.2"
              >
                {product.title}
              </Text>

              <Box
                bg="gray.800"
                p={4}
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.600"
                w="full"
              >
                <Text fontSize="lg" fontWeight="600" color="white" mb={3}>
                  Item Details
                </Text>

                <Tabs.RootProvider
                  lazyMount
                  unmountOnExit
                  defaultValue="details"
                  colorPalette={"red"}
                  value={tabs}
                >
                  <Tabs.List
                    borderBottom="1px solid"
                    borderColor="gray.600"
                    className="product-tabs-list"
                  >
                    <Tabs.Trigger
                      value="details"
                      color={tabs.value === "details" ? "red" : ""}
                    >
                      Details
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      value="warranty"
                      color={tabs.value === "warranty" ? "red" : ""}
                    >
                      Warranty
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      value="shipping"
                      color={tabs.value === "shipping" ? "red" : ""}
                    >
                      Shipping & Handling
                    </Tabs.Trigger>
                  </Tabs.List>

                  <Tabs.Content value="details">
                    <Box
                      className="tab-content red-scroll"
                      h={{ base: "220px", md: "260px" }}
                      maxH="320px"
                      overflowY="auto"
                      pr={2}
                    >
                      <VStack align="flex-start" gap={2}>
                        <Text fontSize="sm" color="white">
                          Make: {product.make}
                        </Text>
                        <Text fontSize="sm" color="white">
                          Model: {product.model}
                        </Text>
                        <Text fontSize="sm" color="white">
                          Year: {product.year}
                        </Text>
                        <Text fontSize="sm" color="white">
                          Desc: {product.desc}
                        </Text>
                        <Text fontSize="sm" color="white">
                          Stock Number: {product.stock}
                        </Text>
                        <Text fontSize="sm" color="white">
                          Tag Number: {product.tag ?? "—"}
                        </Text>
                        <Text fontSize="sm" color="white">
                          Odometer:{" "}
                          {(() => {
                            const odoNum = parseDim(product.odo);
                            return odoNum !== null
                              ? `${odoNum.toLocaleString()} Kms`
                              : "—";
                          })()}
                        </Text>
                        <Text fontSize="sm" color="white">
                          Part Number (OEM):{" "}
                          <Text as="span" fontWeight="semibold">
                            {product.oemnumber?.trim() ? product.oemnumber : "—"}
                          </Text>
                        </Text>
                        <Text
                          fontSize={{ base: "xl", md: "2xl" }}
                          color="#d80c19"
                          fontWeight="bold"
                          lineHeight="1.2"
                        >
                          Price:{" "}
                          <Text as="span" fontWeight="extrabold">
                            ${product.price.toLocaleString()}
                          </Text>
                        </Text>
                      </VStack>
                    </Box>
                  </Tabs.Content>

                  <Tabs.Content value="warranty">
                    <Box
                      className="tab-content red-scroll"
                      h={{ base: "220px", md: "260px" }}
                      maxH="320px"
                      overflowY="auto"
                      pr={2}
                    >
                      <WarrantyInfo />
                    </Box>
                  </Tabs.Content>

                  <Tabs.Content value="shipping">
                    <Box
                      className="tab-content red-scroll"
                      h={{ base: "220px", md: "260px" }}
                      maxH="320px"
                      overflowY="auto"
                      pr={2}
                    >
                      <VStack align="flex-start" gap={2}>
                        <Text fontSize="sm" color="white">
                          <ul>
                            <li>
                              <Text as="span" fontWeight="bold">
                                Hassle-free shipping:
                              </Text>{" "}
                              Add the part to your cart, enter your address, and
                              the system calculates the cost.
                            </li>
                            <li>
                              <Text as="span" fontWeight="bold">
                                Australia-wide delivery:
                              </Text>{" "}
                              We deliver directly to your doorstep across the
                              country.
                            </li>
                            <li>
                              <Text as="span" fontWeight="bold">
                                No hidden fees:
                              </Text>{" "}
                              The total cost is automatically calculated for your
                              convenience.
                            </li>
                          </ul>
                        </Text>
                      </VStack>
                    </Box>
                  </Tabs.Content>
                </Tabs.RootProvider>
              </Box>

              <VStack gap={4} w="full">
                <Button
                  bg={isInCart ? "gray.600" : "#d80c19"}
                  color="white"
                  _hover={{ bg: isInCart ? "gray.500" : "#b30915" }}
                  size="lg"
                  w="full"
                  py={6}
                  fontSize="lg"
                  fontWeight="600"
                  borderRadius="lg"
                  textTransform="uppercase"
                  onClick={handleToggleCart}
                >
                  {isInCart ? "Remove from Cart" : "Add to Cart"}
                </Button>

                <Button
                  bg="white"
                  color="black"
                  _hover={{ bg: "gray.100" }}
                  size="lg"
                  w="full"
                  py={6}
                  fontSize="lg"
                  fontWeight="600"
                  borderRadius="lg"
                  onClick={() => router.push("/contact")}
                  textTransform="uppercase"
                >
                  Contact Us
                </Button>

                {/* Make an Offer trigger */}
                <Button
                  variant="outline"
                  color="white"
                  borderColor="#d80c19"
                  _hover={{ bg: "rgba(216,12,25,0.1)" }}
                  size="lg"
                  w="full"
                  py={6}
                  fontSize="lg"
                  fontWeight="600"
                  borderRadius="lg"
                  onClick={() => setOfferOpen(true)}
                >
                  Make an Offer
                </Button>
              </VStack>

              {/* Offer panel */}
              {isOfferOpen && (
                <Box
                  w="full"
                  bg="gray.900"
                  border="1px solid"
                  borderColor="gray.700"
                  borderRadius="lg"
                  p={4}
                >
                  <Flex justify="space-between" align="center" mb={2}>
                    <Text fontWeight="bold">Make an Offer</Text>
                    <Button variant="ghost" onClick={() => setOfferOpen(false)}>
                      Close
                    </Button>
                  </Flex>

                  <VStack align="stretch" gap={3}>
                    <Input
                      placeholder="Your Name"
                      value={offerName}
                      onChange={(e) => setOfferName(e.target.value)}
                      bg="white"
                      color="black"
                    />
                    <Input
                      placeholder="Your Email"
                      type="email"
                      value={offerEmail}
                      onChange={(e) => setOfferEmail(e.target.value)}
                      bg="white"
                      color="black"
                    />
                    <Input
                      placeholder="Your Offer (AUD)"
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(e.target.value)}
                      bg="white"
                      color="black"
                    />
                    <Textarea
                      placeholder="Message (optional)"
                      value={offerMessage}
                      onChange={(e) => setOfferMessage(e.target.value)}
                      bg="white"
                      color="black"
                    />

                    <HStack>
                      <Button
                        bg="#d80c19"
                        color="white"
                        _hover={{ bg: "#b30915" }}
                        onClick={onSubmitOffer}
                        loading={offerLoading}
                        loadingText="Submitting..."
                      >
                        Submit Offer
                      </Button>
                      <Button variant="outline" onClick={() => setOfferOpen(false)}>
                        Cancel
                      </Button>
                    </HStack>

                    <Text fontSize="xs" color="gray.400">
                      Protected by reCAPTCHA. By submitting, you agree to be
                      contacted about this offer.
                    </Text>
                  </VStack>
                </Box>
              )}
            </VStack>
          </Box>
        </Flex>

        {/* Description / Additional Info Tabs */}
        <Box mt={6}>
          <Box
            bg="gray.800"
            p={4}
            borderRadius="lg"
            border="1px solid"
            borderColor="gray.600"
            w="full"
          >
            <Tabs.RootProvider
              value={infoTabs}
              lazyMount
              unmountOnExit
              defaultValue="description"
              colorPalette={"red"}
            >
              <Tabs.List
                borderBottom="1px solid"
                borderColor="gray.600"
                className="product-tabs-list"
              >
                <Tabs.Trigger
                  value="description"
                  color={infoTabs.value === "description" ? "#d80c19" : ""}
                >
                  Description
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="additional"
                  color={infoTabs.value === "additional" ? "#d80c19" : ""}
                >
                  Additional Information
                </Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="description">
                <Box
                  className="tab-content red-scroll"
                  h={{ base: "220px", md: "260px" }}
                  maxH="360px"
                  overflowY="auto"
                  pr={2}
                >
                  <Box
                    as="div"
                    fontSize="md"
                    color="white"
                    lineHeight="1.6"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </Box>
              </Tabs.Content>

              <Tabs.Content value="additional">
                <Box
                  className="tab-content red-scroll"
                  h={{ base: "220px", md: "260px" }}
                  maxH="360px"
                  overflowY="auto"
                  pr={2}
                >
                  <VStack align="flex-start" gap={3}>
                    <Box w="full" bg="whiteAlpha.50" p={3} borderRadius="md">
                      <Text fontSize="sm" color="white">
                        Weight:{" "}
                        <Text as="span" fontWeight="semibold">
                          {Weight !== null ? `${Weight}` : "—"} kg
                        </Text>
                      </Text>
                    </Box>

                    <Box w="full" bg="whiteAlpha.50" p={3} borderRadius="md">
                      <Text fontSize="sm" color="white">
                        Dimensions (L × W × H):{" "}
                        <Text as="span" fontWeight="semibold">
                          {(L ?? "—")} × {(W ?? "—")} × {(H ?? "—")} cm
                        </Text>
                      </Text>

                      {volumeCm3 !== null ? (
                        <Text fontSize="sm" color="white">
                          Estimated volume:{" "}
                          <Text as="span" fontWeight="semibold">
                            {volumeCm3.toLocaleString()} cm³ (
                            {volumeM3?.toFixed(3)} m³)
                          </Text>
                        </Text>
                      ) : (
                        <Text fontSize="sm" color="white">
                          Estimated volume:{" "}
                          <Text as="span" fontWeight="semibold">
                            —</Text>
                        </Text>
                      )}
                    </Box>
                  </VStack>
                </Box>
              </Tabs.Content>
            </Tabs.RootProvider>
          </Box>
        </Box>

        {/* Global styles */}
        <style jsx global>{`
          .product-tabs-list [data-state="active"] {
            color: #d80c19 !important;
            border-bottom: 2px solid #d80c19 !important;
          }
          .red-scroll::-webkit-scrollbar {
            width: 8px;
          }
          .red-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          .red-scroll::-webkit-scrollbar-thumb {
            background: #d80c19;
            border-radius: 8px;
          }
          .red-scroll {
            scrollbar-width: thin;
            scrollbar-color: #d80c19 transparent;
          }
        `}</style>
      </Box>
    </Box>
  );
};

export default SingleProductPage;
