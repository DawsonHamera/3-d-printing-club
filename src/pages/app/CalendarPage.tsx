
import React, { useState } from "react"
import Calendar from "../../components/Calendar"
import { IonButton, IonButtons, IonContent, IonDatetime, IonHeader, IonInput, IonItem, IonList, IonModal, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import './CalendarPage.css';
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { useAuth } from "../../providers/AuthProvider";

const CalendarPage: React.FC = () => {
    const [refresh, setRefresh] = useState(false);
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

    const {userState} = useAuth()

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
            setRefresh(!refresh)
          }
        } catch (error) {
          console.error("Error", error);
    
        }
      }
    
   

    return (
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
                            <IonInput label="Name" value={eventName} onIonInput={(event) => setEventName(event.detail.value)}></IonInput>
                        </IonItem>
                        <IonItem>
                            <IonInput label="Type" value={eventType} onIonInput={(event) => setEventType(event.detail.value)}></IonInput>
                        </IonItem>
                        <IonItem>
                            <IonInput label="Details" value={eventDetails} onIonInput={(event) => setEventDetails(event.detail.value)}></IonInput>
                        </IonItem>
                        <IonItem>
                            <IonInput label="Location" value={eventLocation} onIonInput={(event) => setEventLocation(event.detail.value)}></IonInput>
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
                            <IonInput label="Code" value={verificationCode} onIonInput={(event) => setVerificationCode(event.detail.value)}></IonInput>
                            <IonButton onClick={() => generateCode()}>Generate</IonButton>
                        </IonItem>    
                    </IonList>
                    <IonButton className="center" onClick={() => addEvent()}>Add</IonButton>
                    <p>{errorMessage}</p>
                </IonContent>
                <IonModal isOpen={isStartTimeOpen} initialBreakpoint={0.5} breakpoints={[0.5]} onDidDismiss={() => setIsStartTimeOpen(false)}>
                    <div className="center">
                        <IonDatetime presentation="time" className="timedate" value={startTime} onIonChange={(event) => { setStartTime(event.detail.value) }}></IonDatetime>
                    </div>
                </IonModal>
                <IonModal isOpen={isEndTimeOpen} initialBreakpoint={0.5} breakpoints={[0.5]} onDidDismiss={() => setIsEndTimeOpen(false)}>
                    <div className="center">
                        <IonDatetime presentation="time" className="timedate" value={endTime} onIonChange={(event) => { setEndTime(event.detail.value) }}></IonDatetime>
                    </div>
                </IonModal>
                <IonModal isOpen={isDateOpen} initialBreakpoint={0.5} breakpoints={[0.5]} onDidDismiss={() => setIsDateOpen(false)}>
                    <div className="center">
                        <IonDatetime presentation="date" className="timedate" value={eventDate} onIonChange={(event) => { setEventDate(event.detail.value) }}></IonDatetime>
                    </div>
                </IonModal>
            </IonModal>
            <Calendar refresh={refresh}/>
            </IonContent>
        </IonPage>
    )
}

export default CalendarPage;