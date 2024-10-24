import { ActionFunctionArgs, redirect, useFetcher } from "react-router-dom";
import { SERVER_URL } from "../utils/utils";
import { useState } from "react";

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

export const CreateFormPage = () => {
  return (
    <>
      <CreateNewBlankForm />
    </>
  );
};
const CreateNewBlankForm = () => {
  const [inputType, setInputType] = useState("multipleChoice");
  const fetcher = useFetcher();
  return (
    <section className="ml-auto mr-auto w-full max-w-[1280px] px-16 pb-[40px] pt-[40px] lg:px-0">
      <header>
        <p className="pb-10">Create a new form</p>
        {fetcher.data?.error && (
          <div className="mb-4 ml-auto mr-auto flex w-full max-w-[1280px] rounded-md border border-red-200 bg-red-50 p-4">
            <p className="text-red-600">{fetcher.data.error}</p>
          </div>
        )}
        <fetcher.Form
          method="post"
          action="/create"
          encType="multipart/form-data"
        >
          <fieldset>
            <input type="text" name="title" placeholder="Title" required />
            <input type="text" name="description" placeholder="Description" />
          </fieldset>
          <fieldset className="mb-20">
            <input type="file" name="image" multiple />
            <small id="fileHelpText" className="text-gray-400">
              Accepted formats: JPG, PNG, up to 5MB.
            </small>
          </fieldset>

          <fieldset>
            <input
              type="text"
              name="untitledQuestion"
              placeholder="Untitled Question"
              className="text-green-500"
            />
            <select
              name="questionType"
              id=""
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setInputType(e.target.value);
              }}
              className="mb-10"
            >
              <option value="multipleChoice">Multiple choice</option>
              <option value="checkboxes">Checkboxes</option>
            </select>
            <div className="flex flex-col gap-10 pb-20">
              {inputType === "multipleChoice" && (
                <>
                  <fieldset className="flex flex-row items-center gap-6">
                    <input
                      type="checkbox"
                      name="multipleChoiceCheckbox1"
                      value="false"
                      disabled
                      className="mb-[unset] w-[unset] gap-10"
                    />
                    <input
                      type="text"
                      name="multipleChoiceOption1"
                      placeholder="Option 1"
                      className="mb-0 max-w-[300px]"
                    />
                  </fieldset>

                  <fieldset className="flex flex-row items-center gap-6">
                    <input
                      type="checkbox"
                      name="multipleChoiceCheckbox2"
                      value="false"
                      disabled
                      className="mb-[unset] w-[unset] gap-10"
                    />
                    <input
                      type="text"
                      name="multipleChoiceOption2"
                      placeholder="Option 2"
                      className="mb-0 max-w-[300px]"
                    />
                  </fieldset>
                </>
              )}
              {inputType === "checkboxes" && (
                <>
                  <fieldset className="flex flex-row items-center gap-6">
                    <input
                      type="radio"
                      name="checkboxRadio1"
                      value="false"
                      disabled
                      id="option1"
                      className="mb-[unset] w-[unset] gap-10"
                    />
                    <input
                      type="text"
                      name="checkboxOption1"
                      placeholder="Option 1"
                      className="mb-0 max-w-[300px]"
                    />
                  </fieldset>

                  <fieldset className="flex flex-row items-center gap-6">
                    <input
                      type="radio"
                      name="checkboxRadio2"
                      value="false"
                      disabled
                      id="option2"
                      className="mb-[unset] w-[unset] gap-10"
                    />
                    <input
                      type="text"
                      name="multipleChoiceOption2"
                      placeholder="Option 2"
                      className="mb-0 max-w-[300px]"
                    />
                  </fieldset>
                </>
              )}
            </div>
          </fieldset>

          <button type="submit">Create</button>
        </fetcher.Form>
      </header>
    </section>
  );
};
