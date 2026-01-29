import { API_BASE_URL } from "../config.js";

export async function request(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error("Request failed");
  }

  const data = await response.json();
  return data;
}
