import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetailsClient";

export default async function NoteDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id; // не Number, просто строка

  // Проверка id (если нужно)
  if (!id || typeof id !== "string") {
    throw new Error("Invalid note ID.");
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient noteId={id} />
    </HydrationBoundary>
  );
}
