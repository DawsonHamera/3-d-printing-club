
import React, { useState } from "react"
import Calendar from "../../components/Calendar"
import './CalendarPage.css';
import { IonPage } from "@ionic/react";
import { refresh } from "ionicons/icons";
import { useAuth } from "../../providers/AuthProvider";


const CalendarPage: React.FC = () => {
    const { userState } = useAuth()

    return (
        <IonPage>
            <Calendar canEdit={userState?.role == 'admin'}/>
        </IonPage>
    )
}

export default CalendarPage;