import React, { useRef, useState } from 'react';
import { submitComment } from '../services';

const CommentsForm = ({ slug }: any) => {
  const [error, setError] = useState(false);
  const [localStorage, setlocalStorage] = useState(null);
  const [showSuccess, setshowSuccess] = useState(false);

  const commentEl = useRef() as React.MutableRefObject<HTMLTextAreaElement>;
  const nameEl = useRef() as React.MutableRefObject<HTMLInputElement>;
  const emailEl = useRef() as React.MutableRefObject<HTMLInputElement>;

  const handleCommentsSubmission = () => {
    setError(false);
    const { value: comment } = commentEl.current;
    const { value: name } = nameEl.current;
    const { value: email } = emailEl.current;

    if (!comment || !name || !email) {
      setError(true);
      return;
    }

    const commentObj = {
      name,
      email,
      comment,
      slug,
    };

    submitComment(commentObj).then((res) => {
      setshowSuccess(true);
      console.log(res);
      setTimeout(() => {
        setshowSuccess(false);
      }, 3000);
    });
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 pb-12 mb-8">
      <h3 className="text-xl mb-8 font-semibold border-b pb-4">Comments</h3>
      <div className="grid grid-cols-1 gap-4 mb-4">
        <textarea
          ref={commentEl}
          className="p-4 text-gray-700 outline-none w-full rounded-lg focus:ring-2 focus:ring-gray-200 bg-gray-100"
          name="comment"
          placeholder="Comment"
        ></textarea>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          ref={nameEl}
          className="py-2 px-4 text-gray-700 outline-none w-full rounded-lg focus:ring-2 focus:ring-gray-200 bg-gray-100"
          name="name"
          placeholder="Name"
        />
        <input
          type="text"
          ref={emailEl}
          className="py-2 px-4 text-gray-700 outline-none w-full rounded-lg focus:ring-2 focus:ring-gray-200 bg-gray-100"
          name="email"
          placeholder="Email"
        />
      </div>
      {error && <p className="text-xs text-red-500">All Fields are required</p>}
      <div className="mt-8">
        <button
          className="transition duration-500 ease hover:bg-indigo-900 inline-block bg-pink-600 text-lg rounded-full text-white px-8 py-4 cursor:pointer"
          type="button"
          onClick={handleCommentsSubmission}
        >
          Submit
        </button>
        {showSuccess && (
          <span className="text-xl float-right mt-3 font-semibold text-green-500">
            Comment Submitted
          </span>
        )}
      </div>
    </div>
  );
};

export default CommentsForm;
