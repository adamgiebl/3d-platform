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
    post.set("author", Parse.User.current());

    const result = await post.save();

    console.table({
      Action: "Create Post",
      Title: title,
      User: Parse.User.current()?.get("username"),
      Status: "Success",
    });

    res.status(201).json({
      id: result.id,
      title: result.get("title"),
      description: result.get("description"),
      modelUrl: result.get("modelUrl"),
      tags: result.get("tags"),
      likes: 0,
      comments: [],
      author: {
        id: result.get("author").id,
        name: result.get("author").get("username"),
        avatar: result.get("author").get("avatar"),
      },
      createdAt: result.get("createdAt"),
    });
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

    console.log(query);

    if (category) {
      query.equalTo("tags", category);
    }

    query.skip((Number(page) - 1) * Number(limit));
    query.limit(Number(limit));
    query.include("author");
    query.descending("createdAt");

    const posts = await query.find();

    console.dir(posts[0]);

    const formattedPosts = posts.map((post) => ({
      id: post.id,
      title: post.get("title"),
      description: post.get("description"),
      modelUrl: post.get("modelUrl"),
      tags: post.get("tags"),
      likes: post.get("likes") || 0,
      comments: post.get("comments") || [],
      author: {
        id: post.get("author").id,
        name: post.get("author").get("username"),
        avatar: post.get("author").get("avatar"),
      },
      createdAt: post.get("createdAt"),
    }));

    res.json({ posts: formattedPosts });
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

    post.increment("likes");
    await post.save();

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
    comment.set("author", Parse.User.current());

    const result = await comment.save();

    post.add("comments", comment);
    await post.save();

    const commentData = {
      id: result.id,
      content: result.get("content"),
      author: {
        id: result.get("author").id,
        name: result.get("author").get("username"),
        avatar: result.get("author").get("avatar"),
      },
      createdAt: result.get("createdAt"),
    };

    console.table({
      Action: "Add Comment",
      PostId: postId,
      User: Parse.User.current()?.get("username"),
      Status: "Success",
    });

    res.status(201).json(commentData);
  } catch (error) {
    console.error("Comment Error:", error);
    res.status(400).json({ error: error.message });
  }
});

export default router;
