import { Router } from "express";
import Parse from "parse/node";

const router = Router();

// Create a new post
router.post("/", async (req, res) => {
  try {
    const { title, description, modelUrl, tags } = req.body;
    const sessionToken = req.headers["x-parse-session-token"] as string;
    const user = await Parse.User.become(sessionToken);

    const Post = Parse.Object.extend("Post");
    const post = new Post();

    post.set("title", title);
    post.set("description", description);
    post.set("modelUrl", modelUrl);
    post.set("user", user);

    const result = await post.save();

    const Tag = Parse.Object.extend("tags");
    const PostTag = Parse.Object.extend("post_tags");

    for (const tagName of tags) {
      let tagQuery = new Parse.Query(Tag);
      tagQuery.equalTo("tag_name", tagName);
      let tag = await tagQuery.first();

      if (!tag) {
        tag = new Tag();
        if (tag) {
          tag.set("tag_name", tagName);
          await tag.save();
        }
      }

      const postTag = new PostTag();
      postTag.set("post_id", post);
      postTag.set("tag_id", tag);
      await postTag.save();
    }

    res.status(201).json({
      objectId: result.id,
      title: result.get("title"),
      description: result.get("description"),
      modelUrl: result.get("modelUrl"),
      tags: tags,
      createdAt: result.get("createdAt"),
      updatedAt: result.get("updatedAt"),
      user: {
        id: user.id,
        username: user.get("username"),
        email: user.get("email"),
      },
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

    Parse.Cloud.useMasterKey();

    const Post = Parse.Object.extend("Post");
    const query = new Parse.Query(Post);

    query.include("user");
    query.skip((Number(page) - 1) * Number(limit));
    query.limit(Number(limit));
    query.descending("createdAt");

    const posts = await query.find();

    const postsTags = await Promise.all(
      posts.map(async (post) => {
        const postTagQ = new Parse.Query("post_tags");
        postTagQ.equalTo("post_id", post);
        postTagQ.include("tag_id");
        const postTags = await postTagQ.find();

        const tags = postTags.map((postTag) =>
          postTag.get("tag_id").get("tag_name")
        );

        const likesQuery = new Parse.Query("Like");
        likesQuery.equalTo("post", post.id);
        const likes = await likesQuery.count();

        const postUser = post.get("user");

        const commentsQuery = new Parse.Query("Comment");
        commentsQuery.equalTo("post", post.toPointer());
        commentsQuery.include("user");
        const comments = await commentsQuery.find();

        return {
          objectId: post.id,
          title: post.get("title"),
          description: post.get("description"),
          modelUrl: post.get("modelUrl"),
          tags: tags,
          createdAt: post.get("createdAt"),
          updatedAt: post.get("updatedAt"),
          likes: likes,
          comments: comments.map((comment) => {
            return {
              content: comment.get("content"),
              id: comment.id,
              name: comment.get("user")?.get("username"),
            };
          }),
          user: postUser
            ? {
                id: postUser.id,
                username: postUser.get("username"),
                email: postUser.get("email"),
              }
            : null,
        };
      })
    );

    res.json({ posts: postsTags });
  } catch (error: any) {
    console.error("Post Feed Fetch Error:", error);
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
    query.equalTo("post", req.params.postId);
    query.equalTo("user", user.id);
    const existingLike = await query.first();
    if (existingLike) {
      existingLike.destroy();
      res.status(200).json({ message: "Deleted like" });
    } else {
      const Like = Parse.Object.extend("Like");
      const like = new Like();
      like.set("user", user.id);
      like.set("post", req.params.postId);
      const result = await like.save();
      res.status(200).json({ message: "Added like" });
    }
  } catch (error: any) {
    console.error("Feed Fetch Error:", error);
    res.status(500).json({ error: error?.message || "Failed to fetch posts" });
  }
});

// Get posts by user ID
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const query = new Parse.Query("Post");

    const userPointer = new Parse.User();
    userPointer.id = userId;
    query.equalTo("user", userPointer);

    query.include("user");
    query.skip((Number(page) - 1) * Number(limit));
    query.limit(Number(limit));
    query.descending("createdAt");

    const posts = await query.find();
    const totalPosts = await query.count();

    const postsWithLikes = await Promise.all(
      posts.map(async (post) => {
        const likesQuery = new Parse.Query("Like");
        likesQuery.equalTo("post", post.id);
        const likes = await likesQuery.count();

        const postUser = post.get("user");

        return {
          objectId: post.id,
          title: post.get("title"),
          description: post.get("description"),
          modelUrl: post.get("modelUrl"),
          createdAt: post.get("createdAt"),
          updatedAt: post.get("updatedAt"),
          likes: likes,
          user: postUser
            ? {
                id: postUser.id,
                username: postUser.get("username"),
                email: postUser.get("email"),
              }
            : null,
        };
      })
    );

    res.json({
      posts: postsWithLikes,
      total: totalPosts,
    });
  } catch (error: any) {
    console.error("User Posts Fetch Error:", error);
    res
      .status(500)
      .json({ error: error?.message || "Failed to fetch user posts" });
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

    res.status(200).json({
      content: comment.get("content"),
      id: comment.id,
      name: user.get("username"),
    });
  } catch (error: any) {
    console.error("Comment creation Error:", error);
    res.status(500).json({ error: error?.message || "Failed to comment" });
  }
});

router.get("/tag/:tag", async (req, res) => {
  try {
    const { tag } = req.params;

    const Tag = Parse.Object.extend("tags");
    const tagQuery = new Parse.Query(Tag);
    tagQuery.equalTo("tag_name", tag);
    const tagObject = await tagQuery.first();

    if (!tagObject) {
      return res.status(404).json({ error: "Tag not found" });
    }

    const PostTag = Parse.Object.extend("post_tags");
    const postTagQuery = new Parse.Query(PostTag);
    postTagQuery.equalTo("tag_id", tagObject);
    postTagQuery.include(["post_id", "post_id.user"]);
    const postTags = await postTagQuery.find();

    const posts = postTags.map((postTag) => postTag.get("post_id"));

    const postsWithDetails = await Promise.all(
      posts.map(async (post) => {
        try {
          const likesQuery = new Parse.Query("Like");
          likesQuery.equalTo("post", post.id);
          const likes = await likesQuery.count();

          const postUser = post.get("user");

          const postTagQuery = new Parse.Query("post_tags");
          postTagQuery.equalTo("post_id", post);
          postTagQuery.include("tag_id");
          const postTags = await postTagQuery.find();
          const tags = postTags.map((postTag) =>
            postTag.get("tag_id").get("tag_name")
          );

          return {
            objectId: post.id,
            title: post.get("title"),
            description: post.get("description"),
            modelUrl: post.get("modelUrl"),
            tags: tags,
            createdAt: post.get("createdAt"),
            updatedAt: post.get("updatedAt"),
            likes: likes,
            user: postUser
              ? {
                  id: postUser.id,
                  username: postUser.get("username"),
                  email: postUser.get("email"),
                }
              : null,
          };
        } catch (error: any) {
          return null;
        }
      })
    );

    const validPosts = postsWithDetails.filter((post) => post !== null);
    res.json({ posts: validPosts });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || "Failed to fetch posts" });
  }
});

export default router;
