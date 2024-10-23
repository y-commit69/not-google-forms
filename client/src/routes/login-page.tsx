import {
  ActionFunctionArgs,
  redirect,
  useActionData,
  useFetcher,
  useNavigation,
} from "react-router-dom";
import { loginWithEmailAndPassword } from "../config/firebase.js";
import { NavBar } from "../root";
import { SERVER_URL } from "../utils/utils.js";

type ActionData = {
  email: string;
  password: string;
};

export const loginUserAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  for (var [key, value] of formData.entries()) {
    console.log(key, value);
  }

  let userCredentials;
  try {
    userCredentials = await loginWithEmailAndPassword(email, password);
  } catch (error) {
    console.error("error logging  in:", error);
    return { error: "invalid email or password. please try again.." };
  }

  let idToken;
  try {
    idToken = await userCredentials.user.getIdToken();
    console.log(idToken);
  } catch (error) {
    console.error("rrror fetching ID token:", error);
    return { error: "failed to retrieve token. please try again." };
  }
  const response = await fetch(`${SERVER_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      idToken: idToken,
      email: email,
      password: password,
    }),
    credentials: "include",
  });
  if (!response.ok) {
    const errorBody = await response.text();
    console.error("server error:", response.status, errorBody);
    return { error: `login failed: ${response.status} ${response.statusText}` };
  }
  console.log(response);
  const responseData = await response.json();
  console.log("server response:", responseData);
  return redirect("/dashboard");
};

export const LoginPage = () => {
  const fetcher = useFetcher();
  const errors = useActionData() as ActionData;
  const navigation = useNavigation();
  return (
    <>
      <NavBar />
      {fetcher.data?.error && (
        <div className="mb-4 ml-auto mr-auto flex w-full max-w-[1280px] rounded-md border border-red-200 bg-red-50 p-4">
          <p className="text-red-600">{fetcher.data.error}</p>
        </div>
      )}
      <fetcher.Form
        method="post"
        className="ml-auto mr-auto flex w-full max-w-[1280px]"
      >
        <label htmlFor="">
          <p>*email</p>

          <input type="email" name="email" placeholder="email" required />
        </label>
        <label htmlFor="">
          <p>*password</p>

          <input
            type="password"
            name="password"
            placeholder="password"
            required
          />
          {errors?.password && (
            <span className="text-red-400">{errors.password}</span>
          )}
        </label>

        <button type="submit">
          {navigation.state === "submitting" ? "Logging in" : "Login"}
        </button>
      </fetcher.Form>
    </>
  );
};
