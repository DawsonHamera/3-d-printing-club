import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonIcon, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import QRCodeScanner from '../../components/QRCodeScanner';
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../providers/AuthProvider';
import { alertCircle, alertCircleSharp, checkmarkCircle } from 'ionicons/icons';
import ApiService from '../../services/ApiService';

const ScannerPage: React.FC = () => {
  const [isScanned, setIsScanned] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const { userState } = useAuth()
  const { apiFetch, apiPost, apiLoading } = ApiService()


  const handleScan = (text: string) => {
    setIsScanned(true);
    verifyCode(text)
  };

  const verifyCode = async (data: string) => {
    const response = await apiPost('attendance', { user_id: userState?.user_id, verification_code: data })
    if (!response.error) {
      setIsError(false)
      setMessage(response.data.event_name)
    }
    else {
      setIsError(true)
      setMessage(response.data.error)
    }

  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Scan</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <QRCodeScanner onScan={handleScan} />
        <div className='ion-padding'>

          {(isScanned && isError === false) && (
            <>
              <IonIcon icon={checkmarkCircle} size="large" style={{ textAlign: 'center', width: '100%' }} />
              <h4>You have successfully registered for</h4>
              <p> {message}</p>
            </>
          )}
          {(isScanned && isError === true) && (
            <>
              <IonIcon icon={alertCircle} size="large" style={{ textAlign: 'center', width: '100%' }} />
              <h4>There was an error scanning the code:</h4>
              <p> {message}</p>
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ScannerPage;
