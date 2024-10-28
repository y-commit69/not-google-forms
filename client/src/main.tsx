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
import { initReactI18next } from "react-i18next";
import i18next from "i18next";

i18next.use(initReactI18next).init({
  debug: true,
  // fallbackLng: "en",
  lng: localStorage.getItem("language") || "en",
  resources: {
    en: {
      translation: {
        search: "Search",
        startANewForm: "Start a new form",
        blankForm: "Blank form",
        recentForms: "Recent forms",
        createANewForm: "Create a new form",
        title: "Title",
        description: "Desacription",
        untitledQuestion: "Untitled question",
        multipleChoice: "Multiple Choice",
        checkboxes: "Checkboxes",
        option: "Option",
        create: "Create",
        acceptedFormatsP: "Accepted formats: JPG, PNG, up to 2MB.",
        createdAt: "created at",
        submit: "Submit",
        delete: "Delete",
      },
    },
    uz: {
      translation: {
        search: "Qidiruv",
        startANewForm: "Yangi formni boshlang",
        blankForm: `Bo'sh form`,
        recentForms: `So'nggi formlar`,
        createANewForm: "Yangi formni yarating",
        title: "Sarlavha",
        description: "Tavsif",
        untitledQuestion: "Nomsiz savol",

        multipleChoice: "Bir nechta tanlov",
        checkboxes: "Katakchalar",
        option: "Variant",
        create: "Yaratish",
        acceptedFormatsP: "Qabul qilingan formatlar: JPG, PNG, 2MB gacha.",
        createdAt: "yaratilgan",
        submit: "Topshirish",
        delete: `O'chirish`,
      },
    },
  },
});

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
