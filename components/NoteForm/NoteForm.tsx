import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { type NoteTag } from "@/types/note";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  initialData?: {
    title: string;
    content: string;
    tag: NoteTag;
  };
  submitButtonText?: string;
  error?: string;
  isLoading: boolean;
  onCancel: () => void;
  onSubmit: (data: { title: string; content: string; tag: NoteTag }) => void;
  onClose: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters")
    .required("Title is required"),
  content: Yup.string().max(500, "Content must be at most 500 characters"),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"], "Invalid tag")
    .required("Tag is required"),
});

const NoteForm: React.FC<NoteFormProps> = ({
  initialData,
  submitButtonText = "Create note",
  error,
  isLoading,
  onCancel,
  onSubmit,
  onClose,
}) => {
  return (
    <Formik
      initialValues={
        initialData ?? { title: "", content: "", tag: "" as NoteTag }
      }
      validationSchema={validationSchema}
      onSubmit={(values) => {
        onSubmit(values);
        onClose();
      }}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" type="text" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              id="content"
              name="content"
              as="textarea"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage
              name="content"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              <option value="" disabled>
                Select a tag
              </option>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          {error && <div className={css.error}>{error}</div>}

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting || isLoading}
            >
              {submitButtonText}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NoteForm;
