import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) {
          throw new Error("No credentials provided.");
        }

        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        // const { email, password } = await signInSchema.parseAsync(credentials)
        // Simulate hashing password
        // const pwHash = saltAndHashPassword(password);

        // Fetch user from the database using credentials
        const user = await getUserFromDb(email, password);

        if (user) {
          // Any user object returned here will be saved in the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error if you need to, for example if you detect invalid credentials.
          // throw new Error("Invalid credentials.");
        }
      },
    }),
  ],
});

const getUserFromDb = async (email: string, password: string) => {
  // Replace with your own logic to fetch user from the database
  return {
    id: "1", // id should be a string
    name: "John Doe",
    email: email,
  };
};
