import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonProgressBar, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { personCircleOutline, calendarOutline, qrCodeOutline, peopleCircle, peopleCircleOutline, fileTrayStacked, fileTrayStackedOutline } from "ionicons/icons";
import { Redirect, Route } from "react-router";
import ScannerPage from "./ScannerPage";
import { useAuth } from "../../providers/AuthProvider";
import ProfilePage from "./Profile";
import CalendarPage from "./CalendarPage";
import UserManagementPage from "./UserManagment";
import PrintJobsPage from "./PrinterJobsPage";
import useNetworkStatus from "../../services/NetworkService";

const Dashboard: React.FC = () => {
    const { authState, userState, isLoading } = useAuth();
    const networkStatus = useNetworkStatus();

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
                    <ProfilePage />
                </Route>
                <Route path="/dashboard/calendar">
                    <CalendarPage />
                </Route>
                <Route path="/dashboard/scanner">
                    <ScannerPage />
                </Route>
                <Route path="/dashboard/printer-jobs">
                    <PrintJobsPage />
                </Route>
                <Route path="/dashboard/user-management">
                    <UserManagementPage />
                </Route>
                <Redirect exact path="/dashboard" to="/dashboard/profile" />
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
                <IonTabButton tab="tab1" href="/dashboard/profile">
                    <IonIcon aria-hidden="true" icon={personCircleOutline} />
                </IonTabButton>
                <IonTabButton tab="tab2" href="/dashboard/printer-jobs">
                    <IonIcon aria-hidden="true" icon={fileTrayStackedOutline} />
                </IonTabButton>
                <IonTabButton tab="tab3" href="/dashboard/calendar">
                    <IonIcon aria-hidden="true" icon={calendarOutline} />
                </IonTabButton>
                {networkStatus === 'online' && (
                    <IonTabButton tab="tab4" href="/dashboard/scanner">
                        <IonIcon aria-hidden="true" icon={qrCodeOutline} />
                    </IonTabButton>
                )}

                {userState?.role === 'admin' && (
                    <IonTabButton tab="tab5" href="/dashboard/user-management">
                        <IonIcon aria-hidden="true" icon={peopleCircleOutline} />
                    </IonTabButton>
                )}
            </IonTabBar>
        </IonTabs>
    );
};

export default Dashboard;
