import { createContext, useContext, useState } from "react";
import { mockPosts } from "./data";

const PostContext = createContext();

export function PostProvider({ children }) {
  const [posts, setPosts] = useState(mockPosts);

  const createPost = (postData) => {
    console.table({
      action: "Creating new post",
      title: postData.title,
      description: postData.description,
    });

    const newPost = {
      id: posts.length + 1,
      ...postData,
      likes: 0,
      comments: [],
      createdAt: new Date().toISOString(),
    };

    setPosts((prevPosts) => [newPost, ...prevPosts]);
    return newPost;
  };

  // Like/Unlike a post
  const toggleLike = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  // Add a comment to a post
  const addComment = (postId, comment) => {
    console.table({
      action: "Adding comment",
      postId,
      comment: comment.content,
    });

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: post.comments.length + 1,
                  ...comment,
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : post
      )
    );
  };

  // Get posts by user ID
  const getPostsByUser = (userId) => {
    return posts.filter((post) => post.author.id === userId);
  };

  // Get posts by tag
  const getPostsByTag = (tag) => {
    return posts.filter((post) => post.tags.includes(tag));
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        createPost,
        toggleLike,
        addComment,
        getPostsByUser,
        getPostsByTag,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

export const usePosts = () => useContext(PostContext);
