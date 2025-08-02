"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import css from "./NoteModal.module.css";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Перевіряємо чи ми на клієнті
  if (typeof window === "undefined") {
    return null;
  }

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) {
    // Створюємо modal-root якщо його немає
    const div = document.createElement("div");
    div.id = "modal-root";
    document.body.appendChild(div);
    return createPortal(
      <div
        className={css.backdrop}
        role="dialog"
        aria-modal="true"
        onClick={handleBackdropClick}
      >
        <div className={css.modal}>{children}</div>
      </div>,
      div
    );
  }

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={css.modal}>{children}</div>
    </div>,
    modalRoot
  );
};

export default Modal;
