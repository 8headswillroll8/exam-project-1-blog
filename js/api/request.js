import { API_BASE_URL } from "../config.js";

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    body: options.body,
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      result?.errors?.[0]?.message ||
      result?.message ||
      `Request failed: ${response.status}`;
    throw new Error(message);
  }

  return result;
}
