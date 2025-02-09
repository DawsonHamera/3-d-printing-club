import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonProgressBar, IonAvatar, IonText, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonButton } from '@ionic/react';
import { useAuth } from '../../providers/AuthProvider';
import { useHistory } from 'react-router';
import NetworkService from '../../services/NetworkService';

// Function to generate initials from first and last names
const getInitials = (firstName: any, lastName: any) => {
  return firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
};

const ProfilePage: React.FC = () => {
  const { userState, onLogout } = useAuth()
  const history = useHistory()
  console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div style={{ 
          textAlign: 'center',
          padding: '40px',
          // backgroundImage: 'url("https://picsum.photos/200/300")',
          backgroundColor: 'var(--ion-color-light-shade)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          <IonAvatar style={{ 
            width: '150px', 
            height: '150px', 
            margin: '0 auto', 
            backgroundColor: 'var(--ion-color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '4rem',
            color: 'white'
          }}>
            {getInitials(userState?.firstName, userState?.lastName)}
          </IonAvatar>
          <IonText>
            <h2>{userState?.firstName} {userState?.lastName}</h2>
            <p>{userState?.email}</p>
          </IonText>
          {onLogout &&  <IonButton onClick={() => onLogout()}>Sign Out</IonButton>}
        </div>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Attend a meeting</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonText>
              <p> Navigate to the scan tab and hold your phone up to the events qrcode or enter manually</p>
            </IonText>
            <IonButton onClick={() => history.push("/dashboard/scanner")}>Scan</IonButton>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Volunteer time with the printers</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonText>
              <p>The best way to learn 3D printing is getting hands on experience. Schedule time to come help with printer maintance, post-proccessing prints, and starting new prints!</p>
            </IonText>
            <IonButton onClick={() => history.push("/dashboard/printer-jobs")}>Schedule</IonButton>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Participate in events</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonText>
              <p>To join us for fundraising, public outreach, and more, head right over to the calendar.</p>
            </IonText>
            <IonButton onClick={() => history.push("/dashboard/calendar")}>Calendar</IonButton>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Feedback</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonText>
              <p>This app is still in the early stages of development, and full of bugs so any feedback is helpfull!</p>
            </IonText>
            <IonButton onClick={() => window.location.href = "https://docs.google.com/forms/d/e/1FAIpQLSfSAIqiTNboYb2rnVFLQPJLfkLnBNdwi_E6QPPGO_EzzJAcEA/viewform?usp=dialog"}>Feedback Form</IonButton>
            </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;
