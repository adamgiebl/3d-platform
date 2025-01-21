import { API_URL } from "./consts";

export const fetchTags = async () => {
  try {
    const response = await fetch(`${API_URL}/tags`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch tags");
    }

    const { tags } = await response.json();
    return tags;
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw error;
  }
};
