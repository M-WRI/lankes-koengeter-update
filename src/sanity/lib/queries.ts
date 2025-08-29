import { groq } from "next-sanity";

// Contact queries
export const contactQuery = groq`
  *[_type == "contact"] | order(orderRank) {
    _id,
    title,
    link,
    publishedAt
  }
`;

// Information queries
export const informationQuery = groq`
  *[_type == "information"][0] {
    _id,
    title,
    contentBlocks[] {
      title,
      text
    },
    publishedAt
  }
`;

// Post queries (existing)
export const postsQuery = groq`
  *[_type == "post"] | order(orderRank) {
    _id,
    title,
    images[] {
      asset->,
      alt,
      text
    },
    publishedAt
  }
`;
