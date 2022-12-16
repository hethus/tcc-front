import { Button, Radio } from "antd";
import React from "react";
import styles from "./styles.module.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";

interface QuestionAlternativeProps {
  field: any;
  indexQuestion: number;
  handleFormChange: (index: number, event: any) => void;
  handleQuestionChange: (index: number, question: any) => void;
  handleRemoveImg: (index: number) => void;
  visible: boolean;
  dragProp: any;
  dragging: number;
}

export function QuestionAlternative({
  field,
  indexQuestion,
  handleFormChange,
  handleQuestionChange,
  visible,
  handleRemoveImg,
  dragProp,
  dragging,
}: QuestionAlternativeProps) {
  const addAlternative = () => {
    const fieldLength = field.options.alternatives.length;
    const data = [...field.options.alternatives];
    data.push({
      id: uuidv4(),
      value: `Alternativa ${fieldLength + 1}`,
      correct: false,
    });
    handleQuestionChange(indexQuestion, data);
  };

  const editAlternative = (indexAlternative: number, event) => {
    const data = [...field.options.alternatives];
    data[indexAlternative].value = event.target.value;
    handleQuestionChange(indexQuestion, data);
  };

  const removeAlternative = (indexAlternative: number) => {
    const data = [...field.options.alternatives];
    data.splice(indexAlternative, 1);
    handleQuestionChange(indexQuestion, data);
  };

  /* const checkAlternative = (index2: number, event) => {
    const data = [...field.options.alternatives];
    data.forEach((alternative) => (alternative.correct = false));
    data[index2].correct = event.target.checked;
    handleQuestionChange(index, data);
  }; */

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(field.options.alternatives);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    handleQuestionChange(indexQuestion, items);
  };

  return (
    <div
      key={indexQuestion}
      className={
        dragging === indexQuestion
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
          onChange={(event) => handleFormChange(indexQuestion, event)}
          className={
            dragging === indexQuestion
              ? styles.titleInputDragging
              : styles.titleInput
          }
        />

        <div className={styles.body}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="alternatives">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {field.options.alternatives.map(
                    (alternative: any, indexAlternative: number) => {
                      return (
                        <Draggable
                          key={alternative.id}
                          draggableId={alternative.id}
                          index={indexAlternative}
                        >
                          {(provided) => (
                            <div
                              className={styles.mapField}
                              {...provided.draggableProps}
                              ref={provided.innerRef}
                            >
                              <div
                                className={styles.dragAlternative}
                                {...provided.dragHandleProps}
                              >
                                <img src="/drag.svg" alt="ícone de drag" />
                              </div>
                              <Radio disabled>
                                <input
                                  name="options.alternatives.value"
                                  value={alternative.value}
                                  onChange={(event) =>
                                    editAlternative(indexAlternative, event)
                                  }
                                  className={styles.alternativeBody}
                                />
                              </Radio>
                              <Button
                                onClick={() =>
                                  removeAlternative(indexAlternative)
                                }
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
                          )}
                        </Draggable>
                      );
                    }
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        <Button
          onClick={() => addAlternative()}
          type={"text"}
          className={styles.addAlternative}
        >
          Adicionar alternativa
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
              onClick={() => handleRemoveImg(indexQuestion)}
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
