import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const newPost = await prisma.post.create({
    data: {
      body: "Fullstack tutorial for GraphQL",
      title: "www.howtographql.com",
    },
  });

  const allLinks = await prisma.post.findMany();
  console.log(allLinks);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
