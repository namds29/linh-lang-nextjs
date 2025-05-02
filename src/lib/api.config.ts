import authService from "@/services/auth.service";

export interface RequestData {
  [key: string]: any;
}
export interface ApiResponse<T> {
  data: {
    payload?: T;
    content?: T;
    responseCode: string;
    responseMessage: string;
  };
  status: number;
}

// Function to handle fetch requests
const fetchAPI = async <T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  endpoint: string,
  data?: RequestData | null,
  token?: string | null,
  tag?: string[] | undefined
): Promise<ApiResponse<T>> => {
  const options: any = {
    method: method,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : undefined,
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${endpoint}`, options);
    console.log(response, 'res')
    if(response.status === 403){
      const newToken = await authService.refreshToken();
      if (newToken) {
        // Retry the original request with the new token
        options.headers["Authorization"] = `Bearer ${newToken}`;
        const refreshResponse = await fetch(endpoint, options);
        const responseData = await refreshResponse.json();
        console.log(refreshResponse, 'refresh');
        return {
          data: responseData,
          status: refreshResponse.status,
        };
      }
    }
    // options.next = { tags: tag };
    if (!response.ok) {
      throw new Error(`${response.status}`);
    }

    const responseData = await response.json();
    return {
      data: responseData,
      status: response.status,
    };
  } catch (error: any) {
    console.error("Fetch error:", error);
    if (error.message === '401' || error.message === '403') {
      console.error('Session expired or unauthorized. Logging out...');
      localStorage.clear(); // Clear the token
      window.location.href = '/login'; // Redirect to login page
    }
    throw error;
  }
};

const getToken = (): string | null => {
  console.log("token", localStorage.getItem("accessToken"));

  return localStorage.getItem("accessToken"); // Replace 'jwt_token' with your actual key
};
// Methods for different HTTP requests
export const api = {
  get: <T>(endpoint: string, tag?: string[]): Promise<ApiResponse<T>> =>
    fetchAPI<T>("GET", endpoint, undefined, null, tag),
  post: <T>(endpoint: string, data: RequestData): Promise<ApiResponse<T>> =>
    fetchAPI<T>("POST", endpoint, data, getToken()),
  put: <T>(endpoint: string, data: RequestData): Promise<ApiResponse<T>> =>
    fetchAPI<T>("PUT", endpoint, data, getToken()),
  delete: <T>(endpoint: string): Promise<ApiResponse<T>> =>
    fetchAPI<T>("DELETE", endpoint, undefined, getToken()),
};
