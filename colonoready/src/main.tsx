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
import Options from "./routes/Options.tsx";
import Schedule from "./routes/Schedule.tsx";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        path: "options",
        element: <Options />,
      },
    ],
  },
  {
    errorElement: <ErrorPage />,
    path: "options/plenvu",
    element: <Plenvu />,
    children: [
      {
        errorElement: <ErrorPage />,
        path: "schedule",
        element: <Schedule />,
      },
    ],
  },
  {
    errorElement: <ErrorPage />,
    path: "options/miralaxg",
    element: <MiralaxGatorade />,
  },
  {
    errorElement: <ErrorPage />,
    path: "options/sutab",
    element: <Sutab />,
  },
  {
    errorElement: <ErrorPage />,
    path: "options/golytely",
    element: <Golytely />,
  },
  {
    errorElement: <ErrorPage />,
    path: "options/golytelytwodayprep",
    element: <Golytely2DayPrep />,
  },
];

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
