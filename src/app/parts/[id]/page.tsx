// /root/s-twins/s-twins-web/src/app/parts/[id]/page.tsx

"use client";

import { Box, Spinner, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import SingleProductDemo from "@/components/SingleProductDemo";
import { axiosInstance } from "@/shared/api/instance";

interface Product {
  id: string;
  title: string;
  description: string; // HTML we generate
  price: number;
  year: number;
  model: string;
  stock: string;
  tag: string;
  odo: number;
  manufacturer: string;
  image: string;
  gallery: string[];
  desc: string;
  inventoryId?: string;
  stockNumber: string;
  tagNumber: string;
  odometer: number;
  make: string;
  mainImage: string;
  thumbnailImage: string;
  weight?: string;
  length?: string;
  width?: string;
  height?: string;
  oemnumber?: string;
}

// ---------- SEO templates (HTML) ----------
type P = { title: string; make: string; model: string; year?: number | string; oemnumber?: string };

function pickSeoDescription(p: P): string {
  const key = `${p.title}-${p.make}-${p.model}-${p.year ?? ""}-${p.oemnumber ?? ""}`;
  const idx = Math.abs(hashCode(key)) % SEO_TEMPLATES.length;
  return SEO_TEMPLATES[idx](p);
}

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return h | 0;
}

const SEO_TEMPLATES: Array<(p: P) => string> = [
  (p) => `
    <p><strong>Tested second-hand ${escapeHtml(p.title)}</strong> for your ${escapeHtml(p.make)} ${escapeHtml(p.model)}${p.year ? " " + escapeHtml(String(p.year)) : ""} — professionally inspected and ready to install.</p>
    <ul>
      <li><strong>Warranty:</strong> Standard 6-month parts warranty on used items</li>
      <li><strong>Fast delivery:</strong> Australia-wide shipping with reliable carriers</li>
      <li><strong>Trusted team:</strong> Experience you can rely on</li>
      ${p.oemnumber ? `<li><strong>OEM / Part No:</strong> ${escapeHtml(p.oemnumber)}</li>` : ""}
    </ul>
    <p>Buy with confidence from S Twins — Sydney’s reliable auto dismantler and parts specialist.</p>
  `,
  (p) => `
    <p>Save money without compromise. This <strong>${escapeHtml(p.title)}</strong> fits the ${escapeHtml(p.make)} ${escapeHtml(p.model)}${p.year ? " (" + escapeHtml(String(p.year)) + ")" : ""} and has been <strong>bench-checked & quality-assessed</strong>.</p>
    <ul>
      <li><strong>6-month used-parts warranty</strong> included</li>
      <li><strong>Nationwide dispatch</strong> — fast metro & regional delivery</li>
      <li>Expert support when you need it</li>
      ${p.oemnumber ? `<li>OEM reference: <strong>${escapeHtml(p.oemnumber)}</strong></li>` : ""}
    </ul>
    <p>Choose S Twins for dependable recycled parts and friendly, knowledgeable service.</p>
  `,
  (p) => `
    <p><strong>${escapeHtml(p.title)}</strong> for ${escapeHtml(p.make)} ${escapeHtml(p.model)} — carefully sourced and <strong>tested second-hand</strong>.</p>
    <ul>
      <li><strong>Warranty cover:</strong> 6 months as standard on used parts</li>
      <li><strong>Fast shipping Australia-wide</strong> with tracking</li>
      <li><strong>Fitment help</strong> by an experienced team</li>
      ${p.oemnumber ? `<li>OEM / Cross-ref: ${escapeHtml(p.oemnumber)}</li>` : ""}
    </ul>
    <p>Stretch your budget further with quality recycled components from S Twins.</p>
  `,
  (p) => `
    <p>Get a <strong>genuine value</strong> replacement: ${escapeHtml(p.title)} to suit ${escapeHtml(p.make)} ${escapeHtml(p.model)}${p.year ? " " + escapeHtml(String(p.year)) : ""}.</p>
    <ul>
      <li>Each part is <strong>visually inspected & function-checked</strong></li>
      <li><strong>6-month warranty</strong> on second-hand items</li>
      <li><strong>Nationwide delivery</strong> — metro & regional</li>
      ${p.oemnumber ? `<li>Part number / OEM: <strong>${escapeHtml(p.oemnumber)}</strong></li>` : ""}
    </ul>
    <p>S Twins: tested parts, fair pricing, and service you can trust.</p>
  `,
  (p) => `
    <p>Keep your ${escapeHtml(p.make)} ${escapeHtml(p.model)} running with a quality <strong>${escapeHtml(p.title)}</strong> from Sydney’s S Twins.</p>
    <ul>
      <li><strong>6-month warranty</strong> on used components</li>
      <li><strong>Rapid dispatch Australia-wide</strong></li>
      <li><strong>Experienced dismantlers</strong> — parts graded for condition</li>
      ${p.oemnumber ? `<li>OEM reference: <strong>${escapeHtml(p.oemnumber)}</strong></li>` : ""}
    </ul>
    <p>Message our team for exact fitment checks and shipping quotes.</p>
  `,
  (p) => `
    <p>This <strong>${escapeHtml(p.title)}</strong> suits ${escapeHtml(p.make)} ${escapeHtml(p.model)}${p.year ? " " + escapeHtml(String(p.year)) : ""}. It’s a <strong>tested second-hand</strong> component backed by our support.</p>
    <ul>
      <li><strong>Standard 6-month warranty</strong> on used parts</li>
      <li><strong>Fast, trackable delivery</strong> across Australia</li>
      <li><strong>Honest grading</strong> and friendly after-sales service</li>
      ${p.oemnumber ? `<li>OEM / Part No: ${escapeHtml(p.oemnumber)}</li>` : ""}
    </ul>
    <p>Choose S Twins for reliable recycled auto parts and excellent value.</p>
  `,
  (p) => `
    <p><strong>Quality recycled ${escapeHtml(p.title)}</strong> — a smart alternative for ${escapeHtml(p.make)} ${escapeHtml(p.model)} owners.</p>
    <ul>
      <li><strong>6-month used-parts warranty</strong> included</li>
      <li><strong>Australia-wide shipping</strong>, fast turnaround</li>
      <li><strong>Tested & graded</strong> by our dismantling team</li>
      ${p.oemnumber ? `<li>Reference: <strong>${escapeHtml(p.oemnumber)}</strong></li>` : ""}
    </ul>
    <p>Great prices, dependable parts, and support you can rely on — that’s S Twins.</p>
  `,
  (p) => `
    <p>Looking for <strong>${escapeHtml(p.title)}</strong> for your ${escapeHtml(p.make)} ${escapeHtml(p.model)}? We’ve got a <strong>tested second-hand</strong> unit ready to ship.</p>
    <ul>
      <li><strong>6-month warranty</strong> on used components</li>
      <li><strong>Nationwide delivery</strong> with careful packaging</li>
      <li><strong>Knowledgeable support</strong> before and after purchase</li>
      ${p.oemnumber ? `<li>OEM match: ${escapeHtml(p.oemnumber)}</li>` : ""}
    </ul>
    <p>Ask us for freight options or bundle pricing with other parts.</p>
  `,
  (p) => `
    <p>Trusted by Aussie drivers: <strong>${escapeHtml(p.title)}</strong> for ${escapeHtml(p.make)} ${escapeHtml(p.model)}${p.year ? " " + escapeHtml(String(p.year)) : ""}, <strong>tested and backed</strong> by S Twins.</p>
    <ul>
      <li><strong>6-month warranty</strong> (used parts)</li>
      <li><strong>Express shipping available</strong> Australia-wide</li>
      <li><strong>Fitment help</strong> from a team with real-world experience</li>
      ${p.oemnumber ? `<li>OEM / Part Ref: ${escapeHtml(p.oemnumber)}</li>` : ""}
    </ul>
    <p>Enquire now for a quick quote and delivery timeframe.</p>
  `,
  (p) => `
    <p>Buy smarter with a <strong>tested second-hand ${escapeHtml(p.title)}</strong> for ${escapeHtml(p.make)} ${escapeHtml(p.model)}.</p>
    <ul>
      <li><strong>Standard 6-month warranty</strong> on used items</li>
      <li><strong>Fast Australia-wide delivery</strong></li>
      <li><strong>Experience you can rely on</strong> for fitment advice</li>
      ${p.oemnumber ? `<li>OEM reference available: ${escapeHtml(p.oemnumber)}</li>` : ""}
    </ul>
    <p>S Twins — quality recycled parts, fair prices, and dependable service.</p>
  `,
];

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
// -------------------------------------------

