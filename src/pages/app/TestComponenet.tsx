import { IonCard, IonCardContent } from "@ionic/react";
import ApiService from "../../services/ApiService";
import { DynamicList, DynamicListItems } from "../../components/DynamicList";
import { useAuth } from "../../providers/AuthProvider";
/* eslint-disable */
const Test: React.FC = () => {
    const { apiFetch, apiPost } = ApiService()
    const { userState } = useAuth();
    return (
        <DynamicList
            get="get_events"   // Fetches event list
            add="add_event"    // API to add an event
            remove="remove_event"
            update="update_event"
            readonly={false}
        >
            {/* <DynamicListEditor>
                <DynamicListEditorInput field="event_name" fieldType="string" inputType="text" />
                <DynamicListEditorInput field="event_details" inputType="text" />
                <DynamicListEditorInput field="event_type" inputType="select" />
                <DynamicListEditorInput field="event_date" inputType="text" />
            </DynamicListEditor> */}

            {/* DynamicList internally loops through items and injects them */}
            <DynamicListItems renderItem={(item: any) => (
                <IonCard color={item.scheduled_by == `${userState?.firstName} ${userState?.lastName}` ? 'primary' : ''}>
                    <IonCardContent>
                        <h1>{item.event_name}</h1>
                        <p>{item.event_details}</p>
                        <p>{item.scheduled_by}</p>
                    </IonCardContent>
                </IonCard>
            )} />

        </DynamicList>
    );

}

export default Test;