import { CaretDownOutlined } from "@ant-design/icons";
import React from "react";
import styles from "./styles.module.css";

interface FilterProps {
  title: string;
}

export function FilterButton({ title }: FilterProps) {
  return (
    <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      <CaretDownOutlined style={{ fontSize: "24px", color: "#8C8C8C" }} />
    </div>
  );
}
