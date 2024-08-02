export default async function GroupBalance({
  params,
}: {
  params: { id: string };
}) {
  return <div>Group Balance: {params.id}</div>;
}
