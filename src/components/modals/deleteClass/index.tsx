import { NextComponentType } from "next";
import React, { Dispatch, useState } from "react";
import { Modal, Typography, Button } from "antd";

interface Props {
  openModal: boolean;
  setOpenModal: Dispatch<boolean>;
}

const DeleteClassModal = ({ openModal, setOpenModal }: Props) => {
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleCancel = () => {
    setOpenModal(false);
  };

  const handleDelete = () => {};

  return (
    <Modal
      title="Title"
      open={openModal}
      onOk={handleDelete}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      footer={[
        <div
          key="container"
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <Button
            style={{ margin: ".6rem 0" }}
            key="back"
            onClick={handleCancel}
          >
            Voltar
          </Button>
          <Button
            style={{ margin: ".6rem 0" }}
            key="delete"
            onClick={handleDelete}
          >
            Excluir
          </Button>
        </div>,
      ]}
    >
      <Typography>
        Tem certeza que deseja apagar a turma name da tabela?
      </Typography>
    </Modal>
  );
};

export default DeleteClassModal;
