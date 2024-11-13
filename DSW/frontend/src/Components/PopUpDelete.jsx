import React, { useState } from 'react';
import './popupDelete.css'; // O arquivo de estilo
import CustomButton from './CustomButton'

export default function PopUpDelete({onConfirm, onClose, text}) {
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
                            <svg width="62" height="62" viewBox="0 0 62 62" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <title>Simbolo de atenção</title>
                                <path d="M26.6699 7.5C28.5944 4.16667 33.4056 4.16667 35.3301 7.5L53.5167 39C55.4412 42.3333 53.0355 46.5 49.1865 46.5H12.8135C8.96446 46.5 6.55884 42.3333 8.48334 39L26.6699 7.5Z" fill="#ED1C24"/>
                                <circle cx="31" cy="38" r="2" fill="white"/>
                                <line x1="31" y1="15" x2="31" y2="31" stroke="white" stroke-width="4" stroke-linecap="round"/>
                            </svg>

                        </span>
                    </div>
                    <h2 className="popup-title">Tem certeza?</h2>
                    <p className="popup-message">
                        Essa ação removerá o {text}. Essa ação não é reversível.
                    </p>
                    <div className="popup-actions">
                        <CustomButton label="Sim, deletar" className="red size189" onClick={onConfirm}/>
                        <CustomButton label="Cancelar" className="borderred size108" onClick={() => { 
                            closePopup();
                            onClose();  
                        }} />
                    </div>
                </div>
            )}
        </>
    );
}
