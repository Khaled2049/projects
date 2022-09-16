import { extendType, nonNull, objectType, stringArg } from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";

export const Post = objectType({
  name: "Post",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("title");
    t.nonNull.string("body");
  },
});

export const PostQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("posts", {
      type: "Post",
      resolve(parent, args, context, info) {
        return context.prisma.post.findMany();
      },
    });
  },
});

export const PostMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createPost", {
      type: "Post",
      args: {
        body: nonNull(stringArg()),
        title: nonNull(stringArg()),
      },

      resolve(parent, args, context) {
        const newPost = context.prisma.post.create({
          data: {
            body: args.body,
            title: args.title,
          },
        });
        return newPost;
      },
    });
  },
});
