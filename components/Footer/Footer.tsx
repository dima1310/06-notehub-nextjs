import css from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={css.footer}>
      <div className={css.content}>
        <p>© {new Date().getFullYear()} NoteHub. All rights reserved.</p>
        <div className={css.wrap}>
          <p>Developer: Your Name</p>
          <p>
            Contact us:{"Dmytrii Ponomarenko "}
            <a href="mailto:student@notehub.app">
              dimaponomarenko13101981@gmail.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
