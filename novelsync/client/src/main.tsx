import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import {
  Root,
  Signin,
  Signup,
  CreateStory,
  StoryDetail,
  BookClubs,
  Community,
  DraftEditor,
  UserStories,
  AllStories,
  BookClubDetails,
  Library,
  BookDetails,
} from "./routes/index";
import { AuthProvider } from "./contexts/AuthContext";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { NavbarWrapper } from "./NavbarWrapper";

import { AIProvider } from "./contexts/AIContext";
import { EditorProvider } from "./contexts/EditorContext";
import { BookClubProvider } from "./contexts/BookClubContext";

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
        path: "/community",
        element: <Community />,
      },
      {
        path: "/sign-in",
        element: <Signin />,
      },
      {
        path: "/draft",
        element: <DraftEditor />,
      },
      {
        path: "/sign-up",
        element: <Signup />,
      },
      {
        path: "/create",
        element: <CreateStory />,
      },
      {
        path: "/user-stories",
        element: <UserStories />,
      },
      {
        path: "/novel/:id",
        element: <StoryDetail />, // Add the route for the novel detail
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <AIProvider>
        <BookClubProvider>
          <EditorProvider>
            <RouterProvider router={router} />
          </EditorProvider>
        </BookClubProvider>
      </AIProvider>
    </AuthProvider>
  </React.StrictMode>
);
