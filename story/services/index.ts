import { request, gql } from 'graphql-request';

const graphqlAPI = String(process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT);

export const getData = async () => {
  const query = gql`
    query GetPosts {
      posts {
        id
        author {
          name
          id
        }
        content {
          text
        }
        coverImage {
          url
        }
        title
        slug
        excerpt
      }
    }
  `;
  const results = await request(graphqlAPI, query);
  return results?.posts;
};
export const getPostDetails = async (slug: string) => {
  const query = gql`
    query GetPostDetails($slug: String!) {
      post(where: { slug: $slug }) {
        id
        content {
          text
        }
        coverImage {
          url
        }
        title
        slug
      }
    }
  `;
  const results = await request(graphqlAPI, query, { slug });
  return results?.post;
};

export const getCategories = async () => {
  const query = gql`
    query GetCategories {
      categories {
        name
        slug
      }
    }
  `;
  const result = await request(graphqlAPI, query);
  return result?.categories;
};
