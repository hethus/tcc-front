import { NextPage } from "next";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Input } from "antd";
import styles from "@/styles/Classes.module.css";
import { Header } from "../../src/components/header";
import { FilterButton } from "../../src/components/filterButton";
import ClassesTable from "../../src/components/tables/classesTable";
import DeleteClassModal from "../../src/components/modals/deleteClass";
import BackPage from "../../src/components/backPages";

const Classes: NextPage = () => {
  const { enums } = useSelector((state: any) => state);
  const hasEnums = Object.keys(enums).length;

  const [openModal, setOpenModal] = useState(false);
  const [dataIdParam, setDataIdParam] = useState('');

  return hasEnums ? (
    <div className={styles.container}>
      <Header />

      <div className={styles.body}>
        <BackPage />

        <div className={styles.content}>
          <h1 className={styles.title}>Turmas</h1>

          <button className={styles.button}>Criar</button>
        </div>

        <div className={styles.ContainerTable}>
          <ClassesTable setOpenModal={setOpenModal} setDataIdParam={setDataIdParam} />
        </div>

        {openModal && dataIdParam !== undefined ? (
          <DeleteClassModal openModal={openModal} setOpenModal={setOpenModal} dataIdParam={dataIdParam} />
        ) : (
          ""
        )}
      </div>
    </div>
  ) : null;
};

export default Classes;
