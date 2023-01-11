import { MoreOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Typography } from "antd";
import { useRouter } from "next/router";
import React, { Dispatch } from "react";
import { appRoutes } from "../../../../constants";

interface Props {
  setOpenModal: Dispatch<boolean>;
  idParam: string
}

const MoreInfosTable = ({ setOpenModal, idParam }: Props) => {
  const navigate = useRouter();

  const items: MenuProps["items"] = [
    {
      label: (
        <Typography onClick={() => navigate.push(appRoutes.updateClass.replace("[index]", idParam))}>
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
