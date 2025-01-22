'use client'
import styles from '../styles/Settings.module.scss'

interface checkbox extends React.InputHTMLAttributes<HTMLInputElement>{
    children : string
}


const { v4: uuidv4 } = require('uuid');
export default function Checkbox({children, ...props } : checkbox) {
    
    let uuid = uuidv4();
     return <div className={styles.inputBox}>
     <label htmlFor={uuid}>{children}</label>
     <input id={uuid} {...props} type='checkbox'
     />
   </div>
}