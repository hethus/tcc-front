import React from "react";
import styled from "@/styles/changePassword/changePassword.module.css";
import Head from "next/head";

const ChangePassword = () => {
  return (
    <div className={styled.container}>
      <Head>
        <title>Trocar senha - SAMI</title>
        <meta
          name="Página de Trocar senha"
          content="Página para a troca de senha do usuário"
        />
      </Head>

      <img className={styled.img} src="/loginImage.svg" alt="logo" />

      <div className={styled.inputSide}>
        <h1 className={styled.title}>Trocar senha</h1>

        <div className={styled.divInput}>
          <input className={styled.input} type="password" placeholder="Digite a sua senha nova..." />

          <input className={styled.input} type="password" placeholder="Digite a senha novamente...." />
        </div>

        <button className={styled.btn}>Trocar</button>
      </div>
    </div>
  );
};

export default ChangePassword;
