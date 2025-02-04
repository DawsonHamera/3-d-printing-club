import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonProgressBar, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { personCircleOutline, calendarOutline, qrCodeOutline } from "ionicons/icons";
import { Redirect, Route } from "react-router";
import Tab3 from "./Tab3";
import { useAuth } from "../../providers/AuthProvider";
import Profile from "./Profile";
import CalendarPage from "./CalendarPage";

const Dashboard: React.FC = () => {
    const { authState, isLoading } = useAuth();
    if (!isLoading && !authState?.authenticated) {
        console.log("Need to auth");
        return <Redirect to="/sign-in" />;
    }
    if (isLoading) {
        return <IonProgressBar type="indeterminate" />;
    }
    return (
        <IonTabs>
            <IonRouterOutlet>
                <Route exact path="/dashboard/profile">
                    <Profile />
                </Route>
                <Route path="/dashboard/calendar">
                    <CalendarPage />
                </Route>
                <Route path="/dashboard/tab3">
                    <Tab3 />
                </Route>
                <Redirect exact path="/dashboard" to="/dashboard/profile" />
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
                <IonTabButton tab="tab1" href="/dashboard/profile">
                    <IonIcon aria-hidden="true" icon={personCircleOutline} />
                </IonTabButton>
                <IonTabButton tab="tab2" href="/dashboard/calendar">
                    <IonIcon aria-hidden="true" icon={calendarOutline} />
                </IonTabButton>
                <IonTabButton tab="tab3" href="/dashboard/tab3">
                    <IonIcon aria-hidden="true" icon={qrCodeOutline} />
                </IonTabButton>
            </IonTabBar>
        </IonTabs>
    );
};

export default Dashboard;
