const TOKEN_KEY = "accessToken";
const NAME_KEY = "profileName";

export function getAccessToken() {
  const token = localStorage.getItem(TOKEN_KEY);
  return token && token.trim() !== "" ? token : null;
}

export function isLoggedIn() {
  return Boolean(getAccessToken());
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(NAME_KEY);
}
