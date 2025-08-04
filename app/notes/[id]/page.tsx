type NoteDetailsPageProps = {
  params: { id: string };
};

export default function NoteDetailsPage({ params }: NoteDetailsPageProps) {
  return (
    <div>
      <h1>Note Details Page</h1>
      <p>Note ID: {params.id}</p>
    </div>
  );
}
