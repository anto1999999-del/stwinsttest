export type User = {
  ID: string;
  user_login: string;
  user_nicename: string;
  user_email: string;
  user_url: string;
  user_registered: unknown;
  user_activation_key: string;
  user_status: number;
  display_name: string;
  user_address?: string | null;
};

export type UpdateUserDto = {
  user_login?: string;
  user_nicename?: string;
  user_email?: string;
  user_url?: string;
  // ISO string preferred
  user_registered?: string;
  user_activation_key?: string;
  user_status?: number;
  display_name?: string;
  user_address?: string | null;
};
