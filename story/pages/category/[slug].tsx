import React from 'react';
import { getCategories, getPostsByCatagory } from '../../services';
import Link from 'next/link';
const CategoryPost = ({ posts }: any) => {
  return (
    <div className="container mx-auto px-10 mb-8">
      <div className="">
        <div className="">
          {posts.map((post: any, index: number) => (
            <div
              className="shadow-lg bg-sky-300 rounded-lg p-9 lg:p-8 pb-12 mt-8 mb-8"
              key={post.id}
            >
              <h1 className="transition duration-100 text-center mt-2 mb-1 cursor-pointer hover:text-slate-600 text-3xl font-semibold">
                {post.title}
              </h1>
              <div className="font-light text-center text-gray-700">
                {post.author?.name} on{' '}
              </div>
              <p className="text-center text-lg text-gray-700 font-normal px-4 lg:px-20 mb-2">
                {post.excerpt}
              </p>
              <div className="text-center mb-5">
                <Link href={`/posts/${post.category}`}>
                  <span className="cursor-pointer text-slate-100  bg-blue-800 inline-block rounded-full px-4 py-2">
                    Read More...
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Fetch data at build time
export async function getStaticProps({ params }: any) {
  const posts = await getPostsByCatagory(params.slug);

  // console.log(posts);

  return {
    props: { posts },
  };
}

export async function getStaticPaths() {
  const data = await getCategories();

  return {
    paths: data.map((post: any) => {
      return { params: { slug: post.slug } };
    }),

    fallback: false,
  };
}

export default CategoryPost;
