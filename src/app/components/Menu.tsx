import { forwardRef, useImperativeHandle, useState } from 'react';
import styles from '../styles/Menu.module.scss'
import { get } from 'http';
import { parking } from '../data/data';

type contextType = 'hidden' | 'settings' | 'listView' | 'parking';

// Define the interface for the component props
interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
    type: contextType;
    barCallBack?: () => void
}
  


interface MenuHandle {
    setType: (type : contextType) => void;
    getType: () => contextType
}
  
  
// Use forwardRef to pass the ref to the underlying div element
const Menu = forwardRef<MenuHandle, MenuProps>(({ children, type, barCallBack, ...props }, ref) => {
    let [cType, setType] = useState<contextType>(type);

    const getType = () => cType;
    
    useImperativeHandle(ref, () => ({
        setType,
        getType
    }));

    return (
        <div {...props} className={styles.Menu}>
        <div className={styles.barCont}>
            <div className={styles.bar} onClick={barCallBack}></div>
        </div>
        <div id="content" className={cType === 'hidden' ? styles.hidden : ''}>
            {children}
        </div>
        </div>
    );
    });

// Set displayName for better debugging in React DevTools
Menu.displayName = 'Menu';

export default Menu;