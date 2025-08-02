"use client";

import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { notesApi } from "@/Lib/api";
import { CreateNoteData } from "@/types/note";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onClose: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be at most 100 characters")
    .required("Title is required"),
  text: Yup.string()
    .max(1000, "Text must be at most 1000 characters")
    .required("Text is required"),
});

const NoteForm: React.FC<NoteFormProps> = ({ onClose }) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CreateNoteData) => notesApi.createNote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onClose();
    },
    onError: (error) => {
      console.error("Failed to create note:", error);
    },
  });

  return (
    <Formik
      initialValues={{ title: "", text: "" }}
      validationSchema={validationSchema}
      onSubmit={(values) => createMutation.mutate(values)}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <h2>Create New Note</h2>

          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" type="text" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="text">Content</label>
            <Field
              id="text"
              name="text"
              as="textarea"
              rows="8"
              className={css.textarea}
              placeholder="Enter your note content here..."
            />
            <ErrorMessage name="text" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting || createMutation.isPending}
            >
              {isSubmitting || createMutation.isPending
                ? "Creating..."
                : "Create Note"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NoteForm;
