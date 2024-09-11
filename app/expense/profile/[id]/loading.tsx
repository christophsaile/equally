export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div
        className=":text-neutral-800 inline-block size-8 animate-spin rounded-full border-[3px] border-current border-t-transparent dark:text-white"
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
