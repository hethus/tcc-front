import { Button, Dropdown } from "antd";
import React from "react";
import { toast } from "react-toastify";
import styles from "./styles.module.css";

interface MenuQuestionsProps {
  items: any;
  addFields: (e: any) => void;
  handleDuplicate: (field: any) => void;
  removeFields: (index: number) => void;
  field: any;
  index: number;
}

export function MenuQuestions({
  items,
  addFields,
  handleDuplicate,
  removeFields,
  field,
  index,
}: MenuQuestionsProps) {
  return (
    <div className={styles.menu}>
      <Button type="ghost" className={styles.button}>
        <Dropdown
          menu={{ items, onClick: addFields }}
          trigger={["click"]}
          // position="bottomRight"
          placement="topRight"
        >
          <img src="/add.svg" alt="Adicionar questão" className={styles.svg} />
        </Dropdown>
      </Button>
      <Button
        type="ghost"
        className={styles.button}
        onClick={() => handleDuplicate(field)}
      >
        <img src="/copy.svg" alt="Duplicar questão" className={styles.svg} />
      </Button>
      <Button
        type="ghost"
        className={styles.button}
        onClick={() => removeFields(index)}
      >
        <img src="/exclude.svg" alt="Remover questão" className={styles.svg} />
      </Button>
      <Button type="ghost" className={styles.button}>
        <img src="/img.svg" alt="Adicionar imagem" className={styles.svg} />
      </Button>
      <Button
        type="ghost"
        className={styles.button}
        onClick={() =>
          toast.info("Em breve", {
            toastId: "more",
          })
        }
      >
        <img src="/more.svg" alt="Mais opções" className={styles.svg} />
      </Button>
    </div>
  );
}
