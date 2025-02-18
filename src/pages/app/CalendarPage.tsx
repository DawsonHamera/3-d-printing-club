import React, { useEffect, useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonGrid, IonIcon, IonPage, IonRow } from '@ionic/react';
import ApiService from '../../services/ApiService';
import { checkmarkCircle, ellipseOutline } from 'ionicons/icons';
import QRCode from 'react-qr-code';
import { DynamicList, DynamicListEditor, DynamicListEditorInput, DynamicListEditorSelect, DynamicListEditorCode, DynamicListEditorDate, DynamicListEditorTime, DynamicListItems } from '../../components/DynamicList';

const CalendarPage: React.FC = () => {
    const { userState } = useAuth();
    const { apiPost } = ApiService();
    const [attendance, setAttendance] = useState<string[]>([]); // State to hold attendance data

    // Fetch attendance data once on mount
    useEffect(() => {
        const fetchAttendance = async () => {
            const response = await apiPost('get_attendance', { user_id: userState?.user_id });
            setAttendance(response.data);
        };

        fetchAttendance();
    }, []); // Runs once on mount

    return (
        <IonPage>
            <DynamicList
                get="get_events"   // Fetches event list
                add="add_event"    // API to add an event
                remove="remove_event"
                update="update_event"
                readonly={false}
            >
                <DynamicListEditor
                    buttonText="Add new item"
                    submitText="Add"
                    title="Create new item"
                    hiddenFields={{ scheduled_by: 18 }}
                >
                    <DynamicListEditorInput field="event_name" label="Name" />
                    <DynamicListEditorSelect field="event_type" label="Type"
                        options={[
                            { label: "Meeting", value: "meeting" },
                            { label: "Workshop", value: "workshop" },
                            { label: "Fundraiser", value: "fundraiser" }
                        ]} />
                    <DynamicListEditorInput field="event_location" label="Location" />
                    <DynamicListEditorInput field="event_details" label="Details" />
                    <DynamicListEditorCode field="verification_code" label="Code" />
                    <DynamicListEditorDate field="event_date" label="Date" />
                    <DynamicListEditorTime field="start_time" label="Start time" />
                    <DynamicListEditorTime field="end_time" label="End time" />
                </DynamicListEditor>

                {/* DynamicList internally loops through items and injects them */}
                <DynamicListItems
                    identifier="event_id"
                    canEdit={true}
                    renderItem={(item: any) => (
                        <IonCard style={{ borderLeft: attendance.includes(item.event_id) ? `6px solid var(--ion-color-success)`: `6px solid var(--ion-color-primary)`, width: '100%' }}>
                            <IonGrid>
                                <IonRow>
                                    <IonCol size="1" className="vertical-container">
                                        <p className="vertical">{item.event_type}</p>
                                    </IonCol>
                                    <IonCol>
                                        <IonCardHeader>
                                            <IonCardTitle>{item.event_name}</IonCardTitle>
                                            <IonCardSubtitle>
                                                {new Date(`1970-01-01T${item.start_time}Z`).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, timeZone: 'UTC' }) + " - "}
                                                {new Date(`1970-01-01T${item.end_time}Z`).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, timeZone: 'UTC' })}
                                            </IonCardSubtitle>
                                        </IonCardHeader>

                                        <IonCardContent>
                                            {item.event_details}
                                            {attendance.includes(item.event_id) ? 'TRUE' :"FALSE"}
                                        </IonCardContent>
                                    </IonCol>

                                    <IonCol size="4">
                                        <div style={{ justifyItems: 'center' }}>
                                            <h4>{new Date(item.event_date).toLocaleString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).toUpperCase()}</h4>
                                            {userState?.role === 'admin' ? (
                                                <>
                                                    <QRCode
                                                        value={item.verification_code}
                                                        size={100}
                                                    />
                                                    <p>{item.verification_code}</p>
                                                </>
                                            ) : (
                                                // Conditionally check attendance and render icon
                                                attendance.length > 0 ? (
                                                    (() => {
                                                        const eventDateTime = new Date(`${item.event_date}T${item.start_time}`);
                                                        const currentTime = new Date();

                                                        if (eventDateTime < currentTime && attendance.includes(item.event_id)) {
                                                            return <IonIcon icon={checkmarkCircle} size="large" />;
                                                        } else if (attendance.includes(item.event_id)) {
                                                            return <IonIcon icon={ellipseOutline} size="large" />;
                                                        } else {
                                                            return null;
                                                        }
                                                    })()
                                                ) : (
                                                    <p>Loading...</p> // Loading state
                                                )
                                            )}
                                        </div>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                        </IonCard>
                    )}
                />
            </DynamicList>
        </IonPage>
    );
};

export default CalendarPage;
