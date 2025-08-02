import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { notesApi } from "@/Lib/api";
import { NotesPageClient } from "./NotesPage.client";

export default async function NotesPage() {
  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ["notes", 1, ""],
      queryFn: () => notesApi.getNotes({ page: 1, perPage: 12, search: "" }),
    });
  } catch (error) {
    console.error("Failed to prefetch notes:", error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesPageClient />
    </HydrationBoundary>
  );
}
