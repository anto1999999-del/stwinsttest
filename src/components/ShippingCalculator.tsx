// ///root/s-twins/s-twins-web/src/components/ShippingCalculator.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Input,
  FieldRoot,
  FieldLabel,
  CardRoot,
  CardBody,
  CardHeader,
  Heading,
  AlertRoot,
  Spinner,
  Badge,
  Grid,
  GridItem,
  createToaster,
} from "@chakra-ui/react";
import {
  shippingApi,
  ShippingAddress,
  ShippingItem,
  ShippingRate,
  ServiceType,
} from "@/shared/api/shipping";

interface ShippingCalculatorProps {
  items: Array<{
    id: string;
    name?: string;
    weight?: number;
    length?: number;
    width?: number;
    height?: number;
    quantity: number;
  }>;
  onRateSelected?: (rate: ShippingRate) => void;
  defaultDestination?: Partial<ShippingAddress>;
}

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

const AUSTRALIAN_STATES = [
  { value: "NSW", label: "New South Wales" },
  { value: "VIC", label: "Victoria" },
  { value: "QLD", label: "Queensland" },
  { value: "WA", label: "Western Australia" },
  { value: "SA", label: "South Australia" },
  { value: "TAS", label: "Tasmania" },
  { value: "NT", label: "Northern Territory" },
  { value: "ACT", label: "Australian Capital Territory" },
];

