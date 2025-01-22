import Image from "next/image";
import styles from "./page.module.css";
import Map from "./components/Map";



export default function Home() {
  const center = { lat: 40.7128, lng: -74.0060 }; // Example: New York City coordinates
  const zoom = 12;

  return (
    <div className={styles.page}>
      <Map zoom={zoom} />
    </div>
  );
}
