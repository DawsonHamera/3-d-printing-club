import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonProgressBar, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonSelect, IonSelectOption, IonButton, IonItem, IonItemSliding, IonIcon, IonItemOption, IonItemOptions, IonList, IonAlert } from '@ionic/react';
import { useAuth } from '../../providers/AuthProvider';
import axios from 'axios';
import ApiService from '../../services/ApiService';
import { trash } from 'ionicons/icons';

interface User {
  user_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'user' | 'member';
  grade: 'freshman' | 'sophomore' | 'junior' | 'senior';
  score: number;
  created_at: string;
}

const UserManagementPage: React.FC = () => {
  const [ removeUser, setRemoveUser ] = useState(0)
  const [users, setUsers] = useState<User[]>([]);
  const [prompt, setPrompt] = useState(false);
  const { userState, isLoading } = useAuth();
  const { apiFetch, apiPost, apiLoading } = ApiService()

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await apiFetch('get_users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
    }
  };

  const handleChangeRole = async (user_id: number, role: string) => {
    await apiPost("update_role", { user_id, role })
    await fetchUsers()
  };
  const handleRemoveUser = async () => {
    await apiPost("remove_user", { user_id: removeUser })
    await fetchUsers()
  };


  if (isLoading || apiLoading) {
    return <IonProgressBar type="indeterminate" />;
  }

  if (userState?.role === 'admin') {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>User Management</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList lines="none">
            {users.map((user) => (
              <IonItemSliding key={user.user_id}>
                <IonItem>
                  <IonCard style={user.user_id === userState?.user_id ? { border: '2px solid var(--ion-color-primary)', width: '100%' } : { width: '100%' }}>
                    <IonCardHeader>
                      <IonCardTitle style={user.user_id === userState?.user_id ? { color: 'var(--ion-color-primary)' } : {}}>
                        {user.user_id === userState?.user_id ? `${user.username} (you)` : user.username}
                      </IonCardTitle>
                      <IonCardSubtitle>{user.email}</IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <p>
                        <strong>Id:</strong> {user.user_id}
                      </p>
                      <p>
                        <strong>Name:</strong> {user.first_name} {user.last_name}
                      </p>
                      <p>
                        <strong>Role:</strong>
                        {/* Make IonSelect inline */}
                        <IonSelect
                          value={user.role}
                          placeholder={user.role}
                          onIonChange={(e) => handleChangeRole(user.user_id, e.detail.value)}
                          style={{ display: 'inline-block', width: 'auto', marginLeft: '10px' }} // Inline display styling
                        >
                          <IonSelectOption value="user">User</IonSelectOption>
                          <IonSelectOption value="member">Member</IonSelectOption>
                          <IonSelectOption value="admin">Admin</IonSelectOption>
                        </IonSelect>
                      </p>
                      <p>
                        <strong>Grade:</strong> {user.grade}
                      </p>
                      <p>
                        <strong>Score:</strong> {user.score}
                      </p>
                      <p>
                        <strong>Created At:</strong> {new Date(user.created_at).toLocaleString()}
                      </p>
                    </IonCardContent>
                  </IonCard>
                </IonItem>
                <IonItemOptions side="end">
                  <IonItemOption color="danger" onClick={() => {setRemoveUser(user.user_id); setPrompt(true)}}>
                    <IonIcon slot="icon-only" icon={trash}></IonIcon>
                  </IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
            ))}
          </IonList>
          <IonAlert
            isOpen={prompt}
            onDidDismiss={() => setPrompt(false)}
            header={'Warning'}
            message={"Are you sure you want to proceed with account deletion? All this user's data will be permanently lost."}
            buttons={[
              {
                text: 'Cancel',
                handler: () => {
                  setPrompt(false)
                },
              },
              {
                text: 'Yes',
                handler: () => {
                  handleRemoveUser()
                  setPrompt(false)
                },
              },
            ]}
          />
        </IonContent>
      </IonPage>
    );
  }

  return null;
};

export default UserManagementPage;
