import { ReactNode } from "react";
import { json, Link, useLoaderData, useParams } from "react-router-dom";
import { CreateNewBlankForm } from "./routes/create-page";
import { SERVER_URL } from "./utils/utils";

export const rootLoader = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/templates`);
    if (!response.ok) {
      throw new Error("Failed to fetch templates");
    }
    const templates = await response.json();
    return json(templates);
  } catch (error) {
    console.error(error);
  }
};
export const Root = () => {
  return (
    <>
      <NavBar />
      <TemplateGallery />
      <RecentForms />
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
      <ul className="ml-auto mr-auto flex w-full max-w-[1280px] gap-16 px-16 pb-20 pt-20">
        <li className="ml-10px">Search</li>
      </ul>
    </>
  );
};

const TemplateGallery = () => {
  return (
    <>
      <section className="ml-auto mr-auto max-w-[1280px] px-16 pb-20 pt-[20px]">
        <header className="pb-10">Start a new form</header>
        <ul className="flex gap-20 overflow-x-auto whitespace-nowrap">
          <li>
            <TemplateBlankForm />
          </li>
          <li>
            <TemplateContactInfo />
          </li>

          <li>
            <TemplatePartyInvite />
          </li>
        </ul>
      </section>
    </>
  );
};

export type Template = {
  id: number;
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

function formatTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
const RecentForms = () => {
  const data = useLoaderData() as Template[];
  console.log(data);
  return (
    <>
      <section className="mb-20 ml-auto mr-auto max-w-[1280px] px-16">
        <div className="pb-20">
          <header className="pb-10">Recent forms</header>
          <ul>
            {data.map((d) => (
              <Link to={`/forms/${d.id}`} key={d.id}>
                <li className="flex h-[180px] w-[160px] flex-col justify-end pb-10">
                  <header className="h-[160px] bg-gray-300"></header>
                  <footer className="flex flex-col">
                    <span>{d.title}</span>
                    <span className="text-xs text-gray-500">created at:</span>
                    <span className="text-xs text-gray-500">
                      {formatTime(d.createdAt)}
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

export const FormItem = () => {
  const formDataAsync = useLoaderData() as Template[];
  const params = useParams();
  console.log(params);
  return (
    <>
      <div>Form item id: {params.id}</div>
      {formDataAsync.map((data) => (
        <>
          <span>{data.title}</span>
        </>
      ))}
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
const TemplateContactInfo = () => {
  return (
    <>
      <Link to="/contact-template">
        <TemplateItemStatic text="Contact info →">
          <div className="h-[180px] w-[160px] bg-gray-300"></div>
        </TemplateItemStatic>
      </Link>
    </>
  );
};

const TemplatePartyInvite = () => {
  return (
    <>
      <Link to="/party-template">
        <TemplateItemStatic text="Party invite →">
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

export const NewFormPage = () => {
  return (
    <>
      <NavBar />
      <CreateNewBlankForm />
    </>
  );
};

export const ContactTemplatePage = () => {
  return (
    <>
      <NavBar />
      <div>contact template</div>
    </>
  );
};

export const PartyInviteTemplatePage = () => {
  return (
    <>
      <NavBar />
      <div>party invite template</div>
    </>
  );
};
