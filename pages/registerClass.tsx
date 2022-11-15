import type { NextPage } from "next";
import { UploadOutlined } from "@ant-design/icons";
import readXlsxFile from 'read-excel-file'
import { Header } from "../src/components/header";
import { Button } from "antd";
import { InputForms } from "../src/components/inputForms";
import styles from "../styles/RegisterTeacher.module.css";
import Upload from "antd/lib/upload/Upload";
import useCRUD from "../src/components/hooks/useCRUD";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

 const onUploadFile = (info)  => {
    if (info.file.status === "done") {
      toast.success(`Arquivo ${info.file.name} baixado com sucesso`);
      if(info.file.name.split('.'[1]) === 'xlsx') {
        readXlsxFile(info.file.originFileObj).then((rows) => {
          console.log({rows})
         })
        }
    } else if (info.file.status === "error") {
      toast.error('Erro ao baixar arquivo');
    }
  };

  const formFields = [
    {title: 'Nome', type: 'string', key: 'name'},
    {title: 'Nome da disciplina', type: 'string', key: 'subjectName'},
    {title: 'Código da disciplina', type: 'number', key: 'subjectId'},
    {title: 'Semestre', type: 'string', key: 'semester'}
  ];

const RegisterClass: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [classData, setClassData] = useState({});

  const { data, handleCreate, loading } = useCRUD({ model: 'subjectClass', immediatlyLoadData: !!id, pathOptions: id });

  useEffect(() => {
    if(!loading && data) {
      setClassData(data);
    }
  },[data])

  const registerNewClass = () => {
    handleCreate({values: classData})
  }

  return !loading ? (
    <div className={styles.container}>
      <Header />
      <div className={styles.titleForms}>Cadastro Turma</div>
      <div className={styles.pageContainer}>
        <div className={styles.formsContainer}>
          {formFields.map((field) => {
            const { key, type } = field;
            return (
                      <InputForms key={key} onChange={e => {
                        setClassData(prev => ({...prev, [key]: type === 'number' ? Number(e.target.value) : e.target.value}))
                      }} {...field}/>

          )})}
          <span>(Apenas arquivos xlsx)</span>
          <Upload onChange={onUploadFile} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
            <Button className={styles.buttonUpload} icon={<UploadOutlined />}>
              Alunos
            </Button>
          </Upload>
        </div>

        <div className={styles.buttonDiv}>
          <Button className={styles.buttonCancel} onClick={() => router.back()}>Voltar</Button>
          <Button className={styles.buttonRegister} onClick={registerNewClass}>Salvar</Button>
        </div>
      </div>
    </div>
  ) : null;
};

export default RegisterClass;
