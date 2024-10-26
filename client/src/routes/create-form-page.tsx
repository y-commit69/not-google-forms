import { useState } from "react";
import {
  ActionFunctionArgs,
  json,
  redirect,
  useFetcher,
} from "react-router-dom";
import { SERVER_URL } from "../utils/utils";

type actionErrors = {
  title?: string;
  description?: string;
  questionText?: string;
  options?: string;
};
export async function createNewFormAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const title = formData.get("title");
  const description = formData.get("description");
  const questionText = formData.get("questionText");
  const questionType = formData.get("questionType");

  let option1;
  let option2;

  if (questionType === "multipleChoice") {
    option1 = formData.get("multipleChoice[0].text");
    option2 = formData.get("multipleChoice[1].text");
  } else if (questionType === "checkboxes") {
    option1 = formData.get("checkboxes[0].text");
    option2 = formData.get("checkboxes[1].text");
  }
  const errors: actionErrors = {};
  if (!title) {
    errors.title = "Title cannot be empty";
  }
  if (!description) {
    errors.description = "Description cannot be empty";
  }
  if (!questionText) {
    errors.questionText = "Question cannot be empty";
  }
  if (!option1 && !option2) {
    errors.options = "Options cannot be empty";
  }
  // return data if we have errors
  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }

  for (var [key, value] of formData.entries()) {
    console.log(key, value);
  }
  try {
    const response = await fetch(`${SERVER_URL}/create`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      return json({ error: "failed to create form" });
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
    <section className="ml-auto mr-auto w-full max-w-[1280px] px-16 pb-[50px] pt-[40px] lg:px-0">
      <header>
        <p className="pb-10">Create a new form</p>
        {fetcher.data?.error && (
          <div className="mb-4 ml-auto mr-auto flex w-full max-w-[1280px] rounded-md border border-red-200 bg-red-50 p-4">
            <p className="text-red-600">{fetcher.data.error}</p>
          </div>
        )}
        <fetcher.Form method="post" encType="multipart/form-data">
          <label className="flex flex-col">
            <input type="text" name="title" placeholder="Title" />
            {fetcher.data?.errors && (
              <span className="w-max rounded-md border border-red-200 bg-red-50 p-4">
                <span className="text-red-600">
                  {fetcher.data.errors.title}
                </span>
              </span>
            )}
          </label>
          <label className="flex flex-col pb-10">
            <input type="text" name="description" placeholder="Description" />
            {fetcher.data?.errors && (
              <span className="w-max rounded-md border border-red-200 bg-red-50 p-4">
                <span className="text-red-600">
                  {fetcher.data.errors.description}
                </span>
              </span>
            )}
          </label>

          <label className="flex flex-col pb-10">
            <input type="file" name="image" multiple disabled />
            <small id="fileHelpText" className="text-gray-400">
              Accepted formats: JPG, PNG, up to 2MB.
            </small>
          </label>

          <label className="flex flex-col pb-10">
            <input
              type="text"
              name="questionText"
              placeholder="Untitled Question"
              className="text-green-500"
            />
            {fetcher.data?.errors && (
              <span className="w-max rounded-md border border-red-200 bg-red-50 p-4">
                <span className="text-red-600">
                  {fetcher.data.errors.questionText}
                </span>
              </span>
            )}
          </label>

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
                <label className="flex flex-row items-center gap-6">
                  <input
                    type="radio"
                    name="selectedOption"
                    disabled
                    className="mb-[unset] w-[unset] gap-10"
                  />
                  <input
                    type="text"
                    name="multipleChoice[0].text"
                    placeholder="Option 1"
                    className="mb-0 max-w-[300px]"
                  />
                </label>

                <label className="flex flex-row items-center gap-6">
                  <input
                    type="radio"
                    name="selectedOption"
                    disabled
                    className="mb-[unset] w-[unset] gap-10"
                  />
                  <input
                    type="text"
                    name="multipleChoice[1].text"
                    placeholder="Option 2"
                    className="mb-0 max-w-[300px]"
                  />
                </label>
              </>
            )}
            {inputType === "checkboxes" && (
              <>
                <label className="flex items-center gap-6">
                  <input
                    type="checkbox"
                    name="checkboxes[0].checked"
                    value="false"
                    disabled
                    id="option1"
                    className="mb-[unset] w-[unset] gap-10"
                  />
                  <input
                    type="text"
                    name="checkboxes[0].text"
                    placeholder="Option 1"
                    className="mb-0 max-w-[300px]"
                  />
                </label>

                <label className="flex items-center gap-6">
                  <input
                    type="checkbox"
                    name="checkboxes[1].checked"
                    value="false"
                    disabled
                    id="option2"
                    className="mb-[unset] w-[unset] gap-10"
                  />
                  <input
                    type="text"
                    name="checkboxes[1].text"
                    placeholder="Option 2"
                    className="mb-0 max-w-[300px]"
                  />
                </label>
              </>
            )}
            {fetcher.data?.errors && (
              <span className="w-max rounded-md border border-red-200 bg-red-50 p-4">
                <span className="text-red-600">
                  {fetcher.data.errors.options}
                </span>
              </span>
            )}
          </div>

          <button type="submit">Create</button>
        </fetcher.Form>
      </header>
    </section>
  );
};
