import React, { useState } from 'react';
import { BrowserQRCodeReader } from '@zxing/browser';
import { IonButton } from '@ionic/react';

interface QRCodeScannerProps {
    onScan: (text: string) => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScan }) => {
        const [showVideo, setShowVideo] = useState(true)

    const handleScan = async () => {
        const codeReader = new BrowserQRCodeReader();
        try {
            const result = await codeReader.decodeOnceFromVideoDevice(undefined, 'video');
            onScan(result.getText())
            setShowVideo(false);
        } catch (err) {
            console.error(err);
        }
    };

    if (showVideo) {
        return (
            <div>
                <IonButton className="center"  onClick={handleScan}>Scan QR Code</IonButton>
               <video id="video" style={{ width: '100%' }}></video>
            </div>
        );
    }
       
};

export default QRCodeScanner;
