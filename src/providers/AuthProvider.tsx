import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from 'axios';

function parseJwt(token: string): { [key: string]: any } {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Invalid token", error);
        return {};
    }
}

interface AuthProps {
    isLoading?: boolean;
    authState?: { token: string | null; authenticated: boolean | null };
    userState?: { user_id: number | null; email: string | null; firstName: string | null; lastName: string | null; role: string | null, expirationDate: number | null};
    onRegister?: (first_name: string, last_name: string, email: string, password: string, grade: string) => Promise<any>;
    onLogin?: (email: string, password: string) => Promise<any>;
    onLogout?: () => Promise<void>;
}

const TOKEN_KEY = 'jwt';
export const API_URL = 'https://dawson.hamera.com/api';
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [authState, setAuthState] = useState<{ token: string | null; authenticated: boolean | null }>({
        token: null,
        authenticated: null
    });
    const [userState, setUserState] = useState<{ user_id: number | null; email: string | null; firstName: string | null; lastName: string | null; role: string | null, expirationDate: number | null}>({
        user_id: null,
        email: null,
        firstName: null,
        lastName: null,
        role: null,
        expirationDate: null
    });

    useEffect(() => {
        const loadToken = async () => {
            try {
                const token = localStorage.getItem(TOKEN_KEY);
                if (token) {
                    axios.defaults.headers.common['Token'] = `Bearer ${token}`;
                    const tokenPayload = parseJwt(token);
                    setAuthState({ token: token, authenticated: true });
                    setUserState({ 
                        user_id: tokenPayload.user_id, 
                        email: tokenPayload.email, 
                        firstName: tokenPayload.first_name, 
                        lastName: tokenPayload.last_name, 
                        role: tokenPayload.role, 
                        expirationDate: tokenPayload.exp 
                    });
                }
            } catch (e) {
                console.error("Error loading token", e);
            } finally {
                setIsLoading(false);
            }
        };
        loadToken();
    }, []);

    useEffect(() => {
        if (userState?.expirationDate) {
            const expirationTimeMs = userState.expirationDate * 1000;
            const nowMs = Date.now();
            const timeLeft = expirationTimeMs - nowMs;
            const cutoffMs = 2 * 60 * 60 * 1000; // 2 hours in ms

            console.log("Current Time (ms):", nowMs);
            console.log("Token Expiration Time (ms):", expirationTimeMs);
            console.log("Time left (ms):", timeLeft);

            if (timeLeft <= 0) {
                console.log("Token already expired. Logging out...");
                logout();
            } else if (timeLeft <= cutoffMs) {
                console.log(`Setting auto-logout in ${timeLeft} ms (token expires soon)`);
                const timer = setTimeout(() => {
                    console.log("Token expiration reached. Logging out...");
                    logout();
                }, timeLeft);

                return () => clearTimeout(timer);
            } else {
                console.log("Token expiration is far away, no auto-logout set.");
            }
        }
    }, [userState?.expirationDate]);

    const register = useCallback(async (first_name: string, last_name: string, email: string, password: string, grade: string) => {
        try {
            const result = await axios.post(`${API_URL}/register.php`, { first_name, last_name, email, password, grade });
            if (result.data.error) {
                return { error: true, msg: result.data.error };
            }
            return result.data;
        } catch (e: any) {
            return { error: true, msg: e.response.data };
        }
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        try {
            console.log("Attempting to login");
            const result = await axios.post(`${API_URL}/login.php`, { email, password });
            if (result.data.error) {
                console.log("Login failed:", result.data.error);
                return { error: true, msg: result.data.error };
            }
            console.log("Login success");
            const tokenPayload = parseJwt(result.data.jwt);
            setAuthState({ token: result.data.jwt, authenticated: true });
            setUserState({ 
                user_id: tokenPayload.user_id, 
                email: tokenPayload.email, 
                firstName: tokenPayload.first_name, 
                lastName: tokenPayload.last_name, 
                role: tokenPayload.role, 
                expirationDate: tokenPayload.exp 
            });
            axios.defaults.headers.common['Token'] = `Bearer ${result.data.jwt}`;
            localStorage.setItem(TOKEN_KEY, result.data.jwt);
        } catch (e: any) {
            return { error: true, msg: e };
        }
    }, []);

    const logout = useCallback(async () => {
        console.log("Logging out...");
        localStorage.removeItem(TOKEN_KEY);
        delete axios.defaults.headers.common['Token'];
        setAuthState({ token: null, authenticated: false });
        setUserState({
            user_id: null, email: null, firstName: null, lastName: null, role: null, expirationDate: null
        });
    }, []);

    const value = {
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        authState,
        userState,
        isLoading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
