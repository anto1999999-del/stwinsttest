// "use client";

// import {
//   Box,
//   Flex,
//   Text,
//   Button,
//   VStack,
//   Input,
//   Textarea,
//   IconButton,
//   Card,
//   CardBody,
//   Checkbox,
//   Divider,
//   useToast,
//   Alert,
//   AlertIcon,
//   Spinner,
// } from "@chakra-ui/react";
// import { FaComments } from "react-icons/fa";
// import { useState, useEffect } from "react";
// import { useForm, FormProvider } from "react-hook-form";
// import { useCartStore } from "@/shared/stores/useCartStore";
// import { useRouter } from "next/navigation";
// import StripeProvider from "./StripeProvider";
// import StripePaymentForm from "./StripePaymentForm";
// import { ShippingCalculator } from "./ShippingCalculator";
// import { ShippingAddressForm } from "./ShippingAddressForm";
// import { createPaymentIntent } from "@/shared/api/payments";
// import { ShippingRate, ShippingAddress } from "@/shared/api/shipping";

// interface CheckoutFormData {
//   billingAddress: ShippingAddress;
//   shippingAddress?: ShippingAddress;
//   orderNotes?: string;
//   createAccount?: boolean;
//   emailSubscription?: boolean;
// }

// export default function EnhancedCheckoutPage() {
//   const router = useRouter();
//   const items = useCartStore((state) => state.items);
//   const isReadyForCheckout = useCartStore((state) => state.isReadyForCheckout);
//   const clearCart = useCartStore((state) => state.clear);
//   const toast = useToast();

//   // Form state
//   const methods = useForm<CheckoutFormData>({
//     defaultValues: {
//       billingAddress: {
//         name: "",
//         firstName: "",
//         lastName: "",
//         companyName: "",
//         country: "Australia",
//         streetAddress: "",
//         apartment: "",
//         suburb: "",
//         state: "NSW",
//         postcode: "",
//         phone: "",
//         email: "",
//       },
//       createAccount: false,
//       emailSubscription: false,
//     },
//   });

//   // Component states
//   const [sameAsBilling, setSameAsBilling] = useState(true);
//   const [selectedShippingRate, setSelectedShippingRate] =
//     useState<ShippingRate | null>(null);
//   const [showShippingCalculator, setShowShippingCalculator] = useState(false);

//   // Payment states
//   const [clientSecret, setClientSecret] = useState<string | null>(null);
//   const [isCreatingPaymentIntent, setIsCreatingPaymentIntent] = useState(false);
//   const [paymentIntentCreated, setPaymentIntentCreated] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Calculations
//   const subtotal = items.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );
//   const shippingCost = selectedShippingRate?.cost || 0;
//   const subtotalWithShipping = subtotal + shippingCost;
//   const tax = subtotalWithShipping * 0.1; // 10% GST
//   const total = subtotalWithShipping + tax;

//   // Convert cart items to shipping items with default dimensions if not provided
//   const getShippingItems = () => {
//     return items.map((item) => ({
//       weight: 1, // Default 1kg - this could be enhanced to use actual product weights
//       length: 20, // Default 20cm
//       width: 15, // Default 15cm
//       height: 10, // Default 10cm
//       quantity: item.quantity,
//       description: item.name,
//     }));
//   };

//   const handleShippingRateSelected = (rate: ShippingRate) => {
//     setSelectedShippingRate(rate);
//     toast({
//       title: "Shipping Option Selected",
//       description: `${rate.serviceName} - $${rate.cost.toFixed(2)} (${
//         rate.estimatedDays
//       } days)`,
//       status: "success",
//       duration: 3000,
//       isClosable: true,
//     });
//   };

//   const createStripePaymentIntent = async () => {
//     const formData = methods.getValues();

//     // Validate form
//     const isValid = await methods.trigger();
//     if (!isValid) {
//       toast({
//         title: "Please fill in all required fields",
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//       });
//       return;
//     }

//     // Check if cart is ready for checkout (has delivery and shipping)
//     if (!isReadyForCheckout()) {
//       toast({
//         title: "Please complete delivery address and freight calculation first",
//         description:
//           "Go back to cart to set your delivery address and calculate shipping costs.",
//         status: "warning",
//         duration: 5000,
//         isClosable: true,
//       });
//       return;
//     }

