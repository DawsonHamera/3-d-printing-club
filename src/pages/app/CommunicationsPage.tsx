import React, { useEffect, useState } from "react";
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonInput,
    IonTextarea,
    IonButton,
    IonModal,
    IonList,
    IonItem,
    IonLabel,
    IonCheckbox,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonProgressBar
} from "@ionic/react";
import { close } from "ionicons/icons";
import ApiService from "../../services/ApiService";

interface User {
    user_id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: 'admin' | 'user' | 'member';
    grade: 'freshman' | 'sophomore' | 'junior' | 'senior';
    score: number;
    created_at: string;
  }

const EmailForm: React.FC = () => {
    const [users, setUsers] = useState<User[]>([])
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const { apiFetch, apiLoading } = ApiService()
    
    useEffect(() => {
        const fetchUsers = async () => {
            const users = await apiFetch('get_users')
            setUsers(users.data)
        }
        fetchUsers()
    }, [])
    

    const filteredUsers = users.filter(
        (user) =>
            (filter === "all" || user.role === filter) &&
            user.username.toLowerCase().includes(search.toLowerCase())
    );

    const toggleUserSelection = (email: string) => {
        setSelectedUsers((prev) =>
            prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
        );
    };

    const selectAllShown = () => {
        setSelectedUsers(filteredUsers.map(user => user.email));
    };

    const quickSelect = (role: string) => {
        setFilter(role);
        setSelectedUsers(
            users.filter(user => role === "all" || user.role === role).map(user => user.email)
        );
    };

    const handleSubmit = () => {
        const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}&bcc=${selectedUsers.join(",")}`;
        window.location.href = mailtoLink;

    };

    if (apiLoading) {
        return <IonProgressBar type="indeterminate" />;
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Email Form</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonSegment className="ion-margin-bottom">
                    <IonSegmentButton onClick={() => quickSelect("all")}>All</IonSegmentButton>
                    <IonSegmentButton onClick={() => quickSelect("user")}>Users</IonSegmentButton>
                    <IonSegmentButton onClick={() => quickSelect("admin")}>Admins</IonSegmentButton>
                    <IonSegmentButton onClick={() => setShowModal(true)}>Custom</IonSegmentButton>
                </IonSegment>
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle className="center">Compose</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>


                        <IonInput
                            placeholder="Subject"
                            value={subject}
                            onIonChange={(e) => setSubject(e.detail.value!)}
                            className="ion-margin-bottom"
                        />
                        <IonTextarea
                            placeholder="Body"
                            fill="outline"
                            autoGrow={true}
                            value={body}
                            onIonChange={(e) => setBody(e.detail.value!)}
                            className="ion-margin-bottom"
                        />
                    </IonCardContent>
                    <IonButton expand="full" onClick={handleSubmit} className="ion-margin-top">Send Email</IonButton>
                </IonCard>

                <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Select Recipients</IonTitle>
                            <IonButton fill="clear" slot="end" onClick={() => setShowModal(false)}>
                                <IonIcon icon={close} />
                            </IonButton>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <IonGrid>
                            <IonRow>
                                <IonCol>
                                    <IonSearchbar value={search} onIonInput={(e) => setSearch(e.detail.value!)} />
                                </IonCol>
                                <IonCol size="auto">
                                    <IonSelect
                                        value={filter}
                                        onIonChange={(e) => setFilter(e.detail.value)}
                                        interface="popover"
                                    >
                                        <IonSelectOption value="all">All</IonSelectOption>
                                        <IonSelectOption value="user">Users</IonSelectOption>
                                        <IonSelectOption value="member">Members</IonSelectOption>
                                        <IonSelectOption value="admin">Admins</IonSelectOption>
                                    </IonSelect>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                        <IonButton expand="full" onClick={selectAllShown}>Select All Shown</IonButton>
                        <IonList>
                            {filteredUsers.map((user) => (
                                <IonItem key={user.user_id}>
                                    <IonCheckbox
                                        labelPlacement="start"
                                        justify="space-between"
                                        checked={selectedUsers.includes(user.email)}
                                        onIonChange={() => toggleUserSelection(user.email)}
                                    >
                                        {user.username}
                                    </IonCheckbox>
                                </IonItem>
                            ))}
                        </IonList>
                        <IonButton expand="full" onClick={() => setShowModal(false)}>
                            Done
                        </IonButton>
                    </IonContent>
                </IonModal>
            </IonContent>
        </IonPage>
    );
};

export default EmailForm;