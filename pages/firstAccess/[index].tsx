import React from "react";
import styled from "@/styles/changePassword/changePassword.module.css";
import Head from "next/head";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import useCRUD from "../../src/components/hooks/useCRUD";
import { toast } from "react-toastify";

interface FirstAccessData {
  password: string;
  newPassword: string;
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

const firstAccessSchema = yup.object().shape({
  password: yup.string().required("Senha antiga é obrigatória"),
  newPassword: yup.string().required("Nova senha é obrigatória"),
});

const ChangePassword = () => {
  const router = useRouter();
  const {
    register: changePasswordRegister,
    handleSubmit: changePasswordHandleSubmit,
    formState: { errors: changePasswordErrors },
    reset,
  } = useForm<FirstAccessData>({
    resolver: yupResolver(firstAccessSchema),
  });

  const { handleUpdate } = useCRUD({ model: "user/first-access" });

  const handlePasswordChange = (data: FirstAccessData) => {
    handleUpdate({
      values: data,
      id: router.query.index as string,
    }).then(({ data, error }) => {
      if (!data) {
        toast.error(error.message, {
          toastId: "firstAccessError",
        });
      }

      toast.success("Senha cadastrada com sucesso, login liberado!", {
        toastId: "firstAccessSuccess",
      });

      router.push("/login");
      return;
    });
  };

  return (
    <div className={styled.container}>
      <Head>
        <title>Primeiro acesso - SAMI</title>
        <meta
          name="Página de primeiro acesso"
          content="Página para a troca de senha do usuário no primeiro acesso"
        />
      </Head>

      <img className={styled.img} src="/loginImage.svg" alt="logo" />

      <div className={styled.inputSide}>
        <h1 className={styled.title}>Primeiro acesso, altere a senha</h1>

        <div className={styled.divInput}>
          <div className={styled.inputText}>Senha:</div>
          <input
            className={
              changePasswordErrors.password ? styled.inputError : styled.input
            }
            type="password"
            {...changePasswordRegister("password")}
          />
          {changePasswordErrors.password && (
            <p className={styled.error}>
              {changePasswordErrors.password?.message}
            </p>
          )}
        </div>
        <div className={styled.divInput}>
          <div className={styled.inputText}>Nova senha:</div>
          <input
            className={
              changePasswordErrors.newPassword
                ? styled.inputError
                : styled.input
            }
            type="password"
            {...changePasswordRegister("newPassword")}
          />
          {changePasswordErrors.newPassword && (
            <p className={styled.error}>
              {changePasswordErrors.newPassword?.message}
            </p>
          )}
        </div>

        <button
          className={styled.btn}
          onClick={changePasswordHandleSubmit(handlePasswordChange)}
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
