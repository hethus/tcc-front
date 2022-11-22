import type { NextPage } from "next";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { Input } from "../src/components/Input";
import { userUpdate } from "../store/actions/users";
import styles from "../styles/Login.module.css";
import useCRUD from "../src/components/hooks/useCRUD.js";
import { useRouter } from "next/router";
import { appRoutes } from "../constants";
import React from "react";

const Login: NextPage = () => {
  const dispatch = useDispatch();
  const { id, token, email } = useSelector((state: any) => state.user);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const { handleCreate } = useCRUD({ model: 'auth', pathOptions: '/login'});

  const login = () => {
    handleCreate({values: {
      email: user,
      password,
    }})
      .then(({ data, error }) => {
        if(error) return;
        dispatch(userUpdate(data?.user));
        router.push(appRoutes.home);
      });
  };

  return (
    <div className={styles.container}>
      <img src="/homeimg.svg" alt="Home img" className={styles.loginImg} />
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
      </div>
    </div>
  );
};

export default Login;
