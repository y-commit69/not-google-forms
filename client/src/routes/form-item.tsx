import { json, useFetcher, useLoaderData } from "react-router-dom";
import type { Template } from "../root";
import { SERVER_URL } from "../utils/utils";

export const formItemLoader = async () => {
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

export const FormItemPage = () => {
  const formDataAsync = useLoaderData() as Template[];
  const fetcher = useFetcher();
  console.log("formdata asnyc", formDataAsync);
  formDataAsync.map((data) => console.log("questions", data.questions));

  return (
    <>
      {formDataAsync.map((form) => (
        <section
          key={form.id}
          className="ml-auto mr-auto w-full max-w-[1280px] pb-[40px] pt-[40px]"
        >
          <header>
            <p className="pb-10">{form.title}</p>
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
              <fieldset className="mb-20">
                <input type="file" name="image" multiple />
                <small id="fileHelpText" className="text-gray-400">
                  Accepted formats: JPG, PNG, up to 5MB.
                </small>
              </fieldset>
              {form.questions.map((question) => (
                <fieldset key={question.id}>
                  <input
                    type="text"
                    name="untitledQuestion"
                    placeholder="Untitled Question"
                    className="border-0-class text-green-500"
                    defaultValue={question.text}
                  />

                  <div className="flex flex-col gap-10 pb-20">
                    {question.type === "multipleChoice" && (
                      <>
                        <fieldset className="flex flex-row items-center gap-6">
                          <input
                            type="checkbox"
                            name="multipleChoiceCheckbox1"
                            className="mb-[unset] w-[unset] gap-10"
                            defaultValue={question.option1Checked.toString()}
                          />
                          <input
                            type="text"
                            name="multipleChoiceOption1"
                            placeholder="Option 1"
                            className="border-0-class mb-0"
                            defaultValue={question.option1}
                          />
                        </fieldset>

                        <fieldset className="flex flex-row items-center gap-6">
                          <input
                            type="checkbox"
                            name="multipleChoiceCheckbox2"
                            className="mb-[unset] w-[unset] gap-10"
                            defaultValue={question.option2Checked.toString()}
                          />
                          <input
                            type="text"
                            name="multipleChoiceOption2"
                            placeholder="Option 2"
                            className="border-0-class mb-0"
                            defaultValue={question.option2}
                          />
                        </fieldset>
                      </>
                    )}
                    {question.type === "checkboxes" && (
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
                            className="mb-0"
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
                            className="mb-0"
                          />
                        </fieldset>
                      </>
                    )}
                  </div>
                </fieldset>
              ))}

              <button className="max-w-[140px]" type="submit">
                Submit
              </button>
            </fetcher.Form>
          </header>
          <main></main>
        </section>
      ))}
    </>
  );
};
