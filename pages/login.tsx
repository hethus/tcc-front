import type { NextPage } from "next";
import { useDispatch } from "react-redux";
import React from "react";
import { userUpdate } from "../store/actions/users";
import styles from "../styles/Login.module.css";
import useCRUD from "../src/components/hooks/useCRUD.js";
import { useRouter } from "next/router";
import { appRoutes } from "../constants";
import { toast } from "react-toastify";
import Head from "next/head";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { formsUpdate } from "../store/actions/forms";

interface LoginData {
  email: string;
  password: string;
}

const loginSchema = yup.object().shape({
  email: yup.string().required("Email é obrigatório").email("Email inválido"),
  password: yup.string().required("Senha é obrigatória"),
});

const Login: NextPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { handleCreate } = useCRUD({ model: "auth" });
  const { handleGet } = useCRUD({ model: "user" });
  const { handleGet: handleForms } = useCRUD({ model: "form" });

  const {
    register: loginRegister,
    handleSubmit: loginHandleSubmit,
    formState: { errors: loginErrors },
    reset,
  } = useForm<LoginData>({ resolver: yupResolver(loginSchema) });

  const login = (data: LoginData) => {
    handleCreate({
      values: data,
    })
      .then(({ data, error }) => {
        if (!data) {
          console.log(error)
          return toast.error("Credenciais inválidas ou usuário não cadastrado");
        }

        if (data.login) {
          handleGet({
            header: {
              Authorization: `Bearer ${data.token}`,
            },
          })
            .then(({ data }) => {
              handleForms({
                header: {
                  Authorization: `Bearer ${data.token}`,
                },
                refetchPathOptions: `${data.email}`,
              })
                .then(({ data }) => {
                  dispatch(formsUpdate(data));
                })
                .catch((err) => {
                  console.log(err);
                });
              dispatch(userUpdate(data));
              toast.success("Login realizado com sucesso", {
                toastId: "loginSuccess",
              });
              router.push(appRoutes.home);
            })
            .catch((error) => {
              toast.error(error, {
                toastId: "loginError",
              });
            });
        }

        if (
          !data.login &&
          data.message === "Usuário novo, por favor crie uma senha"
        ) {
          toast.info(data.message, {
            toastId: "loginInfo",
          });
          router.push(`firstAccess/${data.tokenUrl}`);
        }
      })
      .catch((error) => {
        toast.error(error, {
          toastId: "loginError",
        });
      });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Login - SAMI</title>
        <meta name="Página de login" content="Página de login do usuário" />
      </Head>
      <img src="/loginImage.svg" alt="Home img" className={styles.loginImg} />

      <div className={styles.inputSide}>
        <div className={styles.logoText}>SAMI</div>
        <div className={styles.text}>
          Sistema para análise de métricas e <br /> indicadores de aprendizagem
        </div>

        <div className={styles.divInput}>
          <div className={styles.title}>Email:</div>
          <input
            className={loginErrors.email ? styles.inputError : styles.input}
            type="email"
            {...loginRegister("email")}
          />
          {loginErrors.email && (
            <p className={styles.error}>{loginErrors.email?.message}</p>
          )}
        </div>

        <div className={styles.divInput}>
          <div className={styles.title}>Senha:</div>
          <input
            className={loginErrors.password ? styles.inputError : styles.input}
            type="password"
            {...loginRegister("password")}
          />
          {loginErrors.password && (
            <p className={styles.error}>{loginErrors.password?.message}</p>
          )}
        </div>

        <button
          className={styles.submitButton}
          onClick={loginHandleSubmit(login)}
        >
          Entrar
        </button>

        <span
          className={styles.linkPassword}
          onClick={() => router.push(appRoutes.changePassword)}
        >
          Esqueceu sua senha
        </span>
      </div>
    </div>
  );
};

export default Login;
