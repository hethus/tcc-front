import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { FilterButton } from "../src/components/filterButton";
import { Input } from "antd";
import { FormCard } from "../src/components/formCard";
import { Header } from "../src/components/header";
import React from "react";
import Head from "next/head";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { appRoutes } from "../constants";
import { TitlePage } from "../src/components/titlePage";

const Home: NextPage = () => {
  const { forms } = useSelector((state: any) => state);
  const router = useRouter();

  const { Search } = Input;

  return (
    <div className={styles.container}>
      <Head>
        <title>Home - SAMI</title>
        <meta name="Página inicial" content="Página inicial da aplicação" />
      </Head>
      <Header />
      <div className={styles.body}>
        <TitlePage title="Formulários" url={appRoutes.registerForm} />
        <div className={styles.filterDiv}>
          <div className={styles.filterDivLeftSide}>
            <FilterButton title="Tipos" />

            <FilterButton title="Visualização" />

            <FilterButton title="Data" />

            <div className={styles.inputSearchDiv}>
              <div className={styles.inputSearchTitle}>Nome:</div>
              <Search
                placeholder="Digite um nome..."
                onSearch={() => {}}
                className={styles.inputSearch}
              />
            </div>
          </div>

          
        </div>

        <div className={styles.cardsDiv}>
          {forms.forms?.map((form: any) => (
            <FormCard
              key={form.id}
              id={form.id}
              title={form.name}
              date={`${new Date(form.createdAt).toLocaleDateString()}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
