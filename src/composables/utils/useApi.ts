import type { ApiResponse } from '@/infrastructure/types';
import axios, { type AxiosResponse } from 'axios';

export default function useApi() {

  const get = async <T>(url: string): Promise<ApiResponse<T>> => {
    const response: AxiosResponse<T> = await axios.get(url);
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      isOk: response.status >= 200 && response.status < 300,
    } as ApiResponse<T>;
  };

  const post = async <T, U = undefined>(
    url: string,
    data: T,
    headers?: Record<string, string>,
  ): Promise<ApiResponse<U>> => {
    const response: AxiosResponse<U> = await axios.post(url, data, { headers });
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      isOk: response.status >= 200 && response.status < 300,
    } as ApiResponse<U>;
  };

  return {
    get,
    post,
  };
}
