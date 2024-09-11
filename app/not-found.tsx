import { Button } from "@/components/button";

export default function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <p className="text-2xl font-semibold text-teal-600">404</p>
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
        Page not found
      </h1>
      <p className="mt-8 text-base leading-relaxed text-gray-800 dark:text-white">
        Sorry, something went wrong.<br></br>
        We couldn’t find the page you’re looking for.
      </p>
      <div className="mt-10 flex items-center justify-center">
        <Button href="/home" variant="accent">
          Return Home
        </Button>
      </div>
    </div>
  );
}
