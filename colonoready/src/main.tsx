import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  RouteObject,
} from "react-router-dom";
import ErrorPage from "./error-page.tsx";

import Root from "./routes/Root.tsx";
import GatoradeMiralax from "./routes/gatorade-miralax.tsx";
import Trilyte from "./routes/trilyte.tsx";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/trilyte",
    element: <Trilyte />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/gatorade-miralax",
    element: <GatoradeMiralax />,
    errorElement: <ErrorPage />,
  },
];

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
