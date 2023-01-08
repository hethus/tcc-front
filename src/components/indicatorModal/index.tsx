import { PlusOutlined } from "@ant-design/icons";
import { Button, Divider, Input, InputRef, Modal, Select } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ReactTextareaAutosize from "react-textarea-autosize";
import { toast } from "react-toastify";
import { appRoutes } from "../../../constants";
import useCRUD from "../hooks/useCRUD";
import styles from "./styles.module.css";

interface IndicatorModalProps {
  setIsModalOpen: (value: boolean) => void;
  isModalOpen: boolean;
}

export function IndicatorModal({
  setIsModalOpen,
  isModalOpen,
}: IndicatorModalProps) {
  const [methodologies, setMethodologies] = useState([] as any);
  const [groups, setGroups] = useState([] as any);
  const [indicator, setIndicator] = useState({
    name: "",
    description: "",
    methodology: "",
    group: "",
  });
  const [indicatorError, setIndicatorError] = useState("");

  const [nameGroup, setNameGroup] = useState("");
  const [nameMethodology, setNameMethodology] = useState("");

  const { user } = useSelector((state: any) => state);
  const router = useRouter();

  const inputRef = useRef<InputRef>(null);

  const { handleGet: handleGroup } = useCRUD({ model: "group" });
  const { handleGet: handleMethodology } = useCRUD({ model: "methodology" });
  const { handleCreate: handleIndicator } = useCRUD({ model: "indicator" });

  const { handleCreate: handleCreateGroup } = useCRUD({ model: "group" });
  const { handleCreate: handleCreateMethodology } = useCRUD({
    model: "methodology",
  });

  const handleOk = () => {
    if (!indicator.name) {
      setIndicatorError("name");
      return toast.error("Nome é obrigatório", {
        toastId: "error-name",
      });
    }

    if (!indicator.methodology) {
      setIndicatorError("methodology");
      return toast.error("Metodologia é obrigatória", {
        toastId: "error-methodology",
      });
    }

    if (!indicator.group) {
      setIndicatorError("group");
      return toast.error("Conjunto é obrigatório", {
        toastId: "error-group",
      });
    }

    if (!indicator.description) {
      setIndicatorError("description");
      return toast.error("Descrição é obrigatória", {
        toastId: "error-description",
      });
    }

    handleIndicator({
      header: {
        Authorization: `Bearer ${user.token}`,
      },
      values: {
        name: indicator.name,
        description: indicator.description,
        methodologyId: indicator.methodology,
        groupId: indicator.group,
      },
    }).then(({ data, error }) => {
      if (error) {
        return toast.error("Erro ao criar indicador", {
          toastId: "error",
        });
      }

      handleReset();
      router.push(appRoutes.oneIndicator.replace("[index]", data.id));
      setIsModalOpen(false);
    });
  };

  const handleCancel = () => {
    handleReset();
    setIsModalOpen(false);
  };

  const handleReset = () => {
    setGroups([]);
    setMethodologies([]);
    setIndicatorError("");
    setIndicator({
      name: "",
      description: "",
      methodology: "",
      group: "",
    });
  };

  const onNameChange = (event: any, type: string) => {
    if (type === "group") {
    setNameGroup(event.target.value);
    } else {
      setNameMethodology(event.target.value);
    }
  };

  const addItem = (e: any, type: string) => {
    e.preventDefault();
  
    if (type === "group" && !nameGroup) {
      return toast.error("Nome do grupo é obrigatório", {
        toastId: "error-group",
      });
    }

    if (type === "methodology" && !nameMethodology) {
      return toast.error("Nome da metodologia é obrigatório", {
        toastId: "error-methodology",
      });
    }

    if (type === "group") {
      handleCreateGroup({
        header: {
          Authorization: `Bearer ${user.token}`,
        },
        values: {
          label: nameGroup || `New item ${groups.length++}`,
        },
      }).then(({ data, error }) => {
        if (error) {
          return toast.error("Erro ao criar grupo", {
            toastId: "error",
          });
        }

        setGroups([
          ...groups,
          {
            value: data.id,
            label: data.label,
          },
        ]);
      });
      setNameGroup("");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } else {
      handleCreateMethodology({
        header: {
          Authorization: `Bearer ${user.token}`,
        },
        values: {
          label: nameMethodology || `New item ${methodologies.length++}`,
        },
      }).then(({ data, error }) => {
        if (error) {
          return toast.error("Erro ao criar metodologia", {
            toastId: "error",
          });
        }

        setMethodologies([
          ...methodologies,
          {
            value: data.id,
            label: data.label,
          },
        ]);

      });
      setNameMethodology("");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  useEffect(() => {
    handleGroup({
      header: {
        Authorization: `Bearer ${user.token}`,
      },
      refetchPathOptions: `${user.email}`,
    }).then(({ data, error }) => {
      if (error) {
        return toast.error("Erro ao carregar grupos", {
          toastId: "error",
        });
      }

      const dataFormatted = data.map((item: any) => {
        return {
          value: item.id,
          label: item.label,
        };
      });

      setGroups(dataFormatted);
    });

    handleMethodology({
      header: {
        Authorization: `Bearer ${user.token}`,
      },
      refetchPathOptions: `${user.email}`,
    }).then(({ data, error }) => {
      if (error) {
        return toast.error("Erro ao carregar metodologias", {
          toastId: "error",
        });
      }

      const dataFormatted = data.map((item: any) => {
        return {
          value: item.id,
          label: item.label,
        };
      });

      setMethodologies(dataFormatted);
    });
  }, [isModalOpen === true]);

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
      <div className={styles.container}>
        <p className={styles.titleModal}>Criar indicador</p>
        <div className={styles.inputDiv}>
          <p
            className={styles.inputName}
            style={{ color: indicatorError === "name" ? "#ff4d4f" : "#000" }}
          >
            Nome:
          </p>
          <input
            className={styles.input}
            value={indicator.name}
            onChange={(e) => {
              setIndicator({ ...indicator, name: e.target.value });
            }}
            placeholder="Escreva aqui o nome..."
            style={{
              borderColor: indicatorError === "name" ? "#ff4d4f" : "#000",
            }}
          />
        </div>
        <div className={styles.inputDiv}>
          <div className={styles.inputDiv}>
            <p
              className={styles.inputName}
              style={{
                color: indicatorError === "methodology" ? "#ff4d4f" : "#000",
              }}
            >
              Metodologia:
            </p>

            <Select
              onChange={(value) => {
                setIndicator({ ...indicator, methodology: value });
              }}
              options={methodologies}
              value={indicator.methodology || "Selecione a metodologia"}
              className={styles.select}
              size="large"
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <Divider style={{ margin: "8px 0" }} />
                  <div>
                    <Input
                      placeholder="Nome da nova metodologia"
                      ref={inputRef}
                      value={nameMethodology}
                      onChange={(e) => onNameChange(e, "methodology")}
                      style={{ width: "100%" }}
                    />
                    <Button
                      type="primary"
                      onClick={(e) => addItem(e, "methodology")}
                      style={{ width: "100%", marginTop: 8 }}
                    >
                      Adicionar item
                    </Button>
                  </div>
                </>
              )}
            />
          </div>
          <div className={styles.inputDiv}>
            <p
              className={styles.inputName}
              style={{
                color: indicatorError === "group" ? "#ff4d4f" : "#000",
              }}
            >
              Conjunto:
            </p>

            <Select
              onChange={(value) => {
                setIndicator({ ...indicator, group: value });
              }}
              options={groups}
              value={indicator.group || "Selecione o conjunto"}
              className={styles.select}
              size="large"
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <Divider style={{ margin: "8px 0" }} />
                  <div>
                    <Input
                      placeholder="Nome do novo conjunto"
                      ref={inputRef}
                      value={nameGroup}
                      onChange={(e) => onNameChange(e, "group")}
                    />
                    <Button
                      type="primary"
                      onClick={(e) => addItem(e, "group")}
                      style={{ width: "100%", marginTop: 8 }}
                    >
                      Adicionar item
                    </Button>
                  </div>
                </>
              )}
            />
          </div>
        </div>
        <div>
          <p className={styles.inputName}>Descrição:</p>
          <ReactTextareaAutosize
            className={styles.textArea}
            value={indicator.description}
            onChange={(e) => {
              setIndicator({ ...indicator, description: e.target.value });
            }}
            placeholder="Escreva aqui a descrição..."
          />
        </div>
      </div>
    </Modal>
  );
}
