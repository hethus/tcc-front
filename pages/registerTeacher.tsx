import Checkbox from "antd/lib/checkbox/Checkbox";
import type { NextPage } from "next";
import { useState } from "react";
import { Header } from "../src/components/header";
import { Button } from "antd";
import { InputForms } from "../src/components/inputForms";
import styles from "../styles/RegisterTeacher.module.css";

const RegisterTeacher: NextPage = () => {
  const [isAdm, setIsAdm] = useState(false);

  const onChange = () => {
    setIsAdm(!isAdm);
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.titleForms}>Cadastro Professor</div>
      <div className={styles.pageContainer}>
        <div className={styles.formsContainer}>
          <InputForms title="Nome" type="string" />
          <InputForms title="Email" type="email" />
          <InputForms title="Matricula" type="string" />
        </div>

        <Checkbox className={styles.checkbox} onChange={onChange}>
          Administrador
        </Checkbox>

        <div className={styles.buttonDiv}>
          <Button className={styles.buttonCancel}>Voltar</Button>
          <Button className={styles.buttonRegister}>Cadastrar</Button>
        </div>
      </div>
    </div>
  );
};

export default RegisterTeacher;
