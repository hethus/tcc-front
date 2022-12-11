import { Button, Dropdown } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { MenuQuestions } from "../menuQuestions";
import { QuestionAlternative } from "./alternative";
import { MultipleChoice } from "./multipleChoice";
import styles from "./styles.module.css";
import { QuestionText } from "./text";

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

  const [visible, setVisible] = useState({
    index: -1,
    visible: false,
  });

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

  const handleQuestionTextChange = (index, event) => {
    let data = [...formFields];
    data[index].options.textResponse = event.target.value;
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
      {formFields.map((field: any, index: number) => {
        switch (field.type) {
          case "alternative":
            return (
              <div
                key={index}
                className={styles.menuPosition}
                onMouseEnter={() => handleVisible(index)}
              >
                <QuestionAlternative
                  field={field}
                  index={index}
                  handleFormChange={handleFormChange}
                  visible={
                    visible.index === index && visible.visible ? true : false
                  }
                  handleQuestionChange={handleQuestionChange}
                  handleRemoveImg={handleRemoveImg}
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
                  />
                )}
              </div>
            );
          case "text":
            return (
              <div
                key={index}
                className={styles.menuPosition}
                onMouseEnter={() => handleVisible(index)}
              >
                <QuestionText
                  field={field}
                  index={index}
                  handleFormChange={handleFormChange}
                  visible={
                    visible.index === index && visible.visible ? true : false
                  }
                  handleQuestionTextChange={handleQuestionTextChange}
                  handleRemoveImg={handleRemoveImg}
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
                  />
                )}
              </div>
            );
          case "likert":
            return <div>likert</div>;
          case "multipleChoice":
            return (
              <div
                key={index}
                className={styles.menuPosition}
                onMouseEnter={() => handleVisible(index)}
              >
                <MultipleChoice
                  field={field}
                  index={index}
                  handleFormChange={handleFormChange}
                  visible={
                    visible.index === index && visible.visible ? true : false
                  }
                  handleQuestionChange={handleQuestionChange}
                  handleRemoveImg={handleRemoveImg}
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
                  />
                )}
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
