import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import {
  Root,
  Signin,
  Signup,
  CreateDocument,
  NovelDetail,
  // Edit,
} from "./routes/index";
import { AuthProvider } from "./contexts/AuthContext";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { NavbarWrapper } from "./NavbarWrapper";
import { NovelsProvider } from "./contexts/NovelsContext";
import BookClub from "./routes/BookClub";
import UserStories from "./routes/UserStories";
import { AIProvider } from "./contexts/AIContext";
import { EditorProvider } from "./contexts/EditorContext";
import { DraftEditor } from "./routes/DraftEditor";

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
        path: "/clubs",
        element: <BookClub />,
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
        element: <CreateDocument />,
      },
      {
        path: "/user-stories",
        element: <UserStories />,
      },
      // {
      //   path: "/edit/:id",
      //   element: <Edit />,
      // },
      {
        path: "/novel/:id",
        element: <NovelDetail />, // Add the route for the novel detail
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <NovelsProvider>
        <AIProvider>
          <EditorProvider>
            <RouterProvider router={router} />
          </EditorProvider>
        </AIProvider>
      </NovelsProvider>
    </AuthProvider>
  </React.StrictMode>
);
