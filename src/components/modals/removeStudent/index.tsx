import React, { Dispatch } from "react";
import { Modal, Typography, Button } from "antd";

interface Props {
  openModal: boolean;
  setOpenModal: Dispatch<boolean>;
}

const RemoveStudentModal = ({ openModal, setOpenModal }: Props) => {
  const handleCancel = () => {
    setOpenModal(false);
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
          <Button style={{ margin: ".6rem 0" }} key="back" onClick={handleCancel}>
            Voltar
          </Button>
          <Button style={{ margin: ".6rem 0" }} key="delete">
            Remover
          </Button>
        </div>,
      ]}
    >
      <Typography>Tem certeza que remover esse aluno da turma?</Typography>
    </Modal>
  );
};

export default RemoveStudentModal;
