import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorPage } from "./error-page.tsx";
import "./index.css";
import { IndexPage, Root, rootLoader } from "./routes/root.tsx";
import {
  CreateFormPage,
  createNewFormAction,
} from "./routes/create-form-page.tsx";
import {
  formItemAction,
  formItemLoader,
  FormItemPage,
} from "./routes/form-item.tsx";

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
        action: formItemAction,
      },
    ],
  },
]);
createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router}></RouterProvider>,
);
