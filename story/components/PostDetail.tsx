import React from 'react';

interface PostDetailProps {
  post: IPostDetail;
}

const PostDetail = ({ post }: PostDetailProps) => {
  return (
    <div className="bg-white shadow-lg rounded-lg lg:p-8 pb-12 mb-8">
      <div className="relative overflow-hidden shadow-md mb-6">
        <img
          src="https://picsum.photos/id/237/200/300/"
          alt={post.title}
          className="object-top h-80 w-full object-cover shadow-lg rounded-t-lg lg:rounded-lg"
        />
      </div>
      <div className="px-4 lg:px-0 ">
        <div className="flex items-center">{post.content.text}</div>
      </div>
    </div>
  );
};

export default PostDetail;
