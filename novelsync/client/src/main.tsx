import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import {
  Root,
  Signin,
  Signup,
  CreateDocument,
  NovelDetail,
  ProtectedEditRoute,
  Edit,
} from "./routes/index";
import { AuthProvider } from "./contexts/AuthContext";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { NavbarWrapper } from "./NavbarWrapper";
import { NovelsProvider } from "./contexts/NovelsContext";

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
        path: "/sign-in",
        element: <Signin />,
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
        path: "/edit/:id",
        element: <Edit />,
      },
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
        <RouterProvider router={router} />
      </NovelsProvider>
    </AuthProvider>
  </React.StrictMode>
);
