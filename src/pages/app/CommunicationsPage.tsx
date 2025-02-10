import React, { useState } from "react";
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
    IonCardTitle
} from "@ionic/react";
import { close } from "ionicons/icons";

const dummyUsers = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@domain.com`,
    role: ["user", "member", "admin"][i % 3],
}));

const EmailForm: React.FC = () => {
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const filteredUsers = dummyUsers.filter(
        (user) =>
            (filter === "all" || user.role === filter) &&
            user.name.toLowerCase().includes(search.toLowerCase())
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
            dummyUsers.filter(user => role === "all" || user.role === role).map(user => user.email)
        );
    };

    const handleSubmit = () => {
        const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}&bcc=${selectedUsers.join(",")}`;
        window.location.href = mailtoLink;

    };

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
                                <IonItem key={user.id}>
                                    <IonCheckbox
                                        labelPlacement="start"
                                        justify="space-between"
                                        checked={selectedUsers.includes(user.email)}
                                        onIonChange={() => toggleUserSelection(user.email)}
                                    >
                                        {user.name}
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