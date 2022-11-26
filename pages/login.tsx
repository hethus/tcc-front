import type { NextPage } from "next";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { Input } from "../src/components/Input";
import { userUpdate } from "../store/actions/users";
import styles from "../styles/Login.module.css";
import useCRUD from "../src/components/hooks/useCRUD.js";
import { useRouter } from "next/router";
import { appRoutes } from "../constants";

const Login: NextPage = () => {
  const dispatch = useDispatch();
  const { id, token, email } = useSelector((state: any) => state.user);
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
        if (data.login) {
          handleGet({
            header: {
              Authorization: `Bearer ${data.token}`,
            },
          })
            .then(({ data }) => {
              dispatch(userUpdate(data));
              router.push(appRoutes.home);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className={styles.container}>
      <img src="/teste.svg" alt="Home img" className={styles.loginImg} />

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
