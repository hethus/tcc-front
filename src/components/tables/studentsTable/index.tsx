import { SearchOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import { Button, Input, Space, Table } from "antd";
import type { ColumnsType, ColumnType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import Highlighter from "react-highlight-words";
import Styles from "./styles.module.css";
import MoreInfosTable from "../../dropdown/moreInfosTable";
import useCRUD from "../../hooks/useCRUD";
import { useSelector } from "react-redux";
import RemoveStudent from "../../dropdown/removeStudent";

interface DataType {
  name: string;
  email: string;
  registration: string;
  more?: any;
}

type DataIndex = keyof DataType;

interface Props {
  students: any[];
  setOpenModal: Dispatch<boolean>;
}

const StudentsTable = ({ students, setOpenModal }: Props) => {
  const [search, setSearch] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [studentsTableData, setStudentsTableData] = useState<DataType[]>(
    [] as DataType[]
  );

  const searchInput = useRef<InputRef>(null);

  useEffect(() => {
    const studentsData = students.map((info) => {
      return {
        name: info.name,
        email: info.email,
        registration: info.registration,
        more: <RemoveStudent setOpenModal={setOpenModal} />
      };
    });
    setStudentsTableData(studentsData);
  }, []);

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
      title: "Nome",
      dataIndex: "name",
      key: "name",
      ...getColumnsSearchProps("name"),
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["ascend", "descend"],
      align: "center",
      width: 85,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnsSearchProps("email"),
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["ascend", "descend"],
      align: "center",
      width: 85,
    },
    {
      title: "Registro",
      dataIndex: "registration",
      key: "registration",
      ...getColumnsSearchProps("registration"),
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["ascend", "descend"],
      align: "center",
      width: 85,
    },
    {
      title: "",
      dataIndex: "more",
      key: "more",
      width: 20,
    },
  ];

  return (
    <Table
      size={"middle"}
      className={Styles.Table}
      columns={columns}
      dataSource={studentsTableData}
    />
  );
};

export default StudentsTable;
