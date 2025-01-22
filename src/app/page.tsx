import styles from "./page.module.css";
import Map from "./components/Map";



export default function Home() {
  const zoom = 12;

  return (
    <div className={styles.page}>
      <Map zoom={zoom} />
    </div>
  );
}
