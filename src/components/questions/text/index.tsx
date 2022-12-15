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
  dragProp: any;
  dragging: number;
}

export function QuestionText({
  field,
  index,
  handleFormChange,
  visible,
  handleQuestionTextChange,
  handleRemoveImg,
  dragProp,
  dragging,
}: QuestionTextProps) {
  return (
    <div
      key={index}
      className={
        dragging === index
          ? styles.alternativeContainerDragging
          : visible
          ? styles.alternativeContainerSelected
          : styles.alternativeContainer
      }
    >
      <div className={styles.drag} {...dragProp}>
        <img src="/drag.svg" alt="ícone de drag" />
      </div>
      <div className={styles.alternativeContainerLeft}>
        <input
          name="title"
          placeholder="Título da pergunta"
          value={field.title}
          onChange={(event) => handleFormChange(index, event)}
          className={
            dragging === index ? styles.titleInputDragging : styles.titleInput
          }
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
