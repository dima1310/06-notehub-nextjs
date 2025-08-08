"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getNoteById, deleteNote } from "@/lib/api";
import type { Note } from "@/types/note";
import css from "./NoteDetails.module.css";

interface NoteDetailProps {
  id: string;
}

export default function NoteDetail({ id }: NoteDetailProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: note,
    isLoading,
    isError,
    error,
  } = useQuery<Note>({
    queryKey: ["note", id],
    queryFn: () => getNoteById(id),
    staleTime: 5 * 60 * 1000,
  });

  const { mutate: removeNote, isPending: isDeleting } = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      router.push("/notes");
    },
  });

  const handleDelete = () => {
    if (window.confirm("Delete this note? This action cannot be undone.")) {
      removeNote(id);
    }
  };

  if (isLoading) {
    return (
      <div className={css.container}>
        <div className={css.loading}>Loading note...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={css.container}>
        <div className={css.error}>
          Error loading note:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </div>
        <Link href="/notes" className={css.backLink}>
          ← Back to notes
        </Link>
      </div>
    );
  }

  if (!note) {
    return (
      <div className={css.container}>
        <div className={css.error}>Note not found</div>
        <Link href="/notes" className={css.backLink}>
          ← Back to notes
        </Link>
      </div>
    );
  }

  return (
    <div className={css.container}>
      <div className={css.header}>
        <Link href="/notes" className={css.backLink}>
          ← Back to notes
        </Link>
        <div className={css.actions}>
          <Link href={`/notes/${id}/edit`} className={css.editButton}>
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className={css.deleteButton}
            disabled={isDeleting}
            aria-label={`Delete note: ${note.title}`}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      <article className={css.note}>
        <header className={css.noteHeader}>
          <h1 className={css.title}>{note.title}</h1>
          {note.tag && (
            <span className={css.tag} data-tag={note.tag.toLowerCase()}>
              {note.tag}
            </span>
          )}
        </header>

        <div className={css.content}>
          {note.content ? (
            <p>{note.content}</p>
          ) : (
            <p className={css.emptyContent}>No content</p>
          )}
        </div>

        <footer className={css.metadata}>
          {note.createdAt && (
            <div className={css.date}>
              Created: {new Date(note.createdAt).toLocaleDateString()}
            </div>
          )}
          {note.updatedAt && note.updatedAt !== note.createdAt && (
            <div className={css.date}>
              Updated: {new Date(note.updatedAt).toLocaleDateString()}
            </div>
          )}
        </footer>
      </article>
    </div>
  );
}
