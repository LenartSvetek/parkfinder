'use client'

import { forwardRef } from 'react';
import styles from '../styles/Search.module.scss';

const Search = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props : React.InputHTMLAttributes<HTMLInputElement>, ref) => {
    return <div className={styles.searchBox}><input {...props} ref={ref} type="text" placeholder="Search..."></input></div>
});

Search.displayName = "Search";

export { Search };