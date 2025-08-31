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
  *[_type == "information"] {
    _id,
    title,
    id,
    contentBlocks[] {
      title,
      text
    },
    publishedAt
  }
`;

export const postsQuery = groq`*[_type == "post"] | order(orderRank) {
  _id,
  title,
  images[] {
    _key,
    asset->,
    alt,
    text
  },
  publishedAt,
  orderRank
}`;
