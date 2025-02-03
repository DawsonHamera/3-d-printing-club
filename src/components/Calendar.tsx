import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonList, IonProgressBar, IonRow } from "@ionic/react"
import React, { useEffect, useState } from "react"
import { useAuth } from "../providers/AuthProvider";
import axios from "axios";
import './Calendar.css'
import { checkmarkCircle, trash } from "ionicons/icons";

type CalendarProps = {
    qrcode?: Boolean,
    canDelete?: Boolean,
    refresh?: Boolean,
}

const Calendar: React.FC = (props: CalendarProps, refresh) => {
    const [loading, setLoading] = useState(true);
    const [attendance, setAttendance] = useState([]);
    const [events, setEvents] = useState([]);
    const { userState } = useAuth()

    const fetchData = async () => {
        const attendance = await axios.post("https://dawson.hamera.com/api/get_attendance.php", { user_id: userState?.user_id });
        const events = await axios.get("https://dawson.hamera.com/api/get_events.php");
        const attendedEvents = attendance.data.map((event: any) => event.event_id)
        setAttendance(attendedEvents)
        setEvents(events.data)
        setLoading(false)
    }
    const removeEvent = async (code: String) => {
        try {
            const result = await axios.post('https://dawson.hamera.com/api/remove_event.php', { verification_code: code });
            fetchData()
            console.log("Deleted successfully", result)
        } catch (error) {
            console.error(error);

        }
    }

    useEffect(
        React.useCallback(() => {
            setLoading(true)
            fetchData();
        }, [])
        , [refresh]);

    const renderEvents = events.map((event) => (
        <IonCard className="card">
            <IonGrid>
                <IonRow>
                    <IonCol size="1" className="vertical-container">
                        <p className="vertical">{event.event_type}</p>
                    </IonCol>
                    <IonCol>
                        <IonCardHeader>
                            <IonCardTitle>{event.event_name}</IonCardTitle>
                            <IonCardSubtitle>
                                {new Date(`1970-01-01T${event.start_time}Z`).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) + " - "}
                                {new Date(`1970-01-01T${event.end_time}Z`).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                            </IonCardSubtitle>
                        </IonCardHeader>

                        <IonCardContent>
                            {event.event_details}
                        </IonCardContent></IonCol>
                    <IonCol size="3">
                        <div style={{justifyItems: 'center'}}>
                            <h4>{new Date(event.event_date).toLocaleString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}</h4>
                            <IonIcon icon={checkmarkCircle} size="large"></IonIcon>
                        </div>
                        <IonIcon icon={trash} size="small" style={{float: "right", margin: 5}} onClick={() => removeEvent(event.verification_code)}></IonIcon>
                    </IonCol>
                </IonRow>
            </IonGrid>
            
        </IonCard>
    ))

    if (loading) {
        return <IonProgressBar type="indeterminate"></IonProgressBar>;
    }


    return (
        <div>
            {renderEvents}
        </div>
    )

}

export default Calendar;