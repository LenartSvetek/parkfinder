
import { forwardRef, useImperativeHandle, useState } from 'react';
import styles from '../styles/Settings.module.scss'

interface SettignsProps extends React.HTMLAttributes<HTMLDivElement>{
    children? : React.ReactNode
}

export interface SettingsHandle {
  show : (show: boolean) => void
}

const Settings = forwardRef<SettingsHandle, SettignsProps>(({ children, ...props }, ref) => {
  const [bShow, setShow] = useState<boolean>(false);  
  
  const show = (show : boolean) => setShow(show);

  useImperativeHandle(ref, () => ({
      show
  }));

  return (
    <div {...props} className={`${styles.settings} ${(!bShow)?styles.hidden : ""}`}>
      {children}
    </div>
    );
  });
  
  // Set displayName for better debugging in React DevTools
  Settings.displayName = 'Settings';
  
  export default Settings;