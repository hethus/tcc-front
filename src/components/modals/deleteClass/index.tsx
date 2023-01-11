import { NextComponentType } from "next";
import React, { Dispatch, useEffect, useState } from "react";
import { Modal, Typography, Button } from "antd";
import useCRUD from "../../hooks/useCRUD";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

interface Props {
  openModal: boolean;
  setOpenModal: Dispatch<boolean>;
  dataIdParam: string;
}

const DeleteClassModal = ({ openModal, setOpenModal, dataIdParam }: Props) => {
  const { user } = useSelector((state: any) => state);

  const { handleDelete: handleDeleteClass } = useCRUD({
    model: "classe",
  });

  const handleCancel = () => {
    setOpenModal(false);
  };

  const handleDelete = () => {
    handleDeleteClass({
      refetchPathOptions: dataIdParam,
      header: {
        Authorization: `Bearer ${user.token}`,
      },
    }).then(({ error }) => {
      if (error) {
        console.log(error);
        toast.error("Error ao apagar turma da tabela", {
          toastId: "deleteClass",
        });
        return;
      }

      setOpenModal(false);
      toast.success("Turma deletada do sistema!", {
        toastId: "deleteClass",
      });
      return;
    });
  };

  return (
    <Modal
      title="Title"
      open={openModal}
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
        Tem certeza que deseja apagar a turma da tabela do sistema?
      </Typography>
    </Modal>
  );
};

export default DeleteClassModal;
