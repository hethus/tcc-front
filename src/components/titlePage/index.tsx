import { Modal } from "antd";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { appRoutes } from "../../../constants";
import { IndicatorModal } from "../indicatorModal";
import styles from "./styles.module.css";

interface TitlePageProps {
  title: string;
  url: string;
  isIndicator?: boolean;
}

export function TitlePage({ title, url, isIndicator, reload }: TitlePageProps) {
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    if (isIndicator) {
      showModal();
      return;
    }

    router.push(url);
  };

  return (
    <div className={styles.title}>
      {title}
      <button className={styles.button} onClick={() => handleCreate()}>
        Criar
      </button>
      {isIndicator && (
        <IndicatorModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  );
}
