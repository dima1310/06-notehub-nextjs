import type { Note } from "@/types/note";
import css from "./NoteList.module.css";
import Link from "next/link";

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
  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h3 className={css.title}>{note.title}</h3>
          <p className={css.content}>{note.content}</p>

          {/* Нижняя часть карточки: тег слева, кнопки справа */}
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>

            {/* КНОПКИ: строго в один ряд справа */}
            <div style={{ display: "flex", gap: "8px" }}>
              <Link href={`/details/${note.id}`} className={css.link}>
                View details
              </Link>
              <button
                className={css.button}
                onClick={() => onDelete?.(note.id)}
                disabled={isDeleting}
                aria-label={`Удалить ${note.title}`}
              >
                {isDeleting ? "..." : "Delete"}
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
