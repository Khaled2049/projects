import React from 'react';
import moment from 'moment';
import Link from 'next/link';

interface IPostProps {
  posts: IPost[];
}

const Post = (props: IPostProps) => {
  const { posts } = props;
  return (
    <div className="shadow-lg rounded-lg p-9 lg:p-8 pb-12 mb-8">
      <div className="relative mb-6">
        {posts.map((post: IPost) => {
          return (
            <div key={post.id}>
              <img
                // src={post?.coverImage?.url}
                src="https://i.picsum.photos/id/0/5616/3744.jpg?hmac=3GAAioiQziMGEtLbfrdbcoenXoWAW-zlyEAMkfEdBzQ"
                alt={post.title}
                className="object-top h-80 w-full object-cover shadow-lg rounded-t-lg lg:rounded-lg"
              ></img>
              <h1 className="transition duration-100 text-center mt-2 mb-1 cursor-pointer hover:text-red-600 text-3xl font-semibold">
                {post.title}
              </h1>
              <div className="font-light text-center text-gray-700">
                Posted By: {post.author?.name} on{' '}
                <span>{moment(post.createdAt).format('MMM DD, YYYY')}</span>
              </div>
              <p className="text-center text-lg text-gray-700 font-normal px-4 lg:px-20 mb-2">
                {post.excerpt}
              </p>
              <div className="text-center mb-5">
                <Link href={`/posts/${post.slug}`}>
                  <span className="transition duration-100 cursor-pointer text-blue-800 hover:text-blue-600 bg-blue-300 hover:-translate-y-1 inline-block rounded-full px-4 py-2">
                    Read More...
                  </span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Post;
