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

export const getCategories = async () => {
  const query = gql`
    query GetCategories {
      categories {
        category
        slug
      }
    }
  `;
  const result = await request(graphqlAPI, query);
  return result?.categories;
};

export const getPostsByCatagory = async (category: string) => {
  const query = gql`
    query GetPostsByCatagory($category: String!) {
      posts(where: { category: $category }) {
        id
        excerpt
        title
        category
        content {
          text
        }
        slug
      }
    }
  `;

  const result = await request(graphqlAPI, query, { category });
  return result?.posts;
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
