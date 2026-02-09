// src/shared/api/wp-posts.ts
import { axiosInstance } from "./instance";

export type WpPost = {
  ID: string;
  post_author: string;
  post_date: string;
  post_date_gmt: string;
  post_content: string;
  post_title: string;
  post_excerpt: string;
  post_status:
    | "publish"
    | "draft"
    | "private"
    | "pending"
    | "auto-draft"
    | "inherit";
  comment_status: "open" | "closed";
  ping_status: "open" | "closed";
  post_password: string;
  post_name: string;
  to_ping: string;
  pinged: string;
  post_modified: string;
  post_modified_gmt: string;
  post_content_filtered: string;
  post_parent: string;
  guid: string;
  menu_order: number;
  post_type:
    | "post"
    | "page"
    | "attachment"
    | "revision"
    | "nav_menu_item"
    | "product";
  post_mime_type: string;
  comment_count: string;
  meta?: Record<string, string>;
};

export type WpPostMeta = {
  meta_id: string;
  post_id: string;
  meta_key: string;
  meta_value: string;
};

export type CreatePostPayload = {
  post_title: string;
  post_content?: string;
  post_excerpt?: string;
  post_status?: "publish" | "draft" | "private" | "pending";
  post_type?: "post" | "page" | "product" | "attachment";
  post_name?: string;
  guid?: string;
  menu_order?: number;
  post_parent?: number;
  comment_status?: "open" | "closed";
  ping_status?: "open" | "closed";
  post_password?: string;
  to_ping?: string;
  pinged?: string;
  post_mime_type?: string;
  // Additional product-specific fields
  price?: string;
  year?: string;
  startYear?: string;
  endYear?: string;
  stock?: string;
  tag?: string;
  odo?: string;
  make?: string;
  manufacturer?: string;
  thumb?: string;
  gallery_ids?: string;
  icdesc?: string;
  weight?: string;
  length?: string;
  width?: string;
  height?: string;
  sku?: string;
  model?: string;
};

export type UpdatePostPayload = Partial<CreatePostPayload>;

export type QueryPostsParams = {
  page?: number;
  pageSize?: number;
  q?: string;
  post_type?: string;
  post_status?: string;
  post_author?: number;
  post_parent?: number;
  dateFrom?: string;
  dateTo?: string;
  sortBy?:
    | "ID"
    | "post_title"
    | "post_date"
    | "post_modified"
    | "menu_order"
    | "comment_count";
  sortOrder?: "asc" | "desc";
  includeMeta?: boolean;
};

