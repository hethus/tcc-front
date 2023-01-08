import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import styles from "../../../styles/indicators/one.module.css";
import { Header } from "../../../src/components/header";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Select } from "antd";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "react-toastify";
import useCRUD from "../../../src/components/hooks/useCRUD";
import { TitlePage } from "../../../src/components/titlePage";
import { IndicatorTable } from "../../../src/components/tables/indicatorTable";

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

const OneIndicator: NextPage = () => {
  const { handleUpdate } = useCRUD({ model: "indicator" });
  const { handleGet: handleGetOne } = useCRUD({ model: "indicator/one" });
  const { handleGet: handleGetMethodologies } = useCRUD({
    model: "methodology",
  });
  const { handleGet: handleGetGroups } = useCRUD({ model: "group" });

  const { user } = useSelector((state: any) => state);
  const router = useRouter();

  const [indicator, setIndicator] = useState({
    id: "",
    name: "",
    description: "",
    forms: [],
    methodologyId: "",
    groupId: "",
    userId: "",
  });
  const [methodologies, setMethodologies] = useState([]);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (!router.isReady || !router.query.index) return;
    handleGetOne({
      header: {
        Authorization: `Bearer ${user.token}`,
      },
      refetchPathOptions: `${router.query.index}`,
    }).then(({ data, error }) => {
      if (error) {
        toast.error("Erro ao buscar indicador");
        return;
      }

      setIndicator(data);
    });

    handleGetMethodologies({
      header: {
        Authorization: `Bearer ${user.token}`,
      },
      refetchPathOptions: user.email,
    }).then(({ data, error }) => {
      if (error) {
        toast.error("Erro ao buscar metodologias");
        return;
      }

      const dataFormatted = data.map((item: any) => {
        return {
          value: item.id,
          label: item.label,
        };
      });

      setMethodologies(dataFormatted);
    });

    handleGetGroups({
      header: {
        Authorization: `Bearer ${user.token}`,
      },
      refetchPathOptions: user.email,
    }).then(({ data, error }) => {
      if (error) {
        toast.error("Erro ao buscar grupos");
        return;
      }

      const dataFormatted = data.map((item: any) => {
        return {
          value: item.id,
          label: item.label,
        };
      });
      setGroups(dataFormatted);
    });
  }, [router.query.index]);

  const submit = () => {
    handleUpdate({
      values: indicator,
      header: {
        Authorization: `Bearer ${user.token}`,
      },
      refetchPathOptions: `${router.query.index}`,
    }).then(({ data, error }) => {
      if (error) {
        toast.error("Erro ao atualizar formulário");
        return;
      }
      toast.success("Formulário atualizado com sucesso!");
    });
  };

  const handleEditIndicator = (e: any, name: string) => {
    setIndicator({
      ...indicator,
      [name]: e.target.value,
    });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Indicadores - SAMI</title>
        <meta name="Indicadores" content="Página de indicadores da aplicação" />
      </Head>
      <Header />
      <TitlePage
        title="Indicadores"
        isIndicatorEdit
        nameIndicator={indicator.name}
        handleEditIndicator={handleEditIndicator}
        handleUpdateIndicator={submit}
      />
      <div className={styles.body}>
        <div className={styles.selectContainer}>
          <div className={styles.selectDiv}>
            <p className={styles.inputName}>Metodologia:</p>
            <Select
              onChange={(value) => {
                setIndicator({ ...indicator, methodologyId: value });
              }}
              options={methodologies}
              value={indicator.methodologyId || "Selecione o conjunto"}
              className={styles.select}
              size="large"
            />
          </div>
          <div className={styles.selectDiv}>
            <p className={styles.inputName}>Grupo:</p>
            <Select
              onChange={(value) => {
                setIndicator({ ...indicator, groupId: value });
              }}
              options={groups}
              value={indicator.groupId || "Selecione o conjunto"}
              className={styles.select}
              size="large"
            />
          </div>
        </div>
        <div className={styles.textAreaDiv}>
          <p className={styles.inputName}>Descrição:</p>
          <TextareaAutosize
            value={indicator.description}
            onChange={(e) => handleEditIndicator(e, "description")}
            className={styles.textArea}
          />
        </div>
        <IndicatorTable
          data={indicator.forms}
          id={router.query.index as string}
          setIndicator={setIndicator}
        />
      </div>
    </div>
  );
};

export default OneIndicator;
