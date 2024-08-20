import { login, signup } from "./actions";

// TODO - Implement the login page
// TODO - Add status messages for login and signup
export default function Login() {
  return (
    <form className="mb-8 flex flex-col gap-4 rounded border p-4 shadow-md">
      <div className="flex flex-col">
        <label htmlFor="email" className="mb-1 font-semibold">
          Email:
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="password" className="mb-1 font-semibold">
          Password:
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex gap-4">
        <button
          formAction={login}
          className="mt-4 rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
        >
          Log in
        </button>
        <button
          formAction={signup}
          className="mt-4 rounded bg-green-500 p-2 text-white hover:bg-green-600"
        >
          Sign up
        </button>
      </div>
    </form>
  );
}
