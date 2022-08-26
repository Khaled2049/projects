import type { NextPage } from 'next';
import Post from '../components/Post';
import { getData } from '../services';
import Categories from '../components/Categories';
interface HomeProps {
  posts: IPost[];
}

const Home = (props: HomeProps) => {
  return (
    <div className="container mx-auto px-10 mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 col-span-1">
          <Post posts={props.posts} />
        </div>
        <div className="lg:col-span-4 col-span-1">
          <div className="lg:sticky relative">
            <Categories />
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps = async () => {
  // const posts = (await getData()) || [];
  const posts = [
    {
      id: 'cl5zeifh2593b0dk1i23f3xci',
      author: { name: 'Khaled Hossain', id: 'cl5zeg848e7aa0bj0gfqas2zl' },
      content: {
        text: "Lorem Ipsum\\n is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      },
      coverImage: null,
      title: 'Test Blog',
      slug: 'test',
      excerpt: 'This is a test.',
    },
    {
      id: 'cl5zeifh2593b0dk1i23f3xci',
      author: { name: 'Khaled Hossain', id: 'cl5zeg848e7aa0bj0gfqas2zl' },
      content: {
        text: "Lorem Ipsum\\n is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      },
      coverImage: null,
      title: 'Test Blog',
      slug: 'test',
      excerpt: 'This is a test.',
    },
  ];
  return {
    props: {
      posts,
    },
  };
};

export default Home;
