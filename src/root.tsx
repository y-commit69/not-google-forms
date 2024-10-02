export const Root = () => {
  return (
    <>
      <NavBar />
      <TemplateGalley/>
      <RecentForms/>
    </>
  );
};

const NavBar = () => {
  return (
    <>
      <nav className="pt-20  bg-slate-300">
        <ul className="flex justify-between ">
          <li className="text-xl text-purple-400"><a href="/">Not Google Forms</a></li>
          <li className="">Account</li>
        </ul>
      </nav>
    </>
  );
};

const TemplateGalley = ()=> {
  return (
    <>
    <section className="bg-gray-200 pt-10">
      <header className="pb-10">Start a new form</header>
      <ul className="flex gap-20">
        <li className="bg-green-200 min-h-[150px] min-w-[150px]">
          Blank form
        </li>
        <li className="bg-green-300 min-h-[150px] min-w-[150px]">
          Contact Information
        </li>
        <li className="bg-green-400 min-h-[150px] min-w-[150px]">
          RSVP
        </li>
        <li className="bg-green-500 min-h-[150px] min-w-[150px]">
          Party Invite
        </li>
        <li className="bg-green-600 min-h-[150px] min-w-[150px]">
          T-Shirt Sign up
        </li>
      </ul>
    </section>
    </>
  )
}

const RecentForms = ()=> {
  return (
    <>
    <div>Recent</div>
    </>
  )
}