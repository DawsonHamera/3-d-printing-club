import axios from "axios";
import { useState } from "react";



const ApiService = () => {
    const [apiLoading, setApiLoading] = useState(true);


    const fetchUsers = async () => {
        setApiLoading(true);
        try {
            const response = await axios.get('https://dawson.hamera.com/api/get_users.php');
            return response.data
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setApiLoading(false);
        }
    };

    const assignJob = async (job_id: any, username: string) => {
        setApiLoading(true);
        try {
            const response = await axios.post('https://dawson.hamera.com/api/assign_job.php', {job_id, username});
            return response.data
        } catch (error) {
            console.error("Error assigning job:", error);
        } finally {
            setApiLoading(false);
        }
    };


    return { apiLoading, fetchUsers, assignJob }
}
export default ApiService;