import React from 'react';

import Link from 'next/link';

const Navbar = () => {
  return (
    <div className="h-[4rem] py-4 flex justify-center items-center bg-blue-900 w-full content-center">
      <Link href="/">
        <div className="text-center text-sky-100">
          <span className="cursor-pointer font-bold text-4xl">Suppity Sup</span>
        </div>
      </Link>
    </div>
  );
};

export default Navbar;
