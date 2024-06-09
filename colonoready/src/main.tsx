import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  RouteObject,
} from "react-router-dom";

import HomePage from "./components/HomePage.tsx";
import FormStep1 from "./components/forms/Form1";
import ColonoscopyPrepForm from "./components/forms/ColonoscopyPrepForm.tsx";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/form",
    element: <App />,
    children: [
      { path: "step1", element: <ColonoscopyPrepForm /> },
      { path: "step2", element: <FormStep1 /> },
    ],
  },
  // Add more steps if needed
  // { path: "*", element: <Navigate to="/" replace /> },
];

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
