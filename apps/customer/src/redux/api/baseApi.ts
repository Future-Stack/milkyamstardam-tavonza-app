



const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export interface ApiResponse<T = any> {
  statusCode: number;
  message: string;
  data: T;
}

export async function baseApiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // Always send HttpOnly cookies for authentication (No localStorage)
  });

  const resData: ApiResponse<T> = await response.json().catch(() => ({
    statusCode: response.status,
    message: response.statusText || 'An error occurred',
    data: null as any,
  }));

  if (!response.ok || (resData.statusCode && resData.statusCode >= 400)) {
    const errorMsg =
      resData.message ||
      (Array.isArray((resData as any).message) ? (resData as any).message[0] : 'Request failed');
    throw new Error(errorMsg);
  }

  return resData;
}
