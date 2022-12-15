import { Button, Radio } from "antd";
import React, { useState } from "react";
import styles from "./styles.module.css";
import TextareaAutosize from "react-textarea-autosize";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";

interface QuestionLikertProps {
  field: any;
  indexLikert: number;
  handleFormChange: (index: number, event: any) => void;
  handleQuestionLikertChange: (
    index: number,
    question: any,
    type: string
  ) => void;
  handleRemoveImg: (index: number) => void;
  visible: boolean;
  dragProp: any;
  dragging: number;
}

export function QuestionLikert({
  field,
  indexLikert,
  handleFormChange,
  handleQuestionLikertChange,
  visible,
  handleRemoveImg,
  dragProp,
  dragging,
}: QuestionLikertProps) {
  const [questionIndex, setQuestionIndex] = useState(-1);

  const addLikert = (type: "columns" | "lines") => {
    if (type === "columns") {
      const fieldLength = field.options.columns.length;
      const data = [...field.options.columns];
      data.push({ value: `Coluna ${fieldLength + 1}` });
      handleQuestionLikertChange(indexLikert, data, type);
    } else {
      const fieldLength = field.options.lines.length;
      const data = [...field.options.lines];
      data.push({
        id: uuidv4(),
        value: `Linha ${fieldLength + 1}`,
        response: "",
      });
      handleQuestionLikertChange(indexLikert, data, type);
    }
  };

  const editLikert = (
    indexQuestion: number,
    event: any,
    type: "columns" | "lines"
  ) => {
    if (type === "columns") {
      const data = [...field.options.columns];
      data[indexQuestion].value = event.target.value;
      handleQuestionLikertChange(indexLikert, data, type);
    } else {
      const data = [...field.options.lines];
      data[indexQuestion].value = event.target.value;
      handleQuestionLikertChange(indexLikert, data, type);
    }
  };

  const removeLikert = (indexQuestion: number, type: "columns" | "lines") => {
    if (type === "columns") {
      const data = [...field.options.columns];
      data.splice(indexQuestion, 1);
      handleQuestionLikertChange(indexLikert, data, type);
    } else {
      const data = [...field.options.lines];
      data.splice(indexQuestion, 1);
      handleQuestionLikertChange(indexLikert, data, type);
    }
  };

  const handleDragEndLine = (result: any) => {
    setQuestionIndex(-1);
    if (!result.destination) return;
    const data = [...field.options.lines];
    const [reorderedItem] = data.splice(result.source.index, 1);
    data.splice(result.destination.index, 0, reorderedItem);
    handleQuestionLikertChange(indexLikert, data, "lines");
  };

  const handleStartDrag = (result: any) => {
    setQuestionIndex(result.source.index);
  };

  return (
    <div
      key={indexLikert}
      className={
        dragging === indexLikert
          ? styles.likertContainerDragging
          : visible
          ? styles.likertContainerSelected
          : styles.likertContainer
      }
    >
      <div className={styles.drag} {...dragProp}>
        <img src="/drag.svg" alt="ícone de drag" />
      </div>
      <div className={styles.likertContainerLeft}>
        <input
          name="title"
          placeholder="Título da pergunta"
          value={field.title}
          onChange={(event) => handleFormChange(indexLikert, event)}
          className={
            dragging === indexLikert
              ? styles.titleInputDragging
              : styles.titleInput
          }
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
                onClick={() => handleRemoveImg(indexLikert)}
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
                {field.options.columns.map(
                  (column: any, indexQuestion: number) => {
                    return (
                      <th key={indexQuestion}>
                        <div className={styles.thContainer}>
                          <TextareaAutosize
                            name="options.columns.value"
                            value={column.value}
                            onChange={(event) =>
                              editLikert(indexQuestion, event, "columns")
                            }
                            className={styles.likertBody}
                          />
                          <Button
                            onClick={() =>
                              removeLikert(indexQuestion, "columns")
                            }
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
                  }
                )}
                <th>
                  <Button
                    onClick={() => addLikert("columns")}
                    type={"text"}
                    className={styles.addColumn}
                  >
                    <img
                      src="/plus.svg"
                      alt="adicionar coluna"
                      className={styles.plusIcon}
                    />
                  </Button>
                </th>
              </tr>
            </thead>

            <DragDropContext
              onDragEnd={handleDragEndLine}
              onBeforeDragStart={handleStartDrag}
            >
              <Droppable droppableId="likert">
                {(provided) => (
                  <tbody {...provided.droppableProps} ref={provided.innerRef}>
                    {field.options.lines.map(
                      (line: any, indexQuestion: number) => {
                        return (
                          <Draggable
                            key={line.id}
                            draggableId={line.id}
                            index={indexQuestion}
                          >
                            {(provided) => (
                              <tr
                                key={indexQuestion}
                                className={styles.thTable}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                              >
                                <td
                                  className={
                                    indexQuestion !== questionIndex
                                      ? styles.thContainer
                                      : styles.thContainerDrag
                                  }
                                >
                                  <div
                                    className={styles.dragAlternative}
                                    {...provided.dragHandleProps}
                                  >
                                    <img src="/drag.svg" alt="ícone de drag" />
                                  </div>
                                  <TextareaAutosize
                                    name="options.lines.value"
                                    value={line.value}
                                    onChange={(event) =>
                                      editLikert(indexQuestion, event, "lines")
                                    }
                                    className={styles.likertBody}
                                  />
                                  {indexQuestion !== questionIndex ? (
                                    <Button
                                      onClick={() =>
                                        removeLikert(indexQuestion, "lines")
                                      }
                                      className={styles.deleteLikert}
                                      type="text"
                                    >
                                      <img
                                        src="/exclude.svg"
                                        alt="Excluir Linha"
                                        className={styles.deleteIcon}
                                      />
                                    </Button>
                                  ) : null}
                                </td>

                                {indexQuestion !== questionIndex
                                  ? field.options.columns.map(
                                      (column: any, indexLine: number) => {
                                        return (
                                          <td key={indexLine}>
                                            <Radio
                                              className={styles.radioLines}
                                              disabled
                                            />
                                          </td>
                                        );
                                      }
                                    )
                                  : null}
                              </tr>
                            )}
                          </Draggable>
                        );
                      }
                    )}
                    {provided.placeholder}
                    <Button
                      onClick={() => addLikert("lines")}
                      type={"text"}
                      className={styles.addLine}
                    >
                      Adicionar
                    </Button>
                  </tbody>
                )}
              </Droppable>
            </DragDropContext>
          </table>
        </div>
      </div>
    </div>
  );
}
