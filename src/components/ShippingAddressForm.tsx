"use client";

import React from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { Controller, useFormContext, FieldErrors } from "react-hook-form";

interface ShippingAddressFormProps {
  title?: string;
  namePrefix: string; // e.g., 'billingAddress' or 'shippingAddress'
  showSameAsBilling?: boolean;
  sameAsBilling?: boolean;
  onSameAsBillingChange?: (value: boolean) => void;
  errors?: FieldErrors;
}

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

export const ShippingAddressForm: React.FC<ShippingAddressFormProps> = ({
  title = "Address",
  namePrefix,
  showSameAsBilling = false,
  sameAsBilling = false,
  onSameAsBillingChange,
  errors,
}) => {
  const { control } = useFormContext();

  const getFieldError = (fieldName: string) => {
    const fieldError = (
      errors as Record<string, Record<string, { message?: string }>>
    )?.[namePrefix]?.[fieldName];
    return fieldError?.message;
  };

  return (
    <Box>
      <VStack gap={4} align="stretch">
        <HStack justify="space-between" align="center">
          <Text fontSize="lg" fontWeight="bold">
            {title}
          </Text>
          {showSameAsBilling && (
            <HStack gap={2}>
              <input
                type="checkbox"
                checked={sameAsBilling}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onSameAsBillingChange?.(e.target.checked)
                }
              />
              <Text>Same as billing address</Text>
            </HStack>
          )}
        </HStack>

        {(!showSameAsBilling || !sameAsBilling) && (
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <GridItem>
              <Box>
                <Text mb={2} fontWeight="medium">
                  First Name *
                </Text>
                <Controller
                  name={`${namePrefix}.firstName`}
                  control={control}
                  rules={{ required: "First name is required" }}
                  render={({ field }) => (
                    <Input {...field} placeholder="John" />
                  )}
                />
                {getFieldError("firstName") && (
                  <Text fontSize="sm" color="red.500" mt={1}>
                    {getFieldError("firstName")}
                  </Text>
                )}
              </Box>
            </GridItem>

            <GridItem>
              <Box>
                <Text mb={2} fontWeight="medium">
                  Last Name *
                </Text>
                <Controller
                  name={`${namePrefix}.lastName`}
                  control={control}
                  rules={{ required: "Last name is required" }}
                  render={({ field }) => <Input {...field} placeholder="Doe" />}
                />
                {getFieldError("lastName") && (
                  <Text fontSize="sm" color="red.500" mt={1}>
                    {getFieldError("lastName")}
                  </Text>
                )}
              </Box>
            </GridItem>

            <GridItem colSpan={2}>
              <Box>
                <Text mb={2} fontWeight="medium">
                  Company Name (Optional)
                </Text>
                <Controller
                  name={`${namePrefix}.companyName`}
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Your Company" />
                  )}
                />
                {getFieldError("companyName") && (
                  <Text fontSize="sm" color="red.500" mt={1}>
                    {getFieldError("companyName")}
                  </Text>
                )}
              </Box>
            </GridItem>

            <GridItem colSpan={2}>
              <Box>
                <Text mb={2} fontWeight="medium">
                  Street Address *
                </Text>
                <Controller
                  name={`${namePrefix}.streetAddress`}
                  control={control}
                  rules={{ required: "Street address is required" }}
                  render={({ field }) => (
                    <Input {...field} placeholder="123 Main Street" />
                  )}
                />
                {getFieldError("streetAddress") && (
                  <Text fontSize="sm" color="red.500" mt={1}>
                    {getFieldError("streetAddress")}
                  </Text>
                )}
              </Box>
            </GridItem>

            <GridItem colSpan={2}>
              <Box>
                <Text mb={2} fontWeight="medium">
                  Apartment, Suite, etc. (Optional)
                </Text>
                <Controller
                  name={`${namePrefix}.apartment`}
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Apt 2B" />
                  )}
                />
                {getFieldError("apartment") && (
                  <Text fontSize="sm" color="red.500" mt={1}>
                    {getFieldError("apartment")}
                  </Text>
                )}
              </Box>
            </GridItem>

            <GridItem>
              <Box>
                <Text mb={2} fontWeight="medium">
                  Suburb *
                </Text>
                <Controller
                  name={`${namePrefix}.suburb`}
                  control={control}
                  rules={{ required: "Suburb is required" }}
                  render={({ field }) => (
                    <Input {...field} placeholder="Sydney" />
                  )}
                />
                {getFieldError("suburb") && (
                  <Text fontSize="sm" color="red.500" mt={1}>
                    {getFieldError("suburb")}
                  </Text>
                )}
              </Box>
            </GridItem>

            <GridItem>
              <Box>
                <Text mb={2} fontWeight="medium">
                  State *
                </Text>
                <Controller
                  name={`${namePrefix}.state`}
                  control={control}
                  rules={{ required: "State is required" }}
                  render={({ field }) => (
                    <select
                      {...field}
                      style={{
                        width: "100%",
                        padding: "8px",
                        border: "1px solid #E2E8F0",
                        borderRadius: "6px",
                        backgroundColor: "white",
                      }}
                    >
                      <option value="">Select state</option>
                      {AUSTRALIAN_STATES.map((state) => (
                        <option key={state.value} value={state.value}>
                          {state.label}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {getFieldError("state") && (
                  <Text fontSize="sm" color="red.500" mt={1}>
                    {getFieldError("state")}
                  </Text>
                )}
              </Box>
            </GridItem>

            <GridItem>
              <Box>
                <Text mb={2} fontWeight="medium">
                  Postcode *
                </Text>
                <Controller
                  name={`${namePrefix}.postcode`}
                  control={control}
                  rules={{
                    required: "Postcode is required",
                    pattern: {
                      value: /^\d{4}$/,
                      message: "Please enter a valid 4-digit postcode",
                    },
                  }}
                  render={({ field }) => (
                    <Input {...field} placeholder="2000" />
                  )}
                />
                {getFieldError("postcode") && (
                  <Text fontSize="sm" color="red.500" mt={1}>
                    {getFieldError("postcode")}
                  </Text>
                )}
              </Box>
            </GridItem>

            <GridItem>
              <Box>
                <Text mb={2} fontWeight="medium">
                  Country *
                </Text>
                <Controller
                  name={`${namePrefix}.country`}
                  control={control}
                  rules={{ required: "Country is required" }}
                  defaultValue="Australia"
                  render={({ field }) => (
                    <select
                      {...field}
                      style={{
                        width: "100%",
                        padding: "8px",
                        border: "1px solid #E2E8F0",
                        borderRadius: "6px",
                        backgroundColor: "white",
                      }}
                    >
                      <option value="Australia">Australia</option>
                      <option value="New Zealand">New Zealand</option>
                    </select>
                  )}
                />
                {getFieldError("country") && (
                  <Text fontSize="sm" color="red.500" mt={1}>
                    {getFieldError("country")}
                  </Text>
                )}
              </Box>
            </GridItem>

            <GridItem>
              <Box>
                <Text mb={2} fontWeight="medium">
                  Phone Number *
                </Text>
                <Controller
                  name={`${namePrefix}.phone`}
                  control={control}
                  rules={{
                    required: "Phone number is required",
                    pattern: {
                      value: /^(\+61|0)[2-9]\d{8}$/,
                      message: "Please enter a valid Australian phone number",
                    },
                  }}
                  render={({ field }) => (
                    <Input {...field} placeholder="+61412345678" />
                  )}
                />
                {getFieldError("phone") && (
                  <Text fontSize="sm" color="red.500" mt={1}>
                    {getFieldError("phone")}
                  </Text>
                )}
              </Box>
            </GridItem>

            <GridItem>
              <Box>
                <Text mb={2} fontWeight="medium">
                  Email Address *
                </Text>
                <Controller
                  name={`${namePrefix}.email`}
                  control={control}
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email address",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="email"
                      placeholder="john.doe@example.com"
                    />
                  )}
                />
                {getFieldError("email") && (
                  <Text fontSize="sm" color="red.500" mt={1}>
                    {getFieldError("email")}
                  </Text>
                )}
              </Box>
            </GridItem>
          </Grid>
        )}

        {showSameAsBilling && sameAsBilling && (
          <Box p={4} bg="gray.50" borderRadius="md">
            <Text color="gray.600" textAlign="center">
              Shipping address will be the same as billing address
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};
