import React from 'react';

interface PostDetailProps {
  post: IPostDetail;
}

const PostDetail = ({ post }: PostDetailProps) => {
  console.log(post);
  return (
    <div className="rounded-lg  p-9 lg:p-8 pb-12 mt-8 mb-8">
      <div className="flex overflow-auto items-center justify-center">
        {post.content.text}
      </div>
    </div>
  );
};

export default PostDetail;
