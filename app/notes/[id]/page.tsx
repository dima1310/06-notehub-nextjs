import { fetchNoteById } from "@/lib/api";
import type { Note } from "@/types/note";

interface NoteDetailsPageProps {
  params: { id: number | string };
}

export default async function NoteDetailsPage({
  params,
}: NoteDetailsPageProps) {
  const { id } = params;

  let note: Note | null = null;

  try {
    note = await fetchNoteById(Number(id));
  } catch (error) {
    console.error("Failed to fetch note:", error);
    return <div>Помилка завантаження нотатки</div>;
  }

  if (!note) {
    return <div>Нотатку не знайдено</div>;
  }

  return (
    <div>
      <h1>{note.title}</h1>
      <p>{note.content}</p>
    </div>
  );
}
