/* eslint-disable react-hooks/rules-of-hooks */
import styles from "@/styles/UpdateClass.module.css";
import { Button, Form, Input } from "antd";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import BackPage from "../../../src/components/backPages";
import { Header } from "../../../src/components/header";
import useCRUD from "../../../src/components/hooks/useCRUD";
import { toast } from "react-toastify";
import StudentsTable from "../../../src/components/tables/studentsTable";

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

interface AllDataClass {
  name: string;
  semester: string;
  subjectName: string;
  subjectId: number;
  UsersSubjectClasses: [];
}

const UpdateClass: NextPage = () => {
  const { enums, user } = useSelector((state: any) => state);
  const hasEnums = Object.keys(enums).length;
  const route = useRouter();

  const [classData, setClassData] = useState({
    id: null,
    name: "",
    semester: "",
    subjectId: 0,
    subjectName: "",
    UsersSubjectClasses: [],
  });
  const [loading, setLoading] = useState(true);

  const { handleGet: handleGetClass } = useCRUD({
    model: "classe/one",
  });

  const {handleUpdate: handleUpdateClass} = useCRUD({
    model: 'classe'
  })

  const renderClassData = () => {
    handleGetClass({
      refetchPathOptions: route.query.index as string,
      header: {
        Authorization: `Bearer ${user.token}`,
      },
    }).then(({ data, error }) => {
      if (error) {
        console.log(error);
        toast.error("Error ao puxar os dados da turma", {
          toastId: "getClass",
        });
        return;
      }

      console.log(data);
      setClassData({
        id: data.id,
        name: data.name,
        semester: data.semester,
        subjectId: data.subjectId,
        subjectName: data.subjectName,
        UsersSubjectClasses: data.UsersSubjectClasses.map((infos) => {
          return infos?.user;
        }),
      });
    });
  };

  useEffect(() => {
    renderClassData();
  }, []);

  useEffect(() => {
    if (classData.id) {
      setLoading(false);
    }
  }, [classData]);

  console.log(classData);

  return hasEnums && !loading ? (
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
                  <Input
                    style={{ fontSize: "1.1rem", textAlign: 'center' }}
                    defaultValue={classData.name}
                    onChange={(e) => {
                      setClassData({
                        ...classData,
                        name: e.target.value,
                      });
                    }}
                  />
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
                  <Input
                    style={{ fontSize: "1.1rem", textAlign: 'center'}}
                    defaultValue={classData.subjectName}
                    onChange={(e) => {
                      setClassData({
                        ...classData,
                        subjectName: e.target.value,
                      });
                    }}
                  />
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
                  <Input
                    style={{ fontSize: "1.1rem", textAlign: 'center' }}
                    defaultValue={classData.subjectId}
                    onChange={(e) => {
                      setClassData({
                        ...classData,
                        subjectId: Number(e.target.value),
                      });
                    }}
                  />
                </Form.Item>

                <p className={styles.labelForm}>
                  Alunos
                </p>
                <StudentsTable />

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
