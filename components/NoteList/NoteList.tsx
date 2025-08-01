import Link from "next/link";
import { Note } from "@/types/note";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.item}>
          <div className={css.content}>
            <h3 className={css.title}>{note.title}</h3>
            <p className={css.text}>{note.text}</p>
            <p className={css.date}>
              {new Date(note.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className={css.actions}>
            <Link href={`/notes/${note.id}`} className={css.viewButton}>
              View details
            </Link>
            <button className={css.deleteButton}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
