import styles from "../styles/Footer.module.scss";

interface FooterProps {
    children: React.ReactNode;
  }

export default function Footer(props : FooterProps){
    return <>
        <div className={styles.footer}>
            {props.children}
        </div>
    </>
}