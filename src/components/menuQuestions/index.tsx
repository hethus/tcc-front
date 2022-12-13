import { Button, Dropdown, Input } from "antd";
import React from "react";
import { toast } from "react-toastify";
import styles from "./styles.module.css";

interface MenuQuestionsProps {
  items: any;
  addFields: (e: any) => void;
  handleDuplicate: (field: any) => void;
  removeFields: (index: number) => void;
  handleImgChange: (index: number, e: any) => void;
  field: any;
  index: number;
  loading: boolean;
}

export function MenuQuestions({
  items,
  addFields,
  handleDuplicate,
  removeFields,
  field,
  index,
  loading,
  handleImgChange,
}: MenuQuestionsProps) {
  return (
    <div className={styles.menu}>
      <Dropdown
        menu={{ items, onClick: addFields }}
        trigger={["click"]}
        placement="bottomRight"
      >
        <Button type="ghost" className={styles.button}>
          <img src="/add.svg" alt="Adicionar questão" className={styles.svg} />
        </Button>
      </Dropdown>
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
      <Button
        type="ghost"
        className={styles.button}
        loading={loading}
        onClick={() => {
          const input = document.querySelector(
            'input[type="file"]'
          ) as HTMLInputElement;
          if (loading) {
            return;
          }

          input.click();
        }}
      >
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => handleImgChange(index, e)}
        />
        {loading === false ? (
          <img src="/img.svg" alt="Adicionar imagem" className={styles.svg} />
        ) : null}
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
