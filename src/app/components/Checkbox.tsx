'use client'
import styles from '../styles/Settings.module.scss'

interface checkbox extends React.InputHTMLAttributes<HTMLInputElement>{
    children : string
}


export default function Checkbox({children, ...props } : checkbox) {
    
    const uuid = Math.floor(Math.random() * 100000000).toString();
     return <div className={styles.inputBox}>
     <label htmlFor={uuid}>{children}</label>
     <input id={uuid} {...props} type='checkbox'
     />
   </div>
}