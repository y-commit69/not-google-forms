import { createRoot } from "react-dom/client";
import {
  ContactTemplatePage,
  NewFormPage,
  PartyInviteTemplatePage,
  Root,
} from "./root.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorPage } from "./error-page.tsx";
import { createNewFormAction } from "./routes/create-page.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,

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
]);
createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router}></RouterProvider>,
);
