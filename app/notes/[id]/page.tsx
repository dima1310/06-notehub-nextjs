interface PageProps {
  params: {
    id: string;
  };
}

export default async function NoteDetailsPage({ params }: PageProps) {
  const { id } = params;

  return (
    <div>
      <h1>Note Details Page</h1>
      <p>Note ID: {id}</p>
    </div>
  );
}
