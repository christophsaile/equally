type Props = {
  children: React.ReactNode;
  type: "error" | "success" | "warning" | "info";
};

const info = (children: React.ReactNode) => {
  return (
    <div className="mt-2 rounded-lg border border-blue-200 bg-blue-100 p-4 text-sm text-blue-800">
      {children}
    </div>
  );
};

const success = (children: React.ReactNode) => {
  return (
    <div className="mt-2 rounded-lg border border-teal-200 bg-teal-100 p-4 text-sm text-teal-800">
      {children}
    </div>
  );
};

const error = (children: React.ReactNode) => {
  return (
    <div className="mt-2 rounded-lg border border-red-200 bg-red-100 p-4 text-sm text-red-800">
      {children}
    </div>
  );
};

const warning = (children: React.ReactNode) => {
  return (
    <div className="mt-2 rounded-lg border border-yellow-200 bg-yellow-100 p-4 text-sm text-yellow-800">
      {children}
    </div>
  );
};

export function Alert({ children, type }: Props) {
  return (
    <>
      {type === "info" && info(children)}
      {type === "success" && success(children)}
      {type === "error" && error(children)}
      {type === "warning" && warning(children)}
    </>
  );
}
