import React, { useState } from 'react';
import './PopUpSucess.css'; 
import CustomButton from '../components/CustomButton'

export default function PopUpSucess({onClose, text}) {
    const [isOpen, setIsOpen] = useState(true); 

    const closePopup = () => {
        setIsOpen(false); 
    };

    return (
        <>
            {isOpen && (
                <div className="popup">
                    <div className="popup-header">
                        <span className="popup-icon">
                            <svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_2075_4321)">
                                <path d="M21.7503 40.0204C22.4529 40.0209 23.1486 39.8819 23.797 39.6115C24.4455 39.3412 25.0339 38.9448 25.5281 38.4454L45.1368 18.8367L40.3623 14.0757L21.7503 32.6877L13.6368 24.5764L8.8623 29.3487L17.9703 38.4567C18.4658 38.9541 19.055 39.3484 19.7038 39.6168C20.3526 39.8852 21.0482 40.0224 21.7503 40.0204V40.0204Z" fill="#0095DA"/>
                                <path d="M47.25 0H6.75C4.95979 0 3.2429 0.711159 1.97703 1.97703C0.711159 3.2429 0 4.95979 0 6.75L0 54H54V6.75C54 4.95979 53.2888 3.2429 52.023 1.97703C50.7571 0.711159 49.0402 0 47.25 0V0ZM47.25 47.25H6.75V6.75H47.25V47.25Z" fill="#0095DA"/>
                                </g>
                                <defs>
                                <clipPath id="clip0_2075_4321">
                                <rect width="54" height="54" fill="white"/>
                                </clipPath>
                                </defs>
                            </svg>



                        </span>
                    </div>
                    <h2 className="popup-title-sucess">Sucesso</h2>
                    <p className="popup-message">
                        {text} cadastrado com sucesso!
                    </p>
                    <div className="popup-actions-sucess">
                        <CustomButton label="OK" className="blue size108" onClick={() => { 
                            closePopup();
                            onClose();  
                        }}/>
                    </div>
                </div>
            )}
        </>
    );
}
