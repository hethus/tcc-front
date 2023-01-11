import React, { Dispatch } from "react";
import { Dropdown, Typography } from "antd";
import type { MenuProps } from "antd";
import { MoreOutlined } from "@ant-design/icons";

interface Props {
  setOpenModal: Dispatch<boolean>;
}

const RemoveStudent = ({ setOpenModal }: Props) => {
  const items: MenuProps["items"] = [
    {
      label: (
        <Typography onClick={() => setOpenModal(true)}>
          Remover aluno
        </Typography>
      ),
      key: 1,
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
      <MoreOutlined
        style={{
          cursor: "pointer",
        }}
      />
    </Dropdown>
  );
};

export default RemoveStudent;
