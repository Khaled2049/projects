import React, { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  DocumentData,
  QueryDocumentSnapshot,
  addDoc,
  doc,
  deleteDoc,
  where,
} from "firebase/firestore";
import { useAuthContext } from "./AuthContext";
import { firestore } from "../config/firebase";
import { IUser } from "../types/IUser";
// Define the type for a post
interface IPost {
  id: string;
  content: string;
  createdAt: Date;
  authorId: string;
  authorName: string;
}

// Define the type for the context state
interface PostsContextState {
  posts: IPost[];
  loading: boolean;
  hasMore: boolean;
  loadMorePosts: () => Promise<void>;
  createPost: (content: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
}

const PostsContext = createContext<PostsContextState | undefined>(undefined);
const POSTS_PER_PAGE = 10;

export const PostsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  const { user } = useAuthContext();

  const loadMorePosts = async () => {
    if (loading || !hasMore || !user) return;
    setLoading(true);

    console.log("Loading more posts...");

    try {
      const postsCollection = collection(firestore, "posts");
      let postsQuery;
      postsQuery = query(
        postsCollection,
        orderBy("createdAt", "desc"),
        limit(POSTS_PER_PAGE)
      );

      if (lastDoc) {
        postsQuery = query(postsQuery, startAfter(lastDoc));
      }

      const querySnapshot = await getDocs(postsQuery);
      const newPosts = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as IPost)
      );

      setPosts((prevPosts) => {
        const existingIds = new Set(prevPosts.map((post) => post.id));
        const uniqueNewPosts = newPosts.filter(
          (post) => !existingIds.has(post.id)
        );
        return [...prevPosts, ...uniqueNewPosts];
      });

      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
      setHasMore(querySnapshot.docs.length === POSTS_PER_PAGE);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log("PostsProvider mounted or isMyFeed changed");
    setPosts([]);
    setLastDoc(null);
    setHasMore(true);
    loadMorePosts();
  }, []);

  useEffect(() => {
    console.log("User state changed", user);
    if (user) {
      setPosts([]);
      setLastDoc(null);
      setHasMore(true);
      loadMorePosts();
    }
  }, [user]);

  const createPost = async (content: string) => {
    if (!user) return;
    const postsCollection = collection(firestore, "posts");

    try {
      const newPost: Omit<IPost, "id"> = {
        content,
        createdAt: new Date(),
        authorId: user.uid,
        authorName: user.displayName || "",
      };

      const docRef = await addDoc(postsCollection, newPost);

      const createdPost: IPost = {
        ...newPost,
        id: docRef.id,
      };

      setPosts((prevPosts) => [...prevPosts, createdPost]);
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  };

  const deletePost = async (postId: string) => {
    if (!user) return;

    try {
      // Delete the post from Firestore
      const postRef = doc(firestore, "posts", postId);
      await deleteDoc(postRef);

      // Remove the post from local state
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  };

  return (
    <PostsContext.Provider
      value={{
        posts,
        createPost,
        deletePost,
        loadMorePosts,
        loading,
        hasMore,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};

// Create a custom hook to use the PostsContext
export const usePosts = () => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error("usePosts must be used within a PostsProvider");
  }
  return context;
};
