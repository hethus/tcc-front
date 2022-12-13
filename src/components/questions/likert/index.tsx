import { Button, Radio } from "antd";
import React from "react";
import styles from "./styles.module.css";
import TextareaAutosize from "react-textarea-autosize";


interface QuestionLikertProps {
  field: any;
  index: number;
  handleFormChange: (index: number, event: any) => void;
  handleQuestionLikertChange: (index: number, question: any, type: string) => void;
  handleRemoveImg: (index: number) => void;
  visible: boolean;
}

export function QuestionLikert({
  field,
  index,
  handleFormChange,
  handleQuestionLikertChange,
  visible,
  handleRemoveImg,
}: QuestionLikertProps) {
  const addLikert = (type: string) => {
    if (type === "columns") {
      const fieldLength = field.options.columns.length;
      const data = [...field.options.columns];
      data.push({ value: `Coluna ${fieldLength + 1}` });
      handleQuestionLikertChange(index, data, type);
    } else {
      const fieldLength = field.options.lines.length;
      const data = [...field.options.lines];
      data.push({ value: `Linha ${fieldLength + 1}`, response: "" });
      handleQuestionLikertChange(index, data, type);
    }
  };

  const editLikert = (index2: number, event, type: string) => {
    if (type === "columns") {
      const data = [...field.options.columns];
      data[index2].value = event.target.value;
      handleQuestionLikertChange(index, data,type);
    } else {
      const data = [...field.options.lines];
      data[index2].value = event.target.value;
      handleQuestionLikertChange(index, data, type);
    }
  };

  const removeLikert = (index2: number, type: string) => {
    if (type === "columns") {
      const data = [...field.options.columns];
      data.splice(index2, 1);
      handleQuestionLikertChange(index, data, type);
    } else {
      const data = [...field.options.lines];
      data.splice(index2, 1);
      handleQuestionLikertChange(index, data, type);
    }
  };

  return (
    <div
      key={index}
      className={
        visible
          ? styles.likertContainerSelected
          : styles.likertContainer
      }
    >
      <div className={styles.likertContainerLeft}>
        <input
          name="title"
          placeholder="Título da pergunta"
          value={field.title}
          onChange={(event) => handleFormChange(index, event)}
          className={styles.titleInput}
        />
          {field.image && (
        <div className={styles.imgContainer}>
            <div className={styles.imgDiv}>
              <img
                src={field.image}
                className={styles.img}
                alt="Imagem da pergunta"
              />
              <Button
                onClick={() => handleRemoveImg(index)}
                className={styles.deleteLikertImg}
                type="text"
              >
                <img
                  src="/exclude.svg"
                  alt="Excluir imagem"
                  className={styles.deleteIconImg}
                />
              </Button>
            </div>
        </div>
          )}

        <div className={styles.body}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.thTable}>
                <th></th>
                {field.options.columns.map((column, index2) => {
                  return (
                    <th key={index2}>
                      <div className={styles.thContainer}>

                      <TextareaAutosize
                        name="options.columns.value"
                        value={column.value}
                        onChange={(event) =>
                          editLikert(index2, event, "columns")
                        }
                        className={styles.likertBody}
                      />
                      <Button
                        onClick={() => removeLikert(index2, "columns")}
                        className={styles.deleteLikert}
                        type="text"
                      >
                        <img
                          src="/exclude.svg"
                          alt="Excluir Coluna"
                          className={styles.deleteIcon}
                        />
                      </Button>
                      </div>
                    </th>
                  );
                })}
                <th>

                <Button
                  onClick={() => addLikert("columns")}
                  type={"text"}
                  className={styles.addColumn}
                >
                  <img src="/plus.svg" alt="adicionar coluna" className={styles.plusIcon}/>
                </Button>
                </th>
              </tr>
            </thead>

            <tbody>
              {field.options.lines.map((line, index2) => {
                return (
                  <tr key={index2} className={styles.thTable}>
                    <td className={styles.thContainer}>
                      <TextareaAutosize
                        name="options.lines.value"
                        value={line.value}
                        onChange={(event) => editLikert(index2, event, "lines")}
                        className={styles.likertBody}
                      />
                      <Button
                        onClick={() => removeLikert(index2, "lines")}
                        className={styles.deleteLikert}
                        type="text"
                      >
                        <img
                          src="/exclude.svg"
                          alt="Excluir Linha"
                          className={styles.deleteIcon}
                        />
                      </Button>
                    </td>

                    {field.options.columns.map((column, index3) => {
                      return (
                        <td key={index3}>
                          <Radio
                          className={styles.radioLines}
                            disabled
                          />
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              <tr className={styles.thTable}>

              <Button
                onClick={() => addLikert("lines")}
                type={"text"}
                className={styles.addLine}
              >
                Adicionar
              </Button>
              </tr>
            </tbody>
          </table>
        </div>

        
      </div>
    </div>
  );
}
