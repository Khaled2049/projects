import React from 'react';

import Link from 'next/link';

const Navbar = () => {
  return (
    <div className="container mx-auto px-10 mb-8 content-center">
      <div className="border-b  w-full border-blue-400 py-8">
        <Link href="/">
          <div className="text-center">
            <span className="cursor-pointer font-bold text-4xl text-white">
              Suppity Sup
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
