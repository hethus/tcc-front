import { Button, Radio } from "antd";
import React from "react";
import styles from "./styles.module.css";
import TextareaAutosize from "react-textarea-autosize";

interface QuestionTextProps {
  field: any;
  index: number;
  handleFormChange: (index: number, event: any) => void;
  visible: boolean;
  handleQuestionTextChange: (index: number, event: any) => void;
  handleRemoveImg: (index: number) => void;
}

export function QuestionText({
  field,
  index,
  handleFormChange,
  visible,
  handleQuestionTextChange,
  handleRemoveImg,
}: QuestionTextProps) {
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

        <div>
          <TextareaAutosize
            name="textResponse"
            placeholder="Escreva aqui"
            value={field.options.textResponse}
            onChange={(event) => handleQuestionTextChange(index, event)}
            className={styles.textArea}
            disabled
          />
        </div>
      </div>
      <div>
        {field.image && (
          <div className={styles.imgDiv}>
            <img
              src={field.image}
              alt="Imagem da pergunta"
              className={styles.img}
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
