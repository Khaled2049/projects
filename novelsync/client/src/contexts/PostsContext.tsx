import React, { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
  addDoc,
  doc,
  deleteDoc,
  where,
  onSnapshot,
} from "firebase/firestore";
import { useAuthContext } from "./AuthContext";
import { firestore } from "../config/firebase";

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
  allPosts: IPost[];
  followingPosts: IPost[];
  loading: boolean;
  hasMore: boolean;
  loadMorePosts: () => void;
  createPost: (content: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
}

const PostsContext = createContext<PostsContextState | undefined>(undefined);
const POSTS_PER_PAGE = 10;

export const PostsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [allPosts, setAllPosts] = useState<IPost[]>([]);
  const [followingPosts, setFollowingPosts] = useState<IPost[]>([]);

  const { user } = useAuthContext();

  const loadMorePosts = () => {
    if (loading || !hasMore || !user) return;

    setLoading(true);

    // All posts listener
    const allPostsQuery = query(
      collection(firestore, "posts"),
      orderBy("createdAt", "desc"),
      // startAfter(lastDoc || 0),
      limit(POSTS_PER_PAGE)
    );

    const unsubscribeAllPosts = onSnapshot(
      allPostsQuery,
      (snapshot) => {
        const newPosts = snapshot.docs.map((doc) => ({
          id: doc.id,
          authorId: doc.data().authorId,
          authorName: doc.data().authorName,
          content: doc.data().content,
          createdAt: doc.data().createdAt.toDate(),
          ...doc.data(),
        }));

        setAllPosts((prevPosts) => {
          const existingIds = new Set(prevPosts.map((post) => post.id));
          const uniqueNewPosts = newPosts.filter(
            (post) => !existingIds.has(post.id)
          );
          return [...prevPosts, ...uniqueNewPosts];
        });
        setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
        setHasMore(snapshot.docs.length === POSTS_PER_PAGE);
        setLoading(false);
      },
      (error) => {
        console.error("Error loading more posts:", error);
        setLoading(false);
      }
    );

    // Following posts listener
    const followingPostsQuery = query(
      collection(firestore, "posts"),
      where("authorId", "in", user.following || []),
      orderBy("createdAt", "desc"),
      limit(POSTS_PER_PAGE)
    );

    const unsubscribeFollowingPosts = onSnapshot(
      followingPostsQuery,
      (snapshot) => {
        const newPosts = snapshot.docs.map((doc) => ({
          id: doc.id,
          authorId: doc.data().authorId,
          authorName: doc.data().authorName,
          content: doc.data().content,
          createdAt: doc.data().createdAt.toDate(),
          ...doc.data(),
        }));

        setFollowingPosts((prevPosts) => {
          const existingIds = new Set(prevPosts.map((post) => post.id));
          const uniqueNewPosts = newPosts.filter(
            (post) => !existingIds.has(post.id)
          );
          return [...prevPosts, ...uniqueNewPosts];
        });
        setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
        setHasMore(snapshot.docs.length === POSTS_PER_PAGE);
        setLoading(false);
      },
      (error) => {
        console.error("Error loading more followed author posts:", error);
        setLoading(false);
      }
    );

    // Cleanup function
    return () => {
      unsubscribeAllPosts();
      unsubscribeFollowingPosts();
    };
  };

  useEffect(() => {
    if (user) {
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

      setAllPosts((prevPosts) => [...prevPosts, createdPost]);
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
      setAllPosts((prevPosts) =>
        prevPosts.filter((post) => post.id !== postId)
      );
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  };

  return (
    <PostsContext.Provider
      value={{
        followingPosts,
        allPosts,
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
