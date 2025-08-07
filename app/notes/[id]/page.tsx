import React from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NotePage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div>
      <h1>Note {id}</h1>
      {/* Add your note content here */}
    </div>
  );
}

export async function generateStaticParams() {
  return [];
}
