import type { NextPage } from "next";
import styles from "../../styles/indicators/all.module.css";
import { FilterButton } from "../../src/components/filterButton";
import { Input } from "antd";
import { FormCard } from "../../src/components/formCard";
import { Header } from "../../src/components/header";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { TitlePage } from "../../src/components/titlePage";
import useCRUD from "../../src/components/hooks/useCRUD";
import { toast } from "react-toastify";

const AllIndicators: NextPage = () => {
  const { user } = useSelector((state: any) => state);
  const router = useRouter();

  const { Search } = Input;

  const { handleGet } = useCRUD({ model: "indicator" });

  const [indicators, setIndicators] = useState([]);

  const reload = () => {
    handleGet({
      header: {
        Authorization: `Bearer ${user.token}`,
      },
      refetchPathOptions: `${user.email}`,
    }).then(({ data, error }) => {
      if (error) {
        return toast.error("Erro ao carregar indicadores", {
          toastId: "error",
        });
      }

      setIndicators(data);
    });
  };

  useEffect(() => {
    reload();
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Indicadores - SAMI</title>
        <meta name="Indicadores" content="Página de indicadores da aplicação" />
      </Head>
      <Header />
      <div className={styles.body}>
        <TitlePage title="Indicadores" isIndicator reload={reload}/>
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
          {indicators?.map((indicator: any) => (
            <FormCard
              key={indicator.id}
              id={indicator.id}
              title={indicator.name}
              date={`${new Date(indicator.createdAt).toLocaleDateString()}`}
              isIndicator
              reloadInPage={reload}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllIndicators;
