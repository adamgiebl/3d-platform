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

    const postsWithLikes = await Promise.all(
      posts.map(async (post) => {
        const likesQuery = new Parse.Query("Like");
        likesQuery.equalTo("post", post.id);
        const likes = await likesQuery.count();

        return {
          objectId: post.id,
          title: post.get("title"),
          description: post.get("description"),
          modelUrl: post.get("modelUrl"),
          createdAt: post.get("createdAt"),
          updatedAt: post.get("updatedAt"),
          likesCount: likes,
        };
      })
    );

    console.log("Posts with likes:", postsWithLikes);

    res.json({ posts: postsWithLikes });
  } catch (error: any) {
    console.error("Feed Fetch Error:", error);
    res.status(500).json({ error: error?.message || "Failed to fetch posts" });
  }
});


// Post post like
router.post("/:postId/like", async (req, res) => {
  try {
    const sessionToken = req.headers["x-parse-session-token"] as string;
    const user = await Parse.User.become(sessionToken);

    // Check if user already liked the post
    const query = new Parse.Query("Like");
    query.contains("post", req.params.postId);
    query.contains("user", user.id);
    const exists = await query.find();

    if (exists.length > 0){
      res.status(201).json({ error: "User already liked that post" });
    } else {
      const Like = Parse.Object.extend("Like");
      const like = new Like();
      like.set("user", user.id);
      like.set("post", req.params.postId);
      const result = await like.save();
      res.status(200).json({});
    }
  } catch (error: any) {
    console.error("Feed Fetch Error:", error);
    res.status(500).json({ error: error?.message || "Failed to fetch posts" });
  }
});

export default router;
