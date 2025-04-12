// Type definition for the request data
export interface RequestData {
  [key: string]: any; // Replace with more specific types as needed
}

// Type definition for the API response
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
  tag?: string[] | undefined
): Promise<ApiResponse<T>> => {
  const options: RequestInit = {
    method: method,
    cache: 'no-store',
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${endpoint}`, options);
    console.log(endpoint);
    
    // options.next = { tags: tag };
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    return {
      data: responseData,
      status: response.status,
    };
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

// Methods for different HTTP requests
export const api = {
  get: <T>(endpoint: string, tag?: string[]): Promise<ApiResponse<T>> =>
    fetchAPI<T>("GET", endpoint, undefined, tag),
  post: <T>(endpoint: string, data: RequestData): Promise<ApiResponse<T>> =>
    fetchAPI<T>("POST", endpoint, data),
  put: <T>(endpoint: string, data: RequestData): Promise<ApiResponse<T>> =>
    fetchAPI<T>("PUT", endpoint, data),
  delete: <T>(endpoint: string): Promise<ApiResponse<T>> =>
    fetchAPI<T>("DELETE", endpoint),
};
