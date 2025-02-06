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


const PrintJobsPage: React.FC = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userState } = useAuth();
    const [isInvalid, setIsInvalid] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetchJobs();
    }, []);

    // Function to fetch jobs from API
    const fetchJobs = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`https://dawson.hamera.com/api/get_jobs.php`);
            setJobs(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching jobs", error);
            setLoading(false);
        }
    };

    // Function to add a job
    const handleAddJob = async (newJob: any) => {
        try {
            const result = await axios.post(`https://dawson.hamera.com/api/add_job.php`, newJob);
            if (result && result.data.error) {
                setIsInvalid(true)
                setErrorMessage(result.data.error)
            } else {
                fetchJobs(); // Refresh jobs list
            }
        } catch (error: any) {
            console.error("Error adding job", error);
            setIsInvalid(true)
            setErrorMessage(error)
        }
    };

    // Function to remove a job
    const handleRemoveJob = async (jobId: string) => {
        try {
            const result = await axios.post('https://dawson.hamera.com/api/remove_job.php', { job_id: jobId });
            if (result && result.data.error) {
                setIsInvalid(true)
                setErrorMessage(result.data.error)
            } else {
                fetchJobs(); // Refresh jobs list
            }
        } catch (error: any) {
            console.error("Error removing job:", error);
            setIsInvalid(true)
            setErrorMessage(error)
        }
    };

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
                    loading={loading}
                    canEdit={userState?.role === 'admin'}
                />
                <IonAlert
                    isOpen={isInvalid}
                    onDidDismiss={() => setIsInvalid(false)}
                    header={'Error'}
                    message={errorMessage}
                    buttons={['OK']}
                />
            </IonContent>
        </IonPage>
    );
};

export default PrintJobsPage;
