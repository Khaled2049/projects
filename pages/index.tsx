// import type { NextPage } from 'next'
import Head from 'next/head'
import { PostCard, PostWidget, Categories } from '../components'
import { getPosts } from '../services'

interface AppProps {
  posts: any
}

type Props = {
  posts: any
}

const Home: React.FC<Props>  = ({ posts }: AppProps): JSX.Element => {
  return (
    <div className="container mx-auto px-10 mb-8">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-12'>
        <div className='lg:col-span-8 col-span-1'>
          {posts.map((post: any, idx: number) => (
            <PostCard post={post.node} key={idx}/>
          ))}
        </div>
        <div className='lg:col-span-4 col-span-1'>
            <div className='lg:sticky relative top-8'>
              <PostWidget categories={posts.categories} slug={posts.slug}/>
              <Categories />
            </div>
        </div>
      </div>
    </div>
  )
}

export async function getStaticProps() {
  const posts = (await getPosts()) || [];
  return {props: {posts}};
}

export default Home