//     setIsCreatingPaymentIntent(true);
//     try {
//       // Prepare cart items with shipping data
//       const cartItems = items.map((item) => ({
//         id: item.id,
//         name: item.name,
//         price: item.price,
//         quantity: item.quantity,
//         image: item.image,
//         // Add shipping dimensions if available
//         weight: 1, // You might want to get this from the product data
//         length: 20,
//         width: 15,
//         height: 10,
//       }));

//       // Prepare shipping address (use billing if same)
//       const shippingAddress = sameAsBilling
//         ? formData.billingAddress
//         : formData.shippingAddress;

//       // Create payment intent with shipping data
//       const response = await createPaymentIntent({
//         items: cartItems,
//         billingAddress: formData.billingAddress,
//         shippingAddress: shippingAddress,
//         shippingOption: selectedShippingRate
//           ? {
//               serviceType: selectedShippingRate.serviceType,
//               cost: selectedShippingRate.cost,
//               estimatedDays: selectedShippingRate.estimatedDays,
//               carrier: selectedShippingRate.carrier,
//             }
//           : undefined,
//         currency: "aud",
//       });

//       setClientSecret(response.clientSecret);
//       setPaymentIntentCreated(true);
//       toast({
//         title: "Payment form ready!",
//         status: "success",
//         duration: 3000,
//         isClosable: true,
//       });
//     } catch (error) {
//       console.error("Error creating payment intent:", error);
//       toast({
//         title: "Failed to initialize payment",
//         description: "Please try again.",
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//       });
//     } finally {
//       setIsCreatingPaymentIntent(false);
//     }
//   };

//   const handlePaymentSuccess = () => {
//     toast({
//       title: "Payment successful!",
//       description: "Redirecting to confirmation page...",
//       status: "success",
//       duration: 5000,
//       isClosable: true,
//     });
//     clearCart();
//     setTimeout(() => {
//       router.push("/order-confirmation");
//     }, 2000);
//   };

//   const handlePaymentError = (error: string) => {
//     toast({
//       title: "Payment failed",
//       description: error,
//       status: "error",
//       duration: 5000,
//       isClosable: true,
//     });
//   };

//   if (items.length === 0) {
//     return (
//       <Box as="section" bg="gray.50" minH="100vh" py={20}>
//         <Box
//           maxW="1200px"
//           mx="auto"
//           px={{ base: 6, md: 12, lg: 16 }}
//           textAlign="center"
//         >
//           <Text fontSize="2xl" fontWeight="bold" color="gray.600" mb={4}>
//             Your cart is empty
//           </Text>
//           <Text fontSize="lg" color="gray.500" mb={8}>
//             Add some products to proceed to checkout
//           </Text>
//           <Button
//             bg="#d80c19"
//             color="white"
//             _hover={{ bg: "#b30915" }}
//             size="lg"
//             onClick={() => router.push("/parts")}
//           >
//             Browse Products
//           </Button>
//         </Box>
//       </Box>
//     );
//   }

//   return (
//     <Box
//       as="section"
//       bg="linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)"
//       minH="100vh"
//       py={10}
//     >
//       <Box maxW="1400px" mx="auto" px={{ base: 6, md: 12, lg: 16 }}>
//         {/* Page Title */}
//         <Box textAlign="center" mb={12}>
//           <Text
//             fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
//             fontWeight="bold"
//             bgGradient="linear(to-r, #d80c19, #ff6b6b)"
//             bgClip="text"
//             mb={4}
//           >
//             Checkout
//           </Text>
//           <Box
//             w="100px"
//             h="4px"
//             bgGradient="linear(to-r, #d80c19, #ff6b6b)"
//             mx="auto"
//             borderRadius="full"
//             mb={4}
//           />
//           <Box
//             bg="blue.50"
//             p={4}
//             borderRadius="lg"
//             border="1px solid"
//             borderColor="blue.200"
//             maxW="600px"
//             mx="auto"
//           >
//             <Text fontSize="lg" fontWeight="bold" color="blue.700" mb={2}>
//               💳 Payment Information
//             </Text>
//             <Text fontSize="sm" color="blue.600" mb={1}>
//               Full payment (including freight) will be collected now
//             </Text>
//             <Text fontSize="sm" color="blue.600">
//               Items will be prepared and shipped after payment confirmation
//             </Text>
//           </Box>
//         </Box>

