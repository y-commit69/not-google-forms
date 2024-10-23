import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";

import { useState } from "react";
export const ErrorPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const error = useRouteError() as any;
  const [shouldShowTechnicalDetails, setShouldShowTechnicalDetails] =
    useState(false);
  console.error({ error });

  if (error instanceof Error) {
    return (
      <>
        <section className="flex min-h-screen w-full flex-col items-center justify-center">
          <div>
            <h2 className="pb-20 underline decoration-red-500 decoration-wavy">
              Application error
            </h2>
          </div>

          <div className="flex flex-col items-center gap-10">
            <button className="" onClick={() => window.location.reload()}>
              Reload page
            </button>

            {process.env.NODE_ENV === "development" && (
              <button
                type="button"
                className="w-[200px]"
                onClick={() => setShouldShowTechnicalDetails((prev) => !prev)}
              >
                {shouldShowTechnicalDetails ? "Hide" : "Show"} technical details
              </button>
            )}

            <Link to={"/"}>Return home →</Link>

            {shouldShowTechnicalDetails && (
              <div className="max-w-[500px]">
                <p>error: {error.name}</p>
                <p>{error.message}</p>
                <p>{error.stack}</p>
              </div>
            )}
          </div>
        </section>
      </>
    );
  }

  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        {error.status === 404 ? (
          <>
            <h2>{error.status}</h2>
            <p>{error.statusText}</p>
            {error.data && <p className="mt-2">{error.data}</p>}
            <span className="pb-20 underline decoration-red-500 decoration-wavy">
              "Sorry, we can't find the page you are looking for"
            </span>

            <Link to="/">
              <span>Return to homepage →</span>
            </Link>
          </>
        ) : (
          <span>`error: ${error.status}`</span>
        )}
        {}

        {error.data?.message && <p>{error.data.message}</p>}
      </div>
    );
  }

  return (
    <>
      <div>
        <h2>something went wrong</h2>
        <p>an unexpected error occurred. please try again later.</p>
      </div>
    </>
  );
};
