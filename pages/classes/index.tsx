import { NextPage } from "next";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Input } from "antd";
import styles from "@/styles/Classes.module.css";
import { Header } from "../../src/components/header";
import { FilterButton } from "../../src/components/filterButton";
import ClassesTable from "../../src/components/tables/classesTable";
import DeleteClassModal from "../../src/components/modals/deleteClass";

interface Source {
  id: string;
  name: string;
  students: number;
  semester: string;
  discipline: string;
  more?: any;
}

const Classes: NextPage = () => {
  const { enums } = useSelector((state: any) => state);
  const hasEnums = Object.keys(enums).length;

  const [deleteId, setDeleteId] = useState('');
  const [openModal, setOpenModal] = useState(false);

  const { Search } = Input;


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
        </div>

        <div className={styles.ContainerTable}>
          <ClassesTable setOpenModal={setOpenModal} />
        </div>

        {openModal ? (
          <DeleteClassModal openModal={openModal} setOpenModal={setOpenModal} />
        ) : (
          ""
        )}
      </div>
    </div>
  ) : null;
};

export default Classes;
