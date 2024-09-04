import React, { useEffect, useState } from "react";
import { User, BookIcon, Send, UserPlus, BookOpen } from "lucide-react";
import { usePosts } from "../../../contexts/PostsContext";
import { useInView } from "react-intersection-observer";

const Posts = () => {
  const [post, setPost] = useState("");
  const {
    createPost,
    allPosts,
    followingPosts,
    loading,
    hasMore,
    loadMorePosts,
  } = usePosts();
  const [isMyFeed, setIsMyFeed] = useState(true);
  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && !loading && hasMore) {
      loadMorePosts();
    }
  }, [inView, loading, hasMore]);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Post submitted:", post);
    createPost(post);
    setPost("");
  };
  return (
    <div className="w-full lg:w-1/2 bg-amber-50 p-4 overflow-y-auto  border-amber-200">
      <form onSubmit={handlePostSubmit} className="mb-6">
        <div className="flex items-center bg-amber-50 rounded-lg p-2 border border-amber-200">
          <input
            type="text"
            value={post}
            onChange={(e) => setPost(e.target.value)}
            placeholder="Share your thoughts..."
            className="flex-grow bg-transparent outline-none font-serif text-amber-900 p-3"
          />
          <button
            type="submit"
            className="ml-2 text-amber-700 hover:text-amber-900"
          >
            <Send size={20} />
          </button>
        </div>
      </form>

      <div className="flex justify-between mb-4">
        <button
          onClick={() => setIsMyFeed(true)}
          className={`w-full py-2 px-4 text-center font-serif font-bold ${
            isMyFeed ? "bg-amber-600 text-white" : "bg-amber-200 text-amber-900"
          }`}
        >
          My Feed
        </button>
        <button
          onClick={() => setIsMyFeed(false)}
          className={`w-full py-2 px-4 text-center font-serif font-bold ${
            !isMyFeed
              ? "bg-amber-600 text-white"
              : "bg-amber-200 text-amber-900"
          }`}
        >
          Discover
        </button>
      </div>

      {/* All Posts */}

      {isMyFeed
        ? followingPosts.map((post, index) => (
            <div
              key={post.id}
              className="bg-amber-50 shadow rounded-lg p-4 mb-4 border border-amber-200"
            >
              <div className="flex items-center mb-2 justify-between">
                <div className="flex items-center">
                  <User className="mr-2 text-amber-700" />
                  <span className="font-serif font-bold text-amber-900">
                    {post.authorName}
                  </span>
                </div>
                <span className="text-amber-600 text-sm">
                  Post #{index + 1}
                </span>
              </div>
              <p className="mb-2 font-serif text-amber-800">{post.content}</p>
              <div className="flex items-center text-amber-600">
                <BookOpen size={16} className="mr-1" />
                <span>100 likes</span>
              </div>
            </div>
          ))
        : allPosts.map((post, index) => (
            <div
              key={post.id}
              className="bg-amber-50 shadow rounded-lg p-4 mb-4 border border-amber-200"
            >
              <div className="flex items-center mb-2 justify-between">
                <div className="flex items-center">
                  <User className="mr-2 text-amber-700" />
                  <span className="font-serif font-bold text-amber-900">
                    {post.authorName}
                  </span>
                </div>
                <span className="text-amber-600 text-sm">
                  Post #{index + 1}
                </span>
              </div>
              <p className="mb-2 font-serif text-amber-800">{post.content}</p>
              <div className="flex items-center text-amber-600">
                <BookOpen size={16} className="mr-1" />
                <span>100 likes</span>
              </div>
            </div>
          ))}

      {}

      {loading && (
        <div className="text-center p-4 bg-amber-100 rounded">
          Loading more posts...
        </div>
      )}
      {!loading && !hasMore && (
        <div className="text-center p-4 bg-amber-200 rounded text-amber-800">
          No more posts to load
        </div>
      )}
      <div ref={ref} className="h-10">
        {loading && <div>Loading...</div>}
      </div>
    </div>
  );
};

export default Posts;
