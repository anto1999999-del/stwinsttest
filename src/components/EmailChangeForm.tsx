"use client";

import { z } from "zod";
import { useForm, type Resolver } from "react-hook-form";
import { Box, Button, HStack, Input, Text, VStack } from "@chakra-ui/react";

const emailSchema = z.object({
  user_email: z
    .string()
    .email("Enter a valid email address")
    .max(100, "Email must be at most 100 characters long"),
});

type EmailValues = z.infer<typeof emailSchema>;

export default function EmailChangeForm({
  defaultEmail,
  onValid,
}: {
  defaultEmail?: string;
  onValid?: (values: EmailValues) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<EmailValues>({
    mode: "onChange",
    defaultValues: { user_email: defaultEmail ?? "" },
    resolver: (async (values) => {
      const parsed = emailSchema.safeParse(values);
      if (parsed.success) return { values: parsed.data, errors: {} };
      const errs: Record<string, unknown> = {};
      for (const issue of parsed.error.issues) {
        const name = String(issue.path[0] ?? "");
        if (!name) continue;
        errs[name] = { type: issue.code, message: issue.message };
      }
      return { values: {}, errors: errs } as unknown as ReturnType<
        Resolver<EmailValues>
      >;
    }) as Resolver<EmailValues>,
  });

  const onSubmit = (values: EmailValues) => onValid?.(values);

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <VStack gap={3} align="stretch">
        <HStack gap={4} align="start">
          <Box flex={1}>
            <Text color="gray.300" mb={1}>
              New email
            </Text>
            <Input
              placeholder="user@example.com"
              color="white"
              _placeholder={{ color: "gray.400" }}
              {...register("user_email")}
            />
            {errors.user_email && (
              <Text color="#d80c19" fontSize="sm" mt={1}>
                {errors.user_email.message as string}
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
          Validate email
        </Button>
      </VStack>
    </Box>
  );
}
