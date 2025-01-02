import { Router } from "express";
import Parse from "parse/node";

const router = Router();

// Create a new post
router.post("/", async (req, res) => {
  try {
    const { title, description, modelUrl } = req.body;
    const Post = Parse.Object.extend("Post");
    const post = new Post();

    post.set("title", title);
    post.set("description", description);
    post.set("modelUrl", modelUrl);

    const result = await post.save();

    console.table({
      Action: "Create Post",
      Title: title,
      Status: "Success",
    });

    res.status(201).json({
      objectId: result.id,
      title: result.get("title"),
      description: result.get("description"),
      modelUrl: result.get("modelUrl"),
      createdAt: result.get("createdAt"),
      updatedAt: result.get("updatedAt"),
    });
  } catch (error: any) {
    console.error("Post Creation Error:", error);
    res.status(400).json({ error: error?.message || "Failed to create post" });
  }
});

// Get posts feed
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const query = new Parse.Query("Post");

    query.skip((Number(page) - 1) * Number(limit));
    query.limit(Number(limit));
    query.descending("createdAt");

    const posts = await query.find();

    const postsWithComments = await Promise.all(      
      posts.map(async (post) => {
        const commentsQuery = new Parse.Query("Comment");
        commentsQuery.equalTo("post", post.toPointer());
        commentsQuery.include("user");
        const comments = await commentsQuery.find();

        return {
          objectId: post.id,
          title: post.get("title"),
          description: post.get("description"),
          modelUrl: post.get("modelUrl"),
          createdAt: post.get("createdAt"),
          updatedAt: post.get("updatedAt"),
          comments: comments.map((comment) => {
            return {
              content: comment.get("content"),
              id: comment.id,
              name: comment.get("user").get("username"),
            }
          })
        };
      })  
    );
    res.json({ posts: postsWithComments });
  } catch (error: any) {
    console.error("Feed Fetch Error:", error);
    res.status(500).json({ error: error?.message || "Failed to fetch posts" });
  }
});


// Add post comment
router.post("/:postId/comments", async (req, res) => {
  try {
    const sessionToken = req.headers["x-parse-session-token"] as string;
    const user = await Parse.User.become(sessionToken);

    const postQuery = new Parse.Query("Post");
    const post = await postQuery.get(req.params.postId);

    const Comment = Parse.Object.extend("Comment");
    const comment = new Comment();
  
    comment.set("content", req.body.content);
    comment.set("user", user);
    comment.set("post", post);
    comment.save();
 
    res.status(200).json(
      {
          content: comment.get("content"),
          id: comment.id,
          name: user.get("username"),
    } 
  );
  } catch (error: any) {
    console.error("Comment creation Error:", error);
    res.status(500).json({ error: error?.message || "Failed to comment" });
  }
});

export default router;
