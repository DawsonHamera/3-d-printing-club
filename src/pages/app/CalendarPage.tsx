import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from '../../components/Calendar';
import { useAuth } from '../../providers/AuthProvider';
import { IonContent, IonHeader, IonPage, IonRefresher, IonRefresherContent, IonTitle, IonToolbar, RefresherEventDetail } from '@ionic/react';
import ApiService from '../../services/ApiService';

const CalendarPage: React.FC = () => {
    const [attendance, setAttendance] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const { userState } = useAuth()
    const { apiFetch, apiPost, apiLoading } = ApiService()


    // Fetch events when the component mounts
    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const events = await apiFetch('get_events');
            const attendance = await apiPost('get_attendance', { user_id: userState?.user_id });
            setEvents(events.data);
            setAttendance(attendance.data)
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    const handleAddEvent = async (newEvent: any) => {
        try {
            // Send the new event data to your backend
            await apiPost('add_event', newEvent);

            // After adding, refresh the events
            fetchEvents();
        } catch (error) {
            console.error("Error adding event:", error);
        }
    };

    const handleRemoveEvent = async (eventId: string) => {
        try {
            // Send the request to delete the event
            await apiPost('remove_event', { event_id: eventId });

            // After deleting, refresh the events
            fetchEvents();
        } catch (error) {
            console.error("Error removing event:", error);
        }
    };

    async function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
        await fetchEvents()
        event.detail.complete();
    }

    return (
        <IonPage>
            <IonContent>
                <IonToolbar>
                    <IonTitle>Calendar</IonTitle>
                </IonToolbar>
                <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                <Calendar
                    attendance={attendance}
                    events={events}
                    onAddEvent={handleAddEvent}
                    onRemoveEvent={handleRemoveEvent}
                    loading={apiLoading}
                    canEdit={userState?.role === 'admin'}
                    qrcode={userState?.role === 'admin'}
                />
            </IonContent>
        </IonPage>
    );
};

export default CalendarPage;
