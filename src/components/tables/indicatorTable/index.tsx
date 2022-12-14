import { Table, Dropdown, Tooltip, Modal } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { formsUpdate } from "../../../../store/actions/forms";
import useCRUD from "../../hooks/useCRUD";
import styles from "./styles.module.css";
import { appRoutes } from "../../../../constants";

interface IndicatorTableProps {
  data: any;
  id: string;
  setIndicator: (value: any) => void;
}

export function IndicatorTable({
  data,
  id,
  setIndicator,
}: IndicatorTableProps) {
  const router = useRouter();
  const dispatch = useDispatch();

  const [dataTable, setDataTable] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [informationModal, setInformationModal] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [formId, setFormId] = useState("");

  const { forms, user } = useSelector((state: any) => state);
  const { handleGet: handleGetForms } = useCRUD({ model: "form" });
  const { handleCreate: handleCreateIndicator } = useCRUD({
    model: "indicator",
  });

  const { handleGet: handleGetIndicator } = useCRUD({
    model: "indicator/one",
  });
  const { handleDelete: handleDeleteForm } = useCRUD({ model: "form" });

  const dataDropdown = (type: string) => {
    if (type === "form") {
      return [
        { label: "Ver detalhes (editar)", key: "Ver detalhes-form" },
        { label: "Aplicar", key: "Reaplicar-form" },
        { label: "Excluir", key: "Excluir-form", danger: true },
      ];
    }
    return [
      { label: "Ver detalhes", key: "Ver detalhes-evaluation" },
      { label: "Agendar", key: "Agendar-evaluation" },
      { label: "Excluir", key: "Excluir-evaluation", danger: true },
    ];
  };

  const dropdownData = (type: string) => {
    if (type === "form") {
      const formData = forms.forms?.map((form: any) => {
        return { label: form.name, key: form.id };
      });

      return [
        {
          label: "Formul??rios dispon??veis:",
          key: "Formul??rios dispon??veis-form",
          disabled: true,
        },
        ...formData,
      ];
    }

    return [
      {
        label: "N??o implementado",
        key: "Formul??rios dispon??veis-form",
        disabled: true,
      },
    ];
  };

  const handleDelete = () => {
    handleDeleteForm({
      header: {
        Authorization: `Bearer ${user.token}`,
      },
      refetchPathOptions: `${formId}`,
    }).then(({ data, error }) => {
      if (error) {
        toast.error("Erro ao apagar formul??rio");
        return;
      }
      toast.success("Formul??rio apagado com sucesso");
      handleGetIndicator({
        header: {
          Authorization: `Bearer ${user.token}`,
        },
        refetchPathOptions: `${id}`,
      }).then(({ data, error }) => {
        setIndicator(data);
        setDeleteModal(false);
        handleFormsFunction();
        setIsModalOpen(false);
      });
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
        toast.error("Erro ao buscar formul??rios");
        return;
      }
      dispatch(formsUpdate(data));
    });
  };

  const handleMenu = (menuType: string, option: string, dataId: string) => {
    if (option === "evaluation-add") {
      return () => console.log(menuType);
    }

    if (option === "form-add") {
      setIsModalOpen(true);
      setInformationModal(menuType);
    }

    const menuTypeSplitArray = menuType.split("-");

    if (menuTypeSplitArray[1] === "evaluation") {
      switch (menuTypeSplitArray[0]) {
        case "Ver detalhes":
          toast.warn("Em breve");
          break;
        case "Agendar":
          toast.warn("Em breve");
          break;
        case "Excluir":
          toast.warn("Em breve");
          break;
        default:
          toast.error("Erro inesperado");
          break;
      }
    }

    if (menuTypeSplitArray[1] === "form") {
      switch (menuTypeSplitArray[0]) {
        case "Ver detalhes":
          router.push(`${appRoutes.updateForm.replace("[index]", dataId)}?indicator=${id}`);
          break;
        case "Reaplicar":
          toast.warn("Em breve");
          break;
        case "Excluir":
          setFormId(dataId);
          setDeleteModal(true);
          setIsModalOpen(true);
          break;
        default:
          toast.error("Erro inesperado");
          break;
      }
    }
  };

  const handleDataSource = () => {
    const dataSource = data.map((item: any, index: number) => {
      return {
        key: index,
        name: (
          <div className={styles.nameContainer}>
            {item.name}
            <Tooltip title="Adicionar aplica????o">
              <Dropdown
                arrow
                trigger={["click"]}
                menu={{
                  items: dropdownData("evaluation"),
                  onClick: (e) => handleMenu(e.key, "evaluation-add", item.id),
                }}
              >
                <img
                  src="/add-layer.svg"
                  alt="adicionar aplica????o"
                  className={styles.addLayer}
                />
              </Dropdown>
            </Tooltip>
          </div>
        ),
        ...(item.evaluation?.length > 0 && {
          children: item.evaluation?.map((evaluation: any, index: number) => {
            return {
              key: evaluation.id,
              name: `Aplica????o ${index + 1}`,
              class: evaluation.class.name,
              date: new Date(evaluation.createdAt).toLocaleDateString(),
              views: evaluation.response.length,
              status:
                new Date(evaluation.finalDate) > new Date()
                  ? "Em andamento"
                  : "Finalizado",
              actions: (
                <Dropdown
                  arrow
                  trigger={["click"]}
                  menu={{
                    items: dataDropdown("evaluation"),
                    onClick: (e) =>
                      handleMenu(e.key, "evaluation", evaluation.id),
                  }}
                >
                  <img
                    src="/more.svg"
                    alt="ver mais"
                    className={styles.moreIcon}
                  />
                </Dropdown>
              ),
            };
          }),
        }),
        actions: (
          <Dropdown
            arrow
            trigger={["click"]}
            menu={{
              items: dataDropdown("form"),
              onClick: (e) => handleMenu(e.key, "form", item.id),
            }}
          >
            <img src="/more.svg" alt="ver mais" className={styles.moreIcon} />
          </Dropdown>
        ),
      };
    });

    dataSource.push({
      key: "new",
      name: (
        <div className={styles.newContainer}>
          <Dropdown
            arrow
            trigger={["click"]}
            menu={{
              items: dropdownData("form"),
              onClick: (e) => handleMenu(e.key, "form-add", ""),
            }}
          >
            <img
              src="/add-layer.svg"
              alt="adicionar formul??rio"
              className={styles.addLayer}
            />
          </Dropdown>
          <span className={styles.newContainerSpan}>Adicionar formul??rio</span>
        </div>
      ),
    });

    setDataTable(dataSource);
  };

  useEffect(() => {
    handleDataSource();
  }, [data]);

  const handleOk = () => {
    handleFormsFunction();

    handleCreateIndicator({
      values: { formsId: [informationModal] },
      header: { Authorization: `Bearer ${user.token}` },
      refetchPathOptions: `add/${id}`,
    }).then(({ data, error }) => {
      if (error) {
        toast.error("Erro ao adicionar formul??rio");
        return;
      }
      toast.success("Formul??rio adicionado com sucesso");
      handleGetIndicator({
        header: {
          Authorization: `Bearer ${user.token}`,
        },
        refetchPathOptions: `${id}`,
      }).then(({ data, error }) => {
        setIndicator(data);
        setIsModalOpen(false);
      });
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
      width: "40%",
    },
    {
      title: "Turma",
      dataIndex: "class",
      key: "class",
      width: "15%",
    },
    {
      title: "Data",
      dataIndex: "date",
      key: "date",
      width: "15%",
    },
    {
      title: "Visualiza????es",
      dataIndex: "views",
      key: "views",
      width: "15%",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "10%",
    },
    {
      title: "",
      dataIndex: "actions",
      key: "actions",
      width: "5%",
    },
  ];

  return (
    <div className={styles.tableContainer}>
      <Table dataSource={[...dataTable]} columns={columns} pagination={false} />
      <Modal
        open={isModalOpen}
        onOk={deleteModal ? handleDelete : handleOk}
        onCancel={handleCancel}
        okText={deleteModal ? "Apagar" : "Copiar"}
        cancelText="Cancelar"
        title={deleteModal ? "Apagar formul??rio" : "Copiar formul??rio?"}
        width={700}
        bodyStyle={{ padding: "0 1.2rem 1rem 1.2rem" }}
      >
        {deleteModal ? (
          <span>
            Essa a????o n??o pode ser desfeita. Tem certeza que deseja apagar esse
            formul??rio?
          </span>
        ) : (
          <span>
            Ao confirmar, ser?? gerada uma c??pia do formul??rio atual e adicionada
            ao indicador. Futuras mudan??as no formul??rio usado como base n??o
            ser??o refletidas no que est?? dentro do indicador e vice-versa.
          </span>
        )}
      </Modal>
    </div>
  );
}
