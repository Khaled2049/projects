import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  RouteObject,
} from "react-router-dom";

import FormStep1 from "./components/forms/Form1";
import ColonoscopyPrepForm from "./components/forms/ColonoscopyPrepForm.tsx";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "step1",
        element: <FormStep1 />,
      },
      {
        path: "step2",
        element: <ColonoscopyPrepForm />,
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
