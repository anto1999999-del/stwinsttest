// /root/s-twins/s-twins-web/src/components/VehicleDetails.tsx
"use client";
import {
  Box,
  Flex,
  Text,
  Button,
  HStack,
  VStack,
  Image,
  Grid,
  Spinner,
} from "@chakra-ui/react";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchSingleCar } from "@/shared/api/cars";
type VehicleData = {
  cid: number;
  ID: number;
  name: string;
  make: string;
  prod_cat: string;
  year: number;
  model_id?: number;
  model?: string;
  tag?: string | null;
  stockNo?: string;
  date_added?: unknown;
  /** Absolute URL, or null/undefined if missing */
  thumbnailId?: string | null;
  /** Array of absolute URLs (from Woo), or [] if missing */
  galleryIds?: string[];
};
/* ─────────────────────────────
   SAME image URL handling as Parts
   ───────────────────────────── */
const defaultImage =
  "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500";
/** Normalize image URLs and route 3rd-party hosts through our proxy. */
function resolveImageSrc(raw?: string): string {
  if (!raw || !raw.trim()) return defaultImage;
  // Already relative (/uploads/foo.jpg)
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
// --- SEO description templates (HTML) ---------------------------------
type P = {
  make: string;
  model: string;
  year?: number | string;
  prod_cat?: string;
  stockNo?: string;
};
function pickSeoDescription(p: P): string {
  // deterministic pick per vehicle to avoid flicker: hash by id+title
  const key = `${p.make}-${p.model}-${p.year ?? ""}-${p.prod_cat ?? ""}-${p.stockNo ?? ""}`;
  const idx = Math.abs(hashCode(key)) % SEO_TEMPLATES.length;
  return SEO_TEMPLATES[idx](p);
}
function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return h | 0;
}
// 20 HTML template generators (rotate)
const SEO_TEMPLATES: Array<(p: P) => string> = [
  (p) => `
    <p><strong>Wrecking ${p.year ? p.year + ' ' : ''}${p.make} ${p.model}</strong> – Quality Used Parts at S Twins</p>
    <p>Looking for affordable, reliable used parts for your ${p.make} ${p.model}? At S Twins, we are currently wrecking a ${p.year ? p.year + ' ' : ''}${p.make} ${p.model}, offering a wide range of quality tested parts. Whether you need engine components, body panels, or interior trims, we have what you're looking for.</p>
    <ul>
      <li><strong>Genuine & Tested:</strong> All parts are inspected for reliability</li>
      <li><strong>Affordable Pricing:</strong> Save on repairs with used, genuine parts</li>
      <li><strong>Fast Shipping:</strong> Nationwide delivery across Australia</li>
    </ul>
    <p>Parts Available:</p>
    <ul>
      <li>Engine: Alternators, starters, cylinder heads</li>
      <li>Body: Doors, bumpers, headlights, mirrors</li>
      <li>Suspension & Interior: Suspension, seats, dashboard components</li>
    </ul>
    <p>Contact S Twins for a quick quote and availability on parts from this ${p.make} ${p.model}! Stock: ${p.stockNo || 'N/A'}</p>
  `,
  (p) => `
    <p><strong>Parting Out ${p.year ? p.year + ' ' : ''}${p.make} ${p.model}</strong> – Premium Recycled Parts Available</p>
    <p>Upgrade or repair your vehicle with genuine used parts from our wrecked ${p.year ? p.year + ' ' : ''}${p.make} ${p.model}. S Twins offers tested components at competitive prices.</p>
    <ul>
      <li><strong>Inspected Quality:</strong> Every part checked for performance</li>
      <li><strong>Budget-Friendly:</strong> High-quality alternatives to new parts</li>
      <li><strong>Australia-Wide Delivery:</strong> Quick and secure shipping</li>
    </ul>
    <p>Key Parts on Offer:</p>
    <ul>
      <li>Transmission & Drivetrain</li>
      <li>Electrical Systems: ECUs, sensors</li>
      <li>Exterior: Panels, lights, wheels</li>
    </ul>
    <p>Inquire today for parts from this ${p.make} ${p.model}. Reference stock ${p.stockNo || 'N/A'}.</p>
  `,
  (p) => `
    <p><strong>S Twins Wrecking: ${p.year ? p.year + ' ' : ''}${p.make} ${p.model}</strong> – Your Source for Used Parts</p>
    <p>We’re dismantling a ${p.year ? p.year + ' ' : ''}${p.make} ${p.model} and have a variety of reliable used parts ready to ship. Save big without sacrificing quality.</p>
    <ul>
      <li><strong>Tested & Guaranteed:</strong> Peace of mind with our inspections</li>
      <li><strong>Great Value:</strong> Affordable genuine parts</li>
      <li><strong>Nationwide Service:</strong> Fast delivery to your door</li>
    </ul>
    <p>Available Components:</p>
    <ul>
      <li>Brakes & Suspension</li>
      <li>Interior Trim & Accessories</li>
      <li>Exhaust & Cooling Systems</li>
    </ul>
    <p>Get in touch for availability on this ${p.make} ${p.model} wrecker. Stock no: ${p.stockNo || 'N/A'}.</p>
  `,
  (p) => `
    <p><strong>Quality Parts from Wrecked ${p.year ? p.year + ' ' : ''}${p.make} ${p.model}</strong> at S Twins</p>
    <p>Our team is parting out a ${p.year ? p.year + ' ' : ''}${p.make} ${p.model}, providing tested used parts for your repair needs. Reliable and cost-effective options available now.</p>
    <ul>
      <li><strong>Professional Testing:</strong> Ensured functionality</li>
      <li><strong>Competitive Prices:</strong> Beat dealership costs</li>
      <li><strong>Australia Delivery:</strong> Prompt and tracked</li>
    </ul>
    <p>Parts in Stock:</p>
    <ul>
      <li>Engine & Mechanical</li>
      <li>Body & Exterior</li>
      <li>Electronics & Wiring</li>
    </ul>
    <p>Contact us for parts from this ${p.make} ${p.model}. Quote stock ${p.stockNo || 'N/A'}.</p>
  `,
  (p) => `
    <p><strong>Dismantling ${p.year ? p.year + ' ' : ''}${p.make} ${p.model}</strong> – Recycled Parts Specialists S Twins</p>
    <p>Find high-quality used parts from our current wreck: a ${p.year ? p.year + ' ' : ''}${p.make} ${p.model}. All components are carefully removed and tested.</p>
    <ul>
      <li><strong>Quality Assured:</strong> Thorough inspections</li>
      <li><strong>Savings Guaranteed:</strong> Affordable genuine alternatives</li>
      <li><strong>Fast Nationwide Shipping:</strong> Get it quick</li>
    </ul>
    <p>Selection Includes:</p>
    <ul>
      <li>Suspension & Steering</li>
      <li>Interior & Comfort Features</li>
      <li>Exhaust Systems</li>
    </ul>
    <p>Enquire about this ${p.make} ${p.model} wrecker today. Stock: ${p.stockNo || 'N/A'}.</p>
  `,
  (p) => `
    <p><strong>S Twins: Wrecking ${p.year ? p.year + ' ' : ''}${p.make} ${p.model} for Parts</strong></p>
    <p>We have a ${p.year ? p.year + ' ' : ''}${p.make} ${p.model} in for dismantling, with plenty of quality used parts available. Perfect for DIY repairs or mechanics.</p>
    <ul>
      <li><strong>Tested Reliability:</strong> Function-checked parts</li>
      <li><strong>Budget Options:</strong> Save on new part prices</li>
      <li><strong>Nationwide Dispatch:</strong> Quick turnaround</li>
    </ul>
    <p>Parts List:</p>
    <ul>
      <li>Drivetrain Components</li>
      <li>Body Panels & Glass</li>
      <li>Electrical & Sensors</li>
    </ul>
    <p>Call for details on this ${p.make} ${p.model}. Reference ${p.stockNo || 'N/A'}.</p>
  `,
  (p) => `
    <p><strong>Used Parts from ${p.year ? p.year + ' ' : ''}${p.make} ${p.model} Wreck at S Twins</strong></p>
    <p>Currently wrecking a clean ${p.year ? p.year + ' ' : ''}${p.make} ${p.model} – grab quality recycled parts while available. Fast turnaround on orders.</p>
    <ul>
      <li><strong>Inspected & Cleaned:</strong> Ready to fit</li>
      <li><strong>Affordable Quality:</strong> Genuine used components</li>
      <li><strong>Shipping Across AUS:</strong> Secure delivery service</li>
    </ul>
    <p>Available Now:</p>
    <ul>
      <li>Cooling & Exhaust</li>
      <li>Wheels & Tires</li>
      <li>Electrical Modules</li>
    </ul>
    <p>Ask us for freight options or bundle pricing with other parts. Stock: ${p.stockNo || 'N/A'}.</p>
  `,
  (p) => `
    <p><strong>${p.year ? p.year + ' ' : ''}${p.make} ${p.model} Being Wrecked</strong> – S Twins Parts Supply</p>
    <p>Our latest wreck is a ${p.year ? p.year + ' ' : ''}${p.make} ${p.model}, supplying tested used parts for your vehicle needs. Quality and value combined.</p>
    <ul>
      <li><strong>Quality Checks:</strong> Each part verified</li>
      <li><strong>Cost Savings:</strong> Beat retail prices</li>
      <li><strong>Nationwide Dispatch:</strong> Efficient service</li>
    </ul>
    <p>Parts On Hand:</p>
    <ul>
      <li>Braking Systems</li>
      <li>Lighting & Electrical</li>
      <li>Suspension Parts</li>
    </ul>
    <p>Contact for ${p.make} ${p.model} components. Quote ${p.stockNo || 'N/A'}.</p>
  `,
  (p) => `
    <p><strong>Wrecker Alert: ${p.year ? p.year + ' ' : ''}${p.make} ${p.model} at S Twins</strong></p>
    <p>We have a ${p.year ? p.year + ' ' : ''}${p.make} ${p.model} in for parts – low mileage parts available. Get genuine used items at fraction of new cost.</p>
    <ul>
      <li><strong>Tested for Fit:</strong> Reliable performance</li>
      <li><strong>Great Deals:</strong> Used but like new</li>
      <li><strong>AUS-Wide Shipping:</strong> Door to door</li>
    </ul>
    <p>Featured Parts:</p>
    <ul>
      <li>Transmission</li>
      <li>Body Hardware</li>
      <li>Interior Panels</li>
    </ul>
    <p>Inquire now for this ${p.make} ${p.model}. Ref ${p.stockNo || 'N/A'}.</p>
  `,
  (p) => `
    <p><strong>S Twins Dismantling ${p.year ? p.year + ' ' : ''}${p.make} ${p.model}</strong></p>
    <p>Quality recycled parts from our wrecked ${p.year ? p.year + ' ' : ''}${p.make} ${p.model}. All components cleaned, tested, and ready for installation.</p>
    <ul>
      <li><strong>Assured Quality:</strong> Professional grading</li>
      <li><strong>Value Pricing:</strong> Great value</li>
      <li><strong>Fast AUS Delivery:</strong> Tracked packages</li>
    </ul>
    <p>Parts In Stock:</p>
    <ul>
      <li>Engine Accessories</li>
      <li>Exterior Trim</li>
      <li>Interior Electronics</li>
    </ul>
    <p>Message our team for exact fitment checks and shipping quotes. Stock: ${p.stockNo || 'N/A'}.</p>
  `,
  (p) => `
    <p><strong>Parting ${p.year ? p.year + ' ' : ''}${p.make} ${p.model} – S Twins Auto</strong></p>
    <p>From bumpers to engines, get used parts from this wrecked ${p.year ? p.year + ' ' : ''}${p.make} ${p.model}. Tested for peace of mind.</p>
    <ul>
      <li><strong>Reliable Testing:</strong> Function verified</li>
      <li><strong>Affordable Options:</strong> Genuine savings</li>
      <li><strong>Shipping Nationwide:</strong> Efficient service</li>
    </ul>
    <p>Parts List:</p>
    <ul>
      <li>Driveline Components</li>
      <li>Body Panels & Glass</li>
      <li>Electrical & Sensors</li>
    </ul>
    <p>Call about this ${p.make} ${p.model} wreck. Stock no ${p.stockNo || 'N/A'}.</p>
  `,
  (p) => `
    <p><strong>Used ${p.make} ${p.model} Parts Available</strong> from S Twins Wreck</p>
    <p>Recycled parts from a low-km ${p.year ? p.year + ' ' : ''}${p.make} ${p.model}. Tested and shipped fast.</p>
    <ul>
      <li><strong>Inspected:</strong> Ready to fit</li>
      <li><strong>Affordable:</strong> Save money</li>
      <li><strong>Delivery:</strong> AUS-wide</li>
    </ul>
    <p>Selection:</p>
    <ul>
      <li>Cooling & Exhaust</li>
      <li>Wheels & Tires</li>
      <li>Electrical Modules</li>
    </ul>
    <p>Ask us for freight options or bundle pricing with other parts. Stock: ${p.stockNo || 'N/A'}.</p>
  `,
  (p) => `
    <p><strong>${p.year ? p.year + ' ' : ''}${p.make} ${p.model} Wrecking Special at S Twins</strong></p>
    <p>We have a ${p.year ? p.year + ' ' : ''}${p.make} ${p.model} in for parts – quality used components available now for quick dispatch.</p>
    <ul>
      <li><strong>Tested:</strong> Reliable components</li>
      <li><strong>Value:</strong> Cost-effective</li>
      <li><strong>Ship:</strong> Nationwide</li>
    </ul>
    <p>Available Now:</p>
    <ul>
      <li>Brakes</li>
      <li>Lights</li>
      <li>Wheels</li>
    </ul>
    <p>Contact for ${p.make} ${p.model} availability. Stock no ${p.stockNo || 'N/A'}.</p>
  `,
  (p) => `
    <p><strong>Wrecking: ${p.year ? p.year + ' ' : ''}${p.make} ${p.model}</strong> – Contact S Twins</p>
    <p>Recycled parts from a low-km ${p.year ? p.year + ' ' : ''}${p.make} ${p.model}. Tested and backed by our team.</p>
    <ul>
      <li><strong>Reliable:</strong> Function tested</li>
      <li><strong>Savings:</strong> Genuine used</li>
      <li><strong>Delivery:</strong> Fast AUS-wide</li>
    </ul>
    <p>Available:</p>
    <ul>
      <li>Driveline</li>
      <li>Electronics</li>
      <li>Interior</li>
    </ul>
    <p>Get quotes for this ${p.make} ${p.model}. Ref ${p.stockNo || 'N/A'}.</p>
  `,
  (p) => `
    <p><strong>S Twins: ${p.year ? p.year + ' ' : ''}${p.make} ${p.model} Wrecking</strong></p>
    <p>Parting out with care – used parts from ${p.year ? p.year + ' ' : ''}${p.make} ${p.model} available now.</p>
    <ul>
      <li><strong>Quality:</strong> Inspected</li>
      <li><strong>Prices:</strong> Affordable</li>
      <li><strong>Deliver:</strong> Nationwide</li>
    </ul>
    <p>Parts:</p>
    <ul>
      <li>Engine</li>
      <li>Exterior</li>
      <li>Interior</li>
    </ul>
    <p>Contact for this wreck. Stock ${p.stockNo || 'N/A'}.</p>
  `,
  (p) => `
    <p><strong>Used Parts from Wrecked ${p.year ? p.year + ' ' : ''}${p.make} ${p.model}</strong></p>
    <p>S Twins has a ${p.year ? p.year + ' ' : ''}${p.make} ${p.model} for parts – quality used components available.</p>
    <ul>
      <li><strong>Checked:</strong> For reliability</li>
      <li><strong>Affordable:</strong> Save significantly</li>
      <li><strong>Shipping:</strong> Australia-wide</li>
    </ul>
    <p>Selection:</p>
    <ul>
      <li>Suspension</li>
      <li>Electrical</li>
      <li>Body</li>
    </ul>
    <p>Inquire for ${p.make} ${p.model} availability. Ref ${p.stockNo || 'N/A'}.</p>
  `,
  (p) => `
    <p><strong>Wrecking ${p.make} ${p.model} ${p.year ? '(' + p.year + ')' : ''}</strong> – S Twins</p>
    <p>Dismantling now – grab used parts for your ${p.make} ${p.model}. All tested and ready.</p>
    <ul>
      <li><strong>Tested:</strong> Quality assured</li>
      <li><strong>Budget:</strong> Great prices</li>
      <li><strong>Ship:</strong> Nationwide</li>
    </ul>
    <p>Available:</p>
    <ul>
      <li>Engine</li>
      <li>Body</li>
      <li>Electrics</li>
    </ul>
    <p>Enquire now. Stock no ${p.stockNo || 'N/A'}.</p>
  `,
  (p) => `
    <p><strong>${p.make} ${p.model} Parts from Wreck</strong> – Contact S Twins</p>
    <p>We’re wrecking a ${p.year ? p.year + ' ' : ''}${p.make} ${p.model} – reliable used parts in stock.</p>
    <ul>
      <li><strong>Inspected:</strong> Ready to fit</li>
      <li><strong>Affordable:</strong> Save money</li>
      <li><strong>Delivery:</strong> AUS-wide</li>
    </ul>
    <p>Parts List:</p>
    <ul>
      <li>Transmission</li>
      <li>Lights</li>
      <li>Interior</li>
    </ul>
    <p>Get details for this wreck. ${p.stockNo ? 'Stock: ' + p.stockNo : ''}.</p>
  `,
  (p) => `
    <p><strong>Used ${p.make} ${p.model} Parts Available</strong> from S Twins Wreck</p>
    <p>Quality components from dismantled ${p.year ? p.year + ' ' : ''}${p.make} ${p.model}. Tested and shipped fast.</p>
    <ul>
      <li><strong>Reliable:</strong> Function tested</li>
      <li><strong>Value:</strong> Cost savings</li>
      <li><strong>Shipping:</strong> Australia delivery</li>
    </ul>
    <p>Selection:</p>
    <ul>
      <li>Suspension</li>
      <li>Electrical</li>
      <li>Body</li>
    </ul>
    <p>Inquire for ${p.make} ${p.model} availability. Ref ${p.stockNo || 'N/A'}.</p>
  `,
  (p) => `
    <p><strong>S Twins: ${p.year ? p.year + ' ' : ''}${p.make} ${p.model} Wrecking</strong></p>
    <p>Parting out with care – used parts from ${p.year ? p.year + ' ' : ''}${p.make} ${p.model} available now.</p>
    <ul>
      <li><strong>Quality:</strong> Inspected</li>
      <li><strong>Prices:</strong> Affordable</li>
      <li><strong>Deliver:</strong> Nationwide</li>
    </ul>
    <p>Parts:</p>
    <ul>
      <li>Engine</li>
      <li>Exterior</li>
      <li>Interior</li>
    </ul>
    <p>Contact for this wreck. Stock ${p.stockNo || 'N/A'}.</p>
  `,
];
// minimal HTML escaper for template fields
function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
export default function VehicleDetails({ stockId }: { stockId: string }) {
  const router = useRouter();
  const {
    data: vehicle,
    isLoading,
    isError,
    error,
  } = useQuery<VehicleData>({
    queryKey: ["car", stockId],
    queryFn: () => fetchSingleCar(stockId),
    enabled: !!stockId,
  });
  // Build gallery from API → then map through resolveImageSrc (proxy + normalize)
  const gallery = useMemo(() => {
    if (!vehicle) return [] as string[];
    const raw: string[] = [];
    if (vehicle.thumbnailId && vehicle.thumbnailId.trim()) {
      raw.push(vehicle.thumbnailId.trim());
    }
    if (Array.isArray(vehicle.galleryIds) && vehicle.galleryIds.length > 0) {
      for (const u of vehicle.galleryIds) {
        if (u && u.trim()) raw.push(u.trim());
      }
    }
    // de-dupe while preserving order, then proxy/normalize
    const dedup = Array.from(new Set(raw));
    return dedup.map((u) => resolveImageSrc(u));
  }, [vehicle]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  useEffect(() => {
    if (gallery.length > 0) {
      setSelectedImage((prev) => prev || gallery[0]);
    } else {
      setSelectedImage("");
    }
  }, [gallery]);
  const handleImageClick = (src: string) => {
    setSelectedImage(src);
    const main = document.getElementById("main-image");
    if (main) main.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  // Loading
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" h="100vh" bg="gray.50">
        <VStack gap={4}>
          <Spinner size="xl" color="#d80c19" />
          <Text color="gray.600">Loading car details...</Text>
        </VStack>
      </Box>
    );
  }
  // Error
  if (isError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" h="100vh" bg="gray.50">
        <VStack gap={4}>
          <Text color="red.500" fontSize="lg" textAlign="center">
            Failed to load car details
          </Text>
          <Text color="gray.600" textAlign="center">
            {error instanceof Error ? error.message : "Something went wrong"}
          </Text>
          <Button bg="#d80c19" color="white" _hover={{ bg: "#b30915" }} onClick={() => router.push("/cars")}>
            Back to Cars
          </Button>
        </VStack>
      </Box>
    );
  }
  if (!vehicle) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" h="100vh" bg="gray.50">
        <VStack gap={4}>
          <Text color="gray.600" fontSize="lg">
            Car not found
          </Text>
          <Button bg="#d80c19" color="white" _hover={{ bg: "#b30915" }} onClick={() => router.push("/cars")}>
            Back to Cars
          </Button>
        </VStack>
      </Box>
    );
  }
  const seoDescription = pickSeoDescription({
    make: vehicle.make,
    model: vehicle.model || "",
    year: vehicle.year,
    prod_cat: vehicle.prod_cat,
    stockNo: vehicle.stockNo,
  });
  return (
    <Box as="section" bg="gray.50" py={10}>
      <Box maxW="1400px" mx="auto" px={{ base: 6, md: 12, lg: 16 }}>
        <Flex direction={{ base: "column", lg: "row" }} gap={10}>
          {/* Left: gallery */}
          <Box flex="1">
            <Box
              id="main-image"
              bg="white"
              borderRadius="xl"
              overflow="hidden"
              boxShadow="md"
              transition="all 0.3s ease"
              minH={{ base: "300px", md: "540px" }}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {selectedImage ? (
                <Image
                  src={selectedImage}
                  alt={`${vehicle.year} ${vehicle.make} ${vehicle.model || ""}`}
                  w="full"
                  h={{ base: "300px", md: "540px" }}
                  objectFit="cover"
                  transition="opacity 0.3s ease"
                  onError={(e) => {
                    const el = e.currentTarget as HTMLImageElement;
                    if (el.src !== defaultImage) el.src = defaultImage;
                  }}
                />
              ) : (
                <Box
                  w="full"
                  h={{ base: "300px", md: "540px" }}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="gray.400"
                >
                  No image available
                </Box>
              )}
            </Box>
            <Grid templateColumns={{ base: "repeat(4, 1fr)", md: "repeat(6, 1fr)" }} gap={3} mt={4}>
              {gallery.map((src, idx) => (
                <Box
                  key={`${src}-${idx}`}
                  bg="white"
                  borderRadius="md"
                  overflow="hidden"
                  boxShadow="sm"
                  cursor="pointer"
                  _hover={{
                    boxShadow: "lg",
                    transform: "scale(1.05)",
                    transition: "all 0.2s ease",
                  }}
                  border={selectedImage === src ? "3px solid" : "1px solid"}
                  borderColor={selectedImage === src ? "#d80c19" : "gray.200"}
                  onClick={() => handleImageClick(src)}
                >
                  <Image
                    src={src}
                    alt={`${vehicle.year} ${vehicle.make} ${vehicle.model || ""} ${idx + 1}`}
                    w="full"
                    h="90px"
                    objectFit="cover"
                    onError={(e) => {
                      const el = e.currentTarget as HTMLImageElement;
                      if (el.src !== defaultImage) el.src = defaultImage;
                    }}
                  />
                </Box>
              ))}
            </Grid>
          </Box>
          {/* Right: info */}
          <Box flex="1" bg="white" p={{ base: 6, md: 8 }} borderRadius="xl" boxShadow="md">
            <VStack align="flex-start" gap={6}>
              <Box>
                <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="bold" color="#d80c19">
                  {vehicle.year} {vehicle.make} {vehicle.model || ""}
                </Text>
                <Text color="gray.500">Stock {vehicle.stockNo || vehicle.cid}</Text>
              </Box>
              <HStack gap={4}>
                <Button bg="black" color="white" _hover={{ bg: "gray.800" }} onClick={() => router.push("/contact")}>
                  Contact Us
                </Button>
                <Button
                  bg="#d80c19"
                  color="white"
                  _hover={{ bg: "#b30915" }}
                  onClick={() => {
                    const params = new URLSearchParams();
                    if (vehicle.year) params.set("year", String(vehicle.year));
                    if (vehicle.make) params.set("make", vehicle.make.toLowerCase());
                    if (vehicle.model) params.set("model", (vehicle.model || "").toLowerCase());
                    router.push(`/parts?${params.toString()}`);
                  }}
                >
                  Show All Parts
                </Button>
              </HStack>
              <Box w="full" border="1px solid" borderColor="gray.200" borderRadius="lg" p={6}>
                <Text fontWeight="bold" mb={4} fontSize="lg">
                  Item Details
                </Text>
                <VStack align="flex-start" gap={3} color="gray.700">
                  <HStack gap={2}>
                    <Text fontWeight="semibold">Make / Model:</Text>
                    <Text>
                      {vehicle.make} {vehicle.model || ""}
                    </Text>
                  </HStack>
                  <HStack gap={2}>
                    <Text fontWeight="semibold">Product Category:</Text>
                    <Text>{vehicle.prod_cat}</Text>
                  </HStack>
                  <HStack gap={2}>
                    <Text fontWeight="semibold">Year:</Text>
                    <Text>{vehicle.year}</Text>
                  </HStack>
                  <HStack gap={2}>
                    <Text fontWeight="semibold">Stock Number:</Text>
                    <Text>{vehicle.stockNo || vehicle.cid}</Text>
                  </HStack> 
                </VStack>
              </Box>
              <Box w="full" border="1px solid" borderColor="gray.200" borderRadius="lg" p={6}>
                <Text fontWeight="bold" mb={4} fontSize="lg">
                  Description
                </Text>
                <Box color="gray.700" dangerouslySetInnerHTML={{ __html: seoDescription }} />
              </Box>
            </VStack>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}