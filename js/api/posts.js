import { request } from "./request.js";
import { BLOG_NAME } from "../config.js";

function getOwnerName() {
  const name = localStorage.getItem("profileName");
  return name && name.trim() ? name : null;
}

// Public feed (fixed blog)
export async function getAllPost() {
  return request(`/blog/posts/${BLOG_NAME}`);
}

// Public single post (fixed blog)
export async function getPublicById(id) {
  return request(`/blog/posts/${BLOG_NAME}/${id}`);
}

// Owner scoped (logged in user)
export async function getOwnerById(id) {
  const owner = getOwnerName();
  if (!owner) throw new Error("Not logged in.");
  return request(`/blog/posts/${owner}/${id}`);
}

export async function createPost(payload) {
  const owner = getOwnerName();
  if (!owner) throw new Error("Not logged in.");
  return request(`/blog/posts/${owner}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updatePost(id, payload) {
  const owner = getOwnerName();
  if (!owner) throw new Error("Not logged in.");
  return request(`/blog/posts/${owner}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deletePost(id) {
  const owner = getOwnerName();
  if (!owner) throw new Error("Not logged in.");
  return request(`/blog/posts/${owner}/${id}`, {
    method: "DELETE",
  });
}
