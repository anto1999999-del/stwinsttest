"use client";

import {
  Box,
  Flex,
  Text,
  Button,
  HStack,
  VStack,
  Image,
  useDisclosure,
} from "@chakra-ui/react";
import {
  FaPhone,
  FaSearch,
  FaUser,
  FaShoppingBag,
  FaBars,
} from "react-icons/fa";
import Link from "next/link";
import QuoteRequest from "./QuoteRequest";
import { useState, useEffect } from "react";
import { useCartStore } from "@/shared/stores/useCartStore";

const Header = () => {
  const { open, onOpen, onClose } = useDisclosure();
  const {
    open: isQuoteOpen,
    onOpen: onQuoteOpen,
    onClose: onQuoteClose,
  } = useDisclosure();
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleQuoteOpen = () => {
    // console.log("Quote button clicked, opening modal...");
    onQuoteOpen();
  };

  // Function to close mobile menu when a link is clicked
  const handleLinkClick = () => {
    onClose();
  };

  // Function to close mobile menu when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (isSearchDropdownOpen) {
        const target = event.target as Element;
        if (!target.closest("[data-search-dropdown]")) {
          setIsSearchDropdownOpen(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchDropdownOpen]);

  return (
    <Box
      color="white"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      transition="all 0.3s ease"
      transform={isScrolled ? "translateY(0)" : "translateY(0)"}
      boxShadow={isScrolled ? "0 4px 20px rgba(0, 0, 0, 0.5)" : "none"}
      backdropFilter={isScrolled ? "blur(10px)" : "none"}
      bg={isScrolled ? "rgba(0, 0, 0, 0.95)" : "black"}
    >
      {/* Top Header Section */}
      <Flex
        justify="space-between"
        align="center"
        px={{ base: 4, md: 8 }} // Responsive padding
        py={2}
        borderBottom="1px solid"
        borderColor="#d80c19" // Specific red color
      >
        {/* Left side - Logo */}
        <Link href="/capricorn">
          <Image
            src="/capricorn-header.png"
            alt="STRONGER WITH CAPRICORN"
            height={{ base: "30px", md: "40px" }}
            objectFit="contain"
            cursor="pointer"
            _hover={{ opacity: 0.8 }}
            transition="opacity 0.2s ease"
          />
        </Link>

        {/* Right side - Phone and Quote Button */}
        <HStack gap={{ base: 2, md: 4 }}>
          <HStack gap={2} display={{ base: "none", md: "flex" }}>
            {" "}
            {/* Hidden on mobile */}
            <Box
              color="#d80c19"
              transform="scaleX(-1)"
              fontSize={{ base: "sm", md: "md" }}
            >
              <FaPhone />
            </Box>
            <Text
              fontSize={{ base: "sm", md: "md" }}
              color="white"
              fontWeight="bold"
            >
              <a
                href="tel:0296047366"
                style={{
                  color: "inherit",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                02 9604 7366
              </a>
            </Text>
          </HStack>
          <Button
            bg="#d80c19"
            color="white"
            _hover={{ bg: "#b30915" }}
            transform="skew(-10deg)"
            px={{ base: 3, md: 6 }}
            fontSize={{ base: "xs", md: "sm" }}
            onClick={handleQuoteOpen}
          >
            <Text transform="skew(10deg)">GET A FREE QUOTE</Text>
          </Button>
        </HStack>
      </Flex>

      {/* Main Navigation Bar */}
      <Flex justify="space-between" align="center" px={4} py={4}>
        {/* Left side - STWINS Logo */}
        <HStack gap={3}>
          <Link href="/">
            <Image
              src="/s-twins-logo.png"
              alt="STWINS Logo"
              height={{ base: "30px", md: "40px" }} // Responsive height
              objectFit="contain"
              cursor="pointer"
              _hover={{ opacity: 0.8 }}
              transition="opacity 0.2s ease"
            />
          </Link>
        </HStack>

        {/* Center - Navigation Menu (Hidden on mobile) */}
        <HStack gap={8} display={{ base: "none", lg: "flex" }}>
          {" "}
          {/* Hidden on mobile/tablet */}
          <Link href="/cars">
            <Box position="relative" pb={1}>
              <Text
                cursor="pointer"
                _hover={{ color: "#ff0000" }}
                transition="color 0.3s ease"
              >
                Cars
              </Text>
              {/* Top Red Line */}
              <Box
                position="absolute"
                top="0"
                left="0"
                w="0"
                h="2px"
                bg="#ff0000"
                transition="width 0.3s ease"
                _hover={{ w: "full" }}
              />
              {/* Bottom Red Line */}
              <Box
                position="absolute"
                bottom="0"
                left="0"
                w="0"
                h="3px"
                bg="#ff0000"
                transition="width 0.3s ease"
                _hover={{ w: "full" }}
              />
            </Box>
          </Link>
          <Link href="/parts">
            <Box position="relative" pb={1}>
              <Text
                cursor="pointer"
                _hover={{ color: "#ff0000" }}
                transition="color 0.3s ease"
              >
                Parts
              </Text>
              {/* Top Red Line */}
              <Box
                position="absolute"
                top="0"
                left="0"
                w="0"
                h="2px"
                bg="#ff0000"
                transition="width 0.3s ease"
                _hover={{ w: "full" }}
              />
              {/* Bottom Red Line */}
              <Box
                position="absolute"
                bottom="0"
                left="0"
                w="0"
                h="3px"
                bg="#ff0000"
                transition="width 0.3s ease"
                _hover={{ w: "full" }}
              />
            </Box>
          </Link>
          <Link href="/about">
            <Box position="relative" pb={1}>
              <Text
                cursor="pointer"
                _hover={{ color: "#ff0000" }}
                transition="color 0.3s ease"
              >
                About
              </Text>
              {/* Top Red Line */}
              <Box
                position="absolute"
                top="0"
                left="0"
                w="0"
                h="2px"
                bg="#ff0000"
                transition="width 0.3s ease"
                _hover={{ w: "full" }}
              />
              {/* Bottom Red Line */}
              <Box
                position="absolute"
                bottom="0"
                left="0"
                w="0"
                h="3px"
                bg="#ff0000"
                transition="width 0.3s ease"
                _hover={{ w: "full" }}
              />
            </Box>
          </Link>
          <Link href="/workshop">
            <Box position="relative" pb={1}>
              <Text
                cursor="pointer"
                _hover={{ color: "#ff0000" }}
                transition="color 0.3s ease"
              >
                Workshop
              </Text>
              {/* Top Red Line */}
              <Box
                position="absolute"
                top="0"
                left="0"
                w="0"
                h="2px"
                bg="#ff0000"
                transition="width 0.3s ease"
                _hover={{ w: "full" }}
              />
              {/* Bottom Red Line */}
              <Box
                position="absolute"
                bottom="0"
                left="0"
                w="0"
                h="3px"
                bg="#ff0000"
                transition="width 0.3s ease"
                _hover={{ w: "full" }}
              />
            </Box>
          </Link>
          <Link href="/contact">
            <Box position="relative" pb={1}>
              <Text
                cursor="pointer"
                _hover={{ color: "#ff0000" }}
                transition="color 0.3s ease"
              >
                Contact
              </Text>
              {/* Top Red Line */}
              <Box
                position="absolute"
                top="0"
                left="0"
                w="0"
                h="2px"
                bg="#ff0000"
                transition="width 0.3s ease"
                _hover={{ w: "full" }}
              />
              {/* Bottom Red Line */}
              <Box
                position="absolute"
                bottom="0"
                left="0"
                w="0"
                h="3px"
                bg="#ff0000"
                transition="width 0.3s ease"
                _hover={{ w: "full" }}
              />
            </Box>
          </Link>
          <Link href="/resolution">
            <Box position="relative" pb={1}>
              <Text
                cursor="pointer"
                _hover={{ color: "#ff0000" }}
                transition="color 0.3s ease"
              >
                Resolution Center
              </Text>
              {/* Top Red Line */}
              <Box
                position="absolute"
                top="0"
                left="0"
                w="0"
                h="2px"
                bg="#ff0000"
                transition="width 0.3s ease"
                _hover={{ w: "full" }}
              />
              {/* Bottom Red Line */}
              <Box
                position="absolute"
                bottom="0"
                left="0"
                w="0"
                h="3px"
                bg="#ff0000"
                transition="width 0.3s ease"
                _hover={{ w: "full" }}
              />
            </Box>
          </Link>
        </HStack>

        {/* Right side - Icons and Burger Menu */}
        <HStack gap={3}>
          {/* Search Dropdown Menu */}
          <Box position="relative" data-search-dropdown>
            <Button
              bg="#d80c19"
              color="white"
              size="sm"
              _hover={{ bg: "#b30915" }}
              _active={{ bg: "#b30915" }}
              px={3}
              py={2}
              onClick={() => setIsSearchDropdownOpen(!isSearchDropdownOpen)}
            >
              <FaSearch />
            </Button>

            {isSearchDropdownOpen && (
              <Box
                position="absolute"
                top="100%"
                right="0"
                mt={1}
                bg="black"
                borderRadius="md"
                boxShadow="lg"
                minW="150px"
                zIndex={1000}
                _before={{
                  content: '""',
                  position: "absolute",
                  top: "-8px",
                  right: "20px",
                  width: 0,
                  height: 0,
                  borderLeft: "8px solid transparent",
                  borderRight: "8px solid transparent",
                  borderBottom: "8px solid black",
                }}
              >
                <VStack gap={0} align="stretch">
                  <Button
                    bg="black"
                    color="white"
                    _hover={{ bg: "gray.800" }}
                    borderRadius="0"
                    borderBottom="1px solid"
                    borderColor="red.500"
                    py={3}
                    px={4}
                    justifyContent="flex-start"
                    onClick={() => {
                      window.location.href = "/parts";
                      setIsSearchDropdownOpen(false);
                    }}
                  >
                    Search Parts
                  </Button>
                  <Button
                    bg="black"
                    color="white"
                    _hover={{ bg: "gray.800" }}
                    borderRadius="0"
                    py={3}
                    px={4}
                    justifyContent="flex-start"
                    onClick={() => {
                      window.location.href = "/cars";
                      setIsSearchDropdownOpen(false);
                    }}
                  >
                    Search Cars
                  </Button>
                </VStack>
              </Box>
            )}
          </Box>

          {/* Account Button */}
          <Link href="/profile">
            <Button
              variant="outline"
              color="white"
              borderColor="white"
              size="sm"
              _hover={{ bg: "white", color: "gray.900" }}
              px={3}
              py={2}
            >
              <FaUser />
            </Button>
          </Link>

          {/* Cart Button */}
          <Link href="/cart">
            <Button
              bg="green.400"
              color="white"
              size="sm"
              _hover={{ bg: "green.500" }}
              position="relative"
            >
              <FaShoppingBag />
              <Box
                position="absolute"
                top="-2"
                right="-2"
                bg="#d80c19"
                color="white"
                borderRadius="full"
                w="5"
                h="5"
                fontSize="xs"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {cartCount}
              </Box>
            </Button>
          </Link>

          {/* Burger Menu Button (Mobile only) */}
          <Button
            aria-label="Toggle menu"
            variant="outline"
            color="white"
            borderColor="white"
            size="sm"
            _hover={{ bg: "white", color: "gray.900" }}
            display={{ base: "flex", lg: "none" }} // Visible on mobile/tablet
            onClick={open ? onClose : onOpen}
          >
            <FaBars />
          </Button>
        </HStack>
      </Flex>

      {/* Mobile Menu (Conditional rendering) */}
      {open && (
        <>
          {/* Backdrop overlay */}
          <Box
            position="fixed"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="rgba(0, 0, 0, 0.5)"
            zIndex={999}
            onClick={handleBackdropClick}
          />

          {/* Mobile Menu Content */}
          <Box
            bg="gray.800"
            px={4}
            py={4}
            borderTop="1px solid"
            borderColor="#d80c19"
            position="relative"
            zIndex={1000}
          >
            <VStack gap={4}>
              {/* Mobile Navigation Links */}
              <Link href="/cars" onClick={handleLinkClick}>
                <Box position="relative" py={2}>
                  <Text
                    cursor="pointer"
                    _hover={{ color: "#d80c19" }}
                    fontSize="lg"
                    transition="color 0.3s ease"
                  >
                    Cars
                  </Text>
                  <Box
                    position="absolute"
                    bottom="0"
                    left="0"
                    w="0"
                    h="2px"
                    bg="#d80c19"
                    transition="width 0.3s ease"
                    _hover={{ w: "full" }}
                  />
                </Box>
              </Link>
              <Link href="/parts" onClick={handleLinkClick}>
                <Box position="relative" py={2}>
                  <Text
                    cursor="pointer"
                    _hover={{ color: "#d80c19" }}
                    fontSize="lg"
                    transition="color 0.3s ease"
                  >
                    Parts
                  </Text>
                  <Box
                    position="absolute"
                    bottom="0"
                    left="0"
                    w="0"
                    h="2px"
                    bg="#d80c19"
                    transition="width 0.3s ease"
                    _hover={{ w: "full" }}
                  />
                </Box>
              </Link>
              <Link href="/about" onClick={handleLinkClick}>
                <Box position="relative" py={2}>
                  <Text
                    cursor="pointer"
                    _hover={{ color: "#d80c19" }}
                    fontSize="lg"
                    transition="color 0.3s ease"
                  >
                    About
                  </Text>
                  <Box
                    position="absolute"
                    bottom="0"
                    left="0"
                    w="0"
                    h="2px"
                    bg="#d80c19"
                    transition="width 0.3s ease"
                    _hover={{ w: "full" }}
                  />
                </Box>
              </Link>
              <Link href="/workshop" onClick={handleLinkClick}>
                <Box position="relative" py={2}>
                  <Text
                    cursor="pointer"
                    _hover={{ color: "#d80c19" }}
                    fontSize="lg"
                    transition="color 0.3s ease"
                  >
                    Workshop
                  </Text>
                  <Box
                    position="absolute"
                    bottom="0"
                    left="0"
                    w="0"
                    h="2px"
                    bg="#d80c19"
                    transition="width 0.3s ease"
                    _hover={{ w: "full" }}
                  />
                </Box>
              </Link>
              <Link href="/contact" onClick={handleLinkClick}>
                <Box position="relative" py={2}>
                  <Text
                    cursor="pointer"
                    _hover={{ color: "#d80c19" }}
                    fontSize="lg"
                    transition="color 0.3s ease"
                  >
                    Contact
                  </Text>
                  <Box
                    position="absolute"
                    bottom="0"
                    left="0"
                    w="0"
                    h="2px"
                    bg="#d80c19"
                    transition="width 0.3s ease"
                    _hover={{ w: "full" }}
                  />
                </Box>
              </Link>
              <Link href="/resolution" onClick={handleLinkClick}>
                <Box position="relative" py={2}>
                  <Text
                    cursor="pointer"
                    _hover={{ color: "#d80c19" }}
                    fontSize="lg"
                    transition="color 0.3s ease"
                  >
                    Resolution Center
                  </Text>
                  <Box
                    position="absolute"
                    bottom="0"
                    left="0"
                    w="0"
                    h="2px"
                    bg="#d80c19"
                    transition="width 0.3s ease"
                    _hover={{ w: "full" }}
                  />
                </Box>
              </Link>

              {/* Mobile Phone Number */}
              <HStack gap={2} justify="center" w="full" py={2}>
                <Box color="#d80c19" transform="scaleX(-1)" fontSize="md">
                  <FaPhone />
                </Box>
                <Text fontSize="md" color="white" fontWeight="bold">
                  02 9604 7366
                </Text>
              </HStack>
            </VStack>
          </Box>
        </>
      )}

      {/* Quote Request Modal */}
      {isQuoteOpen && (
        <Box
          position="fixed"
          top="20%"
          left="0"
          right="0"
          bottom="0"
          bg="rgba(0, 0, 0, 0.8)"
          zIndex={10000}
          display="flex"
          alignItems="flex-start"
          justifyContent="center"
          p={4}
        >
          <Box
            bg="white"
            borderRadius="xl"
            maxW="1200px"
            w="full"
            maxH="80vh"
            overflow="auto"
            position="relative"
            zIndex={10001}
            mt="10vh"
          >
            <Button
              position="absolute"
              top={4}
              right={4}
              variant="ghost"
              color="gray.500"
              _hover={{ bg: "gray.100" }}
              onClick={onQuoteClose}
              zIndex={10002}
              size="lg"
              fontSize="xl"
              fontWeight="bold"
            >
              ×
            </Button>
            <QuoteRequest />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Header;
