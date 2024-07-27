import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import {
  Root,
  Signin,
  Signup,
  ProtectedRoute,
  CreateDocument,
  NovelDetail,
  ProtectedEditRoute,
  Edit,
} from "./routes/index";
import { AuthProvider } from "./contexts/AuthContext";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Root />
      </ProtectedRoute>
    ),
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
    element: (
      <ProtectedEditRoute>
        <Edit />
      </ProtectedEditRoute>
    ),
  },
  {
    path: "/novel/:id",
    element: <NovelDetail />, // Add the route for the novel detail
  },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
