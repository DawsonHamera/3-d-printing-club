import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab3.css';
import QRCodeScanner from '../../components/QRCodeScanner';
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../providers/AuthProvider';

const ScannerPage: React.FC = () => {
  const [isScanned, setIsScanned] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const { userState } = useAuth()


  const handleScan = (text: string) => {
    setIsScanned(true);
    verifyCode(text)
  };

  const verifyCode = async ( data: string ) => {
    const response = await axios.post("https://dawson.hamera.com/api/attendance.php", { user_id: userState?.user_id, verification_code: data })
    console.log(response.data)
    console.log(data)
    if (!response.data.error) {
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
        {isScanned && (
          <h4 className='center'>You have successfully registered for {message}</h4>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ScannerPage;
