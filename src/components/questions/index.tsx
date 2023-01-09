import { Button, Dropdown } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { MenuQuestions } from "../menuQuestions";
import { QuestionAlternative } from "./alternative";
import { QuestionLikert } from "./likert";
import { MultipleChoice } from "./multipleChoice";
import styles from "./styles.module.css";
import { QuestionText } from "./text";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";

interface QuestionListProps {
  formFields: any;
  setFormFields: any;
}

export function QuestionList({ formFields, setFormFields }: QuestionListProps) {
  const [loading, setLoading] = useState(false);
  const items = [
    { label: "Alternativas", key: "alternative" },
    { label: "Texto", key: "text" },
    { label: "Likert", key: "likert" },
    { label: "Múltipla escolha", key: "multipleChoice" },
  ];

  const [dragging, setDragging] = useState(-1);

  const [visible, setVisible] = useState({
    index: -1,
    visible: false,
  });

  const handleOnDragEnd = (result: any) => {
    setDragging(-1);
    if (!result.destination) return;

    const items = Array.from(formFields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    //atualizar o order de cada item
    items.forEach((item: any, index: number) => {
      item.order = index + 1;
    });
    setFormFields(items);
  };

  const addFields = (e: any) => {
    let newField = {};

    switch (e.key) {
      case "alternative":
        newField = {
          type: "alternative",
          id: uuidv4(),
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
          id: uuidv4(),
          title: "",
          order: formFields.length + 1, //
          singleAnswer: false, //
          random: false,
          mandatory: false,
          options: {
            textResponse: "",
            response: "",
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
          id: uuidv4(),
          title: "",
          order: formFields.length + 1, //
          singleAnswer: false, //
          random: false,
          mandatory: false,
          options: {
            columns: [],
            lines: [], // aq tem q ser um array de objetos com a questão e a resposta do usuário (value: "questão 1", response: "bom")
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
          id: uuidv4(),
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
      default:
        break;
    }

    setFormFields([...formFields, newField]);
  };

  const changeProperties = (e: any, property: string, index: number) => {
    let data = [...formFields];
    data[index][property] = e;
    setFormFields(data);
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
    // alternatives e multipleChoice
    let data = [...formFields];
    data[index].options.alternatives = question;
    setFormFields(data);
  };

  const handleQuestionTextChange = (index, event) => {
    // textResponse
    let data = [...formFields];
    data[index].options.textResponse = event.target.value;
    setFormFields(data);
  };

  const handleQuestionLikertChange = (index, question, type) => {
    // columns e lines
    let data = [...formFields];
    if (type === "columns") data[index].options.columns = question;
    if (type === "lines") data[index].options.lines = question;
    setFormFields(data);
  };

  const handleDuplicate = (question: any) => {
    const duplicate = JSON.parse(
      JSON.stringify({ ...question, order: formFields.length + 1 })
    );
    setFormFields([...formFields, duplicate]);
  };

  const handleVisible = (index: number) => {
    setVisible({
      index,
      visible: true,
    });
  };
  const handleImgChange = (index: number, e: any) => {
    const file = e.target.files?.[0];
    //verifica se o file não é imagem
    if (!file?.type.match(/image.*/)) {
      toast.error("Arquivo não é uma imagem");
      return;
    }

    //verifica se o tamanho do arquivo é maior que 5mb
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Arquivo muito grande");
      return;
    }

    if (file) {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", file);
      formData.append("album", process.env.NEXT_PUBLIC_CLIENT_ALBUM as string);

      axios
        .post(`https://api.imgur.com/3/image`, formData, {
          headers: {
            Authorization: process.env.NEXT_PUBLIC_CLIENT_ID as string,
          },
        })
        .then((response) => {
          let data = [...formFields];
          data[index].image = response.data.data.link;
          setFormFields(data);
          setLoading(false);
        })
        .catch(() => {
          toast.error("Erro ao enviar imagem");
          setLoading(false);
        });
    }
  };

  const handleRemoveImg = (index: number) => {
    let data = [...formFields];
    data[index].image = "";
    setFormFields(data);
  };

  const handleStartDrag = (result: any) => {
    setDragging(result.source.index);
  };

  if (formFields.length === 0) {
    return (
      <div className={styles.newFormOptions}>
        <p>
          <b>Formulário sem perguntas</b>
        </p>
        <p>Adicione a primeira pergunta:</p>

        <Dropdown menu={{ items, onClick: addFields }} trigger={["click"]}>
          <Button type="primary">Escolher questão</Button>
        </Dropdown>
      </div>
    );
  }

  return (
    <div className={styles.questionList}>
      <DragDropContext onDragEnd={handleOnDragEnd} onDragStart={handleStartDrag}>
        <Droppable droppableId="questions">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {formFields.map((field: any, index: number) => {
                switch (field.type) {
                  case "alternative":
                    return (
                      <Draggable
                        key={field.id}
                        draggableId={field.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            {...provided.draggableProps}
                            ref={provided.innerRef}
                            className={styles.menuPosition}
                            onMouseEnter={() => handleVisible(index)}
                          >
                            <QuestionAlternative
                              field={field}
                              indexQuestion={index}
                              handleFormChange={handleFormChange}
                              visible={
                                visible.index === index && visible.visible
                                  ? true
                                  : false
                              }
                              handleQuestionChange={handleQuestionChange}
                              handleRemoveImg={handleRemoveImg}
                              dragProp={provided.dragHandleProps}
                              dragging={dragging}
                            />
                            {visible.index === index && visible.visible && (
                              <MenuQuestions
                                index={index}
                                removeFields={removeFields}
                                handleDuplicate={handleDuplicate}
                                items={items}
                                loading={loading}
                                handleImgChange={handleImgChange}
                                addFields={addFields}
                                field={field}
                                changeProperties={changeProperties}
                              />
                            )}
                          </div>
                        )}
                      </Draggable>
                    );
                  case "text":
                    return (
                      <Draggable
                        key={field.id}
                        draggableId={field.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            {...provided.draggableProps}
                            ref={provided.innerRef}
                            className={styles.menuPosition}
                            onMouseEnter={() => handleVisible(index)}
                          >
                            <QuestionText
                              field={field}
                              index={index}
                              handleFormChange={handleFormChange}
                              visible={
                                visible.index === index && visible.visible
                                  ? true
                                  : false
                              }
                              handleQuestionTextChange={
                                handleQuestionTextChange
                              }
                              handleRemoveImg={handleRemoveImg}
                              dragProp={provided.dragHandleProps}
                              dragging={dragging}
                            />
                            {visible.index === index && visible.visible && (
                              <MenuQuestions
                                index={index}
                                removeFields={removeFields}
                                handleDuplicate={handleDuplicate}
                                items={items}
                                loading={loading}
                                handleImgChange={handleImgChange}
                                addFields={addFields}
                                field={field}
                                changeProperties={changeProperties}
                              />
                            )}
                          </div>
                        )}
                      </Draggable>
                    );
                  case "likert":
                    return (
                      <Draggable
                        key={field.id}
                        draggableId={field.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            {...provided.draggableProps}
                            ref={provided.innerRef}
                            className={styles.menuPosition}
                            onMouseEnter={() => handleVisible(index)}
                          >
                            <QuestionLikert
                              field={field}
                              indexLikert={index}
                              handleFormChange={handleFormChange}
                              visible={
                                visible.index === index && visible.visible
                                  ? true
                                  : false
                              }
                              handleQuestionLikertChange={
                                handleQuestionLikertChange
                              }
                              handleRemoveImg={handleRemoveImg}
                              dragProp={provided.dragHandleProps}
                              dragging={dragging}
                            />
                            {visible.index === index && visible.visible && (
                              <MenuQuestions
                                index={index}
                                removeFields={removeFields}
                                handleDuplicate={handleDuplicate}
                                items={items}
                                loading={loading}
                                handleImgChange={handleImgChange}
                                addFields={addFields}
                                field={field}
                                changeProperties={changeProperties}
                              />
                            )}
                          </div>
                        )}
                      </Draggable>
                    );
                  case "multipleChoice":
                    return (
                      <Draggable
                        key={field.id}
                        draggableId={field.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            {...provided.draggableProps}
                            ref={provided.innerRef}
                            className={styles.menuPosition}
                            onMouseEnter={() => handleVisible(index)}
                          >
                            <MultipleChoice
                              field={field}
                              indexQuestion={index}
                              handleFormChange={handleFormChange}
                              visible={
                                visible.index === index && visible.visible
                                  ? true
                                  : false
                              }
                              handleQuestionChange={handleQuestionChange}
                              handleRemoveImg={handleRemoveImg}
                              dragProp={provided.dragHandleProps}
                              dragging={dragging}
                            />
                            {visible.index === index && visible.visible && (
                              <MenuQuestions
                                index={index}
                                removeFields={removeFields}
                                handleDuplicate={handleDuplicate}
                                items={items}
                                loading={loading}
                                handleImgChange={handleImgChange}
                                addFields={addFields}
                                field={field}
                                changeProperties={changeProperties}
                              />
                            )}
                          </div>
                        )}
                      </Draggable>
                    );
                  default:
                    return null;
                }
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
