import { IonAlert, IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonDatetime, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonModal, IonPage, IonProgressBar, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar } from "@ionic/react"
import React, { useEffect, useState } from "react"
import { useAuth } from "../providers/AuthProvider";
import axios from "axios";
import './Calendar.css'
import { checkmarkCircle, ellipseOutline, trash } from "ionicons/icons";
import { v4 as uuidv4 } from 'uuid';
import QRCode from "react-qr-code";
import ApiService from "../services/ApiService";

interface JobsProps {
    canEdit?: boolean;
    jobs: any[];  // List of events from parent
    attendance: any[];
    onAddJob: (newEvent: any) => void;  // Parent function to add event
    onRemoveJob: (eventId: string) => void;  // Parent function to remove event
    loading: boolean;  // Loading state from parent
}

interface PrintJob {
    job_id: string;
    job_date: string;
    job_time: string;
    printer: string;
    item: string;
    link: string;
    assigned_to: string;
}

const Jobs: React.FC<JobsProps> = ({ jobs, attendance, onAddJob, onRemoveJob, loading, canEdit }) => {
    const [isMainModalOpen, setIsMainModalOpen] = useState(false); // Modal for adding job
    const [isDateOpen, setIsDateOpen] = useState(false); // Modal for date picker
    const [isTimeOpen, setIsTimeOpen] = useState(false); // Modal for time picker
    const [jobDate, setJobDate] = useState<string>("");
    const [assignedTo, setAssignedTo] = useState<string>("");
    const [jobTime, setJobTime] = useState<string>("");
    const [printer, setPrinter] = useState("");
    const [users, setUsers] = useState([])
    const [item, setItem] = useState("");
    const [link, setLink] = useState("");

    const [isInvalid, setIsInvalid] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const { userState } = useAuth();
    const { fetchUsers, assignJob, apiLoading } = ApiService()

    const handleAddJob = () => {
        // Call the parent’s onAddJob function to add the event
        onAddJob({
            job_date: jobDate,
            job_time: jobTime,
            printer: printer,
            item: item,
            link: link,
            assigned_to: assignedTo,
        });
        setIsMainModalOpen(false);  // Close modal after adding
    };

    const handleRemoveJob = (eventId: string) => {
        console.log("removing job...");
        // Call the parent’s onRemoveJob function to remove the event
        onRemoveJob(eventId);
    };

    const getInitials = (name: string) => {
        const [firstName, lastName] = name.split(' ');
        return firstName.charAt(0).toUpperCase() + (lastName?.charAt(0).toUpperCase() || '');
    };

    const handleAssignToJob = async (jobId: any, assignedTo: string) => {
        if (assignedTo == "") {
            const result = await assignJob(jobId, userState?.firstName+userState?.lastName)
            console.log(result)
        } 
    }

    const renderJobs = (jobs: PrintJob[]) => (
        <>
            {Array.isArray(jobs) && jobs.length > 0 ? (
                jobs.map((job: PrintJob) => {
                    var color = "var(--ion-color-primary)";
                    if (job.assigned_to === userState?.firstName+userState?.lastName) {
                        color = "var(--ion-color-success)"; // Set color for the left border
                    }
                    return (
                        <IonItemSliding key={job.job_id}>
                            <IonItem>
                                <IonCard style={{ borderLeft: `6px solid ${color}`, width: '100%' }}>
                                    <IonGrid>
                                        <IonRow>
                                            <IonCol>
                                                <IonCardHeader>
                                                    <IonCardTitle>{job.item}</IonCardTitle>
                                                    <IonCardSubtitle>
                                                        {new Date(`${job.job_date}T${job.job_time}`).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                                                    </IonCardSubtitle>
                                                </IonCardHeader>
                                                <IonCardContent>
                                                    Printer: {job.printer}
                                                    <br />
                                                    Item: {job.item}
                                                    <br />
                                                    Link: {job.link}
                                                    <br />
                                                </IonCardContent>
                                            </IonCol>

                                            <IonCol size="4">
                                                <div style={{ justifyItems: 'center' }}>
                                                    <h4>{new Date(job.job_date).toLocaleString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}</h4>
                                                </div>

                                                <IonAvatar
                                                    style={{
                                                        width: '50px',
                                                        height: '50px',
                                                        margin: '0 auto',
                                                        backgroundColor: color,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: job.assigned_to ? 20 : 30,
                                                        color: 'white',
                                                    }}
                                                    onClick={() => handleAssignToJob(job.job_id, job.assigned_to)}
                                                    
                                                >
                                                    {job.assigned_to ? getInitials(job.assigned_to) : "+"}
                                                </IonAvatar>
                                                <p style={{ textAlign: 'center' }}>{job.assigned_to === userState?.firstName+userState?.lastName ? "You":job.assigned_to}</p>
                                            </IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </IonCard>
                            </IonItem>
                            {canEdit && (
                                <IonItemOptions side="end">
                                    <IonItemOption color="danger" onClick={() => handleRemoveJob(job.job_id)}>
                                        <IonIcon slot="icon-only" icon={trash}></IonIcon>
                                    </IonItemOption>
                                </IonItemOptions>
                            )}
                        </IonItemSliding>
                    );
                })
            ) : (
                <p>No print jobs available.</p>
            )}
        </>
    );

    const editJobs = (
        <>
            <IonButton onClick={() => setIsMainModalOpen(true)} className="center">Add Print Job</IonButton>
            <IonModal isOpen={isMainModalOpen}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Add Print Job</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={() => setIsMainModalOpen(false)}>Close</IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <IonList>
                        <IonItem>
                            <IonInput
                                label="Printer"
                                value={printer}
                                onIonInput={(e) => setPrinter(e.detail.value!)}
                            />
                        </IonItem>
                        <IonItem>
                            <IonInput
                                label="Item"
                                value={item}
                                onIonInput={(e) => setItem(e.detail.value!)}
                            />
                        </IonItem>
                        <IonItem>
                            <IonInput
                                label="Link"
                                value={link}
                                onIonInput={(e) => setLink(e.detail.value!)}
                            />
                        </IonItem>
                        <IonItem>
                            <IonInput
                                label="Assigned to"
                                value={assignedTo}
                                onIonInput={(e) => setAssignedTo(e.detail.value!)}
                            />
                            <IonSelect
                                value={assignedTo}
                                placeholder="none"
                                onIonChange={(e) => setAssignedTo(e.detail.value!)}
                                onIonFocus={async () => {
                                    const data = await fetchUsers();
                                    setUsers(data);

                                }}
                            >
                                {apiLoading ? (
                                    <IonSelectOption disabled>Loading...</IonSelectOption>
                                ) : (
                                    users.map((user) => (
                                        <IonSelectOption key={user.username} value={user.username}>
                                            {user.username}
                                        </IonSelectOption>
                                    ))
                                )}
                            </IonSelect>


                        </IonItem>
                        <IonItem>
                            <IonButton onClick={() => setIsDateOpen(true)}>Pick Date</IonButton>
                            <p style={{ marginLeft: 15 }}>
                                {jobDate ? new Date(jobDate).toLocaleString([], { month: 'short', day: 'numeric' }) : 'Select Date'}
                            </p>
                        </IonItem>
                        <IonItem>
                            <IonButton onClick={() => setIsTimeOpen(true)}>Pick Time</IonButton>
                            <p style={{ marginLeft: 15 }}>
                                {jobTime ? new Date(jobTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Select Time'}
                            </p>
                        </IonItem>
                    </IonList>
                    <IonButton expand="full" onClick={handleAddJob}>
                        Add Job
                    </IonButton>
                    <p>{errorMessage}</p>
                </IonContent>
                <IonModal isOpen={isDateOpen} initialBreakpoint={0.5} breakpoints={[0.5]} onDidDismiss={() => setIsDateOpen(false)}>
                    <IonDatetime
                        presentation="date"
                        value={jobDate}
                        onIonChange={(e) => setJobDate(e.detail.value!)}
                    />
                </IonModal>
                <IonModal isOpen={isTimeOpen} initialBreakpoint={0.5} breakpoints={[0.5]} onDidDismiss={() => setIsTimeOpen(false)}>
                    <IonDatetime
                        presentation="time"
                        value={jobTime}
                        onIonChange={(e) => setJobTime(e.detail.value!)}
                    />
                </IonModal>

            </IonModal>
        </>
    );

    if (loading) {
        return <IonProgressBar type="indeterminate"></IonProgressBar>;
    }

    return (
        <div>
            {canEdit && editJobs}
            <IonList lines="none">
                {renderJobs(jobs)}
            </IonList>
        </div>
    );
}

export default Jobs;
