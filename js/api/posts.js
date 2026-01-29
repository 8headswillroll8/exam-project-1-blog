import { request } from "./request.js";
import { BLOG_NAME } from "../config.js";

export async function getAllPost() {
  return request(`/blog/posts/${BLOG_NAME}`);
}
