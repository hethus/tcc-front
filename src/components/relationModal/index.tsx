import { ClockCircleOutlined, MoreOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import styles from "./styles.module.css";
import { appRoutes } from "../../../constants";
import { Dropdown, Modal } from "antd";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

interface RelationModalProps {
  pageOrigin: "indicator" | "form";
  setIsModalOpen: (value: boolean) => void;
  isModalOpen: boolean;
}

export function RelationModal({ pageOrigin, setIsModalOpen, isModalOpen }: RelationModalProps) {
  const router = useRouter();
  const [indicator, setIndicator] = useState([]);
  const [form, setForm] = useState([]);
  
  const handleOk = () => {
    console.log('1');
    handleReset();
  };

  const handleCancel = () => {
    handleReset();
    setIsModalOpen(false);
  };

  const handleReset = () => {
    setIndicator([]);
    setForm([]);
    setIsModalOpen(false);
  };

  return (
    <Modal
    open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Criar"
      cancelText="Cancelar"
      width={800}
      bodyStyle={{ padding: "0 1.2rem 1rem 1.2rem" }}
      className={styles.modal}
    >
    teste
    </Modal>
  );
}
