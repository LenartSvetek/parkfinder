import { forwardRef, useImperativeHandle, useState } from 'react';
import styles from '../styles/ListView.module.scss'
import { parking } from '../data/data';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faChargingStation, faUsers, faVideo, faTicket } from '@fortawesome/free-solid-svg-icons';

interface ListViewProps extends React.HTMLAttributes<HTMLDivElement>{
}

interface ListViewHandle {
  show : (show: boolean) => void,
  setParkingSpaces : (parks : parking[]) => void
}

const ListView = forwardRef<ListViewHandle, ListViewProps>(({...props }, ref) => {
    let [bShow, setShow] = useState<boolean>(false);  
    let [parkings, setParking] = useState<parking[]>([]);
    
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