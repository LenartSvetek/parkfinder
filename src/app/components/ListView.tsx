import { forwardRef, useImperativeHandle, useState } from 'react';
import styles from '../styles/ListView.module.scss'
import { parking } from '../data/data';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faChargingStation, faUsers, faVideo, faTicket } from '@fortawesome/free-solid-svg-icons';

export interface ListViewHandle {
  show : (show: boolean) => void,
  setParkingSpaces : (parks : parking[]) => void
}

const ListView = forwardRef<ListViewHandle, React.HTMLAttributes<HTMLDivElement>>(({...props }, ref) => {
    const [bShow, setShow] = useState<boolean>(false);  
    const [parkings, setParking] = useState<parking[]>([]);
    
    const show = (show : boolean) => setShow(show);

    const setParkingSpaces = (parks : parking[]) => setParking(parks);

    useImperativeHandle(ref, () => ({
        show,
        setParkingSpaces
    }));

    return (
        <div {...props} className={`${styles.listView} ${(!bShow)?styles.hidden : ""}`}>
        {
            parkings.map((park, i) => <>
                <div key={i} className={styles.item}>
                    <span>{park.name}</span>
                    <div>
                        <div className={`${styles.pill} ${(park.parkInfo.freeSpaces > 5)? "" : (park.parkInfo.freeSpaces > 0)? styles.closeToCapacity : styles.atCapacity}`}>
                            <span className={styles.capacity}>{park.parkInfo.freeSpaces}</span>
                            <FontAwesomeIcon icon={faCar} color="black" size="xl" className={styles.car}/>
                        </div>
                        {
                            (park.parkInfo.electricSpaces > 0)?
                            <div className={`${styles.pill} ${(park.parkInfo.freeElSpaces > 3)? "" : (park.parkInfo.freeElSpaces > 0)? styles.closeToCapacity : styles.atCapacity}`}>
                                <span className={styles.capacity}>{park.parkInfo.freeElSpaces}</span>
                                <FontAwesomeIcon icon={faChargingStation} color="black" size="xl" />
                            </div> 
                            : <></>
                        }
                        <div className={styles.pill}>
                            <FontAwesomeIcon icon={(park.level == 1)? faUsers : (park.level == 2)? faVideo : faTicket} color="black" size="xl" />
                        </div>
                    </div>
                </div>
            </>)
        }
        </div>
    );
});

// Set displayName for better debugging in React DevTools
ListView.displayName = 'ListView';

export default ListView;