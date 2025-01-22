import { OverlayView } from "@react-google-maps/api";
import { parking } from "../data/data";
import styles from "../styles/ParkMarker.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar, faChargingStation, faTicket, faUsers, faVideo } from "@fortawesome/free-solid-svg-icons";

interface ParkMarkerProps extends parking {
    showElSpaces ?: boolean
}

export default function ParkMarker(info : ParkMarkerProps) {

    return <OverlayView
        position={info.location}
        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
        <div
            className={styles.marker}
        >
            <div className={`${styles.pill} ${(info.parkInfo.freeSpaces > 5)? "" : (info.parkInfo.freeSpaces > 0)? styles.closeToCapacity : styles.atCapacity}`}>
                <span className={styles.capacity}>{info.parkInfo.freeSpaces}</span>
                <FontAwesomeIcon icon={faCar} color="black" size="xl" className={styles.car}/>
            </div>
            {
                (info.parkInfo.electricSpaces > 0 && (info.showElSpaces == undefined || info.showElSpaces))?
                <div className={`${styles.pill} ${(info.parkInfo.freeElSpaces > 3)? "" : (info.parkInfo.freeElSpaces > 0)? styles.closeToCapacity : styles.atCapacity}`}>
                    <span className={styles.capacity}>{info.parkInfo.freeElSpaces}</span>
                    <FontAwesomeIcon icon={faChargingStation} color="black" size="xl" />
                </div> 
                : <></>
            }

            <div className={styles.pill}>
                <FontAwesomeIcon icon={(info.level == 1)? faUsers : (info.level == 2)? faVideo : faTicket} color="black" size="xl" />
            </div>
        </div>
    </OverlayView>
}