import { Button, Dropdown } from "antd";
import React from "react";
import { QuestionAlternative } from "./alternative";
import styles from "./styles.module.css";

interface QuestionListProps {
  formFields: any;
  setFormFields: any;
}

export function QuestionList ({ formFields, setFormFields }: QuestionListProps) {
  const items = [
    { label: "Alternativas", key: "alternative" },
    { label: "Texto", key: "text" },
    { label: "Likert", key: "likert" },
    { label: "Múltipla escolha", key: "multipleChoice" },
  ];
  const addFields = (e: any) => {
    let newField = {};

    switch (e.key) {
      case "alternative":
        newField = {
          type: "alternative",
          title: "",
          order: formFields.length + 1, //
          singleAnswer: false, //
          random: false,
          mandatory: false,
          options: {
            alternatives: [],
          },
          // opcionais
          subtitle: "",
          style: {},
          image: "",
        };
        break;
      case "text":
        newField = {
          type: "text",
          title: "",
          order: formFields.length + 1, //
          singleAnswer: null, //
          random: null,
          mandatory: null,
          options: {
            textResponse: "",
          },
          // opcionais
          subtitle: "",
          style: {},
          image: "",
        };
        break;
      case "likert":
        newField = {
          type: "likert",
          title: "",
          order: formFields.length + 1, //
          singleAnswer: false, //
          random: false,
          mandatory: false,
          options: {
            alternatives: [],
            trueQuestion: "",
          },
          // opcionais
          subtitle: "",
          style: {},
          image: "",
        };
        break;
      case "multipleChoice":
        newField = {
          type: "multipleChoice",
          question: "",
          alternatives: [{ value: "" }, { value: "" }],
        };
        break;
      default:
        break;
    }

    setFormFields([...formFields, newField]);
  };

  const removeFields = (index: number) => {
    let data = [...formFields];
    data.splice(index, 1);
    setFormFields(data);
  };

  const handleFormChange = (index, event) => {
    let data = [...formFields];
    data[index][event.target.name] = event.target.value;
    setFormFields(data);
  };

  const handleQuestionChange = (index, question) => {
    let data = [...formFields];
    data[index].options.alternatives = question;
    setFormFields(data);
  };

  if (formFields.length === 0) {
    return (
      <div className={styles.newFormOptions}>
            <p>
              <b>Formulário sem perguntas</b>
            </p>
            <p>Adicione a primeira pergunta:</p>
            <div className={styles.newFormButton}>
              <Dropdown menu={{ items, onClick: addFields }} trigger={["click"]}>
                <Button type="primary">Escolher questão</Button>
              </Dropdown>
            </div>
          </div>
    )
  }

  return (
    <div className={styles.questionList}>
      {formFields.map((field: any, index: number) => {
        switch (field.type) {
          case "alternative":
            return (
              <QuestionAlternative
                key={index}
                field={field}
                index={index}
                handleFormChange={handleFormChange}
                removeFields={removeFields}
                handleQuestionChange={handleQuestionChange}
              />
            );
          case "text":
            return <div>texto</div>;
          case "likert":
            return <div>likert</div>;
          case "multipleChoice":
            return <div>múltipla escolha</div>;
          default:
            return <div>erro</div>;
        }
      }
      )}
    </div>
  );
}