//         <FormProvider {...methods}>
//           <Flex direction={{ base: "column", lg: "row" }} gap={8}>
//             {/* Left Column - Forms */}
//             <Box flex="1" maxW={{ base: "100%", lg: "60%" }}>
//               {/* Billing Address */}
//               <Card mb={8}>
//                 <CardBody p={8}>
//                   <ShippingAddressForm
//                     title="Billing Address"
//                     namePrefix="billingAddress"
//                     errors={methods.formState.errors}
//                   />
//                 </CardBody>
//               </Card>

//               {/* Shipping Address */}
//               <Card mb={8}>
//                 <CardBody p={8}>
//                   <ShippingAddressForm
//                     title="Shipping Address"
//                     namePrefix="shippingAddress"
//                     showSameAsBilling={true}
//                     sameAsBilling={sameAsBilling}
//                     onSameAsBillingChange={setSameAsBilling}
//                     errors={methods.formState.errors}
//                   />
//                 </CardBody>
//               </Card>

//               {/* Shipping Calculator */}
//               <Card mb={8}>
//                 <CardBody p={8}>
//                   <ShippingCalculator
//                     items={getShippingItems()}
//                     onRateSelected={handleShippingRateSelected}
//                     defaultDestination={methods.watch("billingAddress")}
//                   />
//                 </CardBody>
//               </Card>

//               {/* Order Notes */}
//               <Card mb={8}>
//                 <CardBody p={8}>
//                   <Text
//                     fontSize="2xl"
//                     fontWeight="bold"
//                     mb={4}
//                     color="gray.800"
//                   >
//                     Order Notes
//                   </Text>
//                   <Text fontSize="sm" color="gray.500" mb={4}>
//                     (Optional)
//                   </Text>
//                   <Textarea
//                     {...methods.register("orderNotes")}
//                     placeholder="Notes about your order, e.g. special notes for delivery."
//                     rows={4}
//                     resize="vertical"
//                   />
//                 </CardBody>
//               </Card>

//               {/* Additional Options */}
//               <Card mb={8}>
//                 <CardBody p={8}>
//                   <VStack align="start" spacing={4}>
//                     <Checkbox {...methods.register("createAccount")}>
//                       Create an account?
//                     </Checkbox>
//                     <Checkbox {...methods.register("emailSubscription")}>
//                       I would like to receive exclusive emails with discounts
//                       and product information
//                     </Checkbox>
//                   </VStack>
//                 </CardBody>
//               </Card>
//             </Box>

//             {/* Right Column - Order Summary & Payment */}
//             <Box flex="1" maxW={{ base: "100%", lg: "40%" }}>
//               <Card>
//                 <CardBody p={8}>
//                   <Text
//                     fontSize="2xl"
//                     fontWeight="bold"
//                     mb={6}
//                     color="gray.800"
//                   >
//                     Your Order
//                   </Text>

//                   {/* Order Items */}
//                   <VStack gap={3} align="stretch" mb={4}>
//                     {items.map((item) => (
//                       <Flex
//                         key={item.id}
//                         justify="space-between"
//                         align="center"
//                       >
//                         <Box flex="1" minW="0">
//                           <Text fontSize="sm" color="gray.800" lineHeight="1.3">
//                             {item.name}
//                           </Text>
//                           <Text fontSize="xs" color="gray.500">
//                             x {item.quantity}
//                           </Text>
//                         </Box>
//                         <Text fontWeight="bold" color="black" fontSize="sm">
//                           ${(item.price * item.quantity).toFixed(2)}
//                         </Text>
//                       </Flex>
//                     ))}
//                   </VStack>

//                   <Divider mb={4} />

//                   {/* Order Totals */}
//                   <VStack gap={2} align="stretch" mb={6}>
//                     <Flex justify="space-between">
//                       <Text color="gray.600">Subtotal</Text>
//                       <Text fontWeight="bold" color="black">
//                         ${subtotal.toFixed(2)}
//                       </Text>
//                     </Flex>

