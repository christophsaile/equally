type Props = {
  children: React.ReactNode;
};

export function FsNav({ children }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 m-auto grid max-w-lg grid-cols-2 items-center gap-4 px-4 pb-4">
      {children}
    </nav>
  );
}
