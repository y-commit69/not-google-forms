import {
  ActionFunctionArgs,
  json,
  redirect,
  useFetcher,
  useLoaderData,
  useParams,
} from "react-router-dom";
import type { Template } from "./root";
import { SERVER_URL } from "../utils/utils";

export const formItemLoader = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/templates`);
    if (!response.ok) {
      return json({ error: "Failed to fetch templates" });
    }
    const templates = await response.json();
    return json(templates);
  } catch (error) {
    console.error(error);
  }
};

export const formItemAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  let intent = formData.get("intent");
  const formId = formData.get("formId");

  if (intent === "delete") {
    try {
      const response = await fetch(`${SERVER_URL}/forms/${formId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        return json({ error: "failed to delete form" });
      }
      return redirect("/");
    } catch (error) {
      console.error(error);
      return json({ error: "failed to delete form" });
    }
  }
};

export const FormItemPage = () => {
  const formDataAsync = useLoaderData() as Template[];
  const params = useParams();
  console.log(params);
  const fetcher = useFetcher();
  console.log("formdata asnyc", formDataAsync);
  formDataAsync.map((data) => console.log("questions", data.questions));
  const currentForm = formDataAsync.find((form) => form.id === params.id);
  if (!currentForm) {
    return (
      <div className="ml-auto mr-auto w-full max-w-[1280px] px-16 pb-[40px] pt-[40px] lg:px-0">
        <p className="text-red-600">Form not found</p>
      </div>
    );
  }

  return (
    <>
      <section className="ml-auto mr-auto w-full max-w-[1280px] px-16 pb-[40px] pt-[40px] lg:px-0">
        <header>
          {fetcher.data?.error && (
            <div className="mb-4 ml-auto mr-auto flex w-full max-w-[1280px] rounded-md border border-red-200 bg-red-50 p-4">
              <p className="text-red-600">{fetcher.data.error}</p>
            </div>
          )}
          <p className="pb-20">{currentForm.title}</p>

          <fetcher.Form method="post" encType="multipart/form-data">
            {currentForm.questions.map((question) => (
              <fieldset key={question.id}>
                <input
                  type="text"
                  name="questionText"
                  placeholder="Untitled Question"
                  className="border-0-class min-w-full text-green-500"
                  defaultValue={question.text}
                />

                <div className="flex flex-col gap-10 pb-20">
                  {question.type === "multipleChoice" && (
                    <>
                      <fieldset className="flex flex-row items-center gap-6">
                        <input
                          type="radio"
                          name="selectedOption"
                          className="mb-[unset] w-[unset] gap-10"
                          defaultValue={question.option1Checked.toString()}
                        />
                        <input
                          type="text"
                          name="multipleChoice[0].text"
                          placeholder="Option 1"
                          className="border-0-class mb-0"
                          defaultValue={question.option1}
                          disabled
                        />
                      </fieldset>

                      <fieldset className="flex flex-row items-center gap-6">
                        <input
                          type="radio"
                          name="selectedOption"
                          className="mb-[unset] w-[unset] gap-10"
                          defaultValue={question.option2Checked.toString()}
                        />
                        <input
                          type="text"
                          name="multipleChoice[1].text"
                          placeholder="Option 2"
                          className="border-0-class mb-0"
                          defaultValue={question.option2}
                          disabled
                        />
                      </fieldset>
                    </>
                  )}
                  {question.type === "checkboxes" && (
                    <>
                      <fieldset className="flex flex-row items-center gap-6">
                        <input
                          type="checkbox"
                          name="checkboxes[0].checked"
                          defaultValue={question.option1Checked.toString()}
                          className="mb-[unset] w-[unset] gap-10"
                        />
                        <input
                          type="text"
                          name="checkboxes[0].text"
                          placeholder="Option 1"
                          className="border-0-class mb-0"
                          defaultValue={question.option1}
                          disabled
                        />
                      </fieldset>

                      <fieldset className="flex flex-row items-center gap-6">
                        <input
                          type="checkbox"
                          name="checkboxes[1].checked"
                          defaultValue={question.option2Checked.toString()}
                          className="mb-[unset] w-[unset] gap-10"
                        />
                        <input
                          type="text"
                          name="checkboxes[1].text"
                          placeholder="Option 2"
                          className="border-0-class mb-0"
                          defaultValue={question.option2}
                          disabled
                        />
                      </fieldset>
                    </>
                  )}
                </div>
              </fieldset>
            ))}

            <input type="hidden" name="formId" value={params.id} />
            <footer className="flex gap-10">
              <button
                className="max-w-[140px]"
                type="submit"
                name="intent"
                value="submit"
              >
                Submit
              </button>
              <button
                className="max-w-[140px] border-red-500 text-red-500"
                type="submit"
                name="intent"
                value="delete"
              >
                Delete
              </button>
            </footer>
          </fetcher.Form>
        </header>
        <main></main>
      </section>
    </>
  );
};
