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
          <span className="block pb-10">{currentForm.title}</span>

          <fetcher.Form method="post" encType="multipart/form-data">
            {currentForm.questions.map((question) => (
              <header key={question.id}>
                <span className="border-0-class block min-w-full pb-10 text-green-500">
                  {question.text}
                </span>

                <div className="flex flex-col gap-8 pb-20">
                  {question.type === "multipleChoice" && (
                    <>
                      <label className="flex w-full items-center gap-6">
                        <input
                          type="radio"
                          name="selectedOption"
                          className="mb-[unset] w-[unset] gap-10"
                          defaultValue={question.option1Checked.toString()}
                        />

                        <span>{question.option1}</span>
                      </label>

                      <label className="flex w-full items-center gap-6">
                        <input
                          type="radio"
                          name="selectedOption"
                          className="mb-[unset] w-[unset] gap-10"
                          defaultValue={question.option2Checked.toString()}
                        />
                        <span className="">{question.option2}</span>
                      </label>
                    </>
                  )}
                  {question.type === "checkboxes" && (
                    <>
                      <label className="flex items-center gap-6">
                        <input
                          type="checkbox"
                          name="checkboxes[0].checked"
                          defaultValue={question.option1Checked.toString()}
                          className="mb-[unset] w-[unset] gap-10"
                        />

                        <span>{question.option1}</span>
                      </label>

                      <label className="flex items-center gap-6">
                        <input
                          type="checkbox"
                          name="checkboxes[1].checked"
                          defaultValue={question.option2Checked.toString()}
                          className="mb-[unset] w-[unset] gap-10"
                        />

                        <span>{question.option2}</span>
                      </label>
                    </>
                  )}
                </div>
              </header>
            ))}

            <input type="hidden" name="formId" value={params.id} />
            <footer className="flex gap-10">
              <button
                className="max-w-[140px] cursor-not-allowed border-gray-300 text-gray-300"
                type="submit"
                name="intent"
                value="submit"
                disabled
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
