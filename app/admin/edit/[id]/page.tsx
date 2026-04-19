import { AdminEditor } from "@/components/AdminEditor";

export default async function AdminEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminEditor id={id} />;
}
