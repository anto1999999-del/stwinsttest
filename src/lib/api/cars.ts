const API_BASE_URL =
  process.env.BACK_END ||
  process.env.NEXT_PUBLIC_BACK_END ||
  process.env.BACKEND_URL ||
  "http://localhost:3001/api";
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

class CarsAPI {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
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
    const endpoint = `/api/cars${queryString ? `?${queryString}` : ""}`;

    return this.request<CarsListResponse>(endpoint);
  }

  async getCarById(id: number): Promise<Car> {
    return this.request<Car>(`/api/cars/${id}`);
  }

  async createCar(carData: CreateCarRequest): Promise<Car> {
    return this.request<Car>("/api/cars", {
      method: "POST",
      body: JSON.stringify(carData),
    });
  }

  async updateCar(id: number, carData: UpdateCarRequest): Promise<Car> {
    return this.request<Car>(`/api/cars/${id}`, {
      method: "PUT",
      body: JSON.stringify(carData),
    });
  }
}

export const carsAPI = new CarsAPI();
