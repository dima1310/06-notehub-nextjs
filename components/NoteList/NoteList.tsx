// components/NoteList/NoteList.tsx
import type { Note } from "@/types/note";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
  onDelete?: (id: string) => void;
  isDeleting?: boolean; // Додано для показу стану завантаження
}

export default function NoteList({
  notes,
  onDelete,
  isDeleting = false,
}: NoteListProps) {
  // Функція для консистентного форматування дати
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <ul className={css.noteList}>
      {notes.map((note) => (
        <li key={note.id} className={css.noteItem}>
          <div className={css.content}>
            <h3 className={css.title}>{note.title}</h3>
            <p className={css.text}>{note.content}</p>
            <div className={css.footer}>
              <span className={css.tag}>{note.tag}</span>
              <p className={css.date}>{formatDate(note.createdAt)}</p>
            </div>
          </div>
          {onDelete && (
            <button
              className={css.deleteButton}
              onClick={() => onDelete(note.id)}
              disabled={isDeleting}
              aria-label={`Видалити нотатку ${note.title}`}
              style={{
                opacity: isDeleting ? 0.6 : 1,
                cursor: isDeleting ? "not-allowed" : "pointer",
              }}
            >
              {isDeleting ? "..." : "✕"}
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
