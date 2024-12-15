import { Router } from "express";
import Parse from "parse/node";

const router = Router();

// Create a new post
router.post("/", async (req, res) => {
  try {
    const { title, description, tags, modelUrl } = req.body;
    const Post = Parse.Object.extend("Post");
    const post = new Post();

    post.set("title", title);
    post.set("description", description);
    post.set("tags", tags);
    post.set("modelUrl", modelUrl);
    post.set("user", Parse.User.current());

    const result = await post.save();
    console.table({
      Action: "Create Post",
      Title: title,
      User: Parse.User.current()?.get("username"),
      Status: "Success",
    });

    res
      .status(201)
      .json({ message: "Post created successfully", postId: result.id });
  } catch (error) {
    console.error("Post Creation Error:", error);
    res.status(400).json({ error: error.message });
  }
});

// Get posts feed
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const query = new Parse.Query("Post");

    if (category) {
      query.equalTo("tags", category);
    }

    query.skip((Number(page) - 1) * Number(limit));
    query.limit(Number(limit));
    query.include("user");
    query.descending("createdAt");

    const posts = await query.find();
    res.json({ posts });
  } catch (error) {
    console.error("Feed Fetch Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Like a post
router.post("/:postId/like", async (req, res) => {
  try {
    const { postId } = req.params;
    const query = new Parse.Query("Post");
    const post = await query.get(postId);

    const Like = Parse.Object.extend("Like");
    const like = new Like();
    like.set("post", post);
    like.set("user", Parse.User.current());

    await like.save();

    console.table({
      Action: "Like Post",
      PostId: postId,
      User: Parse.User.current()?.get("username"),
      Status: "Success",
    });

    res.json({ message: "Post liked successfully" });
  } catch (error) {
    console.error("Like Error:", error);
    res.status(400).json({ error: error.message });
  }
});

// Add comment to a post
router.post("/:postId/comments", async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    const query = new Parse.Query("Post");
    const post = await query.get(postId);

    const Comment = Parse.Object.extend("Comment");
    const comment = new Comment();
    comment.set("content", content);
    comment.set("post", post);
    comment.set("user", Parse.User.current());

    const result = await comment.save();

    console.table({
      Action: "Add Comment",
      PostId: postId,
      User: Parse.User.current()?.get("username"),
      Status: "Success",
    });

    res
      .status(201)
      .json({ message: "Comment added successfully", commentId: result.id });
  } catch (error) {
    console.error("Comment Error:", error);
    res.status(400).json({ error: error.message });
  }
});

export default router;
