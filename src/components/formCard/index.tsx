import { ClockCircleOutlined, MoreOutlined } from "@ant-design/icons";
import React from "react";
import styles from "./styles.module.css";
import { appRoutes } from "../../../constants";
import { Dropdown } from "antd";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

interface FormCardProps {
  title: string;
  date: string;
  id: string;
  isIndicator?: boolean;
}

export function FormCard({ title, date, id, isIndicator }: FormCardProps) {
  const router = useRouter();
  const items = isIndicator
    ? [
        {
          label: "Editar",
          key: `${appRoutes.oneIndicator.replace("[index]", id)}, edit`,
        },
        { label: "Apagar", key: `null2, delete` },
      ]
    : [
        {
          label: "Editar",
          key: `${appRoutes.updateForm.replace("[index]", id)}, edit`,
        },
        { label: "Adicionar à indicador", key: `null1, add` },
        { label: "Apagar", key: `null2, delete` },
        { label: "Duplicar", key: `null3, duplicate` },
      ];

  const onClick = (e: any) => {
    if (!e.key) {
      return;
    }
    const [key, action] = e.key.split(", ");

    if (action === "edit") {
      router.push(key);
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
        <Dropdown
          className={styles.dropdown}
          menu={{ items, onClick }}
          trigger={["click"]}
        >
          <MoreOutlined
            style={{ fontSize: "18px", color: "#0094FF", fontWeight: "bold" }}
          />
        </Dropdown>
      </div>
      <div className={styles.footer}>
        <ClockCircleOutlined style={{ fontSize: "16px", color: "#868686" }} />
        <div className={styles.date}>Criado em {date}</div>
      </div>
    </div>
  );
}
