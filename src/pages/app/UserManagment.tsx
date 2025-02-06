import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonProgressBar, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/react';
import { useAuth } from '../../providers/AuthProvider';
import axios from 'axios';

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
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { userState, isLoading } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://dawson.hamera.com/api/get_users.php');
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (isLoading || loading) {
    return <IonProgressBar type="indeterminate" />;
  }

  if (userState?.role === "admin") {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>User Management</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonGrid>
            {users.map((user) => (
              <IonRow key={user.user_id}>
                <IonCol>
                <IonCard style={user.user_id === userState?.user_id ? { border: "2px solid var(--ion-color-primary)" } : {}}>
                <IonCardHeader>
                      <IonCardTitle style={user.user_id === userState?.user_id ? { color: " var(--ion-color-primary)" } : {}}>{user.user_id === userState?.user_id ? `${user.username} (you)` : user.username}</IonCardTitle>
                      <IonCardSubtitle>{user.email}</IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <p><strong>Id:</strong> {user.user_id}</p>
                      <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
                      <p><strong>Role:</strong> {user.role}</p>
                      <p><strong>Grade:</strong> {user.grade}</p>
                      <p><strong>Score:</strong> {user.score}</p>
                      <p><strong>Created At:</strong> {new Date(user.created_at).toLocaleString()}</p>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              </IonRow>
            ))}
          </IonGrid>
        </IonContent>
      </IonPage>
    );
  }

  return null;
};

export default UserManagementPage;
