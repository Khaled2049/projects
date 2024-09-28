import "./index.css";
import ReactDOM from "react-dom/client";
import {
  Root,
  Signin,
  Signup,
  Story,
  StoryDetail,
  BookClubs,
  Home,
  UserStories,
  AllStories,
  BookClubDetails,
  Library,
  BookDetails,
  Characters,
  Plot,
  Places,
  CreateStory,
  Dashboard,
} from "./routes/index";
import { AuthProvider } from "./contexts/AuthContext";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { NavbarWrapper } from "./NavbarWrapper";

import { AIProvider } from "./contexts/AIContext";
import { EditorProvider } from "./contexts/EditorContext";
import { BookClubProvider } from "./contexts/BookClubContext";
import { PostsProvider } from "./contexts/PostsContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavbarWrapper />,
    children: [
      {
        path: "/",
        element: <Root />,
      },
      {
        path: "/stories",
        element: <AllStories />,
      },
      {
        path: "/library",
        element: <Library />,
      },
      {
        path: "/library/book/:id",
        element: <BookDetails />,
      },
      {
        path: "/book-clubs",
        element: <BookClubs />, // This will be the main component for the book clubs
      },
      {
        path: "/book-clubs/:id",
        element: <BookClubDetails />, // This will be the main component for the book clubs
      },
      {
        path: "/Home",
        element: <Home />,
      },
      {
        path: "/sign-in",
        element: <Signin />,
      },
      {
        path: "/sign-up",
        element: <Signup />,
      },
      {
        path: "/create/:storyId",
        element: <Story />,
        children: [
          { index: true, element: <CreateStory /> },
          { path: "dashboard", element: <Dashboard /> },
          { path: "characters", element: <Characters /> },
          { path: "plot", element: <Plot /> },
          { path: "places", element: <Places /> },
        ],
      },
      {
        path: "/user-stories",
        element: <UserStories />,
      },
      {
        path: "/story/:id",
        element: <StoryDetail />, // Add the route for the novel detail
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <AIProvider>
      <PostsProvider>
        <BookClubProvider>
          <EditorProvider>
            <RouterProvider router={router} />
          </EditorProvider>
        </BookClubProvider>
      </PostsProvider>
    </AIProvider>
  </AuthProvider>
);
