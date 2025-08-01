"use client";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error }: ErrorPageProps) {
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <p>Could not fetch note details. {error.message}</p>
    </div>
  );
}
