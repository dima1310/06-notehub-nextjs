"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchNotes } from "@/lib/api";
import type { Note, NotesResponse } from "@/types/note";
import NoteList from "@/components/NoteList/NoteList";

interface NotesClientProps {
  initialData: NotesResponse;
}

export default function NotesClient({ initialData }: NotesClientProps) {
  const [notes, setNotes] = useState<Note[]>(initialData.notes || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialData.currentPage || 1);
  const [totalPages, setTotalPages] = useState(initialData.totalPages || 1);

  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("search") || "";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  console.log("=== NotesClient State ===");
  console.log("Notes count:", notes.length);
  console.log("Loading:", loading);
  console.log("Error:", error);
  console.log("Current page:", currentPage);
  console.log("Total pages:", totalPages);
  console.log("URL params - query:", query, "page:", pageParam);

  // Мемоізуємо функцію loadNotes щоб уникнути ререндерів
  const loadNotes = useCallback(async (page: number, searchQuery: string) => {
    console.log("=== loadNotes called ===");
    console.log("Page:", page, "Search:", searchQuery);

    try {
      setLoading(true);
      setError(null);

      const response: NotesResponse = await fetchNotes(page, searchQuery, 12);

      console.log("=== Notes loaded ===");
      console.log("Response:", response);

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
  }, []);

  useEffect(() => {
    console.log("=== NotesClient useEffect ===");
    console.log("Current URL query:", query, "page:", pageParam);
    console.log("Current state page:", currentPage);

    // Перевіряємо чи URL параметри відрізняються від поточного стану
    const pageChanged = pageParam !== currentPage;
    const searchChanged = query !== ""; // Якщо є пошук, завжди завантажуємо

    // Якщо це перший рендер з initialData і URL збігається з серверними даними
    const isFirstRenderWithMatchingParams =
      currentPage === (initialData.currentPage || 1) &&
      query === "" &&
      pageParam === (initialData.currentPage || 1);

    if (isFirstRenderWithMatchingParams) {
      console.log("First render with matching params - using initial data");
      return;
    }

    if (pageChanged || searchChanged) {
      console.log("Loading notes due to params change:", {
        pageChanged,
        searchChanged,
        pageParam,
        query,
      });
      loadNotes(pageParam, query);
    }
  }, [query, pageParam, currentPage, loadNotes, initialData.currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      console.log("Page change to:", newPage);

      const params = new URLSearchParams(searchParams.toString());
      params.set("page", newPage.toString());
      if (query) {
        params.set("search", query);
      } else {
        params.delete("search");
      }

      router.push(`/notes?${params.toString()}`);
    }
  };

  const handleDeleteNote = (id: number) => {
    console.log("Delete note:", id);
    // TODO: Implement delete functionality
    setNotes(notes.filter((note) => note.id !== id));
  };

  if (loading) {
    return (
      <div className="loading">
        <p>Завантаження...</p>
      </div>
    );
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
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h3>Нотатки не знайдені</h3>
        <p>Спробуйте змінити пошуковий запит або створити нову нотатку</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <p>Знайдено нотаток: {notes.length}</p>
        {query && <p>Пошук за запитом: {query}</p>}
      </div>

      <NoteList notes={notes} onDelete={handleDeleteNote} />

      {/* Пагінація */}
      {totalPages > 1 && (
        <div
          className="pagination"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginTop: "2rem",
            justifyContent: "center",
          }}
        >
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            style={{
              padding: "0.5rem 1rem",
              border: "1px solid #ccc",
              background: currentPage <= 1 ? "#f5f5f5" : "white",
              cursor: currentPage <= 1 ? "not-allowed" : "pointer",
            }}
          >
            Попередня
          </button>

          <span>
            Сторінка {currentPage} з {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            style={{
              padding: "0.5rem 1rem",
              border: "1px solid #ccc",
              background: currentPage >= totalPages ? "#f5f5f5" : "white",
              cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
            }}
          >
            Наступна
          </button>
        </div>
      )}
    </div>
  );
}
