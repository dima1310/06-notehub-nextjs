import Link from "next/link";
import type { Note } from "@/types/note";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
  onDelete?: (id: number) => void;
}

export default function NoteList({ notes, onDelete }: NoteListProps) {
  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.item}>
          <div className={css.content}>
            <h3 className={css.title}>{note.title}</h3>
            <p className={css.text}>{note.content}</p>
            <p className={css.date}>
              {new Date(note.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className={css.actions}>
            <Link href={`/notes/${note.id}`} className={css.link}>
              View details
            </Link>
            {onDelete && (
              <button
                onClick={() => onDelete(note.id)}
                className={css.deleteButton}
              >
                Delete
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
