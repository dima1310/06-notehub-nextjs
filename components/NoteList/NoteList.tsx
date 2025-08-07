import type { Note } from "@/types/note";
import Link from "next/link";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
}

export default function NoteList({
  notes,
  onDelete,
  isDeleting = false,
}: NoteListProps) {
  const handleDelete = (
    id: string,
    title: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (window.confirm(`Delete "${title}"? This action cannot be undone.`)) {
      onDelete?.(id);
    }
  };

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h3 className={css.title}>{note.title}</h3>
          <p className={css.content}>
            {note.content.length > 120
              ? `${note.content.substring(0, 120)}…`
              : note.content}
          </p>
          <div className={css.footer}>
            {note.tag && <span className={css.tag}>{note.tag}</span>}
            <div style={{ display: "flex", gap: "8px", marginLeft: "auto" }}>
              <Link href={`/notes/${note.id}`} className={css.link}>
                View details
              </Link>
              {onDelete && (
                <button
                  className={css.button}
                  onClick={(e) => handleDelete(note.id, note.title, e)}
                  disabled={isDeleting}
                  aria-label={`Delete note: ${note.title}`}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
