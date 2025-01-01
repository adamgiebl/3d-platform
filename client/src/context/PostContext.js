import { createContext, useContext, useState, useEffect } from "react";
import { mockPosts } from "./data";
import {
  createPost as apiCreatePost,
  fetchPosts as apiFetchPosts,
  likePost as apiLikePost,
  addComment as apiAddComment,
} from "../api/posts";

const PostContext = createContext();

export function PostProvider({ children }) {
  const [posts, setPosts] = useState([...mockPosts]);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const fetchedPosts = await apiFetchPosts();
      setPosts([...fetchedPosts, ...mockPosts]);
    } catch (error) {
      console.error("Error loading posts:", error);
      setPosts([...mockPosts]);
    }
  };

  const createPost = async (postData) => {
    console.log("createPost", postData);
    try {
      const newPost = await apiCreatePost(postData);
      setPosts((prevPosts) => [newPost, ...prevPosts]); 
      return newPost;
    } catch (error) {
      console.error("Error creating post:", error);
      const mockNewPost = {
        objectId: posts.length + 1,
        ...postData,
        createdAt: new Date().toISOString(),
      };
      setPosts((prevPosts) => [mockNewPost, ...prevPosts]);
      return mockNewPost;
    }
  };

  const toggleLike = async (postId) => {
    try {
      const success = await apiLikePost(postId);
      // Returns true if a new like was added, false or nothing if not
      if (success) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.objectId === postId ? { ...post, likes: post.liked ? post.likes - 1 : post.likes + 1, liked: !post.liked } : post
          )
        );
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };


  const addComment = async (postId, comment) => {
    try {
      const newComment = await apiAddComment(postId, comment.content);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: [
                  ...post.comments,
                  {
                    id: newComment.id,
                    content: comment.content,
                    author: comment.author,
                    createdAt: newComment.createdAt,
                  },
                ],
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error adding comment:", error);

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
    }
  };

  const getPostsByUser = (userId) => {
    return posts.filter((post) => post.author.id === userId);
  };

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
