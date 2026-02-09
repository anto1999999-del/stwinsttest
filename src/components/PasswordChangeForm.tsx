"use client";

import { z } from "zod";
import { useForm, type Resolver } from "react-hook-form";
import { Box, Button, HStack, Input, Text, VStack } from "@chakra-ui/react";

const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, "Current password must be at least 8 characters"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((vals) => vals.newPassword === vals.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type PasswordValues = z.infer<typeof passwordSchema>;

export default function PasswordChangeForm({
  onValid,
}: {
  onValid?: (values: PasswordValues) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<PasswordValues>({
    mode: "onChange",
    resolver: (async (values) => {
      const parsed = passwordSchema.safeParse(values);
      if (parsed.success) return { values: parsed.data, errors: {} };
      const errs: Record<string, unknown> = {};
      for (const issue of parsed.error.issues) {
        const name = String(issue.path[0] ?? "");
        if (!name) continue;
        errs[name] = { type: issue.code, message: issue.message };
      }
      return { values: {}, errors: errs } as unknown as ReturnType<
        Resolver<PasswordValues>
      >;
    }) as Resolver<PasswordValues>,
  });

  const onSubmit = (values: PasswordValues) => onValid?.(values);

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <VStack gap={3} align="stretch">
        <HStack gap={4} align="start">
          <Box flex={1}>
            <Text color="gray.300" mb={1}>
              Current password
            </Text>
            <Input
              type="password"
              placeholder="••••••••"
              {...register("currentPassword")}
            />
            {errors.currentPassword && (
              <Text color="#d80c19" fontSize="sm" mt={1}>
                {errors.currentPassword.message as string}
              </Text>
            )}
          </Box>
        </HStack>
        <HStack gap={4} align="start">
          <Box flex={1}>
            <Text color="gray.300" mb={1}>
              New password
            </Text>
            <Input
              type="password"
              placeholder="••••••••"
              {...register("newPassword")}
            />
            {errors.newPassword && (
              <Text color="#d80c19" fontSize="sm" mt={1}>
                {errors.newPassword.message as string}
              </Text>
            )}
          </Box>
          <Box flex={1}>
            <Text color="gray.300" mb={1}>
              Confirm password
            </Text>
            <Input
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <Text color="#d80c19" fontSize="sm" mt={1}>
                {errors.confirmPassword.message as string}
              </Text>
            )}
          </Box>
        </HStack>
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={!isValid}
          alignSelf="flex-end"
          bg="#d80c19"
          color="white"
          _hover={{ bg: "#b20a15" }}
        >
          Validate password
        </Button>
      </VStack>
    </Box>
  );
}
