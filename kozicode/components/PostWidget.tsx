import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Link from 'next/link';
import { getRecentPosts, getSimilarPosts } from '../services';

interface IPostWidget {
  categories: string[];
  slug: string;
}

interface relatedPosts {
  title: string;
  createdAt: string;
  slug: string;
}

const PostWidget = ({ categories, slug }:IPostWidget) => {
  const [relatedPosts , setRelatedPosts] = useState<relatedPosts[]>([]);

  useEffect(() => {
    if (slug) {
      getSimilarPosts(categories, slug).then((result) => {
        setRelatedPosts(result);
      });
    } else {
      getRecentPosts().then((result) => {
        setRelatedPosts(result);
      });
    }
  }, [slug]);

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
      <h3 className="text-xl mb-8 font-semibold border-b pb-4">
        {slug ? 'Related Posts' : 'Recents Posts'}
      </h3>
      {relatedPosts.map((post) => {
        return (
          <div key={post.title} className="flex items-center w-full mb-4">
            <div className="flex-grow ml-4">
              <p className="text-gray-500 font-xs">
                {moment(post.createdAt).format('MMM DD, YYYY')}
              </p>
              <Link href={`/post/${post.slug}`} className="text-md">
                {post.title}
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PostWidget;
