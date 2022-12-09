import { Button, Radio } from "antd";
import React from "react";
import styles from "./styles.module.css";

interface QuestionAlternativeProps {
  field: any;
  index: number;
  handleFormChange: (index: number, event: any) => void;
  removeFields: (index: number) => void;
  handleQuestionChange: (index: number, question: any) => void;
}

export function QuestionAlternative({
  field,
  index,
  handleFormChange,
  removeFields,
  handleQuestionChange,
}: QuestionAlternativeProps) {
  const addAlternative = () => {
    const data = [...field.options.alternatives];
    data.push({ value: "" });
    handleQuestionChange(index, data);
  };
  
  const editAlternative = (index2: number, event) => {
    const data = [...field.options.alternatives];
    data[index2].value = event.target.value;
    handleQuestionChange(index, data);
  };
  return (
    <div key={index} className={styles.alternativeHeader}>
      <input
        name="title"
        placeholder="Título da pergunta"
        value={field.title}
        onChange={(event) => handleFormChange(index, event)}
        className={styles.titleInput}
      />
      <div className={styles.body}>
        {field.options.alternatives.map((alternative, index) => {
          return (
            <Radio key={index} defaultChecked={false} disabled>
              <input
                key={index}
                name="options.alternatives.value"
                placeholder={`Alternativa ${index + 1}`}
                value={alternative.value}
                onChange={(event) => editAlternative(index, event)}
                className={styles.alternativeBody}
              />
            </Radio>
          );
        })}
      </div>
      <Button onClick={() => addAlternative()} type={"text"} className={styles.addAlternative}>Adicionar alternativa</Button>
      <button onClick={() => removeFields(index)}>Remover</button> {/* remover isso daqui */}
    </div>
  );
}
