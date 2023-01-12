import { Modal, Checkbox, Select, DatePicker } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { formsUpdate } from "../../../store/actions/forms";
import useCRUD from "../hooks/useCRUD";
import styles from "./styles.module.css";
import ReactTextareaAutosize from "react-textarea-autosize";

interface EvaluationModalProps {
  open: boolean;
  formId: string;
  indicatorId: string;
  handleReload: () => void;
  setEvaluationModal: (value: boolean) => void;
}

export function EvaluationModal({
  open,
  formId,
  indicatorId,
  handleReload,
  setEvaluationModal,
}: EvaluationModalProps) {
  const router = useRouter();

  const { user } = useSelector((state: any) => state);
  const { handleGet: handleGetClasses } = useCRUD({ model: "classe" });
  const { handleCreate: handleCreateEvaluation } = useCRUD({ model: "evaluation" });
  const [classes, setClasses] = useState([] as any);
  const [evaluation, setEvaluation] = useState({
    formId,
    indicatorId,
    classId: "",
    initialDate: "",
    finalDate: "",
    description: "",
    repeat: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    },
  });

  const handleOk = () => {
    handleCreateEvaluation({
      header: {
        Authorization: `Bearer ${user.token}`,
      },
      values: evaluation,
    }).then(({ data, error }) => {
      if (error) {
        toast.error("Erro ao criar avaliação");
        return;
      }

      toast.success("Avaliação criada com sucesso");
      setEvaluation({
        formId: "",
        indicatorId: "",
        classId: "",
        initialDate: "",
        finalDate: "",
        description: "",
        repeat: {
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
          sunday: false,
        },
      });
      handleReload();
      setEvaluationModal(false);
    });
  };

  const handleCancel = () => {
    setEvaluationModal(false);
    setEvaluation({
      formId: "",
      indicatorId: "",
      classId: "",
      initialDate: "",
      finalDate: "",
      description: "",
      repeat: {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
      },
    });
  };

  useEffect(() => {
    if (!router.isReady || !open) return;
    handleGetClasses({
      header: {
        Authorization: `Bearer ${user.token}`,
      },
      refetchPathOptions: `${user.email}`,
    }).then(({ data, error }) => {
      if (error) {
        toast.error("Erro ao buscar turmas");
        return;
      }

      setClasses(data);

      setEvaluation({
        ...evaluation,
        formId,
        indicatorId,
      });
    });
  }, [open]);

  return (
    <Modal
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={"Adicionar"}
      cancelText="Cancelar"
      title={"Adicionar aplicação"}
      width={700}
      bodyStyle={{ padding: "0 1.2rem 1rem 1.2rem" }}
    >
      <div className={styles.lineFlex}>
        <div className={styles.divFlex}>
          <span className={styles.title}>Formulário: </span>
          <span>teste</span>
        </div>
        <div className={styles.divFlex}>
          <span className={styles.title}>Turma: </span>
          <Select
            showSearch
            placeholder="Selecione a turma"
            filterOption={(input, option) =>
              `${option?.label ?? ""}`
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            className={styles.select}
            options={classes.map((classe: any) => ({
              value: classe.id,
              label: classe.name,
            }))}
            value={evaluation.classId}
            onChange={(value) =>
              setEvaluation({ ...evaluation, classId: value })
            }
          />
        </div>
      </div>
      <div className={styles.divFlexRange}>
        <span className={styles.title}>Período: </span>
        <DatePicker.RangePicker
          showTime
          onChange={(value, valueString) =>
            setEvaluation({
              ...evaluation,
              initialDate: new Date(`${value?.[0]}`).toISOString(),
              finalDate: new Date(`${value?.[1]}`).toISOString(),
            })
          }
          placeholder={["Escolha a data inicial", "Escolha a data final"]}
          className={styles.datePicker}
        />
      </div>
      <div className={styles.descriptionDiv}>
        <span className={styles.title}>Observações: </span>
        <ReactTextareaAutosize
          placeholder="Escreva aqui as observações..."
          className={styles.textArea}
          value={evaluation.description}
          onChange={(e) =>
            setEvaluation({ ...evaluation, description: e.target.value })
          }
        />
      </div>
      <div className={styles.weekDiv}>
        <span className={styles.title}>Repetir: </span>
        <div className={styles.checkboxContainer}>
          <div className={styles.checkboxDiv}>
            <span>Seg</span>
            <Checkbox
              checked={evaluation.repeat.monday}
              onChange={(e) =>
                setEvaluation({
                  ...evaluation,
                  repeat: {
                    ...evaluation.repeat,
                    monday: e.target.checked,
                  },
                })
              }
            />
          </div>
          <div className={styles.checkboxDiv}>
            <span>Ter</span>
            <Checkbox
              checked={evaluation.repeat.tuesday}
              onChange={(e) =>
                setEvaluation({
                  ...evaluation,
                  repeat: {
                    ...evaluation.repeat,
                    tuesday: e.target.checked,
                  },
                })
              }
            />
          </div>
          <div className={styles.checkboxDiv}>
            <span>Qua</span>
            <Checkbox
              checked={evaluation.repeat.wednesday}
              onChange={(e) =>
                setEvaluation({
                  ...evaluation,
                  repeat: {
                    ...evaluation.repeat,
                    wednesday: e.target.checked,
                  },
                })
              }
            />
          </div>
          <div className={styles.checkboxDiv}>
            <span>Qui</span>
            <Checkbox
              checked={evaluation.repeat.thursday}
              onChange={(e) =>
                setEvaluation({
                  ...evaluation,
                  repeat: {
                    ...evaluation.repeat,
                    thursday: e.target.checked,
                  },
                })
              }
            />
          </div>
          <div className={styles.checkboxDiv}>
            <span>Sex</span>
            <Checkbox
              checked={evaluation.repeat.friday}
              onChange={(e) =>
                setEvaluation({
                  ...evaluation,
                  repeat: {
                    ...evaluation.repeat,
                    friday: e.target.checked,
                  },
                })
              }
            />
          </div>
          <div className={styles.checkboxDiv}>
            <span>Sab</span>
            <Checkbox
              checked={evaluation.repeat.saturday}
              onChange={(e) =>
                setEvaluation({
                  ...evaluation,
                  repeat: {
                    ...evaluation.repeat,
                    saturday: e.target.checked,
                  },
                })
              }
            />
          </div>
          <div className={styles.checkboxDiv}>
            <span>Dom</span>
            <Checkbox
              checked={evaluation.repeat.sunday}
              onChange={(e) =>
                setEvaluation({
                  ...evaluation,
                  repeat: {
                    ...evaluation.repeat,
                    sunday: e.target.checked,
                  },
                })
              }
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
