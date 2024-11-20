export default async function WorkspacePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Workspace</h1>
      <p className="text-muted-foreground">Project ID: {params.id}</p>
      <div className="rounded-lg border p-4">
        <p>Workspace content will go here</p>
      </div>
    </div>
  )
}
