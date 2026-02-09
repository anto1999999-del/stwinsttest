// "use client";

// import React, { useState } from "react";
// import {
//   Box,
//   Button,
//   VStack,
//   HStack,
//   Text,
//   Input,
//   Flex,
//   Spinner,
// } from "@chakra-ui/react";
// import { FaShippingFast, FaMapMarkerAlt, FaCalculator } from "react-icons/fa";
// import { toast } from "sonner";
// import { useCartStore } from "@/shared/stores/useCartStore";

// const AUSTRALIAN_STATES = [
//   { value: "New South Wales", label: "New South Wales" },
//   { value: "Victoria", label: "Victoria" },
//   { value: "Queensland", label: "Queensland" },
//   { value: "Western Australia", label: "Western Australia" },
//   { value: "South Australia", label: "South Australia" },
//   { value: "Tasmania", label: "Tasmania" },
//   { value: "Northern Territory", label: "Northern Territory" },
//   {
//     value: "Australian Capital Territory",
//     label: "Australian Capital Territory",
//   },
// ];

// export default function CartShippingCalculator() {
//   const {
//     deliveryAddress,
//     shippingRates,
//     selectedShipping,
//     isCalculatingShipping,
//     shippingError,
//     setDeliveryAddress,
//     calculateShipping,
//     selectShipping,
//     getShippingCost,
//   } = useCartStore();

//   const [addressForm, setAddressForm] = useState({
//     name: deliveryAddress?.name || "",
//     streetAddress: deliveryAddress?.streetAddress || "",
//     apartment: deliveryAddress?.apartment || "",
//     suburb: deliveryAddress?.suburb || "",
//     state: deliveryAddress?.state || "New South Wales",
//     postcode: deliveryAddress?.postcode || "",
//     country: "Australia",
//     phone: deliveryAddress?.phone || "",
//     email: deliveryAddress?.email || "",
//   });

