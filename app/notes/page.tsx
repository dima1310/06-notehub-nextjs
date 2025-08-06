import NotesClient from "./Notes.client";
import { fetchNotes, type NotesResponse } from "@/lib/api";

export const dynamic = "force-dynamic";

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

      <NotesClient initialData={initialData} />
    </div>
  );
}
