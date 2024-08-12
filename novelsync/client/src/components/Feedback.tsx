import React, { useContext, useEffect, useState } from "react";

import { useAuth } from "../contexts/AuthContext";
import NovelsContext from "../contexts/NovelsContext";

interface FeedbackProps {
  novelId: string;
}

const Feedback: React.FC<FeedbackProps> = ({ novelId }) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState<string>("");

  const novelsContext = useContext(NovelsContext);

  if (!novelsContext) {
    throw new Error("useNovels must be used within a NovelsProvider");
  }

  const { feedback, getFeedback, addFeedback } = novelsContext;
  const [localFeedback, setLocalFeedback] = useState(feedback);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const feedbackData = await getFeedback(novelId);
        setLocalFeedback(feedbackData);
      } catch (error) {
        console.error("Error fetching feedback: ", error);
      }
    };

    fetchFeedback();
  }, [novelId, getFeedback]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && user) {
      try {
        await addFeedback(novelId, newComment.trim());
        setNewComment("");
      } catch (error) {
        console.error("Error submitting comment: ", error);
        // Handle error (e.g., show error message to user)
      }
    }
  };

  return (
    <div className="max-w-2xl w-1/2  mx-auto mt-8 p-6 bg-amber-50 rounded-lg shadow-lg m-4">
      {user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-grow px-3 py-2 bg-white border border-amber-300 rounded-l-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              placeholder="Add Feedback..."
            />
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-amber-700 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              Post
            </button>
          </div>
        </form>
      ) : (
        <p className="mb-6 text-red-500">Please sign in to leave feedback.</p>
      )}
      <div className="space-y-4">
        {localFeedback.map((feedbackItem) => (
          <div
            key={feedbackItem.id}
            className="bg-white p-4 rounded-lg shadow-md"
          >
            <p className="text-amber-900">{feedbackItem.text}</p>
            <p className="text-sm text-gray-500 mt-1">
              {feedbackItem.username}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feedback;
