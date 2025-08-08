import React from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/lib/api";
import { getNoteById } from "@/lib/api";
import NoteDetail from "@/app/notes/[id]/NoteDetails.client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NotePage({ params }: PageProps) {
  const { id } = await params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => getNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetail id={id} />
    </HydrationBoundary>
  );
}

export async function generateStaticParams() {
  return [];
}
