import { IonAvatar, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonIcon, IonPage, IonRefresher, IonRefresherContent, IonRow } from "@ionic/react";
import ApiService from "../../services/ApiService";
import { DynamicList, DynamicListItems, DynamicListEditor, DynamicListEditorInput, DynamicListEditorSelect, DynamicListEditorDate, DynamicListEditorTime, DynamicListEditorCode } from "../../components/DynamicList";
import { useAuth } from "../../providers/AuthProvider";
import { add, checkmarkCircle, ellipseOutline, lockClosed, remove } from "ionicons/icons";
import QRCode from "react-qr-code";
import { useEffect, useState } from "react";
import Common from "../../utilities/Common";


interface User {
    user_id: number,
    username: string,
    email: string,
    first_name: string,
    last_name: string,
    role: string,
    grade: string,
    score: number,
    created_at: string
}
const Test: React.FC = () => {
    const [users, setUsers] = useState<User[]>([])
    const [refreshKey, setRefreshKey] = useState(0);

    const { apiFetch, apiPost } = ApiService()
    const { getInitials } = Common();
    const { userState } = useAuth();

    useEffect(() => {
        apiFetch('get_users').then((data) => setUsers(data.data));
    }, []);

    return (
        <IonPage>
            <DynamicList
                get="get_jobs"   // Fetches event list
                add="add_job"    // API to add an event
                remove="remove_job"
                update="update_job"
                readonly={false}
            >
                <DynamicListEditor
                    buttonText="Add new item"
                    submitText="Add"
                    title="Create new item"
                >

                    <DynamicListEditorInput field="printer" label="Printer" />
                    <DynamicListEditorInput field="item" label="Item" />
                    <DynamicListEditorInput field="link" label="Link" />
                    <DynamicListEditorSelect field="assigned_to" label="Assigned to"
                        options={[{ label: "Empty", value: '' }, ...users.map((user) => ({ value: user.user_id, label: user.username }))]} />
                    <DynamicListEditorDate field="job_date" label="Date" />
                    <DynamicListEditorTime field="job_time" label="Time" />

                </DynamicListEditor>

                {/* DynamicList internally loops through items and injects them */}
                <DynamicListItems
                    identifier="event_id"
                    canEdit={true}
                    key={refreshKey}
                    renderItem={(item: any) => {

                        var color = "var(--ion-color-primary)";
                        if (item.assigned_to == userState?.user_id) {
                            color = "var(--ion-color-success)"; // Set color for the left border
                        }

                        // Find the assigned user
                        const assignedUser = users.find((user) => user.user_id == item.assigned_to);
                        const initials = assignedUser ? getInitials(`${assignedUser.first_name} ${assignedUser.last_name}`) : "Null";
                        const assignedUsername = assignedUser ? assignedUser.username : '';


                        function isJobTime(jobDateUtc: any) {
                            const jobDate = new Date(jobDateUtc).toISOString().split('T')[0]; // Convert job date string to Date object
                            const nowUtc = new Date().toISOString().split('T')[0]; // Get current time in UTC
                            console.log("Job", jobDate)
                            console.log("Now", nowUtc)
                            // Check if the job date is today in UTC
                            const isSameDay = jobDate === nowUtc;

                            return isSameDay && new Date().getTime() >= new Date().setHours(7, 30, 0, 0);
                        }

                        const handleAssignJob = async (jobId: string, userId: number | null) => {
                            console.log('Assigning', jobId, userId)
                            const response = await apiPost('assign_job', { job_id: jobId, user_id: userId })
                            console.log(response)
                            if (response) {
                                setRefreshKey(prevKey => prevKey + 1)
                            }
                        }

                        return (

                            <IonCard style={{ borderLeft: `6px solid ${color}`, width: '100%' }}>
                                <IonGrid>
                                    <IonRow>
                                        <IonCol>
                                            <IonCardHeader>
                                                <IonCardTitle>{item.item}</IonCardTitle>
                                                <IonCardSubtitle>
                                                    {new Date(`${item.job_date}T${item.job_time}`).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                                                </IonCardSubtitle>
                                            </IonCardHeader>
                                            <IonCardContent>
                                                Printer: {item.printer}
                                                <br />
                                                Item: {item.item}
                                                <br />
                                                Link: {item.link}
                                                <br />
                                            </IonCardContent>
                                        </IonCol>

                                        <IonCol size="4">
                                            <div style={{ justifyItems: 'center' }}>
                                                <h4>{new Date(new Date(item.job_date).setDate(new Date(item.job_date).getUTCDate())).toLocaleString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}</h4>
                                            </div>

                                            {item.assigned_to ? (
                                                <div style={{ position: 'relative' }}>
                                                    <IonAvatar
                                                        style={{
                                                            width: '50px',
                                                            height: '50px',
                                                            borderRadius: '50%',
                                                            backgroundColor: color,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: 20,
                                                            color: 'white',
                                                            margin: '0 auto',
                                                        }}
                                                    >
                                                        {initials}
                                                    </IonAvatar>
                                                    {isJobTime(item.job_date) && (
                                                        <IonIcon
                                                            icon={lockClosed}
                                                            style={{
                                                                position: 'absolute',
                                                                bottom: -2,
                                                                right: 22,
                                                                backgroundColor: 'var(--ion-color-dark)',
                                                                borderRadius: '50%',
                                                                padding: '2px',
                                                                fontSize: '18px',
                                                                color: 'var(--ion-color-light)',
                                                            }}
                                                        />
                                                    )}
                                                    {!isJobTime(item.job_date) && item.assigned_to == userState?.user_id && (
                                                        <IonIcon
                                                            icon={remove}
                                                            style={{
                                                                position: 'absolute',
                                                                bottom: -2,
                                                                right: 22,
                                                                backgroundColor: 'var(--ion-color-dark)',
                                                                borderRadius: '50%',
                                                                padding: '2px',
                                                                fontSize: '18px',
                                                                color: 'var(--ion-color-light)',
                                                            }}
                                                            onClick={() => handleAssignJob(item.job_id, null)}
                                                        />
                                                    )}
                                                </div>
                                            ) : (
                                                <div style={{ position: 'relative' }}>
                                                    <IonButton
                                                        style={{
                                                            width: '50px',
                                                            height: '50px',
                                                            borderRadius: '100%',
                                                            backgroundColor: color,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            margin: '0 auto'
                                                        }}
                                                        disabled={isJobTime(item.job_date)}
                                                        shape="round"
                                                        onClick={() => handleAssignJob(item.job_id, userState?.user_id ? userState?.user_id : null)}
                                                    >
                                                        <IonIcon icon={add} color="light" size="large" />
                                                    </IonButton>
                                                    {isJobTime(item.job_date) && (
                                                        <IonIcon
                                                            icon={lockClosed}
                                                            style={{
                                                                position: 'absolute',
                                                                bottom: -2,
                                                                right: 22,
                                                                backgroundColor: 'var(--ion-color-dark)',
                                                                borderRadius: '50%',
                                                                padding: '2px',
                                                                fontSize: '18px',
                                                                color: 'var(--ion-color-light)',
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            )}
                                            <p style={{ textAlign: 'center' }}>{item.assigned_to === userState?.user_id ? "You" : assignedUsername}</p>
                                        </IonCol>
                                    </IonRow>
                                </IonGrid>
                            </IonCard>


                        )
                    }
                    }
                />

            </DynamicList>

        </IonPage>
    );

}

export default Test;