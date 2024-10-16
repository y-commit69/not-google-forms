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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    loader: rootLoader,
  },
  {
    path: "/create",
    element: <NewFormPage />,
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
