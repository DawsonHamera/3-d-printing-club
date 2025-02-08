import axios from "axios";
import { useState } from "react";
import { useAuth } from "../providers/AuthProvider";



const ApiService = () => {
    const [apiLoading, setApiLoading] = useState(true);

    const { isLoading } = useAuth()

    const API_URL = 'https://dawson.hamera.com/api';

    const waitForLoading = async () => {
        while (isLoading) {
            // Wait for a small period before checking again
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    };

    const apiFetch = async (endpoint: string) => {
        console.log(`Fetching ${endpoint}`)
        setApiLoading(true);
        await waitForLoading();
        try {
            const response = await axios.get(`${API_URL}/${endpoint}.php`);
            if (response && response.data.error) {
                console.error(`Error fetching ${endpoint}:`, response.data.error);
                return { error: response.data.error, data: null };
            }
            console.log('Fetch successful:', response.data)
            return { error: null, data: response.data }
        } catch (error) {
            console.error(`Axios error fetching ${endpoint}:`, error);
            return { error: error, data: null };
        } finally {
            setApiLoading(false);
        }
    };

    const apiPost = async (endpoint: string, data: any) => {
        setApiLoading(true);
        await waitForLoading();
        try {
            const response = await axios.post(`${API_URL}/${endpoint}.php`, data);
            if (response && response.data.error) {
                console.error(`Error posting to ${endpoint} with data ${data}:`, response.data.error);
                return { error: response.data.error, data: null };
            }
            return { error: null, data: response.data }
        } catch (error) {
            console.error(`Error posting to ${endpoint} with data ${data}:`, error);
            return { error: error, data: null }
        } finally {
            setApiLoading(false);
        }
    };


    return { apiLoading, apiFetch, apiPost }
}
export default ApiService;