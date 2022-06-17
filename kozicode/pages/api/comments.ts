import type { NextApiRequest, NextApiResponse } from 'next'
import { GraphQLClient, gql } from 'graphql-request'


type Data = {
  name: string
}

const graphqlApi = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {  
  const graphlQLClient = new GraphQLClient(String(graphqlApi), {
    headers: {
      authorization: `Bearer ${process.env.GRAPHCMS_TOKEN}`
    }
  })

  const query = gql`
    mutation CreateComment($name: String!, $email: String!, $comment: String!, $slug: String!) {
      createComment(data: { name: $name, email: $email, comment: $comment, post: { connect: {slug: $slug }}}) { id }
    }
  `
  try {
    const result = await graphlQLClient.request(query, req.body);
    console.log(result);
    return res.status(200).send(result); 
  } catch(err) {
    console.log('Error', err);
    return err;
  }

}
