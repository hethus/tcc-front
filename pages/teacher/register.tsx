import Checkbox from "antd/lib/checkbox/Checkbox";
import type { NextPage } from "next";
import { ChangeEvent, useState } from "react";
import { Header } from "../../src/components/header";
import { Button } from "antd";
import { InputForms } from "../../src/components/inputForms";
import useCRUD from "../../src/components/hooks/useCRUD";
import styles from "../../styles/RegisterTeacher.module.css";
import { toast } from "react-toastify";
import React from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Head from "next/head";
import { appRoutes } from "../../constants";

interface TeacherTypes {
  name: string;
  email: string;
  registration: string;
}

const RegisterTeacher: NextPage = () => {
  const { user } = useSelector((state: any) => state);

  const [isAdm, setIsAdm] = useState(false);
  const [teacherData, setTeacherData] = useState<TeacherTypes>({
    name: "",
    email: "",
    registration: "",
  });

  const router = useRouter();

  const { handleCreate } = useCRUD({
    model: "user",
  });

  const handleChangeValues = (e: ChangeEvent<HTMLInputElement>) => {
    setTeacherData((values: TeacherTypes) => ({
      ...values,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = () => {
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

    handleCreate({
      values: { ...teacherData, userType: isAdm ? "admin" : "teacher" },
      header: {
        Authorization: `Bearer ${user.token}`,
      },
    }).then(({ data, error }) => {
      if (error) {
        toast.error("Erro ao registrar professor!", {
          toastId: "errorRegisterTeacher",
        });
        console.log(error);
        return;
      }
      toast.success("Professor registrado com sucesso!", {
        toastId: "successRegisterTeacher",
      });
      router.push(appRoutes.home);
    });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Cadastrar Professor - SAMI</title>
        <meta
          name="Registrar um novo professor"
          content="Página para registrar um novo professor"
        />
      </Head>
      <Header />
      <div className={styles.titleForms}>Cadastro de Professor</div>
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
          <Button className={styles.buttonRegister} onClick={handleRegister}>
            Cadastrar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RegisterTeacher;
