import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorPage } from "./error-page.tsx";
import "./index.css";
import {
  ContactTemplatePage,
  IndexPage,
  PartyInviteTemplatePage,
  Root,
  rootLoader,
} from "./root.tsx";
import {
  createNewFormAction,
  CreateFormPage,
} from "./routes/create-form-page.tsx";
import { formItemLoader, FormItemPage } from "./routes/form-item.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        loader: rootLoader,

        element: <IndexPage />,
      },
      {
        path: "create",
        element: <CreateFormPage />,
        action: createNewFormAction,
      },
      {
        path: "forms/:id",
        element: <FormItemPage />,
        loader: formItemLoader,
      },
      {
        path: "forms/contact-template",
        element: <ContactTemplatePage />,
      },
      {
        path: "forms/party-template",
        element: <PartyInviteTemplatePage />,
      },
    ],
  },
]);
createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router}></RouterProvider>,
);
