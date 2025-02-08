import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonToast,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { calendarOutline, ellipse, globeOutline, personCircleOutline, qrCodeOutline, square, triangle } from 'ionicons/icons';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import SignIn from './pages/SignIn';
import Dashboard from './pages/app/Dashboard';
import { AuthProvider } from './providers/AuthProvider';
import './main.css'
import SignUp from './pages/SignUp';
import { useEffect, useState } from 'react';
import useNetworkStatus from './services/NetworkService';

setupIonicReact();

const App: React.FC = () => {
    const networkStatus = useNetworkStatus();
    const [wasOffline, setWasOffline] = useState(false);
    const [showOnlineToast, setShowOnlineToast] = useState(false);
  
    useEffect(() => {
      if (networkStatus === 'offline') {
        setWasOffline(true);
      } else if (networkStatus === 'online' && wasOffline) {
        setShowOnlineToast(true);
        setWasOffline(false);
      }
    }, [networkStatus,  wasOffline])

  return (
  <IonApp>
    <AuthProvider>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/sign-in">
            <SignIn />
          </Route>
          <Route exact path="/signup">
            <SignUp />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route exact path="/">
            <Redirect to="/dashboard" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
      <IonToast isOpen={networkStatus === 'offline'} message="Offline Mode: You are currently disconnected. Some features may be unavailable until you're back online." icon={globeOutline} duration={5000} position='top' />
      <IonToast isOpen={showOnlineToast} message="You're back online!" duration={3000} position='top' icon={globeOutline} onDidDismiss={() => setShowOnlineToast(false)} />
    </AuthProvider>
  </IonApp>
  )
}

export default App;
