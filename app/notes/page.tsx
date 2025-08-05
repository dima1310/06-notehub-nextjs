import { fetchNotes } from "@/lib/api";
import NotesClient from "@/app/notes/Notes.client";
import type { NotesResponse } from "@/types/note";

interface NotesPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const searchQuery = params.search || "";

  let initialData: NotesResponse;

  try {
    console.log("=== NotesPage Server Component ===");
    console.log("Fetching with params:", { currentPage, searchQuery });

    initialData = await fetchNotes(currentPage, searchQuery, 12);
    console.log("Server fetch successful:", initialData);
  } catch (error) {
    console.error("Error fetching notes on server:", error);

    initialData = {
      notes: [],
      totalPages: 1,
      currentPage: currentPage,
    };
  }

  return (
    <div style={{ padding: "1rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1>Мої нотатки</h1>
      </div>

      {/* Передаємо тільки initialData згідно з інтерфейсом NotesClient */}
      <NotesClient initialData={initialData} />
    </div>
  );
}
