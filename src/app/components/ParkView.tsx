import { forwardRef, useImperativeHandle, useState } from 'react';
import styles from '../styles/ParkView.module.scss'
import { parking } from '../data/data';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faChargingStation, faUsers, faVideo, faTicket, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image'
import Link from 'next/link';

export interface ParkViewHandle {
  show : (show: boolean) => void,
  setParkingSpace : (parks : parking) => void
}

const ParkView = forwardRef<ParkViewHandle, React.HTMLAttributes<HTMLDivElement>>(({...props }, ref) => {
    const [bShow, setShow] = useState<boolean>(false);  
    const [parking, setParking] = useState<parking | undefined>(undefined);
    
    const show = (show : boolean) => setShow(show);

    const setParkingSpace = (parking : parking) => setParking(parking);

    useImperativeHandle(ref, () => ({
        show,
        setParkingSpace
    }));

    return (
        <div {...props} className={`${styles.parkView} ${(!bShow)?styles.hidden : ""}`}>
        {
            (parking)? (
                <>
                <h2>{parking.name}</h2>
                <div className={styles.pills}>
                    <div className={`${styles.pill} ${(parking.parkInfo.freeSpaces > 5)? "" : (parking.parkInfo.freeSpaces > 0)? styles.closeToCapacity : styles.atCapacity}`}>
                        <span className={styles.capacity}>{parking.parkInfo.freeSpaces}</span>
                        <FontAwesomeIcon icon={faCar} color="black" size="xl" className={styles.car}/>
                    </div>
                    {
                        (parking.parkInfo.electricSpaces > 0)?
                        <div className={`${styles.pill} ${(parking.parkInfo.freeElSpaces > 3)? "" : (parking.parkInfo.freeElSpaces > 0)? styles.closeToCapacity : styles.atCapacity}`}>
                            <span className={styles.capacity}>{parking.parkInfo.freeElSpaces}</span>
                            <FontAwesomeIcon icon={faChargingStation} color="black" size="xl" />
                        </div> 
                        : <></>
                    }
                    <div className={styles.pill}>
                        <FontAwesomeIcon icon={(parking.level == 1)? faUsers : (parking.level == 2)? faVideo : faTicket} color="black" size="xl" />
                    </div>
                </div>
                {
                    parking.level == 3?
                        <Image className={styles.image} src="/park.png" alt="parking" width={350} height={350}></Image>
                        :<></>
                }
                <div className={styles.link}>
                    <Link className={styles.pill} href={`https://maps.google.com/?q=${parking.location.lat},${parking.location.lng}`}>
                        <FontAwesomeIcon icon={faLocationDot} />
                        <span>Navigate</span>
                    </Link>
                </div>
                </>
            ) : <></>
        }
        </div>
    );
});

// Set displayName for better debugging in React DevTools
ParkView.displayName = 'ListView';

export default ParkView;