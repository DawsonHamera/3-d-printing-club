import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonAvatar, IonLabel, IonItem, IonList, IonButton } from '@ionic/react';
import { useAuth } from '../../providers/AuthProvider';

const Profile: React.FC = () => {
  const { userState, onLogout } = useAuth();

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
    } else {
      console.error("Logout function is undefined");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonAvatar style={{ margin: '20px auto', width: '150px', height: '150px' }}>
          <img src={"https://ui-avatars.com/api/?name="+userState?.firstName+"+"+userState?.lastName} alt="Profile" />
        </IonAvatar>
        <IonList>
          <IonItem>
            <IonLabel>
              <h2>{userState?.firstName+" "+userState?.lastName}</h2>
              <p>johndoe@example.com</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <h3>Location</h3>
              <p>San Francisco, CA</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <h3>Bio</h3>
              <p>Software developer with a passion for creating amazing applications.</p>
            </IonLabel>
          </IonItem>
        </IonList>
        <IonButton onClick={handleLogout}>Log out</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
