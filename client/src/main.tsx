import { createRoot } from "react-dom/client";
import {
  ContactTemplatePage,
  NewFormPage,
  PartyInviteTemplatePage,
  Root,
  rootLoader,
} from "./root.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorPage } from "./error-page.tsx";
import { createNewFormAction } from "./routes/create-page.tsx";

import { RegisterPage, registerUserAction } from "./routes/register-page.tsx";
import { LoginPage, loginUserAction } from "./routes/login-page.tsx";
import { DashboardPage } from "./routes/dashboard-page.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    loader: rootLoader,
    errorElement: <ErrorPage />,
  },
  {
    path: "/create",
    element: <NewFormPage />,
    action: createNewFormAction,
  },
  {
    path: "/contact-template",
    element: <ContactTemplatePage />,
  },
  {
    path: "/party-template",
    element: <PartyInviteTemplatePage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
    action: registerUserAction,
  },
  {
    path: "/login",
    element: <LoginPage />,
    action: loginUserAction,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/logout",
    element: <DashboardPage />,
  },
]);
createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router}></RouterProvider>,
);