// EXACT same normalization your JSON expects
function normalizeKey(s: string): string {
  return (s || "")
    .replace(/\[/g, "")
    .replace(/\]/g, "")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export const ShippingCalculator: React.FC<ShippingCalculatorProps> = ({
  items,
  onRateSelected,
  defaultDestination,
}) => {
  const [destination, setDestination] = useState<Partial<ShippingAddress>>({
    name: "",
    streetAddress: "",
    suburb: "",
    state: "NSW",
    postcode: "",
    country: "Australia",
    ...defaultDestination,
  });

  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);

  const toaster = createToaster({ placement: "top" });

  // Default origin (your warehouse/business address) - should be configured via environment variables
  const origin: ShippingAddress = {
    name: process.env.NEXT_PUBLIC_WAREHOUSE_NAME || "S-Twins Warehouse",
    streetAddress: process.env.NEXT_PUBLIC_WAREHOUSE_STREET || "",
    suburb: process.env.NEXT_PUBLIC_WAREHOUSE_SUBURB || "",
    state: process.env.NEXT_PUBLIC_WAREHOUSE_STATE || "",
    postcode: process.env.NEXT_PUBLIC_WAREHOUSE_POSTCODE || "",
    country: process.env.NEXT_PUBLIC_WAREHOUSE_COUNTRY || "Australia",
    phone: process.env.NEXT_PUBLIC_WAREHOUSE_PHONE || "",
    email: process.env.NEXT_PUBLIC_WAREHOUSE_EMAIL || "",
  };

  // ===== Load size map (from /public) and cache in-memory =====
  const sizeMapRef = useRef<Map<string, SizeRow> | null>(null);
  const [sizesLoaded, setSizesLoaded] = useState(false);
  const [sizesError, setSizesError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setSizesError(null);
        const res = await fetch("/matches_all_minparcel.json", { cache: "force-cache" });
        if (!res.ok) throw new Error(`load sizes HTTP ${res.status}`);
        const data = (await res.json()) as SizeFile;

        const map = new Map<string, SizeRow>();
        // Include both matches and nonMatches (your JSON may store either)
        for (const r of [...(data.matches || []), ...(data.nonMatches || [])]) {
          map.set(normalizeKey(r.normalized || r.dbItem), r);
        }

        if (mounted) {
          sizeMapRef.current = map;
          setSizesLoaded(true);
        }
      } catch (e: unknown) {
        if (mounted) {
          const msg =
            e instanceof Error ? e.message : String(e ?? "Failed to load size map");
          setSizesError(msg);
          sizeMapRef.current = null; // block quoting if map not available (per your requirement)
          setSizesLoaded(true);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const lookupDims = (name: string) => {
    const m = sizeMapRef.current;
    if (!m) return null;
    const key = normalizeKey(name);
    const hit = m.get(key);
    if (!hit) return null;
    return {
      weight: Number(hit._weight),
      length: Number(hit._length),
      width: Number(hit._width),
      height: Number(hit._height),
      pkg: hit._package,
    };
  };

  const isShippingItem = (x: ShippingItem | undefined): x is ShippingItem =>
    x !== undefined;

  const calculateRates = async () => {
    // Must have size map (or we block)
    if (!sizesLoaded) {
      setError("Please wait — loading size map…");
      return;
    }
    if (sizesError) {
      setError("Size map failed to load. Cannot quote shipping until it’s available.");
      return;
    }

    if (!destination.streetAddress || !destination.suburb || !destination.postcode) {
      setError("Please fill in all required address fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const unresolved: string[] = [];

      // Build strict shipping items:
      //  - name REQUIRED for lookup
      //  - use JSON mapping when present
      //  - else accept explicit dims only if all four > 0
      //  - else block and list in unresolved
      const maybeItems = items.map<ShippingItem | undefined>((item) => {
        const name = (item.name || "").trim();
        if (!name) {
          unresolved.push(`${item.id} (missing name)`);
          return undefined;
        }

        const fromJson = lookupDims(name);

        let weight = item.weight ?? 0;
        let length = item.length ?? 0;
        let width = item.width ?? 0;
        let height = item.height ?? 0;

        if (fromJson) {
          weight = fromJson.weight;
          length = fromJson.length;
          width = fromJson.width;
          height = fromJson.height;
        }

        const validExplicit =
          !fromJson && weight > 0 && length > 0 && width > 0 && height > 0;

        if (!fromJson && !validExplicit) {
          unresolved.push(name);
          return undefined;
        }

        return {
          weight,
          length,
          width,
          height,
          quantity: item.quantity,
          description: "Automotive part",
          // package: fromJson?.pkg, // include if your backend supports package types
        };
      });

      const shippingItems = maybeItems.filter(isShippingItem);

      if (unresolved.length) {
        setError(
          `Missing size mapping for: ${unresolved.join(
            ", "
          )}. Ensure each item has a valid 'name' that matches the JSON (normalized), or supply explicit weight/length/width/height > 0.`
        );
        setLoading(false);
        return;
      }

      const response = await shippingApi.calculateRates({
        origin,
        destination: destination as ShippingAddress,
        items: shippingItems,
      });

      setRates(response.rates);
      if (response.rates.length === 0) {
        setError("No shipping options available for this location");
      }
    } catch (err: unknown) {
      let errorMessage = "Failed to calculate shipping rates";
      if (err && typeof err === "object") {
        const maybe = err as { response?: { data?: { message?: string } } };
        errorMessage = maybe.response?.data?.message ?? errorMessage;
      }
      setError(errorMessage);
      toaster.create({
        title: "Error",
        description: "Failed to calculate shipping rates. Please try again.",
        type: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRateSelection = (rate: ShippingRate) => {
    setSelectedRate(rate);
    onRateSelected?.(rate);
    toaster.create({
      title: "Shipping Option Selected",
      description: `${rate.serviceName} - $${rate.cost.toFixed(2)} (${rate.estimatedDays} days)`,
      type: "success",
      duration: 3000,
    });
  };

  const getServiceTypeBadge = (serviceType: string) => {
    const colors: Record<string, string> = {
      [ServiceType.STANDARD]: "blue",
      [ServiceType.EXPRESS]: "orange",
      [ServiceType.OVERNIGHT]: "red",
      [ServiceType.SAME_DAY]: "green",
    };
    return colors[serviceType as ServiceType] || "gray";
  };

  return (
    <CardRoot>
      <CardHeader>
        <Heading size="md">Shipping Calculator</Heading>
      </CardHeader>
      <CardBody>
        <VStack gap={4} align="stretch">
          {/* Size map warning */}
          {sizesError && (
            <AlertRoot status="error">
              Size map failed to load — shipping quotes are disabled.
            </AlertRoot>
          )}

          {/* Destination Address Form */}
          <Box>
            <Heading size="sm" mb={3}>
              Delivery Address
            </Heading>
            <Grid templateColumns="repeat(2, 1fr)" gap={3}>
              <GridItem colSpan={2}>
                <FieldRoot required>
                  <FieldLabel>Full Name</FieldLabel>
                  <Input
                    value={destination.name}
                    onChange={(e) =>
                      setDestination({ ...destination, name: e.target.value })
                    }
                    placeholder="John Doe"
                  />
                </FieldRoot>
              </GridItem>

              <GridItem colSpan={2}>
                <FieldRoot required>
                  <FieldLabel>Street Address</FieldLabel>
                  <Input
                    value={destination.streetAddress}
                    onChange={(e) =>
                      setDestination({
                        ...destination,
                        streetAddress: e.target.value,
                      })
                    }
                    placeholder="123 Main Street"
                  />
                </FieldRoot>
              </GridItem>

              <FieldRoot required>
                <FieldLabel>Suburb</FieldLabel>
                <Input
                  value={destination.suburb}
                  onChange={(e) =>
                    setDestination({ ...destination, suburb: e.target.value })
                  }
                  placeholder="Sydney"
                />
              </FieldRoot>

              <FieldRoot required>
                <FieldLabel>State</FieldLabel>
                <select
                  value={destination.state}
                  onChange={(e) =>
                    setDestination({ ...destination, state: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #E2E8F0",
                    borderRadius: "6px",
                  }}
                >
                  {AUSTRALIAN_STATES.map((state) => (
                    <option key={state.value} value={state.value}>
                      {state.label}
                    </option>
                  ))}
                </select>
              </FieldRoot>

              <FieldRoot required>
                <FieldLabel>Postcode</FieldLabel>
                <Input
                  value={destination.postcode}
                  onChange={(e) =>
                    setDestination({ ...destination, postcode: e.target.value })
                  }
                  placeholder="2000"
                />
              </FieldRoot>
            </Grid>
          </Box>

          <Button
            onClick={calculateRates}
            loading={loading}
            loadingText="Calculating..."
            colorScheme="blue"
            size="lg"
            disabled={!sizesLoaded || !!sizesError}
          >
            Calculate Shipping Rates
          </Button>

          {error && <AlertRoot status="error">{error}</AlertRoot>}

          {loading && (
            <Box textAlign="center" py={4}>
              <Spinner size="lg" />
              <Text mt={2}>Calculating shipping rates...</Text>
            </Box>
          )}

          {/* Shipping Rate Options */}
          {rates.length > 0 && (
            <Box>
              <Heading size="sm" mb={3}>
                Available Shipping Options
              </Heading>
              <VStack gap={3}>
                {rates.map((rate, index) => (
                  <CardRoot
                    key={index}
                    w="full"
                    cursor="pointer"
                    onClick={() => handleRateSelection(rate)}
                    bg={
                      selectedRate?.serviceType === rate.serviceType
                        ? "blue.50"
                        : "white"
                    }
                    borderColor={
                      selectedRate?.serviceType === rate.serviceType
                        ? "blue.200"
                        : "gray.200"
                    }
                    _hover={{ borderColor: "blue.300", shadow: "md" }}
                  >
                    <CardBody>
                      <HStack justify="space-between" align="center">
                        <VStack align="start" gap={1}>
                          <HStack>
                            <Text fontWeight="semibold">
                              {rate.serviceName}
                            </Text>
                            <Badge
                              colorScheme={getServiceTypeBadge(
                                rate.serviceType
                              )}
                            >
                              {rate.serviceType.replace("_", " ").toUpperCase()}
                            </Badge>
                          </HStack>
                          <Text fontSize="sm" color="gray.600">
                            {rate.estimatedDays} business day
                            {rate.estimatedDays !== 1 ? "s" : ""} • {rate.carrier}
                          </Text>
                        </VStack>
                        <VStack align="end" gap={1}>
                          <Text
                            fontSize="lg"
                            fontWeight="bold"
                            color="blue.600"
                          >
                            ${rate.cost.toFixed(2)} {rate.currency}
                          </Text>
                          {selectedRate?.serviceType === rate.serviceType && (
                            <Badge colorScheme="green">Selected</Badge>
                          )}
                        </VStack>
                      </HStack>
                    </CardBody>
                  </CardRoot>
                ))}
              </VStack>
            </Box>
          )}
        </VStack>
      </CardBody>
    </CardRoot>
  );
};
