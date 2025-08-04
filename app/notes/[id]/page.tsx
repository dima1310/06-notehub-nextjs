type NoteDetailsPageProps = {
  params: {
    id: string;
  };
};

export default function NoteDetailsPage({ params }: NoteDetailsPageProps) {
  const { id } = params;

  return (
    <main>
      <h1>Note ID: {id}</h1>
    </main>
  );
}
