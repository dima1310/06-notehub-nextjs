import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Welcome to NoteHub</h1>
        <p>Your personal notes manager</p>

        <div className={styles.ctas}>
          <Link href="/notes" className={styles.primary}>
            View Notes
          </Link>
          <Link href="/notes" className={styles.secondary}>
            Get Started
          </Link>
        </div>
      </main>
    </div>
  );
}
