import React, { useState } from 'react';
import { IonPage, IonContent, IonInput, IonItem, IonLabel, IonButton, IonFooter, IonText, IonAlert } from '@ionic/react';
import { useAuth } from '../providers/AuthProvider';
import { useHistory } from 'react-router';

const SignIn: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const history = useHistory()

    const { onLogin, authState } = useAuth()

    const login = async () => {
        const result = await onLogin(email, password)
        if (result && result.error) {
            setShowAlert(true)
            setAlertMessage(result.msg)
            
        }
        else {
            setShowAlert(false)
            history.push('/dashboard')
        }
    }

    return (
        <IonPage>
            <IonContent className="ion-padding">
                <h1>Sign In</h1>

                <IonItem>
                    <IonLabel position="stacked">Email</IonLabel>
                    <IonInput
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onIonChange={(e) => setEmail(e.detail.value!)}
                        required
                    />
                </IonItem>

                <IonItem>
                    <IonLabel position="stacked">Password</IonLabel>
                    <IonInput
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onIonChange={(e) => setPassword(e.detail.value!)}
                        required
                    />
                </IonItem>

                <IonButton expand="full" onClick={login}>Sign In</IonButton>

                <IonFooter className="ion-no-border">
                    <IonText color="medium">
                        <p style={{ textAlign: 'center', marginTop: '20px' }}>
                            Don't have an account? <a href="/signup">Sign up</a>
                        </p>
                    </IonText>
                    <IonText>
                        <p>
                            j: {authState?.authenticated ? 'true' : 'false'}
                        </p>
                    </IonText>
                </IonFooter>

                {/* Alert for empty fields */}
                <IonAlert
                    isOpen={showAlert}
                    onDidDismiss={() => setShowAlert(false)}
                    header={'Error'}
                    message={alertMessage}
                    buttons={['OK']}
                />
            </IonContent>
        </IonPage>
    );
};

export default SignIn;
