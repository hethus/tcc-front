import type { NextPage } from "next";
import { UploadOutlined } from "@ant-design/icons";
import readXlsxFile from "read-excel-file";
import { Header } from "../src/components/header";
import { Button } from "antd";
import { InputForms } from "../src/components/inputForms";
import styles from "../styles/RegisterTeacher.module.css";
import Upload from "antd/lib/upload/Upload";
import useCRUD from "../src/components/hooks/useCRUD";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import React from "react";
import Head from "next/head";
import { useSelector } from "react-redux";
import { ITableUser } from "../src/types/interfaces";

const formFields = [
  { title: "Nome", type: "string", key: "name" },
  { title: "Nome da disciplina", type: "string", key: "subjectName" },
  { title: "Código da disciplina", type: "number", key: "subjectId" },
  { title: "Semestre", type: "string", key: "semester" },
];

const RegisterClass: NextPage = () => {
  const { user } = useSelector((state: any) => state);
  const [tableData, setTableData] = useState<ITableUser[]>([] as ITableUser[]);
  const router = useRouter();
  const { id } = router.query;
  const [classData, setClassData] = useState({});

  const {
    data,
    handleCreate: handleCreateClass,
    loading,
  } = useCRUD({
    // para criar uma nova turma
    model: "classe",
  });

  const { handleCreate: handleCreateUser } = useCRUD({
    // para criar o usuário
    model: "user",
  });

  const { handleGet: handleGetUser } = useCRUD({
    // para pegar o usuário
    model: "user",
  });

  const { handleCreate: handleCreateRelationClass } = useCRUD({
    // para criar a relação entre a turma e o usuário
    model: "classes-relation",
  });

  useEffect(() => {
    if (!loading && data) {
      setClassData(data);
    }
  }, [data]);

  const onUploadFile = (info) => {
    if (info.file.status === "done") {
      if (info.file.name.split(".")[1] !== "xlsx") {
        toast.error("Arquivo inválido", {
          toastId: "upload",
        });
        return;
      }

      toast.success(`Arquivo '${info.file.name}' carregado com sucesso`, {
        toastId: "uploadSuccess",
      });

      readXlsxFile(info.file.originFileObj).then((rows) => {
        const dataShift = rows.shift() as string[]; // remover a primeira linha com os nomes das colunas
        // mapear os dados para um objeto:
        const data = rows.map((row) => {
          const obj = {}; // criar um objeto vazio
          row.forEach((item, index) => {
            obj[dataShift[index]] = item; // adicionar os dados no objeto
          });
          return obj;
        });
        console.log(data); // aqui so pra mostrar no console, pode tirar depois
        setTableData(data as ITableUser[]); // setar os dados no estado para serem usados quando o usuário clicar em salvar
      });
    } else if (info.file.status === "error") {
      // se der erro, mostrar uma mensagem de erro:
      toast.error("Erro ao carregar arquivo", {
        toastId: "uploadError",
      });
    }
  };

  const registerNewClass = () => {
    handleCreateClass({
      values: { ...classData },
      header: {
        Authorization: `Bearer ${user.token}`,
      },
    }) // aqui vai criar a turma usando os valores do classData e o id do usuário logado
      // se der certo, vai chamar a função abaixo:
      .then(({ data: dataClass }) => {
        // se não tiver dados, vai mostrar uma mensagem de erro:
        if (!dataClass) {
          toast.error("Erro ao criar turma", {
            toastId: "createClass",
          });
        }

        // se tiver dados, vai criar o usuário usando os dados do excel:
        for (let i = 0; i < tableData.length; i++) {
          console.log(tableData[i]);
          handleCreateUser({
            values: { ...tableData[i], userType: "student" },
            header: {
              Authorization: `Bearer ${user.token}`,
            },
          }) // aqui que chama para criar o usuário
            .then(({ data, error }) => {
              // aqui vai criar a relação entre a turma e o usuário (usei uma função pq pode ser chamada no erro ou no sucesso):
              const handleRelationClass = async (userId: string) => {
                await handleCreateRelationClass({
                  values: { subjectClassId: dataClass.id, userId },
                });
              };

              if (error?.message === "Usuário já cadastrado") {
                // vai entrar aq se o usuário já estiver cadastrado, então tera que pegar o id dele e adicionar na turma
                handleGetUser({
                  refetchPathOptions: `${tableData[i].email}`,
                  header: {
                    Authorization: `Bearer ${user.token}`,
                  },  
                }).then(({ data, error }) => {
                  if (error) {
                    console.log(error)
                    toast.error("Error ao localizar o usuário", {
                      toastId: "getUser",
                    });
                    return;
                  }

                  handleRelationClass(data.id); // aqui chama a função para criar a relação
                  return;
                });
              }
              
              if (error) {
                console.log(error); // aqui vai mostrar o erro no console, se o erro n for o de usuário já cadastrado
                return;
              }

              handleRelationClass(data.id); // aqui chama a função para criar a relação
              return;
            });
        }
      });
  };

  return !loading ? (
    <div className={styles.container}>
      <Head>
        <title>Registrar nova turma - SAMI</title>
        <meta
          name="Registrar uma nova turma"
          content="Página para registrar uma nova turma"
        />
      </Head>
      <Header />
      <div className={styles.titleForms}>Cadastro Turma</div>
      <div className={styles.pageContainer}>
        <div className={styles.formsContainer}>
          {formFields.map((field, index) => {
            const { key, type } = field;
            return (
              <InputForms
                key={index}
                onChange={(e) => {
                  setClassData((prev) => ({
                    ...prev,
                    [key]:
                      type === "number"
                        ? Number(e.target.value)
                        : e.target.value,
                  }));
                }}
                {...field}
              />
            );
          })}
          <span>(Apenas arquivos xlsx)</span>
          <Upload
            onChange={onUploadFile}
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onRemove={() => {
              setTableData([]);
            }}
            maxCount={1}
          >
            <Button className={styles.buttonUpload} icon={<UploadOutlined />}>
              Alunos
            </Button>
          </Upload>
        </div>

        <div className={styles.buttonDiv}>
          <Button className={styles.buttonCancel} onClick={() => router.back()}>
            Voltar
          </Button>
          <Button className={styles.buttonRegister} onClick={registerNewClass}>
            Salvar
          </Button>
        </div>
      </div>
    </div>
  ) : null;
};

export default RegisterClass;
