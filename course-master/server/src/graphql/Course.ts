import { extendType, nonNull, objectType, stringArg } from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";

export const Course = objectType({
  name: "Course",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("title");
    t.nonNull.string("url");
    t.nonNull.string("heading");
    t.nonNull.string("body");
  },
});

export const CourseQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("courses", {
      type: "Course",
      resolve(parent, args, context, info) {
        return context.prisma.course.findMany();
      },
    });
  },
});
