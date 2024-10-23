import { ActionFunctionArgs, redirect, useFetcher } from "react-router-dom";
import { SERVER_URL } from "../utils/utils";

export async function createNewFormAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  for (var [key, value] of formData.entries()) {
    console.log(key, value);
  }
  try {
    const response = await fetch(`${SERVER_URL}/create`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Failed to create form");
    }
    return redirect("/");
  } catch (error) {
    console.error("Error creating form:", error);
    return { error: "Failed to create form. Please try again." };
  }
}
export const CreateNewBlankForm = () => {
  const fetcher = useFetcher();
  return (
    <section className="ml-auto mr-auto w-full max-w-[1280px] px-16 pb-[40px] pt-[40px]">
      <header>
        <p className="pb-10">Create a new form</p>
        <fetcher.Form
          method="post"
          action="/create"
          encType="multipart/form-data"
        >
          <fieldset>
            <input type="text" name="title" placeholder="Title" required />
            <input type="text" name="description" placeholder="Description" />
          </fieldset>

          <select name="" id="" className="mb-10">
            <option value="multipleChoice">Multiple choice</option>
            <option value="checkboxes">Checkboxes</option>
          </select>
          <fieldset>
            <input type="file" name="image" />
          </fieldset>

          <fieldset>
            <input
              type="text"
              name="untitledQuestion"
              placeholder="Untitled Question"
            />
            <div className="flex flex-col gap-10 pb-10">
              <label htmlFor="option1" className="flex items-center gap-6">
                <input
                  type="radio"
                  name="radio"
                  id="option1"
                  className="mb-[unset] w-[unset] gap-10"
                />
                <p>Option 1</p>
              </label>

              <label htmlFor="option2" className="flex items-center gap-6">
                <input
                  type="radio"
                  name="radio"
                  id="option2"
                  className="mb-[unset] w-[unset] gap-10"
                />
                <p> Option 2</p>
              </label>
            </div>
          </fieldset>

          <button type="submit">Create</button>
        </fetcher.Form>
      </header>
      <main></main>
    </section>
  );
};
