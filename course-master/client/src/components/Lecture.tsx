import React from "react";
import { useQuery, gql } from "@apollo/client";

const POSTS_QUERY = gql`
  {
    posts {
      id
      title
      body
    }
  }
`;

interface IPost {
  id: string;
  title: string;
  body: string;
}

const Lecture = () => {
  const { data, loading, error } = useQuery(POSTS_QUERY);

  if (loading) return <p>loading...</p>;
  if (error) return <p>error</p>;

  const { posts } = data;

  const renderPosts = (posts: IPost[]) => {
    return posts.map((post) => {
      return (
        <div key={post.id}>
          <h4>{post.title}</h4>
          <p>{post.body}</p>
        </div>
      );
    });
  };

  return (
    <div>
      <h1>Lectures</h1>
      <div>{renderPosts(posts)}</div>
    </div>
  );
};

export default Lecture;
