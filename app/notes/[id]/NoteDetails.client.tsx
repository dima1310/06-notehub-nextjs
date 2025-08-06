"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { fetchNoteById, updateNote, deleteNote } from "@/lib/api";
import type { UpdateNoteData } from "@/types/note";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";

interface NoteDetailsClientProps {
  noteId: string;
}

export default function NoteDetailsClient({ noteId }: NoteDetailsClientProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),

    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: false,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNoteData }) =>
      updateNote(id, data),
    onSuccess: (updatedNote) => {
      queryClient.setQueryData(["note", noteId], updatedNote);
      queryClient.invalidateQueries({ queryKey: ["notes"] }); // Оновлюємо список нотаток
      setIsEditModalOpen(false);
    },
    onError: (error) => {
      console.error("Failed to update note:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["note", noteId] });

      queryClient.invalidateQueries({ queryKey: ["notes"] });
      router.push("/notes");
    },
    onError: (error) => {
      console.error("Failed to delete note:", error);
    },
  });

  const handleEdit = () => setIsEditModalOpen(true);
  const handleCloseEditModal = () => setIsEditModalOpen(false);

  const handleUpdate = (updateData: UpdateNoteData) => {
    updateMutation.mutate({ id: noteId, data: updateData });
  };

  const handleDelete = () => {
    if (window.confirm("Ви впевнені, що хочете видалити цю нотатку?")) {
      deleteMutation.mutate(noteId);
    }
  };

  const handleBack = () => {
    router.push("/notes");
  };

  // Форматування дати
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("uk-UA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Стани завантаження та помилок
  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p>Завантаження нотатки...</p>
      </div>
    );
  }

  if (isError || !note) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h2>Нотатку не знайдено</h2>
        <p>Можливо, нотатка була видалена або не існує.</p>
        <button
          onClick={handleBack}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#6b7280",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "1rem",
          }}
        >
          Повернутися до списку
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      {/* Навігація */}
      <div style={{ marginBottom: "2rem" }}>
        <button
          onClick={handleBack}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#6b7280",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginRight: "1rem",
          }}
        >
          ← Назад до списку
        </button>
      </div>

      {/* Заголовок та дії */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              margin: "0 0 0.5rem 0",
              lineHeight: "1.2",
            }}
          >
            {note.title}
          </h1>

          {note.tag && (
            <span
              style={{
                display: "inline-block",
                padding: "0.25rem 0.75rem",
                backgroundColor: "#e5e7eb",
                color: "#374151",
                borderRadius: "9999px",
                fontSize: "0.875rem",
                fontWeight: "500",
              }}
            >
              {note.tag}
            </span>
          )}
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={handleEdit}
            disabled={updateMutation.isPending}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: updateMutation.isPending ? "not-allowed" : "pointer",
              opacity: updateMutation.isPending ? 0.6 : 1,
            }}
          >
            {updateMutation.isPending ? "Збереження..." : "Редагувати"}
          </button>

          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: deleteMutation.isPending ? "not-allowed" : "pointer",
              opacity: deleteMutation.isPending ? 0.6 : 1,
            }}
          >
            {deleteMutation.isPending ? "Видалення..." : "Видалити"}
          </button>
        </div>
      </div>

      {/* Контент нотатки */}
      <div
        style={{
          backgroundColor: "#f9fafb",
          padding: "1.5rem",
          borderRadius: "8px",
          border: "1px solid #e5e7eb",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            fontSize: "1.1rem",
            lineHeight: "1.6",
            color: "#374151",
            whiteSpace: "pre-wrap",
          }}
        >
          {note.content}
        </div>
      </div>

      {/* Метадані */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
          backgroundColor: "#f3f4f6",
          borderRadius: "6px",
          fontSize: "0.875rem",
          color: "#6b7280",
        }}
      >
        <div>
          <strong>Створено:</strong> {formatDate(note.createdAt)}
        </div>
        {note.updatedAt && note.updatedAt !== note.createdAt && (
          <div>
            <strong>Оновлено:</strong> {formatDate(note.updatedAt)}
          </div>
        )}
      </div>

      {/* Модальне вікно для редагування */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        title="Редагувати нотатку"
      >
        <NoteForm
          initialData={{
            title: note.title,
            content: note.content,
            tag: note.tag,
          }}
          onSubmit={handleUpdate}
          onCancel={handleCloseEditModal}
          onClose={handleCloseEditModal}
          isLoading={updateMutation.isPending}
          error={updateMutation.error?.message}
          submitButtonText="Зберегти зміни"
        />
      </Modal>
    </div>
  );
}
