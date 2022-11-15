import { ClockCircleOutlined, MoreOutlined } from "@ant-design/icons";
import styles from "./styles.module.css";

interface FormCardProps {
  title: string;
  visualization: number;
  date: string;
}

export function FormCard({ title, visualization, date }: FormCardProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        <button className={styles.button}>
          <MoreOutlined
            style={{ fontSize: "18px", color: "#0094FF", fontWeight: "bold" }}
          />
        </button>
      </div>
      <div className={styles.body}>
        <div className={styles.visualization}>
          Visualização: {visualization}
        </div>
      </div>
      <div className={styles.footer}>
        <ClockCircleOutlined style={{ fontSize: "16px", color: "#868686" }} />
        <div className={styles.date}>Criado em {date}</div>
      </div>
    </div>
  );
}
