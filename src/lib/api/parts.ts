const API_BASE_URL =
  process.env.BACK_END ||
  process.env.NEXT_PUBLIC_BACK_END ||
  process.env.BACKEND_URL ||
  "http://localhost:3001/api";
export interface Part {
  id: string;
  title: string;
  description?: string;
  price?: number;
  year?: string;
  startYear?: string;
  endYear?: string;
  model?: string;
  manufacturer?: string;
  stock?: string;
  tag?: string;
  odo?: string;
  sku?: string;
  icdesc?: string;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  image?: string;
  gallery?: string[];
  make?: string;
  desc?: string;
  inventoryId?: string;
  error?: string;
}

export interface CreatePartRequest {
  title: string;
  description?: string;
  price?: number;
  year?: string;
  startYear?: string;
  endYear?: string;
  make?: string;
  model?: string;
  category?: string;
  manufacturer?: string;
  stock?: string;
  tag?: string;
  odo?: string;
  sku?: string;
  icdesc?: string;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  thumbnailId?: string;
  galleryIds?: string[];
  inventoryId?: string;
}

export interface UpdatePartRequest {
  title?: string;
  description?: string;
  price?: number;
  year?: string;
  startYear?: string;
  endYear?: string;
  make?: string;
  model?: string;
  category?: string;
  manufacturer?: string;
  stock?: string;
  tag?: string;
  odo?: string;
  sku?: string;
  icdesc?: string;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  thumbnailId?: string;
  galleryIds?: string[];
  inventoryId?: string;
}

export interface PartsListResponse {
  cars: Part[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    count: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  error?: string;
}

export interface QueryPartsParams {
  year?: string;
  make?: string;
  model?: string;
  category?: string;
  startYear?: string;
  endYear?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}

class PartsAPI {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Authorization removed - parts creation is now open to all users

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  }

  async getParts(params: QueryPartsParams = {}): Promise<PartsListResponse> {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/parts${queryString ? `?${queryString}` : ""}`;

    return this.request<PartsListResponse>(endpoint);
  }

  async getPartById(id: string): Promise<Part> {
    return this.request<Part>(`/parts/${id}`);
  }

  async createPart(partData: CreatePartRequest): Promise<Part> {
    return this.request<Part>("/parts", {
      method: "POST",
      body: JSON.stringify(partData),
    });
  }

  async updatePart(id: string, partData: UpdatePartRequest): Promise<Part> {
    return this.request<Part>(`/parts/${id}`, {
      method: "PUT",
      body: JSON.stringify(partData),
    });
  }

  async deletePart(
    id: string
  ): Promise<{ success: boolean; message: string; error?: string }> {
    return this.request<{ success: boolean; message: string; error?: string }>(
      `/parts/${id}`,
      {
        method: "DELETE",
      }
    );
  }
}

export const partsAPI = new PartsAPI();
