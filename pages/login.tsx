import type { NextPage } from "next";
import { useDispatch } from "react-redux";
import React, { useState } from "react";
import { Input } from "../src/components/Input";
import { userUpdate } from "../store/actions/users";
import styles from "../styles/Login.module.css";
import useCRUD from "../src/components/hooks/useCRUD.js";
import { useRouter } from "next/router";
import { appRoutes } from "../constants";
import { toast } from "react-toastify";
import Head from "next/head";

const Login: NextPage = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const { handleCreate } = useCRUD({ model: "auth" });
  const { handleGet } = useCRUD({ model: "user" });

  const login = () => {
    handleCreate({
      values: {
        email: user,
        password,
      },
    })
      .then(({ data }) => {
        if (!data) {
          return toast.error("Credenciais inválidas ou usuário não cadastrado");
        }

        if (data.login) {
          handleGet({
            header: {
              Authorization: `Bearer ${data.token}`,
            },
          })
            .then(({ data }) => {
              dispatch(userUpdate(data));
              toast.success("Login realizado com sucesso", {
                toastId: "login",
              });
              router.push(appRoutes.home);
            })
            .catch((error) => {
              toast.error(error, {
                toastId: "login",
              });
            });
        }

        if (
          !data.login &&
          data.message === "Usuário novo, por favor crie uma senha"
        ) {
          toast.error(data.message, {
            toastId: "login",
          }); // adicionar redirecionamento para página de cadastro de senha depois
        }
      })
      .catch((error) => {
        toast.error(error, {
          toastId: "login",
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
        <Input
          title="Usuário"
          type="email"
          onChange={(e) => setUser(e.target.value)}
        />
        <Input
          title="Senha"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className={styles.submitButton} onClick={login}>
          Entrar
        </button>

        <span
          className={styles.linkPassword}
          onClick={() => router.push("/recoverPassword")}
        >
          Esqueceu sua senha
        </span>
      </div>
    </div>
  );
};

export default Login;
