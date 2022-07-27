import React from 'react';

import { getPostDetails, getData } from '../../services';
import PostDetail from '../../components/PostDetail';

interface IPostDetailsProps {
  post: IPostDetail;
}

const PostDetails = ({ post }: IPostDetailsProps) => {
  return (
    <div className="container mx-auto px-10 mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="col-span-1 lg:col-span-8">
          <PostDetail post={post} />
        </div>
        <div className="col-span-1 lg:col-span-4">
          <div className="relative">TEXT</div>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps = async ({ params }: any) => {
  const data = await getPostDetails(params.slug);
  // const data = [
  //   {
  //     id: 'cl5zeifh2593b0dk1i23f3xci',
  //     author: { name: 'Khaled Hossain', id: 'cl5zeg848e7aa0bj0gfqas2zl' },
  //     content: {
  //       text: "Lorem Ipsum\\n is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  //     },
  //     coverImage: null,
  //     title: 'Test Blog',
  //     slug: 'post-1',
  //     excerpt: 'This is a test.',
  //   },
  // ];
  return {
    props: {
      post: data,
    },
  };
};

export async function getStaticPaths() {
  // const data = await getData();
  const data = [
    {
      id: 'cl5zeifh2593b0dk1i23f3xci',
      author: { name: 'Khaled Hossain', id: 'cl5zeg848e7aa0bj0gfqas2zl' },
      content: {
        text: "Lorem Ipsum\\n is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      },
      coverImage: null,
      title: 'Test Blog',
      slug: 'post-1',
      excerpt: 'This is a test.',
    },
    {
      id: 'cl5zesafifh2593b0dk1i23f3xci',
      author: { name: 'Khaled Hossain', id: 'cl5zeg848e7aa0bj0gfqas2zl' },
      content: {
        text: "Lorem Ipsum\\n is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      },
      coverImage: null,
      title: 'Test Blog',
      slug: 'post-2',
      excerpt: 'This is a test.',
    },
  ];

  data.map((post: any) => {
    return { params: { slug: post.slug } };
  });

  return {
    paths: data.map((post: any) => {
      return { params: { slug: post.slug } };
    }),

    fallback: false,
  };
}

export default PostDetails;
