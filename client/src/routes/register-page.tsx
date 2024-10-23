import {
  ActionFunctionArgs,
  redirect,
  useActionData,
  useFetcher,
  useNavigation,
} from "react-router-dom";
import { registerWithEmailAndPassword } from "../config/firebase";
import { NavBar } from "../root";
import { SERVER_URL } from "../utils/utils";

type ActionData = {
  name: string;
  email: string;
  password: string;
  error?: string;
};

export const registerUserAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  for (const [key, value] of formData.entries()) {
    console.log(key, value);
  }

  try {
    const checkUser = await fetch(`${SERVER_URL}/check-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    if (!checkUser.ok) {
      const errorData = await checkUser.json();
      return { error: errorData.error || "Failed to check user existence" };
    }
    const userCredentials = await registerWithEmailAndPassword(email, password);
    const idToken = await userCredentials.user.getIdToken();
    console.info(userCredentials, idToken);

    const response = await fetch(`${SERVER_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idToken: idToken,
        name: name,
        email: email,
        password: password,
      }),
      credentials: "include",
    });
    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Server response:", response.status, errorBody);
      return {
        error: `Registration failed: ${response.status} ${response.statusText}`,
      };
    }
    return redirect("/dashboard");
  } catch (error) {
    console.error("registrartion error:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to register. Please try again.",
    };
  }
};

export const RegisterPage = () => {
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
          <p>*name</p>

          <input type="name" name="name" placeholder="name" required />
          {errors?.name && <span className="text-red-400">{errors.name}</span>}
        </label>
        <label htmlFor="">
          <p>*email</p>

          <input type="email" name="email" placeholder="email" required />
          {errors?.email && (
            <span className="text-red-400">{errors.email}</span>
          )}
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
          {navigation.state === "submitting" ? "Registering" : "Register"}
        </button>
      </fetcher.Form>
    </>
  );
};
