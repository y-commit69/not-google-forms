import { ReactNode, useState } from "react";
import {
  Form,
  json,
  Link,
  LoaderFunctionArgs,
  useLoaderData,
  ScrollRestoration,
  Outlet,
  useSearchParams,
  useNavigation,
} from "react-router-dom";
import { formatTime, HTTP_STATUS, SERVER_URL } from "../utils/utils";
import { RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { t } from "i18next";

export const rootLoader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const searchQuery = url.searchParams.get("search");
  console.log(searchQuery);
  try {
    if (searchQuery !== null) {
      const response = await fetch(
        `${SERVER_URL}/search?search=${encodeURIComponent(searchQuery)}`,
      );

      if (!response.ok) {
        return json({ error: `search failed: ${response.statusText}` });
      }

      const searchResults = await response.json();
      return json(searchResults);
    }
    const response = await fetch(`${SERVER_URL}/templates`);
    console.log("res: ", response);
    if (!response.ok) {
      return json(
        { error: "failed to fetch templates" },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR },
      );
    }
    const templates = await response.json();
    console.log("remplae", templates);
    return json(templates);
  } catch (error) {
    console.error(error);
    return json(
      { error: "failed to fetch templates" },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR },
    );
  }
};

export const Root = () => {
  return (
    <>
      <NavBar />
      <ScrollRestoration />
      <div id="outler">
        <Outlet />
      </div>
      <LanguageSwitcher />
    </>
  );
};

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || " en",
  );

  return (
    <>
      <footer className="ml-auto mr-auto flex w-full max-w-[1280px] gap-10 px-16 pb-[50px] lg:px-0">
        <select
          name="languageSwitcher"
          value={language}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            const selectedLang = e.target.value;
            setLanguage(selectedLang);
            localStorage.setItem("language", selectedLang);
            i18n.changeLanguage(selectedLang);
          }}
        >
          <option value="en">English</option>
          <option value="uz">Uzbek</option>
        </select>
      </footer>
    </>
  );
};

export const IndexPage = () => {
  const searchDataAsync = useLoaderData() as Template[];
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");
  console.log("searchdata", searchDataAsync);
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  return (
    <>
      <section className="mb-20">
        <Search isLoading={isLoading} />
        {searchQuery && searchDataAsync ? (
          <ul className="ml-auto mr-auto flex w-full max-w-[1280px] gap-10">
            {searchDataAsync.map((template) => (
              <li
                key={template.id}
                className="flex h-[180px] w-[160px] px-16 lg:px-0"
              >
                <Link to={`/forms/${template.id}`}>
                  <header className="h-[120px] w-[160px] bg-gray-300"></header>
                  <footer>{template.title}</footer>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <>
            <TemplateGallery />
            <RecentForms />
          </>
        )}
      </section>
    </>
  );
};

const NavBar = () => {
  return (
    <>
      <nav className="p3-pink-color flex h-[280px] px-16 pt-20 text-white">
        <div className="ml-auto mr-auto flex w-full max-w-[1280px] flex-col justify-end">
          <div className="pb-[40px]">
            <Link to="/" className="p3-neon-color gap-10 text-4xl lg:text-7xl">
              not google forms
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

const Search = (props: { isLoading?: boolean }) => {
  const { t, i18n } = useTranslation();
  console.log(t, i18n);
  return (
    <>
      <section className="ml-auto mr-auto flex w-full max-w-[1280px] flex-col gap-16 px-16 pt-20 lg:px-0">
        <Form role="search">
          <label htmlFor="">
            <input
              type="search"
              name="search"
              className="ml-10px border-0 border-b-2"
              placeholder={t("search")}
            />
            {props.isLoading && (
              <span className="-ml-[44px]">
                <RefreshCw size={18} className="animate-spin text-gray-400" />
              </span>
            )}
          </label>

          <button type="submit">{t("search")}</button>
        </Form>
      </section>
    </>
  );
};

const TemplateGallery = () => {
  const { t } = useTranslation();
  return (
    <>
      <section className="ml-auto mr-auto max-w-[1280px] px-16 pb-20 pt-[20px] lg:px-0">
        <header className="pb-10">{t("startANewForm")}</header>
        <ul className="flex gap-20 overflow-x-auto whitespace-nowrap">
          <li>
            <TemplateBlankForm />
          </li>
        </ul>
      </section>
    </>
  );
};

export type Template = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  questions: {
    id: number;
    type: "multipleChoice" | "checkboxes";
    text: string;
    templateId: string;
    order: number;
    option1: string;
    option2: string;
    option1Checked: boolean;
    option2Checked: boolean;
  }[];
};

const RecentForms = () => {
  const { t } = useTranslation();
  const formsDataAsync = useLoaderData() as Template[];
  console.log(formsDataAsync);
  return (
    <>
      <section className="mb-[50px] ml-auto mr-auto max-w-[1280px] px-16 lg:px-0">
        <div className="pb-20">
          <header className="pb-10">{t("recentForms")}</header>
          <ul className="flex gap-20 overflow-x-auto whitespace-nowrap">
            {formsDataAsync.map((form) => (
              <li
                key={form.id}
                className="flex h-[180px] w-[160px] flex-col justify-end pb-10"
              >
                <Link to={`forms/${form.id}`}>
                  <header className="h-[160px] bg-orange-200"></header>
                  <footer className="flex flex-col">
                    <span>{`${form.title} →`}</span>
                    <span className="text-xs text-gray-400">
                      {t("createdAt")}:
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatTime(form.createdAt)}
                    </span>
                  </footer>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
};

const TemplateBlankForm = () => {
  return (
    <>
      <Link to="/create">
        <TemplateItemStatic text={`${t("blankForm")} →`}>
          <div className="h-[180px] w-[160px] bg-gray-300"></div>
        </TemplateItemStatic>
      </Link>
    </>
  );
};

const TemplateItemStatic = (props: { text: string; children?: ReactNode }) => {
  return (
    <>
      <main className="min-h-[180px] w-[160px] pb-20">
        {props.children}
        <p className="">{props.text}</p>
      </main>
    </>
  );
};
