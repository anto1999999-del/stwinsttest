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
      const errorData = await response
        .json()
        .catch(() => ({} as Record<string, unknown>));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
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
