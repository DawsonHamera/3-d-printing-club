import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonItem,
    IonList,
    IonModal,
    IonPage,
    IonProgressBar,
    IonRow,
    IonTitle,
    IonToolbar,
    IonDatetime,
    IonIcon,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonInput,
    IonAvatar,
    IonLabel,
    IonRefresher,
    IonRefresherContent,
    RefresherEventDetail,
    IonAlert,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../providers/AuthProvider";
import { link } from "ionicons/icons";
import Calendar from "../../components/Calendar";
import Jobs from "../../components/Jobs";
import ApiService from "../../services/ApiService";



const PrintJobsPage: React.FC = () => {
    const [jobs, setJobs] = useState([]);
    const { userState } = useAuth();
    const [error, setError] = useState({isInvalid: false, message: ""});
    const { apiFetch, apiPost, apiLoading } = ApiService()

    useEffect(() => {
        fetchJobs();
    }, []);

    // Function to fetch jobs from API
    const fetchJobs = async () => {
        const response = await apiFetch('get_jobs');
        console.log(response)
        if (response.error) {
            setError({isInvalid: true, message: response.error})
        } else {
            setJobs(response.data);
        }
    };

    // Function to add a job
    const handleAddJob = async (newJob: any) => {
        if (await apiPost('add_job', newJob)) {
            fetchJobs();
        } else {
            setError({isInvalid: true, message: "Error adding job"})
        }
    };

    const handleRemoveJob = async (jobId: string) => {
        if (await apiPost('remove_job', {job_id: jobId})) {
            fetchJobs();
        } else {
            setError({isInvalid: true, message: "Error removing job"})
        }
    };

    const handleAssignJob = async (jobId: string, userId: number) => {
        console.log('Assigning', jobId, userId)
        const response = await apiPost('assign_job', { job_id: jobId, user_id: userId })
        console.log(response)
        if (response) {
            fetchJobs();
        } else {
            setError({isInvalid: true, message: "Error assigning job"})
        }
    }

    // Function to handle refresh action
    const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
        await fetchJobs();
        event.detail.complete();
    };

    return (
        <IonPage>
            <IonContent>
                <IonToolbar>
                    <IonTitle>Printer Schedule</IonTitle>
                </IonToolbar>
                <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                <Jobs
                    jobs={jobs}
                    onAddJob={handleAddJob}
                    onRemoveJob={handleRemoveJob}
                    onAssignJob={handleAssignJob}
                    loading={apiLoading}
                    canEdit={userState?.role === 'admin'}
                />
                <IonAlert
                    isOpen={error.isInvalid}
                    onDidDismiss={() => setError({isInvalid: false, message: ''})}
                    header={'Error'}
                    message={error.message}
                    buttons={['OK']}
                />
            </IonContent>
        </IonPage>
    );
};

export default PrintJobsPage;
