import React, { useState } from 'react';
import { IonPage, IonContent, IonInput, IonItem, IonLabel, IonButton, IonFooter, IonText, IonAlert, IonSelect, IonSelectOption } from '@ionic/react';
import { useAuth } from '../providers/AuthProvider';
import { useHistory } from 'react-router';

const SignUp: React.FC = () => {
    const [isInvalid, setIsInvalid] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVerify, setPasswordVerify] = useState('');
    const [grade, setGrade] = useState('');

    const [firstNameMissing, setFirstNameMissing] = useState(false);
    const [lastNameMissing, setLastNameMissing] = useState(false);
    const [emailMissing, setEmailMissing] = useState(false);
    const [emailInvalid, setEmailInvalid] = useState(false);
    const [passwordMissing, setPasswordMissing] = useState(false);
    const [passwordVerifyMissing, setPasswordVerifyMissing] = useState(false);
    const [passwordMismatch, setPasswordMismatch] = useState(false);
    const [gradeMissing, setGradeMissing] = useState(false);

    const { onRegister, onLogin } = useAuth()

    const history = useHistory()


    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSignUp = async () => {
        setFirstNameMissing(!firstName.trim());
        setLastNameMissing(!lastName.trim());
        setEmailMissing(!email.trim());
        setEmailInvalid(!validateEmail(email));
        setPasswordMissing(!password.trim());
        setPasswordVerifyMissing(!passwordVerify.trim());
        setPasswordMismatch(password !== passwordVerify);
        setGradeMissing(!grade.trim());

        if (!firstName.trim() || !lastName.trim() || !email.trim() || !validateEmail(email) || !password.trim() || !passwordVerify.trim() || password !== passwordVerify || !grade.trim()) {
            setIsInvalid(true);
            setErrorMessage('Please fill in all fields correctly.');
        } else {
            setIsInvalid(false);
            setErrorMessage('');
            // Placeholder for sign-up logic
        }
        if (onRegister) {
            const result = await onRegister(firstName, lastName, email, password, grade)
            if (result && result.error) {
                setIsInvalid(true)
                setErrorMessage(result.msg)
            }
            else {
                setIsInvalid(false)
                login()
            }
        }
    };

    const login = async () => {
        if (onLogin) {
            const result = await onLogin(email, password)
            if (result && result.error) {
                setIsInvalid(true)
                setErrorMessage(result.msg)

            }
            else {
                setIsInvalid(false)
                history.push('/dashboard')
            }
        } else {
            console.log("onLogin broken")
        }
    }

    return (
        <IonPage>
            <IonContent className="ion-padding">
                <h1>Sign Up</h1>

                <IonItem>
                    <IonLabel position="stacked">First Name</IonLabel>
                    <IonInput
                        type="text"
                        placeholder="Enter your first name"
                        value={firstName}
                        onIonInput={(e) => setFirstName(e.detail.value!)}
                        required
                        className={firstNameMissing ? 'ion-invalid' : 'ion-valid'}
                    />
                    {firstNameMissing && (
                        <IonText color="danger">First name is required.</IonText>
                    )}
                </IonItem>

                <IonItem>
                    <IonLabel position="stacked">Last Name</IonLabel>
                    <IonInput
                        type="text"
                        placeholder="Enter your last name"
                        value={lastName}
                        onIonInput={(e) => setLastName(e.detail.value!)}
                        required
                        className={lastNameMissing ? 'ion-invalid' : 'ion-valid'}
                    />
                    {lastNameMissing && (
                        <IonText color="danger">Last name is required.</IonText>
                    )}
                </IonItem>

                <IonItem>
                    <IonLabel position="stacked">Email</IonLabel>
                    <IonInput
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onIonInput={(e) => setEmail(e.detail.value!)}
                        required
                        className={emailMissing || emailInvalid ? 'ion-invalid' : 'ion-valid'}
                    />
                    {emailMissing && (
                        <IonText color="danger">Email is required.</IonText>
                    )}
                    {emailInvalid && !emailMissing && (
                        <IonText color="danger">Invalid email format.</IonText>
                    )}
                </IonItem>

                <IonItem>
                    <IonLabel position="stacked">Password</IonLabel>
                    <IonInput
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onIonInput={(e) => setPassword(e.detail.value!)}
                        required
                        className={passwordMissing ? 'ion-invalid' : 'ion-valid'}
                    />
                    {passwordMissing && (
                        <IonText color="danger">Password is required.</IonText>
                    )}
                </IonItem>

                <IonItem>
                    <IonLabel position="stacked">Verify Password</IonLabel>
                    <IonInput
                        type="password"
                        placeholder="Verify your password"
                        value={passwordVerify}
                        onIonInput={(e) => setPasswordVerify(e.detail.value!)}
                        required
                        className={passwordVerifyMissing || passwordMismatch ? 'ion-invalid' : 'ion-valid'}
                    />
                    {passwordVerifyMissing && (
                        <IonText color="danger">Verify password is required.</IonText>
                    )}
                    {passwordMismatch && !passwordVerifyMissing && (
                        <IonText color="danger">Passwords do not match.</IonText>
                    )}
                </IonItem>

                <IonItem>
                    <IonLabel position="stacked">Grade</IonLabel>
                    <IonSelect
                        value={grade}
                        placeholder="Select your grade"
                        onIonInput={(e) => setGrade(e.detail.value)}
                        required
                        className={gradeMissing ? 'ion-invalid' : 'ion-valid'}
                    >
                        <IonSelectOption value="freshman">Freshman</IonSelectOption>
                        <IonSelectOption value="sophomore">Sophomore</IonSelectOption>
                        <IonSelectOption value="junior">Junior</IonSelectOption>
                        <IonSelectOption value="senior">Senior</IonSelectOption>
                    </IonSelect>
                    {gradeMissing && (
                        <IonText color="danger">Grade is required.</IonText>
                    )}
                </IonItem>

                <IonButton expand="full" onClick={handleSignUp}>Sign Up</IonButton>

                <IonFooter className="ion-no-border">
                    <IonText color="medium">
                        <p style={{ textAlign: 'center', marginTop: '20px' }}>
                            Already have an account? <a href="/signin">Sign in</a>
                        </p>
                    </IonText>
                </IonFooter>

                {/* Alert for invalid input */}
                <IonAlert
                    isOpen={isInvalid}
                    onDidDismiss={() => setIsInvalid(false)}
                    header={'Error'}
                    message={errorMessage}
                    buttons={['OK']}
                />
            </IonContent>
        </IonPage>
    );
};

export default SignUp;
