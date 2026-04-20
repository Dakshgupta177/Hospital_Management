import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  BrowserRouter,
  createBrowserRouter,
  Router,
  RouterProvider,
} from "react-router";
import Doctors from "./components/Doctors.jsx";
import Appointments from "./components/Appointments.jsx";
import Tests from "./components/Tests.jsx";
import Patients from "./components/Patients.jsx";

const router = createBrowserRouter([
  {
    element: <App />,
    path: '/',
    children: [
      {
        index: true,
        element: <Doctors/>
      },
      {
        element: <Patients />,
        path: '/patients'
      },
      {
        element: <Appointments />,
        path: '/appointments'
      },
      {
        element: <Tests />,
        path: '/tests'
      },
    ]
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
