type Props = {
  children: React.ReactNode;
};

export function FsButtonGroup({ children }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex gap-4 px-4 pb-4">
      {children}
    </div>
  );
}
