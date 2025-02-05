import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonDatetime, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonModal, IonPage, IonProgressBar, IonRow, IonTitle, IonToolbar } from "@ionic/react"
import React, { useEffect, useState } from "react"
import { useAuth } from "../providers/AuthProvider";
import axios from "axios";
import './Calendar.css'
import { checkmarkCircle, trash } from "ionicons/icons";
import { v4 as uuidv4 } from 'uuid';
import QRCode from "react-qr-code";


interface CalendarProps {
    qrcode?: boolean;
    canEdit?: boolean;
}

interface Event {
    event_id: string;
    event_type: string;
    event_name: string;
    start_time: string;
    end_time: string;
    event_details: string;
    event_date: string;
    verification_code: string;
}

const Calendar: React.FC<CalendarProps> = ({ canEdit }) => {
    const [loading, setLoading] = useState(true);
    const [attendance, setAttendance] = useState<string[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isStartTimeOpen, setIsStartTimeOpen] = useState(false);
    const [isEndTimeOpen, setIsEndTimeOpen] = useState(false);
    const [isDateOpen, setIsDateOpen] = useState(false);
    const [eventName, setEventName] = useState("");
    const [eventType, setEventType] = useState("");
    const [eventDetails, setEventDetails] = useState("");
    const [eventLocation, setEventLocation] = useState("");
    const [scheduledBy, setScheduledby] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const [isInvalid, setIsInvalid] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const { userState } = useAuth()

    const generateCode = () => {
        setVerificationCode(uuidv4().substring(0, 8))
    }

    const addEvent = async () => {
        console.log("Adding event...")

        try {
            const result = await axios.post('https://dawson.hamera.com/api/add_event.php', { event_name: eventName, event_type: eventType, event_details: eventDetails, event_location: eventLocation, scheduled_by: `${userState?.firstName} ${userState?.lastName}`, verification_code: verificationCode, event_date: eventDate, start_time: startTime, end_time: endTime });
            console.log(result.data)
            if (result.data.error) {
                console.log(result.data.error)
                setIsInvalid(true)
                setErrorMessage(result.data.error)
            } else {
                setIsInvalid(false)
                setIsOpen(false)
                fetchData()
            }
        } catch (error) {
            console.error("Error", error);

        }
    }


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
        , []);

    const renderEvents = events.map((event: Event) => (
        <IonItemSliding>
            <IonItem>
                <IonCard className="card" key={event.event_id}>
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
                                </IonCardContent>
                            </IonCol>

                            <IonCol size="4">
                                <div style={{ justifyItems: 'center' }}>
                                    <h4>{new Date(event.event_date).toLocaleString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}</h4>
                                    {userState?.role === 'admin' ? (
                                        <QRCode
                                            value={event.verification_code}
                                            size={100}
                                            bgColor="transparent"
                                            fgColor="var(--ion-color-primary)"
                                        />
                                    ) : (
                                        <IonIcon icon={checkmarkCircle} size="large"></IonIcon>
                                    )}
                                </div>
                            </IonCol>
                        </IonRow>
                    </IonGrid>

                </IonCard>
            </IonItem>

            <IonItemOptions side="end">
                <IonItemOption color="danger">
                    <IonIcon slot="icon-only" icon={trash}></IonIcon>
                </IonItemOption>
            </IonItemOptions>
        </IonItemSliding>
    ))

    const editEvents = (
        <IonPage>
            <IonContent>
                <IonButton onClick={() => setIsOpen(true)} className="center">Add</IonButton>
                <IonModal isOpen={isOpen}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Modal</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => setIsOpen(false)}>Close</IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent className="ion-padding">
                        <IonList>
                            <IonItem>
                                <IonInput label="Name" value={eventName} onIonInput={(event) => setEventName((event.detail.value ?? '') as string)}></IonInput>
                            </IonItem>
                            <IonItem>
                                <IonInput label="Type" value={eventType} onIonInput={(event) => setEventType((event.detail.value ?? '') as string)}></IonInput>
                            </IonItem>
                            <IonItem>
                                <IonInput label="Details" value={eventDetails} onIonInput={(event) => setEventDetails((event.detail.value ?? '') as string)}></IonInput>
                            </IonItem>
                            <IonItem>
                                <IonInput label="Location" value={eventLocation} onIonInput={(event) => setEventLocation((event.detail.value ?? '') as string)}></IonInput>
                            </IonItem>
                            <IonItem>
                                <IonButton onClick={() => setIsStartTimeOpen(true)}>Start time</IonButton> <p style={{ marginLeft: 15 }}>{new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </IonItem>
                            <IonItem>
                                <IonButton onClick={() => setIsEndTimeOpen(true)}>End time</IonButton> <p style={{ marginLeft: 15 }}>{new Date(endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </IonItem>
                            <IonItem>
                                <IonButton onClick={() => setIsDateOpen(true)}>Date</IonButton> <p style={{ marginLeft: 15 }}>{new Date(eventDate).toLocaleString('en-US', { month: 'short', day: 'numeric' })}</p>
                            </IonItem>
                            <IonItem>
                                <IonInput label="Code" value={verificationCode} onIonInput={(event) => setVerificationCode((event.detail.value ?? '') as string)}></IonInput>
                                <IonButton onClick={() => generateCode()}>Generate</IonButton>
                            </IonItem>
                        </IonList>
                        <IonButton className="center" onClick={() => addEvent()}>Add</IonButton>
                        <p>{errorMessage}</p>
                    </IonContent>
                    <IonModal isOpen={isStartTimeOpen} initialBreakpoint={0.5} breakpoints={[0.5]} onDidDismiss={() => setIsStartTimeOpen(false)}>
                        <div className="center">
                            <IonDatetime presentation="time" className="timedate" value={startTime} onIonChange={(event) => { setStartTime((event.detail.value ?? '') as string) }}></IonDatetime>
                        </div>
                    </IonModal>
                    <IonModal isOpen={isEndTimeOpen} initialBreakpoint={0.5} breakpoints={[0.5]} onDidDismiss={() => setIsEndTimeOpen(false)}>
                        <div className="center">
                            <IonDatetime presentation="time" className="timedate" value={endTime} onIonChange={(event) => { setEndTime((event.detail.value ?? '') as string) }}></IonDatetime>
                        </div>
                    </IonModal>
                    <IonModal isOpen={isDateOpen} initialBreakpoint={0.5} breakpoints={[0.5]} onDidDismiss={() => setIsDateOpen(false)}>
                        <div className="center">
                            <IonDatetime presentation="date" className="timedate" value={eventDate} onIonChange={(event) => { setEventDate((event.detail.value ?? '') as string) }}></IonDatetime>
                        </div>
                    </IonModal>
                </IonModal>
                {renderEvents}
            </IonContent>
        </IonPage>
    )

    if (loading) {
        return <IonProgressBar type="indeterminate"></IonProgressBar>;
    }


    if (canEdit) {
        return editEvents
    } else {
        return <div>{renderEvents}</div>
    }

}

export default Calendar;