export type PostsResponse = {
  posts: WpPost[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

export type CreatePostMetaPayload = {
  meta_key: string;
  meta_value?: string;
};

export type UpdatePostMetaPayload = {
  meta_value?: string;
};

const getAuthHeaders = () => {
  if (typeof window === "undefined") return {};

  const token = localStorage.getItem("adminToken");
  if (!token) return {};

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const wpPostsApi = {
  // Posts CRUD operations
  async createPost(payload: CreatePostPayload): Promise<WpPost> {
    const response = await axiosInstance.post("/wp-posts", payload, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  async getPosts(params: QueryPostsParams = {}): Promise<PostsResponse> {
    const response = await axiosInstance.get("/wp-posts", { params });
    return response.data;
  },

  async getPost(id: string): Promise<WpPost> {
    const response = await axiosInstance.get(`/wp-posts/${id}`);
    return response.data;
  },

  async updatePost(id: string, payload: UpdatePostPayload): Promise<WpPost> {
    const response = await axiosInstance.patch(`/wp-posts/${id}`, payload, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  async deletePost(id: string): Promise<{ message: string }> {
    const response = await axiosInstance.delete(`/wp-posts/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  // Post Meta operations
  async createPostMeta(
    postId: string,
    payload: CreatePostMetaPayload
  ): Promise<WpPostMeta> {
    const response = await axiosInstance.post(
      `/wp-posts/${postId}/meta`,
      payload,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  },

  async getPostMeta(postId: string): Promise<WpPostMeta[]> {
    const response = await axiosInstance.get(`/wp-posts/${postId}/meta`);
    return response.data;
  },

  async updatePostMeta(
    postId: string,
    metaKey: string,
    payload: UpdatePostMetaPayload
  ): Promise<WpPostMeta> {
    const response = await axiosInstance.patch(
      `/wp-posts/${postId}/meta/${metaKey}`,
      payload,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  },

  async deletePostMeta(
    postId: string,
    metaKey: string
  ): Promise<{ message: string }> {
    const response = await axiosInstance.delete(
      `/wp-posts/${postId}/meta/${metaKey}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  },
};

// Helper functions for creating product posts
export const createProductPost = async (partData: {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  brand: string;
  partNumber: string;
  image?: string;
  status: "active" | "inactive";
  // Additional optional fields
  year?: string;
  startYear?: string;
  endYear?: string;
  tag?: string;
  odo?: string;
  thumb?: string;
  gallery_ids?: string;
  icdesc?: string;
  weight?: string;
  length?: string;
  width?: string;
  height?: string;
  sku?: string;
  make?: string;
  model?: string;
  inventoryId?: string;
}): Promise<WpPost> => {
  // Create the main post with all available properties
  const post = await wpPostsApi.createPost({
    post_title: partData.name,
    post_content: partData.description,
    post_type: "product",
    post_status: partData.status === "active" ? "publish" : "draft",
    // Include additional properties directly in the create call
    price: partData.price.toString(),
    year: partData.year,
    startYear: partData.startYear,
    endYear: partData.endYear,
    stock: partData.stock.toString(),
    tag: partData.tag,
    odo: partData.odo,
    make: partData.make,
    manufacturer: partData.brand,
    thumb: partData.thumb,
    gallery_ids: partData.gallery_ids,
    icdesc: partData.icdesc,
    weight: partData.weight,
    length: partData.length,
    width: partData.width,
    height: partData.height,
    sku: partData.sku || partData.partNumber,
    model: partData.model || partData.category,
  });

  // Add metadata for the part (keeping some legacy meta for compatibility)
  const metaData: CreatePostMetaPayload[] = [
    { meta_key: "_price", meta_value: partData.price.toString() },
    { meta_key: "stockNo", meta_value: partData.partNumber },
    { meta_key: "manufacturer", meta_value: partData.brand },
    { meta_key: "itemTypeCode", meta_value: partData.category },
    { meta_key: "_stock", meta_value: partData.stock.toString() },
    ...(partData.inventoryId
      ? [{ meta_key: "invNumber", meta_value: partData.inventoryId }]
      : []),
  ];

  // Handle image similar to WordPress standard
  if (partData.image) {
    // Create attachment post for the image (WordPress way)
    let thumbnailId: string | null = null;

    try {
      // Detect MIME type from URL extension
      const getMimeTypeFromUrl = (url: string): string => {
        const extension = url.split(".").pop()?.toLowerCase();
        switch (extension) {
          case "jpg":
          case "jpeg":
            return "image/jpeg";
          case "png":
            return "image/png";
          case "gif":
            return "image/gif";
          case "webp":
            return "image/webp";
          case "svg":
            return "image/svg+xml";
          default:
            return "image/jpeg"; // Default fallback
        }
      };

      const attachmentPost = await wpPostsApi.createPost({
        post_title: `${partData.name} - Image`,
        post_content: "",
        post_type: "attachment",
        post_status: "private",
        post_parent: parseInt(post.ID),
        guid: partData.image,
        post_mime_type: getMimeTypeFromUrl(partData.image),
      });

      thumbnailId = attachmentPost.ID;

      // Add the thumbnail ID to metadata (WordPress standard)
      metaData.push({ meta_key: "_thumbnail_id", meta_value: thumbnailId });
    } catch (error) {
      console.warn(
        "Failed to create attachment post, using fallback image_url:",
        error
      );
      // Fallback to simple image_url metadata
      metaData.push({ meta_key: "image_url", meta_value: partData.image });
    }
  }

  // Create all metadata
  await Promise.all(
    metaData.map((meta) => wpPostsApi.createPostMeta(post.ID, meta))
  );

  return post;
};

// Helper function to resolve image URL from thumbnail ID
export const getImageUrlFromThumbnailId = async (
  thumbnailId: string
): Promise<string | null> => {
  try {
    const attachmentPost = await wpPostsApi.getPost(thumbnailId);
    return attachmentPost.guid || null;
  } catch (error) {
    console.warn("Failed to resolve thumbnail ID to image URL:", error);
    return null;
  }
};

// Enhanced helper to get product posts with resolved image URLs
export const getProductPostWithImage = async (
  post: WpPost
): Promise<WpPost & { resolvedImageUrl?: string }> => {
  const enhancedPost: WpPost & { resolvedImageUrl?: string } = { ...post };

  if (post.meta?._thumbnail_id) {
    try {
      const imageUrl = await getImageUrlFromThumbnailId(
        post.meta._thumbnail_id
      );
      enhancedPost.resolvedImageUrl = imageUrl || post.meta.image_url || "";
    } catch {
      enhancedPost.resolvedImageUrl = post.meta.image_url || "";
    }
  } else {
    enhancedPost.resolvedImageUrl = post.meta?.image_url || "";
  }

  return enhancedPost;
};

// Admin Cars API - uses Next.js API routes for better cache control
export interface Car {
  cid: number;
  ID: number;
  name: string;
  make: string;
  prod_cat: string;
  year: number;
  model_id: number;
  model: string;
  tag?: string;
  stockNo?: string;
  date_added: Date | string;
  thumbnailId?: string;
  galleryIds?: string[];
}

export interface CreateCarRequest {
  name: string;
  make: string;
  prod_cat: string;
  year: number;
  model_id: number;
  model: string;
  tag?: string;
  stockNo?: string;
  thumbnailId?: string;
  galleryIds?: string[];
}

export interface UpdateCarRequest {
  name?: string;
  make?: string;
  prod_cat?: string;
  year?: number;
  model_id?: number;
  model?: string;
  tag?: string;
  stockNo?: string;
  thumbnailId?: string;
  galleryIds?: string[];
}

export interface CarsListResponse {
  cars: Car[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    total: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface QueryCarsParams {
  year?: string;
  make?: string;
  model?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}

class AdminCarsAPI {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const defaultHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Use Next.js API routes with cache control
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      cache: "no-store", // Disable caching
    });

    if (!response.ok) {
      const errorData = (await response
		  .json()
		  .catch(() => ({} as Record<string, unknown>))) as {
		  error?: string;
		};

		throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getCars(params: QueryCarsParams = {}): Promise<CarsListResponse> {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/api/admin/cars${queryString ? `?${queryString}` : ""}`;

    return this.request<CarsListResponse>(endpoint);
  }

  async getCarById(id: number): Promise<Car> {
    return this.request<Car>(`/api/admin/cars?id=${id}`);
  }

  async createCar(carData: CreateCarRequest): Promise<Car> {
    return this.request<Car>("/api/admin/cars", {
      method: "POST",
      body: JSON.stringify(carData),
    });
  }

  async updateCar(id: number, carData: UpdateCarRequest): Promise<Car> {
    return this.request<Car>(`/api/admin/cars?id=${id}`, {
      method: "PUT",
      body: JSON.stringify(carData),
    });
  }

  async deleteCar(id: number): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/admin/cars?id=${id}`, {
      method: "DELETE",
    });
  }
}

export const adminCarsAPI = new AdminCarsAPI();