const fetchProduct = async (id: string): Promise<Product> => {
  const response = await axiosInstance.get(`/parts/${id}`);
  const data = response.data;

  const result: Product = {
    ...data,
    price: Number(data.price),
    year: Number(data.year),
    stockNumber: data.stockNumber || "N/A",
    tagNumber: data.tagNumber || "N/A",
    odometer: Number(data.odometer || 0),
    make: data.make || "Unknown",
    mainImage: data.mainImage || data.image || "https://via.placeholder.com/150",
    thumbnailImage: data.thumbnailImage || data.image || "https://via.placeholder.com/150",
    inventoryId: data.inventoryId,
    weight: data.weight,
    length: data.length,
    width: data.width,
    height: data.height,
    oemnumber: data.oemnumber ?? "",
    // We IGNORE any description from the API and always inject our SEO HTML
    description: "", // set right below
  };

  // Always override description with our SEO HTML
  result.description = pickSeoDescription({
    title: result.title,
    make: result.make,
    model: result.model,
    year: result.year,
    oemnumber: result.oemnumber,
  });

  return result;
};

const ProductDetailPage = () => {
  const params = useParams<{ id: string }>();
  const { data: product, isLoading, isError, error } = useQuery<Product, Error>({
    queryKey: ["product", params?.id ?? ""],
    queryFn: () => fetchProduct(params?.id ?? ""),
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" h="100vh" bg="gray.900">
        <Spinner size="xl" color="#d80c19" />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" h="100vh" bg="gray.900">
        <Text color="red.500" fontSize="lg">{error.message}</Text>
      </Box>
    );
  }

  if (!product) return null;

  // @ts-expect-error consumer expects this shape
  return <SingleProductDemo productData={product} />;
};

export default ProductDetailPage;
