import { NextPage } from "next";
import React from "react";
import styled from "@/styles/recoverPassword/recoverPassword.module.css";
import Head from "next/head";

const RecoverPassword: NextPage = () => {
  return (
    <div className={styled.container}>
      <Head>
        <title>Recuperação de senha - SAMI</title>
        <meta
          name="Página de recuperação da senha"
          content="Página de envio de email para a recuperação da senha do usuário"
        />
      </Head>

      <img className={styled.img} src="/loginImage.svg" alt="logo" />

      <div className={styled.inputSide}>
        <h1 className={styled.title}>Recuperar senha</h1>

        <div className={styled.divInput}>
          <input className={styled.input} type="email" placeholder="Digite o seu email de recuperação..." />
        </div>

        <button className={styled.btn}>Enviar</button>
      </div>
    </div>
  );
};

export default RecoverPassword;
