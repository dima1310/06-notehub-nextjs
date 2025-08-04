"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { fetchNoteById } from "@/lib/api";
import type { Note } from "@/types/note";
import css from "./NoteDetails.module.css";

export default function NoteDetailsClient() {
  const params = useParams();
  const id = Number(params.id);

  const {
    data: note,
    isLoading,
    error,
  } = useQuery<Note>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    enabled: !isNaN(id),
  });

  // Обработка состояния загрузки
  if (isLoading) {
    return <p>Loading, please wait...</p>;
  }

  // Обработка ошибки или отсутствия данных
  if (error || !note) {
    return <p>Something went wrong.</p>;
  }

  // Рендер деталей нотатки согласно заданию
  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>
          {new Date(note.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
