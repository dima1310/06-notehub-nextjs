"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { deleteNote } from "@/lib/api";
import type { Note } from "@/types/note";
import type { NotesResponse } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import Pagination from "@/components/Pagination/Pagination";
import css from "./NotesPage.module.css";

interface NotesClientProps {
  initialData: NotesResponse;
}

export default function NotesClient({ initialData }: NotesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [notes, setNotes] = useState<Note[]>(initialData.notes || []);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [currentPage] = useState(initialData.currentPage || 1);
  const [totalPages] = useState(initialData.totalPages || 1);

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: (_, deletedId) => {
      setNotes((prevNotes) =>
        prevNotes.filter((note) => note.id !== deletedId)
      );
    },
    onError: () => {
      setError("Помилка при видаленні нотатки.");
    },
  });

  const handlePageChange = (selectedItem: { selected: number }) => {
    const newPage = selectedItem.selected + 1;
    const params = new URLSearchParams();

    if (searchTerm) {
      params.set("search", searchTerm);
    }
    params.set("page", newPage.toString());

    router.push(`/notes?${params.toString()}`);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    const params = new URLSearchParams();

    if (value) {
      params.set("search", value);
    }
    params.set("page", "1"); // Сброс на первую страницу при поиске

    router.push(`/notes?${params.toString()}`);
  };

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <input
          type="text"
          placeholder="Пошук..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className={css.searchInput}
        />
        <button onClick={() => setIsModalOpen(true)} className={css.button}>
          Create note +
        </button>
      </div>

      {filteredNotes.length === 0 ? (
        <p>Немає нотаток</p>
      ) : (
        <>
          <NoteList
            notes={filteredNotes}
            onDelete={(id) => deleteMutation.mutate(id)}
            isDeleting={deleteMutation.isPending}
          />

          {totalPages > 1 && (
            <Pagination
              pageCount={totalPages}
              currentPage={currentPage - 1} // react-paginate использует 0-based индексы
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {isModalOpen && (
        <Modal
          title="Створити нотатку"
          isOpen={true}
          onClose={() => setIsModalOpen(false)}
        >
          <NoteForm
            isLoading={false}
            onCancel={() => setIsModalOpen(false)}
            onClose={() => setIsModalOpen(false)}
            onSubmit={(newNote) => {
              const tempId = Date.now().toString();
              const now = new Date().toISOString();

              setNotes((prev) => [
                ...prev,
                {
                  id: tempId,
                  title: newNote.title,
                  content: newNote.content,
                  tag: newNote.tag,
                  createdAt: now,
                  updatedAt: now,
                } as Note,
              ]);

              setIsModalOpen(false);
            }}
          />
        </Modal>
      )}

      {error && (
        <div className={css.error}>
          {error}
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}
    </div>
  );
}
