import { request } from "./request.js";
import { BLOG_NAME } from "../config.js";

export async function getAllPost() {
  return request(`/blog/posts/${BLOG_NAME}`);
}

export async function getById(id) {
  return request(`/blog/posts/${BLOG_NAME}/${id}`);
}

export async function createPost(payload) {
  return request(`/blog/posts/${BLOG_NAME}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updatePost(id, payload) {
  return request(`/blog/posts/${BLOG_NAME}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deletePost(id) {
  return request(`/blog/posts/${BLOG_NAME}/${id}`, {
    method: "DELETE",
  });
}
