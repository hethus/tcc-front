import Checkbox from "antd/lib/checkbox/Checkbox";
import type { NextPage } from "next";
import { useState } from "react";
import { Header } from "../src/components/header";
import { Button } from "antd";
import { InputForms } from "../src/components/inputForms";
import useCRUD from "../src/components/hooks/useCRUD";
import styles from "../styles/RegisterTeacher.module.css";
import { toast } from "react-toastify";
import React from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

interface TeacherTypes {
  name: string;
  email: string;
  registration: string;
  userType: "admin" | "teacher";
}

const RegisterTeacher: NextPage = () => {
  const { user } = useSelector((state: any) => state);

  const [isAdm, setIsAdm] = useState(false);
  const [teacherSubmit, setTeacherSubmit] = useState<TeacherTypes>({
    name: "",
    email: "",
    registration: "",
    userType: "teacher",
  });

  const router = useRouter();
  const { id } = router.query;

  const { handleCreate: handleRegisterTeacher, loading } = useCRUD({
    model: "user",
    immediatlyLoadData: !!id,
  });

  const handleChangeValues = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isAdm === true) {
      setTeacherSubmit((values: TeacherTypes) => ({
        ...values,
        [e.target.name]: e.target.value,
        userType: "admin",
      }));
    } else {
      setTeacherSubmit((values: TeacherTypes) => ({
        ...values,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleRegister = () => {
    handleRegisterTeacher({
      values: teacherSubmit,
      header: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then(() => {
        toast.success("Professor registrado com sucesso!");
      })
      .catch((error: any) => {
        throw new Error(error);
      });
  };

  return !loading ? (
    <div className={styles.container}>
      <Header />
      <div className={styles.titleForms}>Cadastro Professor</div>
      <form className={styles.pageContainer}>
        <div className={styles.formsContainer}>
          <InputForms
            title="Nome"
            type="string"
            name="name"
            onChange={handleChangeValues}
          />
          <InputForms
            title="Email"
            type="email"
            name="email"
            onChange={handleChangeValues}
          />
          <InputForms
            title="Matricula"
            type="string"
            name="registration"
            onChange={handleChangeValues}
          />
        </div>

        <Checkbox
          className={styles.checkbox}
          name="userType"
          onChange={() => setIsAdm(!isAdm)}
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
  ) : null;
};

export default RegisterTeacher;
