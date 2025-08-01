import Link from "next/link";
import css from "./Header.module.css";

export default function Header() {
  return (
    <header className={css.header}>
      <div className={css.container}>
        <Link href="/" className={css.logo}>
          NoteHub
        </Link>
        <nav className={css.nav}>
          <Link href="/" className={css.navLink}>
            Home
          </Link>
          <Link href="/notes" className={css.navLink}>
            Notes
          </Link>
        </nav>
      </div>
    </header>
  );
}
