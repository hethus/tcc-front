import type { NextPage } from "next";
import styles from "../../styles/Forms.module.css";
import { Header } from "../../src/components/header";
import React, { useState } from "react";
import Head from "next/head";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { appRoutes } from "../../constants";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Space, Switch } from "antd";
import { QuestionList } from "../../src/components/questions";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "react-toastify";
import { validateForm } from "../../src/utils/validate-forms";
import useCRUD from "../../src/components/hooks/useCRUD";
import { formsUpdate } from "../../store/actions/forms";
import { useDispatch } from "react-redux";

const RegisterForm: NextPage = () => {
  const { handleCreate } = useCRUD({ model: "form" });
  const { handleGet } = useCRUD({ model: "form" });
  
  const { user } = useSelector((state: any) => state);
  const router = useRouter();
  const dispatch = useDispatch();

  const [formHeader, setFormHeader] = useState({
    title: "",
    description: "",
    randomOrder: false,
  });
  const [formFields, setFormFields] = useState([] as any);

  const submit = (e: any) => {
    e.preventDefault();

    const valid = validateForm(formHeader, formFields);

    if (!valid) {
      return;
    }

    const newForm = {
      name: formHeader.title,
      description: formHeader.description,
      random: formHeader.randomOrder,
      questions: formFields,
    };

    handleCreate({
      values: newForm,
      header: {
        Authorization: `Bearer ${user.token}`,
      },
    }).then(({ data, error }) => {
      if (error) {
        toast.error("Erro ao criar formulário");
        return;
      }
      toast.success("Formulário criado com sucesso!");

      handleGet({
        header: {
          Authorization: `Bearer ${user.token}`,
        },
        refetchPathOptions: `${user.email}`,
      }).then(({ data, error }) => {
        if (error) {
          toast.error("Erro ao buscar formulário");
          router.push(appRoutes.home);
          return;
        }
        dispatch(formsUpdate(data));
        router.push(appRoutes.home);
      });
    });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Criar formulário - SAMI</title>
        <meta name="Página inicial" content="Página inicial da aplicação" />
      </Head>
      <Header />
      <div className={styles.body}>
        <div className={styles.headerForm}>
          <div className={styles.headerFirstLine}>
            <input
              className={styles.headerInput}
              type="text"
              placeholder="Título do formulário"
              value={formHeader.title}
              onChange={(e) => {
                setFormHeader({
                  ...formHeader,
                  title: e.target.value,
                });
              }}
            />
            <Space direction="horizontal">
              <p>Ordem aleatória:</p>
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                defaultChecked
                checked={formHeader.randomOrder}
                onChange={(checked) => {
                  setFormHeader({
                    ...formHeader,
                    randomOrder: checked,
                  });
                }}
              />
            </Space>
          </div>
          <TextareaAutosize
            placeholder="Descrição do formulário"
            value={formHeader.description}
            className={styles.headerTextArea}
            onChange={(e) => {
              setFormHeader({
                ...formHeader,
                description: e.target.value,
              });
            }}
          />
        </div>
        <QuestionList formFields={formFields} setFormFields={setFormFields} />
      </div>
      <div className={styles.footerForm}>
        <Button onClick={submit} type="primary">
          Enviar formulário
        </Button>
      </div>
    </div>
  );
};

export default RegisterForm;
