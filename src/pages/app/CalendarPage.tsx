import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from '../../components/Calendar';
import { useAuth } from '../../providers/AuthProvider';
import { IonContent, IonRefresher, IonRefresherContent, RefresherEventDetail } from '@ionic/react';

const ParentComponent: React.FC = () => {
    const [attendance, setAttendance] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const { userState } = useAuth()

    // Fetch events when the component mounts
    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        console.log('events fetched')
        setLoading(true);
        try {
            const events = await axios.get('https://dawson.hamera.com/api/get_events.php');
            const attendance = await axios.post("https://dawson.hamera.com/api/get_attendance.php", { user_id: userState?.user_id });
            setEvents(events.data);
            setAttendance(attendance.data)
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddEvent = async (newEvent: any) => {
        try {
            // Send the new event data to your backend
            await axios.post('https://dawson.hamera.com/api/add_event.php', newEvent);

            // After adding, refresh the events
            fetchEvents();
        } catch (error) {
            console.error("Error adding event:", error);
        }
    };

    const handleRemoveEvent = async (eventId: string) => {
        console.log("removing 2...")
        try {
            // Send the request to delete the event
            await axios.post('https://dawson.hamera.com/api/remove_event.php', { event_id: eventId });

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
        <IonContent>
            <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                <IonRefresherContent></IonRefresherContent>
            </IonRefresher>
            <Calendar
                attendance={attendance}
                events={events}
                onAddEvent={handleAddEvent}
                onRemoveEvent={handleRemoveEvent}
                loading={loading}
                canEdit={userState?.role === 'admin'}
                qrcode={userState?.role === 'admin'}
            />
        </IonContent>
    );
};

export default ParentComponent;
