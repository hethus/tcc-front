import type { NextPage } from "next";
import styles from "../../styles/Forms.module.css";
import { Header } from "../../src/components/header";
import React from "react";
import Head from "next/head";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { appRoutes } from "../../constants";

const Home: NextPage = () => {
  const { forms } = useSelector((state: any) => state);
  const router = useRouter();

  return (
    <div className={styles.container}>
      <Head>
        <title>Home - SAMI</title>
        <meta name="Página inicial" content="Página inicial da aplicação" />
      </Head>
      <Header />
      <div className={styles.body}>
      </div>
    </div>
  );
};

export default Home;
