/* /root/s-twins/s-twins-web/src/shared/api/admin.ts */
import { axiosInstance } from "./instance";

export interface AdminLoginDto {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  accessToken: string;
  admin: {
    id: number;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
    isActive: boolean;
    lastLogin?: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface AdminRegisterDto {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

// ===== Offers types (admin view) =====
export type OfferStatus = "new" | "read" | "approved" | "rejected";

export interface OfferItem {
  id: string;
  partId: string; // the product/post/inventory reference
  productTitle?: string; // human-readable product title from WordPress
  inventoryId?: string; // if you store it
  offerPrice: number;
  askingPrice?: number | null;
  name: string;
  email?: string | null;
  phone?: string | null;
  message?: string | null;
  createdAt: string;
  status: OfferStatus;
}

export interface OffersListParams {
  page?: number;
  pageSize?: number;
  q?: string; // search text
  status?: OfferStatus | "all";
  partId?: string; // filter by a specific part
}

export interface OffersListResponse {
  items: OfferItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface UpdateOfferDto {
  status?: OfferStatus;
  noteInternal?: string;
}

export interface ReplyOfferDto {
  accept: boolean;
  message?: string;
}

// Resolve bearer token: prefer explicit param, else localStorage (browser)
function bearerHeaders(explicitToken?: string) {
  const token =
    explicitToken ??
    (typeof window !== "undefined" ? localStorage.getItem("adminToken") : null);

  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Shape we actually get back from /api/admin/offers
type RawOfferRow = {
  id: string | number | bigint;
  productId?: string | number | bigint | null;
  productTitle?: string | null;
  name?: string | null;
  email?: string | null;
  createdAt?: string | Date | null;
  offerPrice?: string | number | null;
  askingPrice?: string | number | null;
  inventoryId?: string | null;
  message?: string | null;
  status?: string | null;
  replyMessage?: string | null;
  submittedAt?: string | null;
};

export const adminApi = {
  // ===== PUBLIC =====
  async login(credentials: AdminLoginDto): Promise<AdminLoginResponse> {
    // backend route: /api/admin/login
    const res = await axiosInstance.post("/admin/login", credentials);
    return res.data;
  },

  // ===== PROTECTED AUTH =====
  async register(data: AdminRegisterDto, token?: string) {
    // backend route: /api/admin/register
    const res = await axiosInstance.post("/admin/register", data, {
      headers: { ...bearerHeaders(token) },
    });
    return res.data;
  },

  async getProfile(token?: string) {
    // backend route: /api/admin/me
    const res = await axiosInstance.get("/admin/me", {
      headers: { ...bearerHeaders(token) },
    });
    return res.data;
  },

  async forgotPassword(data: ForgotPasswordDto, token?: string) {
    const res = await axiosInstance.post("/admin/forgot-password", data, {
      headers: { ...bearerHeaders(token) },
    });
    return res.data;
  },

  async resetPassword(data: ResetPasswordDto, token?: string) {
    const res = await axiosInstance.post("/admin/reset-password", data, {
      headers: { ...bearerHeaders(token) },
    });
    return res.data;
  },

  // ===== OFFERS (admin) =====
  offers: {
    // Matches @Controller('admin') + @Get('offers') on the backend
    OFFERS_BASE: "/admin/offers",

    async list(
      params: OffersListParams = {},
      token?: string
    ): Promise<OffersListResponse> {
      // Backend currently returns plain array of offers from /api/admin/offers
      const res = await axiosInstance.get<RawOfferRow[]>(this.OFFERS_BASE, {
        headers: { ...bearerHeaders(token) },
        params: {
          page: params.page ?? 1,
          pageSize: params.pageSize ?? 20,
          q: params.q ?? undefined,
          status:
            params.status && params.status !== "all" ? params.status : undefined,
          partId: params.partId ?? undefined,
        },
      });

      const itemsRaw: RawOfferRow[] = res.data ?? [];

      const items: OfferItem[] = itemsRaw.map((row) => {
        const idStr =
          typeof row.id === "bigint" ? row.id.toString() : String(row.id);

        const productIdRaw = row.productId ?? "";
        const partIdStr =
          typeof productIdRaw === "bigint"
            ? productIdRaw.toString()
            : productIdRaw
            ? String(productIdRaw)
            : "";

        const createdAtStr =
          typeof row.createdAt === "string"
            ? row.createdAt
            : row.createdAt instanceof Date
            ? row.createdAt.toISOString()
            : "";

        // Backend uses "pending" as default; map that to "new" for now
        const backendStatus = row.status ?? "pending";
        let frontendStatus: OfferStatus = "new";
        if (backendStatus === "approved") frontendStatus = "approved";
        else if (backendStatus === "rejected") frontendStatus = "rejected";
        else if (backendStatus === "read") frontendStatus = "read";

        const offerPriceNum =
          typeof row.offerPrice === "number"
            ? row.offerPrice
            : row.offerPrice
            ? Number(row.offerPrice)
            : 0;

        const hasAsking =
          row.askingPrice !== null && row.askingPrice !== undefined;
        const askingPriceNum =
          typeof row.askingPrice === "number"
            ? row.askingPrice
            : hasAsking
            ? Number(row.askingPrice)
            : null;

        return {
          id: idStr,
          partId: partIdStr,
          productTitle: row.productTitle ?? "",
          inventoryId: row.inventoryId ?? undefined,
          offerPrice: offerPriceNum,
          askingPrice: askingPriceNum,
          name: row.name ?? "",
          email: row.email ?? null,
          phone: null,
          message: row.message ?? null,
          createdAt: createdAtStr,
          status: frontendStatus,
        };
      });

      const page = params.page ?? 1;
      const fallbackPageSize = items.length || 1;
      const pageSize = params.pageSize ?? fallbackPageSize;
      const total = items.length;
      const totalPages = 1; // backend not paginating yet

      return {
        items,
        pagination: {
          page,
          pageSize,
          total,
          totalPages,
          hasNextPage: false,
          hasPrevPage: page > 1 && total > 0,
        },
      };
    },

    async update(
      id: string,
      payload: UpdateOfferDto,
      token?: string
    ): Promise<OfferItem> {
      const res = await axiosInstance.patch(
        `${this.OFFERS_BASE}/${id}`,
        payload,
        {
          headers: { ...bearerHeaders(token) },
        }
      );
      return res.data;
    },

    async reply(
      id: string,
      payload: ReplyOfferDto,
      token?: string
    ): Promise<OfferItem> {
      const res = await axiosInstance.post(
        `${this.OFFERS_BASE}/reply/${id}`,
        payload,
        {
          headers: { ...bearerHeaders(token) },
        }
      );
      return res.data;
    },

    async remove(
      id: string,
      token?: string
    ): Promise<{ success: true }> {
      const res = await axiosInstance.delete(`${this.OFFERS_BASE}/${id}`, {
        headers: { ...bearerHeaders(token) },
      });
      return res.data;
    },
  },
};
