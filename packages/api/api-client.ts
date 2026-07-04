import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

export type ApiResponse<T> = {
  data: T;
  status: number;
};

export class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3001/api",
      withCredentials: true,
    });
  }

  async get<T>(
    endpoint: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.client.get<T>(endpoint, config);

    return { data: response.data, status: response.status };
  }

  async post<T, D>(
    endpoint: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.client.post<T>(endpoint, data, config);

    return { data: response.data, status: response.status };
  }

  async patch<T, D>(
    endpoint: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.client.patch<T>(endpoint, data, config);

    return { data: response.data, status: response.status };
  }

  async delete<T>(
    endpoint: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.client.delete<T>(endpoint, config);

    return { data: response.data, status: response.status };
  }
}
