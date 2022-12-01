import { NextPage } from "next";
import React from "react";
import styled from "@/styles/recoverPassword/recoverPassword.module.css";
import Head from "next/head";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useCRUD from "../../src/components/hooks/useCRUD";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

interface RecoveryData {
  email: string;
}

const recoverySchema = yup.object().shape({
  email: yup.string().required("Email é obrigatório").email("Email inválido"),
});

const RecoverPassword: NextPage = () => {
  const { handleGet } = useCRUD({ model: "user/recovery/verify" });
  const router = useRouter();

  const handleSubmit = (data: RecoveryData) => {
    handleGet({
      refetchPathOptions: data.email,
    }).then(({ data, error }) => {
      if (!data) {
        toast.error(error.message, {
          toastId: "recoverError",
        });
        return;
      }

      toast.success(data, {
        toastId: "recoverSuccess",
      });

      router.push("/login");
      return;
    });
  };

  const {
    register: recovery,
    handleSubmit: recoveryHandleSubmit,
    formState: { errors: recoveryErrors },
    reset,
  } = useForm<RecoveryData>({ resolver: yupResolver(recoverySchema) });

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
          <input
            className={styled.input}
            type="email"
            placeholder="Digite o seu email de recuperação..."
            {...recovery("email")}
          />
          {recoveryErrors.email && (
            <p className={styled.error}>{recoveryErrors.email?.message}</p>
          )}
        </div>

        <button
          className={styled.btn}
          onClick={recoveryHandleSubmit(handleSubmit)}
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default RecoverPassword;
