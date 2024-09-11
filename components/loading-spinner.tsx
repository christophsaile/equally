export default function LoadingSpinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="inline-block size-8 animate-spin rounded-full border-[3px] border-current border-t-transparent text-gray-600 dark:text-neutral-400"
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
