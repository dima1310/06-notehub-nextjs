import { fetchNoteById } from "@/lib/api";
import type { Note } from "@/types/note";

interface NoteDetailsPageProps {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
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
    return <div>Ошибка при загрузке заметки</div>;
  }

  if (!note) {
    return <div>Заметка не найдена</div>;
  }

  return (
    <div>
      <h1>{note.title}</h1>
      <p>{note.content}</p>
    </div>
  );
}
