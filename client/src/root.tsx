import { ReactNode } from "react";
import type { LoaderFunction } from "react-router-dom";
import { Link, useLoaderData } from "react-router-dom";
import { CreateNewBlankForm } from "./routes/create-page";
import { API_URL } from "./utils/utils";

type Users = {
  id: number;
  name: string;
  email: string;
};

const getUsers = async (): Promise<{ users: Users[] }> => {
  const res = await fetch(API_URL);
  if (!res.ok) {
    throw new Error("failed to fetch users");
  }
  const users = await res.json();
  console.log(users);
  return users;
};

export const rootLoader: LoaderFunction = async () => {
  const users = await getUsers();
  return users;
};

export const Root = () => {
  const usersData = useLoaderData() as Users[];
  return (
    <>
      <ul>
        {usersData.map((user) => (
          <li key={user.id}>
            <p>{user.name}</p>
            <p>{user.email}</p>
          </li>
        ))}
      </ul>

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
            <Link
              to="/"
              className="gap-10 text-4xl text-purple-400 lg:text-7xl"
            >
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
      <section className="ml-auto mr-auto max-w-[1280px] px-16 pt-[20px]">
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

const RecentForms = () => {
  return (
    <>
      <section className="ml-auto mr-auto max-w-[1280px] px-16">
        <div className="pb-20">Recent forms</div>
      </section>
    </>
  );
};

const TemplateBlankForm = () => {
  return (
    <>
      <Link to="/create">
        <TemplateItem text="Blank form →">
          <div className="h-[200px] w-[200px] bg-slate-300"></div>
        </TemplateItem>
      </Link>
    </>
  );
};
const TemplateContactInfo = () => {
  return (
    <>
      <Link to="/contact-template">
        <TemplateItem text="Contact information →">
          <div className="h-[200px] w-[200px] bg-orange-300"></div>
        </TemplateItem>
      </Link>
    </>
  );
};

const TemplatePartyInvite = () => {
  return (
    <>
      <Link to="/party-template">
        <TemplateItem text="Party invite →">
          <div className="h-[200px] w-[200px] bg-blue-300"></div>
        </TemplateItem>
      </Link>
    </>
  );
};

const TemplateItem = (props: { text: string; children?: ReactNode }) => {
  return (
    <>
      <main className="min-h-[200px] min-w-[200px] pb-20">
        {props.children}
        <p>{props.text}</p>
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
