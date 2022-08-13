import React, { useState, useEffect } from 'react';
import { getCategories } from '../services';
import Link from 'next/link';
const Categories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  useEffect(() => {
    // getCategories().then((newCategories) => {
    //   setCategories(newCategories);
    // });
    setCategories([{ name: 'test', slug: 'test' }]);
  }, []);
  return (
    <div className="bg-white shadow-lg rounded-lg p-8 mb-8 pb-12 mt-8 ">
      <h3 className="text-xl mb-8 font-semibold border-b pb-4">Categories</h3>
      <div>
        {categories.map((category: any) => {
          return (
            <Link href={`/category/${category.slug}`} key={category.slug}>
              <span className="cursor-pointer block pb-3 mb-3">
                {category.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;
