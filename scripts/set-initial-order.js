// Script to set initial order values for existing posts
// Run this in your Sanity Studio or via the Sanity CLI

import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID, // Replace with your actual project ID
  dataset: process.env.SANITY_STUDIO_DATASET, // Replace with your dataset name
  apiVersion: "2024-01-01",
  token: process.env.SANITY_STUDIO_TOKEN, // You'll need a token with write permissions
  useCdn: false,
});

async function setInitialOrder() {
  try {
    // Fetch all posts
    const posts = await client.fetch(
      '*[_type == "post"] | order(publishedAt desc)'
    );

    console.log(`Found ${posts.length} posts to update`);

    // Update each post with an order value
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      const orderValue = i + 1;

      await client.patch(post._id).set({ order: orderValue }).commit();

      console.log(`Updated ${post.title} with order: ${orderValue}`);
    }

    console.log("All posts updated successfully!");
  } catch (error) {
    console.error("Error updating posts:", error);
  }
}

// Uncomment the line below to run the script
// setInitialOrder()
