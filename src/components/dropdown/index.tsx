import { Dropdown, Typography } from "antd";
import type { MenuProps } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { NextComponentType } from "next";
import React, { Dispatch, useEffect, useState } from "react";
import { appRoutes } from "../../../constants";
import { useRouter } from "next/router";

interface Props {
  setOpenModal: Dispatch<boolean>
}


const MoreInfosTable = ({ setOpenModal }: Props) => {
  const navigate = useRouter();

  const items: MenuProps["items"] = [
    {
      label: (
        <Typography onClick={() => navigate.push(appRoutes.updateClass)}>
          Editar
        </Typography>
      ),
      key: "1",
    },
    {
      label: (
        <Typography onClick={() => setOpenModal(true)}>Excluir</Typography>
      ),
      key: "2",
    },
  ];

  return (
    <Dropdown
      menu={{ items }}
      trigger={["click"]}
      placement="bottomRight"
    >
      <MoreOutlined
        style={{
          cursor: "pointer",
        }}
      />
    </Dropdown>
  );
};

export default MoreInfosTable;
