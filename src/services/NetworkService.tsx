// NetworkService.js
import { useEffect, useState } from "react";

const useNetworkStatus = () => {
  const getCurrentNetworkStatus = () => {
    return navigator.onLine ? 'online' : 'offline';
  };

  const [networkStatus, setNetworkStatus] = useState(getCurrentNetworkStatus());

  useEffect(() => {
    const updateNetworkStatus = () => {
      setNetworkStatus(getCurrentNetworkStatus());
    };

    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
    };
  }, []);

  return networkStatus;
};

export default useNetworkStatus;
