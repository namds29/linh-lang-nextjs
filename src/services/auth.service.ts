import { api } from "@/lib/api.config";
import { API_ENDPOINTS, API_URL_WEBCONFIG } from "@/lib/routes/api";

const login = async (payload: { username: string; password: string }) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    username: payload.username,
    password: payload.password,
  });
  const response = await fetch(
    `${API_URL_WEBCONFIG}${API_ENDPOINTS.AUTH.LOGIN}`,
    {
      headers: myHeaders,
      method: "POST",
      body: raw,
      redirect: "follow",
    }
  );
  return response;
};

const refreshToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    
    if (!refreshToken) {
      return null; // No refresh token available
    }
  
    try {
      const response = await fetch(`${API_URL_WEBCONFIG}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken: refreshToken }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }
  
      const data = await response.json();
      console.log('refresh', data);
      
      const newAccessToken = data.accessToken; // Adjust according to your API response
      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      return data.accessToken;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  };
  const getToken = (): string | null => {
    console.log("token", localStorage.getItem("accessToken"));
  
    return localStorage.getItem("accessToken"); // Replace 'jwt_token' with your actual key
  };
export default { login, refreshToken, getToken };
