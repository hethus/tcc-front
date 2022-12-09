import type { NextPage } from "next";
import styles from "../../styles/Forms.module.css";
import { Header } from "../../src/components/header";
import React, { useState } from "react";
import Head from "next/head";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { appRoutes } from "../../constants";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Dropdown, Space, Switch } from "antd";
import { QuestionList } from "../../src/components/questions";

const Home: NextPage = () => {
  const { forms } = useSelector((state: any) => state);
  const router = useRouter();
  const [formFields, setFormFields] = useState([] as any);

  const submit = (e: any) => {
    e.preventDefault();
    console.log(formFields);
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
            />
            <Space direction="horizontal">
              <p>Ordem aleatória:</p>
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                defaultChecked
              />
            </Space>
          </div>
          <textarea
            placeholder="Descrição do formulário"
            className={styles.headerTextArea}
          />
        </div>
        <QuestionList formFields={formFields} setFormFields={setFormFields} />
      </div>
        <div
          className={styles.footerForm}
        >
          <Button onClick={submit} type="primary">Enviar formulário</Button>
        </div>
    </div>
  );
};

export default Home;
