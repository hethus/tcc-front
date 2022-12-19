import Checkbox from "antd/lib/checkbox/Checkbox";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { ChangeEvent, useEffect, useState } from "react";
import { Header } from "../../../src/components/header";
import { Button } from "antd";
import { InputForms } from "../../../src/components/inputForms";
import useCRUD from "../../../src/components/hooks/useCRUD";
import styles from "../../../styles/RegisterTeacher.module.css";
import { toast } from "react-toastify";
import React from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Head from "next/head";
import { appRoutes } from "../../../constants";

interface TeacherTypes {
  name: string;
  email: string;
  registration: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { params } = context;

  return {
    props: {
      params,
    },
  };
};

const RegisterTeacher: NextPage = () => {
  const { user } = useSelector((state: any) => state);

  const [isAdm, setIsAdm] = useState(false);
  const [teacherData, setTeacherData] = useState<TeacherTypes>({
    name: "",
    email: "",
    registration: "",
  });

  const router = useRouter();

  const { handleUpdate, loading } = useCRUD({
    model: "user",
  });

  const { handleGet } = useCRUD({
    model: "user",
  });

  useEffect(() => {
    if (!router.isReady) return;

    const emailTeacher = router.asPath.split("/")[3];
    handleGet({
      header: {
        Authorization: `Bearer ${user.token}`,
      },
      refetchPathOptions: `${emailTeacher}`,
    }).then(({ data, error }) => {
      if (error) {
        toast.error("Erro ao buscar dados do professor!");
        return;
      }

      setTeacherData({
        name: data.name,
        email: data.email,
        registration: data.registration,
      });

      setIsAdm(data.userType === "admin" ? true : false);
    });
  }, []);

  const handleChangeValues = (e: ChangeEvent<HTMLInputElement>) => {
    setTeacherData((values: TeacherTypes) => ({
      ...values,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEdit = () => {
    if (teacherData.name === "") {
      toast.error("Nome não pode ser vazio!", {
        toastId: "errorRegisterTeacher",
      });
      return;
    }
    if (
      teacherData.email === "" ||
      !teacherData.email.match(/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/)
    ) {
      toast.error("Email inválido!", {
        toastId: "errorRegisterTeacher",
      });
      return;
    }
    if (teacherData.registration === "") {
      toast.error("Matrícula não pode ser vazia!", {
        toastId: "errorRegisterTeacher",
      });
      return;
    }

    const emailTeacher = router.asPath.split("/")[3];

    handleUpdate({
      values: { ...teacherData, userType: isAdm ? "admin" : "teacher" },
      header: {
        Authorization: `Bearer ${user.token}`,
      },
      refetchPathOptions: `${emailTeacher}`,
    }).then(({ data, error }) => {
      if (error) {
        toast.error("Erro ao editar professor!", {
          toastId: "errorEditTeacher",
        });
        return;
      }
      toast.success("Professor alterado com sucesso!", {
        toastId: "successEditTeacher",
      });
      router.push(appRoutes.home);
    });
  };

  return !loading ? (
    <div className={styles.container}>
      <Head>
        <title>Editar Professor - SAMI</title>
        <meta
          name="Editar Professor"
          content="Página para editar um professor"
        />
      </Head>
      <Header />
      <div className={styles.titleForms}>Editar cadastro de Professor</div>
      <form className={styles.pageContainer}>
        <div className={styles.formsContainer}>
          <InputForms
            title="Nome"
            type="string"
            name="name"
            onChange={handleChangeValues}
            value={teacherData.name}
          />
          <InputForms
            title="Email"
            type="email"
            name="email"
            onChange={handleChangeValues}
            value={teacherData.email}
          />
          <InputForms
            title="Matricula"
            type="string"
            name="registration"
            onChange={handleChangeValues}
            value={teacherData.registration}
          />
        </div>

        <Checkbox
          className={styles.checkbox}
          name="userType"
          onChange={() => setIsAdm(!isAdm)}
          checked={isAdm}
        >
          Administrador
        </Checkbox>

        <div className={styles.buttonDiv}>
          <Button className={styles.buttonCancel} onClick={() => router.back()}>
            Voltar
          </Button>
          <Button className={styles.buttonRegister} onClick={handleEdit}>
            Cadastrar
          </Button>
        </div>
      </form>
    </div>
  ) : null;
};

export default RegisterTeacher;
