import { toast } from "react-toastify";

export const validateForm = (formHeader: any, formFields: any) => {
  if (!formHeader.title) {
    toast.error("Título do formulário é obrigatório", {
      toastId: "title-required",
    });
    return false;
  }

  if (!formHeader.description) {
    toast.error("Descrição do formulário é obrigatória", {
      toastId: "description-required",
    });
    return false;
  }

  if (formFields.length === 0) {
    toast.error("Formulário deve ter ao menos uma questão", {
      toastId: "questions-required",
    });
    return false;
  }

  if (formFields.some((field: any) => !field.title || field.title === "")) {
    toast.error("Título da questão é obrigatório", {
      toastId: "question-title-required",
    });
    return false;
  }

  if (
    formFields.some(
      (field: any) =>
        (field.type === "alternative" ||
        field.type === "multipleChoice") &&
          field.options.alternatives.length < 2
    )
  ) {
    toast.error("Questão deve ter ao menos duas alternativas", {
      toastId: "alternatives-required",
    });
    return false;
  }

  if (
    formFields.some(
      (field: any) =>
        field.type === "likert" && (field.options.lines?.length < 2 ||
        field.options.columns?.length < 2)
    )
  ) {
    toast.error("Questão deve ter ao menos duas linhas e duas colunas", {
      toastId: "likert-required",
    });
    return false;
  }

  return true;
};