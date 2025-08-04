"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchNotes } from "@/lib/api";
import type { Note, NotesResponse } from "@/types/note";

interface NotesClientProps {
  initialPage: number;
  initialSearch: string;
  initialData: NotesResponse;
}

export default function NotesClient({
  initialPage,
  initialSearch,
  initialData,
}: NotesClientProps) {
  const [notes, setNotes] = useState<Note[]>(initialData.notes || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialData.totalPages || 1);

  const searchParams = useSearchParams();
  const query = searchParams.get("search") || initialSearch;

  useEffect(() => {
    // Если поисковый запрос изменился с начального, загружаем новые данные
    if (query !== initialSearch) {
      loadNotes(1, query);
    }
  }, [query, initialSearch]);

  async function loadNotes(page: number, searchQuery: string) {
    try {
      setLoading(true);
      setError(null);

      const response: NotesResponse = await fetchNotes(page, searchQuery, 12);

      setNotes(response.notes || []);
      setCurrentPage(response.currentPage || page);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
      setError("Не вдалося завантажити нотатки");
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      loadNotes(newPage, query);
    }
  };

  if (loading) {
    return <div>Завантаження...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>Помилка: {error}</p>
        <button onClick={() => loadNotes(currentPage, query)}>
          Спробувати знову
        </button>
      </div>
    );
  }

  if (notes.length === 0) {
    return <div>Нотатки не знайдені</div>;
  }

  return (
    <div>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
          </li>
        ))}
      </ul>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Попередня
          </button>

          <span>
            Сторінка {currentPage} з {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Наступна
          </button>
        </div>
      )}
    </div>
  );
}
