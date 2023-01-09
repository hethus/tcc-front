import { ClockCircleOutlined, MoreOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { appRoutes } from "../../../constants";
import { Dropdown, Modal, Select } from "antd";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import useCRUD from "../hooks/useCRUD";
import { useDispatch, useSelector } from "react-redux";
import { formsUpdate } from "../../../store/actions/forms";

interface FormCardProps {
  title: string;
  date: string;
  id: string;
  isIndicator?: boolean;
  reloadInPage?: () => void;
}

export function FormCard({ title, date, id, isIndicator, reloadInPage }: FormCardProps) {
  const [indicators, setIndicators] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [indicatorRelationModal, setIndicatorRelationModal] = useState("");
  const [confirmModal, setConfirmModal] = useState(false);
  const [formId, setFormId] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);

  const dispatch = useDispatch();

  const { user } = useSelector((state: any) => state);

  const { handleCreate: handleCreateIndicator } = useCRUD({
    model: "indicator",
  });
  const { handleGet: handleGetForms } = useCRUD({ model: "form" });
  const { handleDelete: handleDeleteForm } = useCRUD({ model: "form" });
  const { handleDelete: handleDeleteIndicator } = useCRUD({
    model: "indicator",
  });
  const { handleGet } = useCRUD({ model: "indicator" });
  const reload = () => {
    handleGet({
      header: {
        Authorization: `Bearer ${user.token}`,
      },
      refetchPathOptions: `${user.email}`,
    }).then(({ data, error }) => {
      if (error) {
        return toast.error("Erro ao carregar indicadores", {
          toastId: "error",
        });
      }

      setIndicators(data);
    });
  };

  const handleFormsFunction = () => {
    handleGetForms({
      header: {
        Authorization: `Bearer ${user.token}`,
      },
      refetchPathOptions: `${user.email}`,
    }).then(({ data, error }) => {
      if (error) {
        toast.error("Erro ao buscar formulários");
        return;
      }
      dispatch(formsUpdate(data));
    });
  };

  useEffect(() => {
    reload();
  }, []);

  const router = useRouter();
  const items = isIndicator
    ? [
        {
          label: "Editar",
          key: `${appRoutes.oneIndicator.replace("[index]", id)}, edit`,
        },
        { label: "Apagar", key: `${id}, delete`, danger: true },
      ]
    : [
        {
          label: "Editar",
          key: `${appRoutes.updateForm.replace("[index]", id)}, edit`,
        },
        {
          label: "Adicionar à indicador",
          key: `${id}, add`,
        },
        {
          label: "Apagar",
          key: `${id}, delete`,
          danger: true,
        },
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

    if (action === "add") {
      setIsModalOpen(true);
      setFormId(key);
      return;
    }

    if (action === "delete") {
      setDeleteModal(true);
      setIsModalOpen(true);
      if (isIndicator) {
        setIndicatorRelationModal(key);
        return;
      }
      setFormId(key);
      return;
    }

    return toast.error("Não implementado", {
      toastId: "not-implemented",
    });
  };

  const handleOk = () => {
    handleFormsFunction();

    handleCreateIndicator({
      values: { formsId: [formId] },
      header: { Authorization: `Bearer ${user.token}` },
      refetchPathOptions: `add/${indicatorRelationModal}`,
    }).then(({ data, error }) => {
      if (error) {
        toast.error("Erro ao adicionar formulário");
        return;
      }
      toast.success("Formulário adicionado com sucesso");
      reload();
      setConfirmModal(false);
      setIsModalOpen(false);
    });
  };

  const handleDelete = () => {
    if (isIndicator) {
      handleDeleteIndicator({
        header: {
          Authorization: `Bearer ${user.token}`,
        },
        refetchPathOptions: `${indicatorRelationModal}`,
      }).then(({ data, error }) => {
        if (error) {
          toast.error("Erro ao apagar indicador");
          return;
        }
        toast.success("Indicador apagado com sucesso");
        reloadInPage?.();
        setDeleteModal(false);
        setIsModalOpen(false);
        return;
      });
    } else {
      handleDeleteForm({
        header: {
          Authorization: `Bearer ${user.token}`,
        },
        refetchPathOptions: `${formId}`,
      }).then(({ data, error }) => {
        if (error) {
          toast.error("Erro ao apagar formulário");
          return;
        }
        toast.success("Formulário apagado com sucesso");
        handleFormsFunction();
        setDeleteModal(false);
      });
    }
  };

  const handleCancel = () => {
    setConfirmModal(false);
    setIsModalOpen(false);
    setDeleteModal(false);
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
      <Modal
        open={isModalOpen}
        onOk={deleteModal ? handleDelete : handleOk}
        onCancel={handleCancel}
        okText={
          confirmModal ? "Confirmar" : deleteModal ? "Deletar" : "Adicionar"
        }
        cancelText={confirmModal ? "Cancelar" : "Fechar"}
        title={
          confirmModal
            ? "Confirma?"
            : deleteModal
            ? `Deletar ${isIndicator ? "indicador" : "formulário"}?`
            : "Adicionar ao indicador?"
        }
        width={700}
        bodyStyle={{ padding: "0 1.2rem 1rem 1.2rem" }}
      >
        {confirmModal ? (
          <span>
            Ao confirmar, será gerada uma cópia do formulário atual e adicionada
            ao indicador. Futuras mudanças no formulário usado como base não
            serão refletidas no que está dentro do indicador e vice-versa.
          </span>
        ) : deleteModal ? (
          <span>
            Essa ação não pode ser desfeita. Tem certeza que deseja apagar esse
            {isIndicator ? " indicador" : " formulário"}?
          </span>
        ) : (
          <div>
            {indicators.length > 0 ? (
              <Select
                placeholder="Selecione um indicador"
                style={{ width: "100%" }}
                onChange={(value) => {
                  setIndicatorRelationModal(value);
                  setConfirmModal(true);
                }}
              >
                {indicators.map((indicator: any) => (
                  <option key={indicator.id} value={indicator.id}>
                    {indicator.name}
                  </option>
                ))}
              </Select>
            ) : (
              <span>
                Você não possui nenhum indicador. Crie um indicador para
                adicionar um formulário.
              </span>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
