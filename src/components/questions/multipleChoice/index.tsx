import { Button, Checkbox, Radio } from "antd";
import React from "react";
import styles from "./styles.module.css";

interface MultipleChoiceProps {
  field: any;
  index: number;
  handleFormChange: (index: number, event: any) => void;
  handleQuestionChange: (index: number, question: any) => void;
  handleRemoveImg: (index: number) => void;
  visible: boolean;
}

export function MultipleChoice({
  field,
  index,
  handleFormChange,
  handleQuestionChange,
  visible,
  handleRemoveImg,
}: MultipleChoiceProps) {
  const addAlternative = () => {
    const fieldLength = field.options.alternatives.length;
    const data = [...field.options.alternatives];
    data.push({ value: `Alternativa ${fieldLength + 1}`, correct: false });
    handleQuestionChange(index, data);
  };

  const editAlternative = (index2: number, event) => {
    const data = [...field.options.alternatives];
    data[index2].value = event.target.value;
    handleQuestionChange(index, data);
  };

  const removeAlternative = (index2: number) => {
    const data = [...field.options.alternatives];
    data.splice(index2, 1);
    handleQuestionChange(index, data);
  };

  const checkAlternative = (index2: number, event) => {
    const data = [...field.options.alternatives];
    data[index2].correct = event.target.checked;
    handleQuestionChange(index, data);
  };

  const cleanAlternatives = () => {
    const data = [...field.options.alternatives];
    data.forEach((alternative: any) => (alternative.correct = false));
    handleQuestionChange(index, data);
  }

  return (
    <div
      key={index}
      className={
        visible
          ? styles.alternativeContainerSelected
          : styles.alternativeContainer
      }
    >
      <div className={styles.alternativeContainerLeft}>
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
              <div key={index} className={styles.mapField}>
                <Checkbox
                  checked={alternative.correct}
                  onChange={(event) => checkAlternative(index, event)}
                >
                  <input
                    name="options.alternatives.value"
                    value={alternative.value}
                    onChange={(event) => editAlternative(index, event)}
                    className={styles.alternativeBody}
                  />
                </Checkbox>
                <Button
                  onClick={() => removeAlternative(index)}
                  className={styles.deleteAlternative}
                  type="text"
                >
                  <img
                    src="/exclude.svg"
                    alt="Excluir alternativa"
                    className={styles.deleteIcon}
                  />
                </Button>
              </div>
            );
          })}
        </div>

        <Button
          onClick={() => addAlternative()}
          type={"text"}
          className={styles.addAlternative}
        >
          Adicionar alternativa
        </Button>
        <Button
          onClick={() => cleanAlternatives()}
          type={"text"}
          className={styles.cleanAlternative}
        >
          Limpar alternativas
        </Button>
      </div>

      <div>
        {field.image && (
          <div className={styles.imgDiv}>
            <img
              src={field.image}
              className={styles.img}
              alt="Imagem da pergunta"
            />
            <Button
              onClick={() => handleRemoveImg(index)}
              className={styles.deleteAlternativeImg}
              type="text"
            >
              <img
                src="/exclude.svg"
                alt="Excluir alternativa"
                className={styles.deleteIconImg}
              />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
