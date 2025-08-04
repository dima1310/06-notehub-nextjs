import { fetchNoteById } from "@/lib/api";
import { notFound } from "next/navigation";
import type { Note } from "@/types/note";

interface NoteDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function NoteDetailsPage({
  params,
}: NoteDetailsPageProps) {
  const { id } = await params;

  const noteId = parseInt(id, 10);

  if (isNaN(noteId)) {
    notFound();
  }

  let note: Note;

  try {
    note = await fetchNoteById(noteId);
  } catch (error) {
    console.error("Error fetching note:", error);
    notFound();
  }

  if (!note) {
    notFound();
  }

  return (
    <div className="note-details">
      <h1>{note.title}</h1>
      <div className="note-content">
        <p>{note.content}</p>
      </div>
      {note.createdAt && (
        <div className="note-meta">
          <small>
            Створено: {new Date(note.createdAt).toLocaleDateString("uk-UA")}
          </small>
        </div>
      )}
    </div>
  );
}
