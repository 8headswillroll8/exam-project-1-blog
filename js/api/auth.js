const API_BASE_URL = "https://v2.api.noroff.dev";

export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const result = await response.json();

  if (!response.ok) {
    const message =
      result?.errors?.[0]?.message ||
      result?.message ||
      "Login failed. Check your details.";
    throw new Error(message);
  }

  return result;
}

export async function registerUser({ name, email, password }) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  const result = await response.json();

  if (!response.ok) {
    const message =
      result?.errors?.[0]?.message ||
      result?.message ||
      "Registration failed. Check your details.";
    throw new Error(message);
  }

  return result;
}
