import { Router } from "express";
import Parse from "parse/node";

const router = Router();

// Get all tags ordered by usage frequency
router.get("/", async (req, res) => {
  try {
    const Tag = Parse.Object.extend("tags");
    const PostTag = Parse.Object.extend("post_tags");

    const tagQuery = new Parse.Query(Tag);
    const tags = await tagQuery.find();

    const tagsWithCount = await Promise.all(
      tags.map(async (tag) => {
        const postTagQuery = new Parse.Query(PostTag);
        postTagQuery.equalTo("tag_id", tag);
        const count = await postTagQuery.count();

        return {
          id: tag.id,
          name: tag.get("tag_name"),
          count: count,
        };
      })
    );

    const sortedTags = tagsWithCount.sort((a, b) => b.count - a.count);

    res.json({ tags: sortedTags });
  } catch (error: any) {
    console.error("Tags Fetch Error:", error);
    res.status(500).json({ error: error?.message || "Failed to fetch tags" });
  }
});

export default router;
