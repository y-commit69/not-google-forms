import { ReactNode } from "react";
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
          <ul className="ml-auto mr-auto flex w-full max-w-[1280px]">
            {searchDataAsync.map((template) => (
              <Link key={template.id} to={`/forms/${template.id}`}>
                <li className="h-[180px] w-[160px] px-16 lg:px-0">
                  <header className="h-[160px] bg-gray-300"></header>
                  <footer>{template.title}</footer>
                </li>
              </Link>
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

export const NavBar = () => {
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
  return (
    <>
      <section className="ml-auto mr-auto flex w-full max-w-[1280px] flex-col gap-16 px-16 pt-20 lg:px-0">
        <Form role="search">
          <label htmlFor="">
            <input
              type="search"
              name="search"
              className="ml-10px border-0 border-b-2"
              placeholder="Search"
            />
            {props.isLoading && (
              <span className="-ml-[44px]">
                <RefreshCw size={18} className="animate-spin text-gray-400" />
              </span>
            )}
          </label>

          <button type="submit">Search</button>
        </Form>
      </section>
    </>
  );
};

const TemplateGallery = () => {
  return (
    <>
      <section className="ml-auto mr-auto max-w-[1280px] px-16 pb-20 pt-[20px] lg:px-0">
        <header className="pb-10">Start a new form</header>
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
  const templates = useLoaderData() as Template[];

  console.log(templates);
  return (
    <>
      <section className="mb-20 ml-auto mr-auto max-w-[1280px] px-16 lg:px-0">
        <div className="pb-20">
          <header className="pb-10">Recent forms</header>
          <ul className="flex gap-20 overflow-x-auto whitespace-nowrap">
            {templates.map((template) => (
              <Link to={`forms/${template.id}`} key={template.id}>
                <li className="flex h-[180px] w-[160px] flex-col justify-end pb-10">
                  <header className="h-[160px] bg-gray-300"></header>
                  <footer className="flex flex-col">
                    <span>{`${template.title} →`}</span>
                    <span className="text-xs text-gray-500">created at:</span>
                    <span className="text-xs text-gray-500">
                      {formatTime(template.createdAt)}
                    </span>
                  </footer>
                </li>
              </Link>
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
        <TemplateItemStatic text="Blank form →">
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
