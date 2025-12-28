import api from "./axiosInstance";


export async function apiRequest(requestFn) {
  try {
    return await requestFn();
  } catch (err) {
    // Step 1: access token expired
    if (err.response?.status === 401) {
      try {
        // Step 2: try refresh (silent)
        await api.post("/refresh-token");
        // Step 3: retry original request
        return await requestFn();
      } catch (refreshErr) {
        // Step 4: refresh failed → logout needed
        throw refreshErr;
      }
    }
    throw err;
  }
}