//   const [showAddressForm, setShowAddressForm] = useState(!deliveryAddress);

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setAddressForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleCalculateShipping = async () => {
//     // Validate required fields
//     if (
//       !addressForm.name ||
//       !addressForm.streetAddress ||
//       !addressForm.suburb ||
//       !addressForm.postcode
//     ) {
//       toast.error("Please fill in all required delivery address fields");
//       return;
//     }

//     // Validate postcode format
//     if (!/^\d{4}$/.test(addressForm.postcode)) {
//       toast.error("Please enter a valid 4-digit Australian postcode");
//       return;
//     }

//     // Save address and calculate shipping
//     setDeliveryAddress(addressForm);
//     setShowAddressForm(false);
//     await calculateShipping();
//   };

//   const handleShippingSelect = (rate: any) => {
//     selectShipping(rate);
//     toast.success(
//       `${rate.serviceName} - $${rate.cost.toFixed(2)} (${
//         rate.estimatedDays
//       } days)`
//     );
//   };

//   const getServiceTypeBadge = (serviceType: string) => {
//     const colors: Record<string, string> = {
//       standard: "blue",
//       express: "orange",
//       overnight: "red",
//       same_day: "green",
//     };
//     return colors[serviceType] || "gray";
//   };

//   return (
//     <Box
//       bg="white"
//       p={6}
//       borderRadius="lg"
//       boxShadow="md"
//       border="1px solid"
//       borderColor="gray.200"
//     >
//       <Box mb={6}>
//         <Flex align="center" justify="space-between">
//           <HStack gap={3}>
//             <Box color="#d80c19">
//               <FaShippingFast size="24px" />
//             </Box>
//             <Text fontSize="xl" fontWeight="bold">
//               Delivery & Shipping
//             </Text>
//           </HStack>
//           <Box bg="red.100" px={2} py={1} borderRadius="sm">
//             <Text fontSize="xs" fontWeight="bold" color="red.800">
//               REQUIRED FOR CHECKOUT
//             </Text>
//           </Box>
//         </Flex>
//       </Box>

//       <VStack gap={6} align="stretch">
//         {/* Freight Cost Highlight */}
//         {selectedShipping && (
//           <Box
//             bg="green.50"
//             p={4}
//             borderRadius="lg"
//             border="2px solid"
//             borderColor="green.300"
//             textAlign="center"
//           >
//             <Text fontSize="lg" fontWeight="bold" color="green.700" mb={1}>
//               🚚 Freight Cost: ${selectedShipping.cost.toFixed(2)}
//             </Text>
//             <Text fontSize="sm" color="green.600">
//               {selectedShipping.serviceName} • {selectedShipping.estimatedDays}{" "}
//               business days
//             </Text>
//             <Text fontSize="xs" color="green.500" mt={2}>
//               This freight cost is included in your checkout total
//             </Text>
//           </Box>
//         )}

//         {/* Current Delivery Address Display */}
//         {deliveryAddress && !showAddressForm && (
//           <Box
//             p={4}
//             bg="blue.50"
//             borderRadius="lg"
//             border="1px solid"
//             borderColor="blue.200"
//           >
//             <HStack gap={2} mb={2}>
//               <Box color="blue.500">
//                 <FaMapMarkerAlt />
//               </Box>
//               <Text fontWeight="bold" color="blue.700">
//                 Delivering to:
//               </Text>
//             </HStack>
//             <Text color="gray.700">{deliveryAddress.name}</Text>
//             <Text color="gray.600" fontSize="sm">
//               {deliveryAddress.streetAddress}
//               {deliveryAddress.apartment && `, ${deliveryAddress.apartment}`}
//             </Text>
//             <Text color="gray.600" fontSize="sm">
//               {deliveryAddress.suburb}, {deliveryAddress.state}{" "}
//               {deliveryAddress.postcode}
//             </Text>
//             <Button
//               mt={3}
//               size="sm"
//               variant="outline"
//               bg="blue.500"
//               color="white"
//               _hover={{ bg: "blue.600" }}
//               onClick={() => setShowAddressForm(true)}
//             >
//               Change Address
//             </Button>
//           </Box>
//         )}

//         {/* Address Form */}
//         {showAddressForm && (
//           <Box>
//             <Text fontSize="lg" fontWeight="bold" mb={4} color="gray.800">
//               Delivery Address
//             </Text>
//             <VStack gap={4} align="stretch">
//               <Box>
//                 <Text mb={2} fontWeight="medium">
//                   Full Name *
//                 </Text>
//                 <Input
//                   name="name"
//                   value={addressForm.name}
//                   onChange={handleInputChange}
//                   placeholder="John Doe"
//                   _focus={{
//                     borderColor: "#d80c19",
//                     boxShadow: "0 0 0 1px #d80c19",
//                   }}
//                 />
//               </Box>

//               <Box>
//                 <Text mb={2} fontWeight="medium">
//                   Street Address *
//                 </Text>
//                 <Input
//                   name="streetAddress"
//                   value={addressForm.streetAddress}
//                   onChange={handleInputChange}
//                   placeholder="123 Main Street"
//                   _focus={{
//                     borderColor: "#d80c19",
//                     boxShadow: "0 0 0 1px #d80c19",
//                   }}
//                 />
//               </Box>

//               <Box>
//                 <Text mb={2} fontWeight="medium">
//                   Apartment/Unit (Optional)
//                 </Text>
//                 <Input
//                   name="apartment"
//                   value={addressForm.apartment}
//                   onChange={handleInputChange}
//                   placeholder="Unit 5"
//                   _focus={{
//                     borderColor: "#d80c19",
//                     boxShadow: "0 0 0 1px #d80c19",
//                   }}
//                 />
//               </Box>

//               <HStack gap={4}>
//                 <Box flex={1}>
//                   <Text mb={2} fontWeight="medium">
//                     Suburb *
//                   </Text>
//                   <Input
//                     name="suburb"
//                     value={addressForm.suburb}
//                     onChange={handleInputChange}
//                     placeholder="Sydney"
//                     _focus={{
//                       borderColor: "#d80c19",
//                       boxShadow: "0 0 0 1px #d80c19",
//                     }}
//                   />
//                 </Box>

//                 <Box flex={1}>
//                   <Text mb={2} fontWeight="medium">
//                     State *
//                   </Text>
//                   <select
//                     name="state"
//                     value={addressForm.state}
//                     onChange={handleInputChange}
//                     style={{
//                       width: "100%",
//                       padding: "8px",
//                       border: "1px solid #E2E8F0",
//                       borderRadius: "6px",
//                       backgroundColor: "white",
//                     }}
//                   >
//                     {AUSTRALIAN_STATES.map((state) => (
//                       <option key={state.value} value={state.value}>
//                         {state.label}
//                       </option>
//                     ))}
//                   </select>
//                 </Box>

//                 <Box flex={1}>
//                   <Text mb={2} fontWeight="medium">
//                     Postcode *
//                   </Text>
//                   <Input
//                     name="postcode"
//                     value={addressForm.postcode}
//                     onChange={handleInputChange}
//                     placeholder="2000"
//                     maxLength={4}
//                     _focus={{
//                       borderColor: "#d80c19",
//                       boxShadow: "0 0 0 1px #d80c19",
//                     }}
//                   />
//                 </Box>
//               </HStack>

//               <HStack gap={4}>
//                 <Box flex={1}>
//                   <Text mb={2} fontWeight="medium">
//                     Phone (Optional)
//                   </Text>
//                   <Input
//                     name="phone"
//                     value={addressForm.phone}
//                     onChange={handleInputChange}
//                     placeholder="+61 400 000 000"
//                     _focus={{
//                       borderColor: "#d80c19",
//                       boxShadow: "0 0 0 1px #d80c19",
//                     }}
//                   />
//                 </Box>

//                 <Box flex={1}>
//                   <Text mb={2} fontWeight="medium">
//                     Email (Optional)
//                   </Text>
//                   <Input
//                     name="email"
//                     type="email"
//                     value={addressForm.email}
//                     onChange={handleInputChange}
//                     placeholder="john@example.com"
//                     _focus={{
//                       borderColor: "#d80c19",
//                       boxShadow: "0 0 0 1px #d80c19",
//                     }}
//                   />
//                 </Box>
//               </HStack>

//               <Button
//                 onClick={handleCalculateShipping}
//                 loading={isCalculatingShipping}
//                 bg="#d80c19"
//                 color="white"
//                 _hover={{ bg: "#b30915" }}
//                 size="lg"
//               >
//                 <HStack gap={2}>
//                   <FaCalculator />
//                   <Text>
//                     {isCalculatingShipping
//                       ? "Calculating..."
//                       : "Calculate Shipping Rates"}
//                   </Text>
//                 </HStack>
//               </Button>
//             </VStack>
//           </Box>
//         )}

//         {/* Shipping Error */}
//         {shippingError && (
//           <Box
//             bg="red.50"
//             p={4}
//             borderRadius="md"
//             border="1px solid"
//             borderColor="red.200"
//           >
//             <Text color="red.600">{shippingError}</Text>
//           </Box>
//         )}

//         {/* Loading State */}
//         {isCalculatingShipping && (
//           <Box textAlign="center" py={6}>
//             <Spinner size="lg" color="#d80c19" />
//             <Text mt={3} color="gray.600">
//               Calculating shipping rates...
//             </Text>
//           </Box>
//         )}

//         {/* Shipping Rate Options */}
//         {shippingRates.length > 0 && !isCalculatingShipping && (
//           <Box>
//             <Text fontSize="lg" fontWeight="bold" mb={4} color="gray.800">
//               Available Shipping Options
//             </Text>
//             <VStack gap={3}>
//               {shippingRates.map((rate, index) => (
//                 <Box
//                   key={index}
//                   w="full"
//                   cursor="pointer"
//                   onClick={() => handleShippingSelect(rate)}
//                   bg={
//                     selectedShipping?.serviceType === rate.serviceType
//                       ? "#fef2f2"
//                       : "white"
//                   }
//                   borderColor={
//                     selectedShipping?.serviceType === rate.serviceType
//                       ? "#d80c19"
//                       : "gray.200"
//                   }
//                   borderWidth="2px"
//                   p={4}
//                   borderRadius="md"
//                   _hover={{ borderColor: "#d80c19", shadow: "md" }}
//                   transition="all 0.2s"
//                 >
//                   <HStack justify="space-between" align="center">
//                     <VStack align="start" gap={1}>
//                       <HStack>
//                         <Text fontWeight="bold" color="gray.800">
//                           {rate.serviceName}
//                         </Text>
//                         <Box
//                           bg={`${getServiceTypeBadge(rate.serviceType)}.100`}
//                           px={2}
//                           py={1}
//                           borderRadius="sm"
//                         >
//                           <Text
//                             fontSize="xs"
//                             fontWeight="bold"
//                             color={`${getServiceTypeBadge(
//                               rate.serviceType
//                             )}.800`}
//                           >
//                             {rate.serviceType.replace("_", " ").toUpperCase()}
//                           </Text>
//                         </Box>
//                       </HStack>
//                       <Text fontSize="sm" color="gray.600">
//                         {rate.estimatedDays} business day
//                         {rate.estimatedDays !== 1 ? "s" : ""} • {rate.carrier}
//                       </Text>
//                     </VStack>
//                     <VStack align="end" gap={1}>
//                       <Text fontSize="xl" fontWeight="bold" color="#d80c19">
//                         ${rate.cost.toFixed(2)}
//                       </Text>
//                       {selectedShipping?.serviceType === rate.serviceType && (
//                         <Box bg="green.100" px={2} py={1} borderRadius="sm">
//                           <Text
//                             fontSize="xs"
//                             fontWeight="bold"
//                             color="green.800"
//                           >
//                             Selected
//                           </Text>
//                         </Box>
//                       )}
//                     </VStack>
//                   </HStack>
//                 </Box>
//               ))}
//             </VStack>

//             {/* Current Selection Summary */}
//             {selectedShipping && (
//               <Box
//                 mt={4}
//                 p={4}
//                 bg="green.50"
//                 borderRadius="lg"
//                 border="1px solid"
//                 borderColor="green.200"
//               >
//                 <HStack justify="space-between" align="center">
//                   <Box>
//                     <Text fontWeight="bold" color="green.700">
//                       Selected Shipping:
//                     </Text>
//                     <Text color="green.600" fontSize="sm">
//                       {selectedShipping.serviceName} -{" "}
//                       {selectedShipping.estimatedDays} day
//                       {selectedShipping.estimatedDays !== 1 ? "s" : ""}
//                     </Text>
//                   </Box>
//                   <Text fontSize="lg" fontWeight="bold" color="green.600">
//                     ${getShippingCost().toFixed(2)}
//                   </Text>
//                 </HStack>
//               </Box>
//             )}
//           </Box>
//         )}
//       </VStack>
//     </Box>
//   );
// }
