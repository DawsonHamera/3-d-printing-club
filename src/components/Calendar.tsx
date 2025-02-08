import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonDatetime, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonModal, IonPage, IonProgressBar, IonRow, IonTitle, IonToolbar } from "@ionic/react"
import React, { useEffect, useState } from "react"
import { useAuth } from "../providers/AuthProvider";
import axios from "axios";
import './Calendar.css'
import { checkmarkCircle, ellipseOutline, trash } from "ionicons/icons";
import { v4 as uuidv4 } from 'uuid';
import QRCode from "react-qr-code";


interface CalendarProps {
    qrcode?: boolean;
    canEdit?: boolean;
    events: any[];  // List of events from parent
    attendance: any[]
    onAddEvent: (newEvent: any) => void;  // Parent function to add event
    onRemoveEvent: (eventId: string) => void;  // Parent function to remove event
    loading: boolean;  // Loading state from parent
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

const Calendar: React.FC<CalendarProps> = ({ events, attendance, onAddEvent, onRemoveEvent, loading, qrcode, canEdit }) => {
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

    const handleAddEvent = () => {
        onAddEvent({ event_name: eventName, event_type: eventType, event_details: eventDetails, event_location: eventLocation, scheduled_by: `${userState?.firstName} ${userState?.lastName}`, verification_code: verificationCode, event_date: eventDate, start_time: startTime, end_time: endTime });
        setIsOpen(false);  // Close modal after adding
    };

    const handleRemoveEvent = (eventId: string) => {
        onRemoveEvent(eventId);
    };

    const attending = events.filter(event => attendance.includes(event.event_id));
    const other = events.filter(event => !attendance.includes(event.event_id));


    const renderEvents = (events: Event[], color: string) => (
        <>
            {events.map((event: Event) => (
                <IonItemSliding key={event.event_id}>
                    <IonItem >
                        <IonCard style={{ borderLeft: `6px solid ${color}`, width: '100%' /*backgroundColor: "var(--ion-color-light-shade)"*/ }}>
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
                                            {qrcode ? (
                                                <>
                                                    <QRCode
                                                        value={event.verification_code}
                                                        size={100}
                                                    // style={{border: '4px solid var(--ion-color-light-tint)'}}
                                                    // fgColor="var(--ion-color-light-tint)"
                                                    // bgColor="var(--ion-color-primary)"
                                                    />
                                                    <p>{event.verification_code}</p>
                                                </>
                                            ) : (
                                                (() => {
                                                    const eventDateTime = new Date(`${event.event_date}T${event.start_time}`);
                                                    const currentTime = new Date();
                                                    if (eventDateTime < currentTime && attendance.includes(event.event_id)) {
                                                        return <IonIcon icon={checkmarkCircle} size="large"></IonIcon>;
                                                    } else if (attendance.includes(event.event_id)) {
                                                        return <IonIcon icon={ellipseOutline} size="large"></IonIcon>;
                                                    } else {
                                                        return ""
                                                    }
                                                })()
                                            )}
                                        </div>

                                    </IonCol>
                                </IonRow>
                            </IonGrid>

                        </IonCard>
                    </IonItem>

                    {canEdit && (
                        <IonItemOptions side="end">
                            <IonItemOption color="danger" onClick={() => handleRemoveEvent(event.event_id)}>
                                <IonIcon slot="icon-only" icon={trash}></IonIcon>
                            </IonItemOption>
                        </IonItemOptions>
                    )}
                </IonItemSliding>
            ))}
        </>
    )

    const editEvents = (
        <>
            <IonButton onClick={() => setIsOpen(true)} className="center">Add</IonButton>
            <IonModal isOpen={isOpen}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Add Event</IonTitle>
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
                    <IonButton className="center" onClick={() => handleAddEvent()}>Add</IonButton>
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
        </>
    )

    if (loading) {
        return <IonProgressBar type="indeterminate"></IonProgressBar>;
    }

    const finalEvents = () => {
        if (attendance.length > 0) {
            if (other.length > 0) {
                return (
                    <>
                        <h3 className="center">Attended</h3>
                        {renderEvents(attending, "var(--ion-color-success)")}
                        <h3 className="center">Other</h3>
                        {renderEvents(other, "var(--ion-color-primary)")}
                    </>
                )
            } else {
                return (
                    <>
                        <h3 className="center">Attended</h3>
                        {renderEvents(attending, "var(--ion-color-success)")}
                    </>
                )
            }


        } else {
            return renderEvents(other, "var(--ion-color-primary)")
        }
    }

    return (
        <div>
            {canEdit && editEvents}
            <IonList lines="none">
                {finalEvents()}
            </IonList>
        </div>
    )


}

export default Calendar;