import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { FilterButton } from "../src/components/filterButton";
import { Input, Switch } from "antd";
import { FormCard } from "../src/components/formCard";
import { Header } from "../src/components/header";
import React from "react";
import Head from "next/head";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { appRoutes } from "../constants";

const Home: NextPage = () => {
  const { forms } = useSelector((state: any) => state);
  const router = useRouter();

  const onChange = (checked: boolean) => {
    console.log(`switch to ${checked}`);
  };

  const { Search } = Input;

  return (
    <div className={styles.container}>
      <Head>
        <title>Home - SAMI</title>
        <meta name="Página inicial" content="Página inicial da aplicação" />
      </Head>
      <Header />
      <div className={styles.body}>
        <div className={styles.title}>
          Formulários
          <button className={styles.button} onClick={() => router.push(appRoutes.registerForm)}>
            Criar
          </button>
        </div>
        <div className={styles.filterDiv}>
          <div className={styles.filterDivLeftSide}>
            <FilterButton title="Tipos" />

            <FilterButton title="Visualização" />

            <FilterButton title="Data" />

            <div className={styles.inputSearchDiv}>
              <div className={styles.inputSearchTitle}>Nome:</div>
              <Search
                placeholder="input search text"
                onSearch={() => {}}
                className={styles.inputSearch}
              />
            </div>
          </div>

          <div className={styles.filterDivRightSide}>
            <div className={styles.switchDiv}>
              <div className={styles.switchTitle}>lista</div>

              <Switch defaultChecked onChange={onChange} />
            </div>

            <div className={styles.switchDiv}>
              <div className={styles.switchTitle}>cartões</div>
            </div>

            <div className={styles.switchDiv}>
              <div className={styles.orderTitle}>Ordenar</div>
              <div className={styles.orderDivButton}>
                <button className={styles.orderDivButtonUpDown}>
                  <UpOutlined style={{ fontSize: "12px", color: "#C4C4C4" }} />
                </button>
                <button className={styles.orderDivButtonUpDown}>
                  <DownOutlined
                    style={{ fontSize: "12px", color: "#C4C4C4" }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.cardsDiv}>
          {forms.forms?.map((form: any) => (
            <FormCard
              key={form.id}
              id={form.id}
              title={form.name}
              visualization={0} // como?
              date={`${new Date(form.createdAt).toLocaleDateString()}`}
            />
          ))}
          <FormCard title="Formulário 1" visualization={5} date="15/01/22" id="1" />
          <FormCard title="Formulário 2" visualization={2} date="27/02/22" id="2"/>
          <FormCard title="Formulário 3" visualization={7} date="13/03/22" id="3"/>
        </div>
      </div>
    </div>
  );
};

export default Home;
