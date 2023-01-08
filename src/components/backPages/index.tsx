import React from "react";
import styles from "./styles.module.css";
import { LeftOutlined } from "@ant-design/icons";
import { useRouter } from 'next/router'

const BackPage = () => {
    const navigate = useRouter()

  return (
    <div className={styles.backPage}>
      <i className={styles.backIcon}>
        <LeftOutlined onClick={() => navigate.back()} />
      </i>
    </div>
  );
};

export default BackPage;
