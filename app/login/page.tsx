import { login, signup } from "./actions";

// TODO - Add status messages for login and signup
export default function Login() {
  return (
    <form className="mb-8 flex flex-col gap-4 p-4">
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
        <button formAction={login} className="btn-primary w-full">
          Log in
        </button>
        <button formAction={signup} className="btn-secondary w-full">
          Sign up
        </button>
      </div>
    </form>
  );
}
