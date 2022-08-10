import React from 'react';
import Link from 'next/link';

const home = () => {
  return (
    <header className="h-[88vh] w-full bg-gradient-to-r from-indigo-600 to-emerald-100 bg-cover bg-center flex justify-center items-center">
      <div className="flex flex-col justify-center items-center">
        <h1 className=" text-center text-5xl text-white font-bold drop-shadow-lg">
          WELCOME TO KOZICODE
        </h1>
        <p className="mt-5 text-center text-lg text-white opacity-70">
          This webiste is about programming and other stuff.
        </p>
        <Link href={`/allPosts`}>
          <span className="cursor-pointer text-sky-50 bg-emerald-600 inline-block rounded-full px-4 py-2 mt-3">
            All Posts
          </span>
        </Link>
      </div>
    </header>
  );
};

export default home;