//                     {selectedShippingRate ? (
//                       <Box>
//                         <Flex justify="space-between">
//                           <Text color="gray.600">
//                             Freight ({selectedShippingRate.serviceName})
//                           </Text>
//                           <Text fontWeight="bold" color="#d80c19">
//                             ${selectedShippingRate.cost.toFixed(2)}
//                           </Text>
//                         </Flex>
//                         <Text fontSize="xs" color="gray.500" textAlign="right">
//                           {selectedShippingRate.estimatedDays} business days •{" "}
//                           {selectedShippingRate.carrier}
//                         </Text>
//                       </Box>
//                     ) : (
//                       <Flex justify="space-between">
//                         <Text color="gray.600">Freight</Text>
//                         <Text fontWeight="bold" color="orange.500">
//                           Calculate above
//                         </Text>
//                       </Flex>
//                     )}

//                     <Flex justify="space-between">
//                       <Text color="gray.600">Tax (GST)</Text>
//                       <Text fontWeight="bold" color="black">
//                         ${tax.toFixed(2)}
//                       </Text>
//                     </Flex>

//                     <Divider />

//                     <Flex justify="space-between" fontSize="lg">
//                       <Text fontWeight="bold" color="black">
//                         Total Payment (Due Now)
//                       </Text>
//                       <Text fontWeight="bold" color="#d80c19" fontSize="xl">
//                         ${total.toFixed(2)}
//                       </Text>
//                     </Flex>

//                     {selectedShippingRate && (
//                       <Box
//                         bg="yellow.50"
//                         p={3}
//                         borderRadius="md"
//                         border="1px solid"
//                         borderColor="yellow.200"
//                       >
//                         <Text
//                           fontSize="xs"
//                           color="yellow.700"
//                           textAlign="center"
//                           fontWeight="bold"
//                         >
//                           💳 Full payment collected now • Items prepared after
//                           payment
//                         </Text>
//                       </Box>
//                     )}
//                   </VStack>

//                   {/* Payment Section */}
//                   <Text fontSize="xl" fontWeight="bold" mb={6} color="gray.800">
//                     Payment
//                   </Text>

//                   {!paymentIntentCreated ? (
//                     <Button
//                       bgGradient="linear(to-r, #d80c19, #ff6b6b)"
//                       color="white"
//                       _hover={{
//                         bgGradient: "linear(to-r, #b30915, #e55555)",
//                         transform: "translateY(-2px)",
//                         boxShadow: "0 8px 25px rgba(216, 12, 25, 0.4)",
//                       }}
//                       size="lg"
//                       w="full"
//                       py={8}
//                       fontSize="xl"
//                       fontWeight="bold"
//                       onClick={createStripePaymentIntent}
//                       isLoading={isCreatingPaymentIntent}
//                       loadingText="Setting up payment..."
//                       disabled={
//                         isCreatingPaymentIntent || !isReadyForCheckout()
//                       }
//                       borderRadius="xl"
//                       boxShadow="0 4px 15px rgba(216, 12, 25, 0.3)"
//                       transition="all 0.3s ease"
//                     >
//                       Continue to Payment
//                     </Button>
//                   ) : (
//                     <StripeProvider clientSecret={clientSecret!}>
//                       <StripePaymentForm
//                         total={total}
//                         onSuccess={handlePaymentSuccess}
//                         onError={handlePaymentError}
//                         isLoading={isSubmitting}
//                       />
//                     </StripeProvider>
//                   )}

//                   {!isReadyForCheckout() && (
//                     <Alert status="warning" mt={4}>
//                       <AlertIcon />
//                       Please complete delivery address and freight calculation
//                       in cart first
//                     </Alert>
//                   )}
//                 </CardBody>
//               </Card>
//             </Box>
//           </Flex>
//         </FormProvider>
//       </Box>

//       {/* Floating "Text us" Button */}
//       <IconButton
//         aria-label="Text us"
//         bg="#d80c19"
//         color="white"
//         _hover={{ bg: "#b30915" }}
//         position="fixed"
//         right={6}
//         bottom={6}
//         size="lg"
//         borderRadius="lg"
//         boxShadow="lg"
//         zIndex={1000}
//       >
//         <FaComments />
//       </IconButton>
//     </Box>
//   );
// }
