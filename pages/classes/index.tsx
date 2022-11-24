import { NextPage } from "next";
import React from "react";
import { useSelector } from "react-redux";
import { Input } from "antd";
import 'antd/dist/antd.css';
import styles from "@/styles/Classes.module.css";
import { Header } from "../../src/components/header";
import { FilterButton } from "../../src/components/filterButton";
import ClassesTable from "../../src/components/tables/classesTable";

const Classes: NextPage = () => {
  const { enums } = useSelector((state: any) => state);
  const hasEnums = Object.keys(enums).length;

  const { Search } = Input;

  const handleOnSearch = () => {};

  return hasEnums ? (
    <div className={styles.container}>
      <Header />

      <div className={styles.body}>
        <div className={styles.content}>
          <h1 className={styles.title}>Turmas</h1>

          <button className={styles.button}>Criar</button>
        </div>

        <div className={styles.filterContainer}>
          <div className={styles.filterLeftSide}>
            <FilterButton title="Disciplina" />

            <FilterButton title="Semestre" />
          </div>

          <div className={styles.filterRightSide}>
            <div className={styles.inputSearchDiv}>
              <label className={styles.inputSearchName}>Nome:</label>
              <Search
                placeholder="Digite um nome..."
                allowClear
                onSearch={handleOnSearch}
                style={{ width: 300 }}
              />
            </div>
          </div>
        </div>

        <div className={styles.ContainerTable}>
          <ClassesTable />
        </div>
      </div>
    </div>
  ) : null;
};

export default Classes;
