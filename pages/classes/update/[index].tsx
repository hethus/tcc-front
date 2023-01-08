/* eslint-disable react-hooks/rules-of-hooks */
import styles from "@/styles/UpdateClass.module.css";
import { Button, Form, Input } from "antd";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from 'next/router';
import BackPage from "../../../src/components/backPages";
import { Header } from "../../../src/components/header";
import useCRUD from "../../../src/components/hooks/useCRUD";

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = (context) => {
  const { params } = context;

  return {
    props: {
      params,
    },
  };
};

const UpdateClass: NextPage = () => {
  const { enums, user } = useSelector((state: any) => state);
  const hasEnums = Object.keys(enums).length;
  const route = useRouter();

  const [classData, setClassData] = useState('');

  const { handleGet: handleGetClass } = useCRUD({
    model: 'classe/one'
  })

  const renderClassData = async () => {
    handleGetClass({
      refetchPathOptions: route.query.index as string,
      header: {
        Authorization: `Bearer ${user.token}`
      }
    })
    .then(({data}) => {
      console.log(data)
      setClassData(data)
    })
    .catch((error: any) => {
      console.error(`Message error: ${error}`)
      return
    })
  }

  useEffect(() => {
    renderClassData()
  }, [])

  return hasEnums ? (
    <div className={styles.container}>
      <Header />

      <div className={styles.body}>
        <BackPage />

        <div className={styles.content}>
          <h1 className={styles.title}>Atualizar Turma</h1>

          <div className={styles.containerForm}>
            <div className={styles.contentForm}>
              <form
                style={{
                  alignContent: "center",
                  textAlign: "center",
                }}
                autoComplete="off"
              >
                <label className={styles.labelForm} htmlFor="name">
                  Nome
                </label>
                <Form.Item
                  name="name"
                  id="name"
                  style={{ fontSize: "0" }}
                  rules={[
                    {
                      required: true,
                      message: "Adicione um nome!",
                      type: "string",
                    },
                  ]}
                >
                  <Input style={{ fontSize: "1.1rem" }} />
                </Form.Item>

                <label className={styles.labelForm} htmlFor="discipline">
                  Disciplina
                </label>
                <Form.Item
                  name="discipline"
                  id="discipline"
                  rules={[
                    {
                      required: true,
                      message: "Coloque uma disciplina!",
                      type: "string",
                    },
                  ]}
                >
                  <Input style={{ fontSize: "1.1rem" }} />
                </Form.Item>

                <label className={styles.labelForm} htmlFor="code">
                  Código de disciplina
                </label>
                <Form.Item
                  name="code"
                  id="code"
                  rules={[
                    {
                      required: true,
                      message: "Coloque uma disciplina!",
                      type: "string",
                    },
                  ]}
                >
                  <Input style={{ fontSize: "1.1rem" }} />
                </Form.Item>

                <label className={styles.labelForm} htmlFor="students">
                  Alunos
                </label>
                <Form.Item
                  name="students"
                  id="students"
                  rules={[
                    {
                      required: true,
                      message: "Coloque uma disciplina!",
                      type: "string",
                    },
                  ]}
                >
                  <Input style={{ fontSize: "1.1rem" }} />
                </Form.Item>

                <Form.Item>
                  <Button className={styles.addStudentsBtn} type="primary">
                    Adicionar Alunos
                  </Button>
                </Form.Item>

                <div className={styles.contentBtns}>
                  <Button type="primary" className={styles.backBtn}>
                    Voltar
                  </Button>

                  <Button type="primary" className={styles.updateBtn}>
                    Salvar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default UpdateClass;
