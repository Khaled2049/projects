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
import Plenvu from "./routes/Plenvu.tsx";
import Sutab from "./routes/Sutab.tsx";
import MiralaxGatorade from "./routes/MiralaxGatorade.tsx";
import Golytely from "./routes/Golytely.tsx";
import Golytely2DayPrep from "./routes/GolytelyTwoDay.tsx";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        path: "Plenvu",
        element: <Plenvu />,
      },
      {
        errorElement: <ErrorPage />,
        path: "MiralaxG",
        element: <MiralaxGatorade />,
      },
      {
        errorElement: <ErrorPage />,
        path: "Sutab",
        element: <Sutab />,
      },
      {
        errorElement: <ErrorPage />,
        path: "Golytely",
        element: <Golytely />,
      },
      {
        errorElement: <ErrorPage />,
        path: "GolytelyTwoDayPrep",
        element: <Golytely2DayPrep />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
