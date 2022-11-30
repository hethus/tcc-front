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

interface ChangePasswordData {
  password: string;
  confirmPassword: string;
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

const changePasswordSchema = yup.object().shape({
  password: yup.string().required("Senha é obrigatória"),
  confirmPassword: yup
    .string()
    .required("Confirme sua senha")
    .oneOf([yup.ref("password"), null], "Senhas não conferem"),
});

const ChangePassword = () => {
  const router = useRouter();
  const {
    register: changePasswordRegister,
    handleSubmit: changePasswordHandleSubmit,
    formState: { errors: changePasswordErrors },
    reset,
  } = useForm<ChangePasswordData>({
    resolver: yupResolver(changePasswordSchema),
  });

  const { handleUpdate } = useCRUD({ model: "user/recovery/password" });

  const handlePasswordChange = (data: ChangePasswordData) => {
    console.log(data);
    data.confirmPassword;

    handleUpdate({
      values: data,
      id: router.query.index as string,
    }).then(({ data, error }) => {
      if (!data) {
        toast.error(error.message, {
          toastId: "changePasswordError",
        });
      }

      console.log(data);

      toast.success(data.message, {
        toastId: "changePasswordSuccess",
      });

      router.push("/login");
      return;
    });
  };

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
        <h1 className={styled.title}>Alterar senha</h1>

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
          <div className={styled.inputText}>Confirmar senha:</div>
          <input
            className={
              changePasswordErrors.confirmPassword
                ? styled.inputError
                : styled.input
            }
            type="password"
            {...changePasswordRegister("confirmPassword")}
          />
          {changePasswordErrors.confirmPassword && (
            <p className={styled.error}>
              {changePasswordErrors.confirmPassword?.message}
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
