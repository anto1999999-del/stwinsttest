"use client";

import { z } from "zod";
import { useForm, type Resolver } from "react-hook-form";
import { Box, Button, HStack, Input, Text, VStack } from "@chakra-ui/react";
import { useUpdateUserMutation } from "@/features/auth/api/updateUser";
import { toast } from "sonner";
import axios from "axios";
import type { UpdateUserDto } from "@/shared/types/user";

// helpers
const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.union([z.literal("").transform(() => undefined), schema]).optional();

const isIso = (v: string) => !v || !Number.isNaN(Date.parse(v));

const schema: z.ZodType<UpdateUserDto> = z.object({
  user_login: emptyToUndefined(
    z.string().max(60, "user_login must be at most 60 characters long")
  ),
  user_nicename: emptyToUndefined(
    z.string().max(50, "user_nicename must be at most 50 characters long")
  ),
  // user_email is read-only in this form; separate EmailChangeForm handles validation
  user_url: emptyToUndefined(
    z.string().max(100, "user_url must be at most 100 characters long")
  ),
  user_registered: emptyToUndefined(
    z.string().refine(isIso, "user_registered must be an ISO date string")
  ),
  user_activation_key: emptyToUndefined(
    z
      .string()
      .max(255, "user_activation_key must be at most 255 characters long")
  ),
  user_status: emptyToUndefined(z.coerce.number().int()),
  display_name: emptyToUndefined(
    z.string().max(250, "display_name must be at most 250 characters long")
  ),
  user_address: emptyToUndefined(z.string()),
});

export type ProfileEditFormValues = z.infer<typeof schema>;

export function ProfileEditForm({
  id,
  defaults,
}: {
  id: string;
  defaults?: Partial<ProfileEditFormValues>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<UpdateUserDto>({
    resolver: (async (values) => {
      const parsed = schema.safeParse(values);
      if (parsed.success) {
        return { values: parsed.data, errors: {} };
      }
      const errs: Record<string, unknown> = {};
      for (const issue of parsed.error.issues) {
        const name = String(issue.path[0] ?? "");
        if (!name) continue;
        errs[name] = { type: issue.code, message: issue.message };
      }
      return { values: {}, errors: errs } as unknown as ReturnType<
        Resolver<UpdateUserDto>
      >;
    }) as Resolver<UpdateUserDto>,
    defaultValues: defaults,
    mode: "onChange",
  });

  const { mutateAsync } = useUpdateUserMutation(id);

  const onSubmit = async (values: UpdateUserDto) => {
    const payload = Object.fromEntries(
      Object.entries(values).filter(([, v]) => v !== undefined && v !== "")
    );
    try {
      const user = await mutateAsync(payload);
      toast.success("Profile updated");
      reset({
        user_login: user.user_login,
        user_nicename: user.user_nicename,
        user_email: user.user_email,
        user_url: user.user_url,
        user_registered: undefined,
        user_activation_key: undefined,
        user_status: user.user_status,
        display_name: user.display_name,
        user_address: user.user_address,
      });
    } catch (e: unknown) {
      let message = "Update failed";
      if (axios.isAxiosError(e)) {
        const data = e.response?.data as unknown;
        if (data && typeof data === "object" && "message" in data) {
          message = (data as { message?: string }).message || message;
        } else {
          message = e.message || message;
        }
      }
      toast.error(message);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <VStack gap={4} align="stretch">
        <Box>
          <Text color="gray.300" mb={1}>
            Address
          </Text>
          <Input
            placeholder="123 Main Street, City, State 12345"
            color="white"
            _placeholder={{ color: "gray.400" }}
            {...register("user_address")}
          />
          {errors.user_address && (
            <Text color="#d80c19" fontSize="sm" mt={1}>
              {errors.user_address.message as string}
            </Text>
          )}
        </Box>

        <HStack gap={4} align="start">
          <Box flex={1}>
            <Text color="gray.300" mb={1}>
              Display name
            </Text>
            <Input
              placeholder="UserTest"
              color="white"
              _placeholder={{ color: "gray.400" }}
              {...register("display_name")}
            />
            {errors.display_name && (
              <Text color="#d80c19" fontSize="sm" mt={1}>
                {errors.display_name.message as string}
              </Text>
            )}
          </Box>
          <Box flex={1}>
            <Text color="gray.300" mb={1}>
              Email
            </Text>
            <Input
              placeholder="user@example.com"
              value={defaults?.user_email ?? ""}
              readOnly
              disabled
              color="white"
              _placeholder={{ color: "gray.400" }}
            />
          </Box>
        </HStack>

        <HStack gap={4} align="start">
          <Box flex={1}>
            <Text color="gray.300" mb={1}>
              Username
            </Text>
            <Input
              placeholder="user_login"
              color="white"
              _placeholder={{ color: "gray.400" }}
              {...register("user_login")}
            />
            {errors.user_login && (
              <Text color="#d80c19" fontSize="sm" mt={1}>
                {errors.user_login.message as string}
              </Text>
            )}
          </Box>
          <Box flex={1}>
            <Text color="gray.300" mb={1}>
              Nice name
            </Text>
            <Input
              placeholder="user_nicename"
              color="white"
              _placeholder={{ color: "gray.400" }}
              {...register("user_nicename")}
            />
            {errors.user_nicename && (
              <Text color="#d80c19" fontSize="sm" mt={1}>
                {errors.user_nicename.message as string}
              </Text>
            )}
          </Box>
        </HStack>

        <HStack gap={4} align="start">
          <Box flex={1}>
            <Text color="gray.300" mb={1}>
              Website
            </Text>
            <Input
              placeholder="https://example.com"
              color="white"
              _placeholder={{ color: "gray.400" }}
              {...register("user_url")}
            />
            {errors.user_url && (
              <Text color="#d80c19" fontSize="sm" mt={1}>
                {errors.user_url.message as string}
              </Text>
            )}
          </Box>
          <Box flex={1}>
            <Text color="gray.300" mb={1}>
              Status
            </Text>
            <Input
              placeholder="0"
              color="white"
              _placeholder={{ color: "gray.400" }}
              {...register("user_status" as const)}
            />
            {errors.user_status && (
              <Text color="#d80c19" fontSize="sm" mt={1}>
                {errors.user_status.message as string}
              </Text>
            )}
          </Box>
        </HStack>

        <HStack gap={4} align="start">
          <Box flex={1}>
            <Text color="gray.300" mb={1}>
              Registered (ISO)
            </Text>
            <Input
              placeholder="2025-08-14T00:00:00.000Z"
              color="white"
              _placeholder={{ color: "gray.400" }}
              {...register("user_registered")}
            />
            {errors.user_registered && (
              <Text color="#d80c19" fontSize="sm" mt={1}>
                {errors.user_registered.message as string}
              </Text>
            )}
          </Box>
          <Box flex={1}>
            <Text color="gray.300" mb={1}>
              Activation key
            </Text>
            <Input
              placeholder=""
              color="white"
              _placeholder={{ color: "gray.400" }}
              {...register("user_activation_key")}
            />
            {errors.user_activation_key && (
              <Text color="#d80c19" fontSize="sm" mt={1}>
                {errors.user_activation_key.message as string}
              </Text>
            )}
          </Box>
        </HStack>

        <Button
          type="submit"
          loading={isSubmitting}
          disabled={!isDirty}
          alignSelf="flex-end"
          bg="#d80c19"
          color="white"
          _hover={{ bg: "#b20a15" }}
        >
          Save changes
        </Button>
      </VStack>
    </Box>
  );
}

export default ProfileEditForm;
