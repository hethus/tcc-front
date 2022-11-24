import { SearchOutlined, MoreOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import { Button, Input, Space, Table } from "antd";
import type { ColumnsType, ColumnType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import React, { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import styles from "./styles.module.css";

interface DataType {
  id: string;
  name: string;
  students: number;
  semester: string;
  discipline: string;
  more: any;
}

type DataIndex = keyof DataType;

const Data: DataType[] = [
  {
    id: "1",
    name: "Turma A",
    students: 28,
    semester: "01-2020",
    discipline: "Algoritmos",
    more: <MoreOutlined />,
  },
  {
    id: "2",
    name: "Turma B",
    students: 22,
    semester: "03-2020",
    discipline: "Logica de programação",
    more: <MoreOutlined />,
  },
  {
    id: "3",
    name: "Turma C",
    students: 28,
    semester: "02-2020",
    discipline: "Contabilidade",
    more: <MoreOutlined />,
  },
  {
    id: "4",
    name: "Turma A",
    students: 30,
    semester: "05-2020",
    discipline: "Estruturas de dados II",
    more: <MoreOutlined />,
  },
];

const ClassesTable = () => {
  const [search, setSearch] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearch(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilter: () => void) => {
    clearFilter();
    setSearch("");
  };

  const getColumnsSearchProps = (
    dataIndex: DataIndex
  ): ColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Procurar por ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 96 }}
          >
            Pesquisar
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Limpar
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Fechar
          </Button>
        </Space>
      </div>
    ),

    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),

    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),

    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 70);
      }
    },

    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[search]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns: ColumnsType<DataType> = [
    {
      title: "Turma",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["ascend", "descend"],
      align: 'center',
      width: 160
    },
    {
      title: "Alunos",
      dataIndex: "students",
      key: "students",
      sorter: (a, b) => a.students - b.students,
      sortDirections: ["ascend", "descend"],
      align: 'center',
      width: 250
    },
    {
      title: "Semestres",
      dataIndex: "semester",
      key: "semester",
      sorter: (a, b) => a.semester.length - b.semester.length,
      sortDirections: ["ascend", "descend"],
      align: 'center',
      width: 250
    },
    {
      title: "Disciplinas",
      dataIndex: "discipline",
      key: "discipline",
      ...getColumnsSearchProps("discipline"),
      sorter: (a, b) => a.discipline.length - b.discipline.length,
      sortDirections: ["ascend", "descend"],
      align: 'center',
      width: 250
    },
    {
      title: "",
      dataIndex: "more",
      key: "more",
      width: 20
    },
  ];

  return <Table className={styles.Table} columns={columns} dataSource={Data} />;
};

export default ClassesTable;
