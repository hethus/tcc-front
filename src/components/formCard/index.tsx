import { ClockCircleOutlined, MoreOutlined } from "@ant-design/icons";
import React from "react";
import styles from "./styles.module.css";
import { appRoutes } from "../../../constants";
import { Dropdown } from "antd";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

interface FormCardProps {
  title: string;
  visualization: number;
  date: string;
  id: string;
}

export function FormCard({ title, visualization, date, id }: FormCardProps) {
  const router = useRouter();
  const items = [
    { label: "Editar", key: appRoutes.updateForm },
    { label: "Adicionar à indicador", key: 'null1' },
    { label: "Apagar", key: 'null2' },
    { label: "Duplicar", key: 'null3' },
  ];

  const onClick = (e: any) => {
    if (!e.key) {
      return;
    }

    if (e.key === appRoutes.updateForm) {
      const formRoute = appRoutes.updateForm.replace("[index]", id);
      router.push(formRoute);
      return;
    }

    return toast.error("Não implementado", {
      toastId: "not-implemented",
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        <Dropdown className={styles.dropdown} menu={{ items, onClick }} trigger={["click"]}>
          <MoreOutlined
            style={{ fontSize: "18px", color: "#0094FF", fontWeight: "bold" }}
          />
        </Dropdown>
      </div>
      <div className={styles.body}>
        <div className={styles.visualization}>
          Visualização: {visualization}
        </div>
      </div>
      <div className={styles.footer}>
        <ClockCircleOutlined style={{ fontSize: "16px", color: "#868686" }} />
        <div className={styles.date}>Criado em {date}</div>
      </div>
    </div>
  );
}
