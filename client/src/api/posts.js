import { API_URL } from "./consts";

export const createPost = async (postData) => {
  console.log("createPost", postData);
  try {
    const response = await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: postData.title,
        description: postData.description,
        modelUrl: postData.modelUrl,
      }),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to create post");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

export const fetchPosts = async () => {
  try {
    const response = await fetch(`${API_URL}/posts`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }

    const { posts } = await response.json();
    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

export const likePost = async (postId) => {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}/like`, {
      method: "POST",
      credentials: "include",
    });
    if (response.status == 201){
      return false //post already liked by user
    }
    if (!response.ok) {
      throw new Error("Failed to like post");
    }
    return true;
  } catch (error) {
    console.error("Error liking post:", error);
    throw error;
  }
};

export const addComment = async (postId, content) => {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to add comment");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};
