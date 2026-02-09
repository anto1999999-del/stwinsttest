"use client";

import {
  Box,
  Text,
  VStack,
  HStack,
  Image as ChakraImage,
  Button,
  VisuallyHidden,
} from "@chakra-ui/react";
import { Part, fetchSinglePart } from "@/shared/api/parts";
import { useCartStore } from "@/shared/stores/useCartStore";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

interface ProductCardProps {
  part: Part;
}

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

const ProductCard = ({ part }: ProductCardProps) => {
  // --- Hooks MUST be called unconditionally (no early returns above here) ---
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Derived values (hooks OK here)
  const imgSrc = useMemo(() => resolveImageSrc(part.image), [part.image]);
  const isInCart = items.some((item) => item.id === part.id);

  const handleCardClick = () => router.push(`/parts/${part.id}`);

  const handleAddToCart = async () => {
  if (isInCart) {
    removeItem(part.id);
    return;
  }
  setIsAddingToCart(true);

  // helper to coerce to positive numbers or undefined
  const pos = (v: unknown) =>
    typeof v === "number" && Number.isFinite(v) && v > 0 ? v : undefined;

  try {
    const partDetails = await fetchSinglePart(part.id);

    const weight = pos(partDetails.weight);
    const length = pos(partDetails.length);
    const width  = pos(partDetails.width);
    const height = pos(partDetails.height);

    const hasAllDims = !!(weight && length && width && height);

    const baseItem = {
      id: part.id,
      name: part.title,
      price: Number(part.price),
      quantity: 1,
      image: imgSrc || defaultImage,
      inventoryId: partDetails.inventoryId || part.inventoryId,
	  category: part.category,
    };

    const itemToAdd = hasAllDims
      ? { ...baseItem, weight, length, width, height }
      : baseItem;

    // 🔎 Debug: see exactly what's going to the cart
    /*console.log("[ProductCard:addItem] partId:", part.id, {
      fromApi: { weight, length, width, height },
      hasAllDims,
      iteToAdd,
    });
	
	console.log("[ProductCard:addItem] about to add:", {
	  id: itemToAdd.id,
	  title: itemToAdd.name,
	  category: itemToAdd.category,
	  fromApiDims: { weight, length, width, height },
	});*/
	//console.log("[ProductCard] part from API:", { id: part.id, category: part.category, title: part.title });

    addItem(itemToAdd);
  } catch (error) {
    console.warn(`Failed to fetch details for part ${part.id}:`, error);

    // No defaults here — add without dims so checkout won’t quote shipping.
    const fallback = {
      id: part.id,
      name: part.title,
      price: Number(part.price),
      quantity: 1,
      image: imgSrc || defaultImage,
      inventoryId: part.inventoryId,
	  category: part.category,
    };

    //console.log("[ProductCard:addItem] fetch failed, adding without dims:", fallback);
    addItem(fallback);
  } finally {
    setIsAddingToCart(false);
  }
};

  return (
    <Box
      as="article"
      itemScope
      itemType="https://schema.org/Product"
      bg="gray.800"
      borderColor="gray.700"
      borderRadius="xl"
      boxShadow="dark-lg"
      overflow="hidden"
      _hover={{ boxShadow: "xl", transform: "translateY(-2px)" }}
      transition="all 0.3s ease"
      position="relative"
      maxW="380px"
      minH="520px"
      display="flex"
      flexDirection="column"
      onClick={handleCardClick}
      cursor="pointer"
    >
      <Box>
        <ChakraImage
          src={imgSrc}
          alt={part.title}
          w="full"
          h="180px"
          objectFit="cover"
          itemProp="image"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            if (target.src !== defaultImage) target.src = defaultImage;
          }}
        />
      </Box>

      <Box px={5} pt={4} pb={2} flex="1">
        <Text
          fontWeight="bold"
          fontSize="xl"
          color="whiteAlpha.900"
          mb={2}
          itemProp="name"
        >
          {part.title}
        </Text>

        <VisuallyHidden>
          <span itemProp="description">{part.description}</span>
        </VisuallyHidden>

        <Text
          fontSize="2xl"
          fontWeight="bold"
          color="#d80c19"
          itemProp="offers"
          itemScope
          itemType="https://schema.org/Offer"
        >
          <meta itemProp="priceCurrency" content="AUD" />
          <span itemProp="price">{Number(part.price).toFixed(2)}</span>
          <meta itemProp="availability" content="https://schema.org/InStock" />
        </Text>

        <VStack align="flex-start" gap={1}>
          <Text fontSize="sm" color="gray.300">Year: {part.year}</Text>
          <Text fontSize="sm" color="gray.300">Stock#: {part.stock}</Text>
        </VStack>

        <Box w="full" h="1px" bg="gray.700" my={2} />
        <HStack justify="space-between" w="full">
          <Text fontSize="sm" color="gray.300">Delivery</Text>
          <Text fontSize="sm" color="gray.300">Local Pick Up</Text>
        </HStack>
      </Box>

      <Box px={5} pb={4} mt="auto" onClick={(e) => e.stopPropagation()}>
        <Button
          bg={isInCart ? "gray.600" : "#d80c19"}
          color="white"
          _hover={{ bg: isInCart ? "gray.500" : "#b30915" }}
          size="lg"
          w="full"
          py={4}
          fontSize="md"
          fontWeight="600"
          borderRadius="lg"
          textTransform="uppercase"
          transition="all 0.3s ease"
          onClick={handleAddToCart}
          loading={isAddingToCart}
          loadingText="Adding..."
          disabled={isAddingToCart}
        >
          {isInCart ? "Remove from Cart" : "Add to Cart"}
        </Button>
      </Box>
    </Box>
  );
};

export default ProductCard;
