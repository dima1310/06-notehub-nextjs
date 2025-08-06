"use client";

import { useEffect, useState } from "react";
import { fetchNotes } from "@/lib/api";
import type { Note } from "@/types/note";
import { NotesResponse } from "@/lib/api";

interface NotesClientProps {
  initialData: NotesResponse;
}

export default function NotesClient({}: NotesClientProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getNotes = async () => {
      try {
        const response: NotesResponse = await fetchNotes(); // очікуємо NotesResponse
        setNotes(response.notes); // витягуємо тільки масив нотаток
      } catch (err) {
        console.error("Failed to fetch notes:", err);
        setError("Не вдалося завантажити нотатки");
      } finally {
        setLoading(false);
      }
    };

    getNotes();
  }, []);

  if (loading) {
    return <p>Завантаження...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Список нотаток</h2>
      {notes.length === 0 ? (
        <p>Немає нотаток</p>
      ) : (
        <ul>
          {notes.map((note) => (
            <li key={note.id}>
              <h3>{note.title}</h3>
              <p>{note.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
