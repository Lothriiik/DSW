import React, { useState } from 'react';
import './PopUpSucess.css'; 
import CustomButton from '../components/CustomButton'

export default function PopUpSucess() {
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
                                <title>Pacote indicando um pedido</title>
                                <g clip-path="url(#clip0_213_2307)">
                                <path d="M46.125 0H7.875C5.78642 0 3.78338 0.829685 2.30653 2.30653C0.829685 3.78338 0 5.78642 0 7.875L0 54H54V7.875C54 5.78642 53.1703 3.78338 51.6935 2.30653C50.2166 0.829685 48.2136 0 46.125 0ZM47.25 7.875V11.25H36V6.75H46.125C46.4234 6.75 46.7095 6.86853 46.9205 7.07951C47.1315 7.29048 47.25 7.57663 47.25 7.875ZM24.75 6.75H29.25V18H24.75V6.75ZM7.875 6.75H18V11.25H6.75V7.875C6.75 7.57663 6.86853 7.29048 7.07951 7.07951C7.29048 6.86853 7.57663 6.75 7.875 6.75V6.75ZM6.75 47.25V18H18V24.75H36V18H47.25V47.25H6.75ZM32.625 36H42.75V42.75H32.625V36Z" fill="#0095DA"/>
                                </g>
                                <defs>
                                <clipPath id="clip0_213_2307">
                                <rect width="54" height="54" fill="white"/>
                                </clipPath>
                                </defs>
                            </svg>

                        </span>
                    </div>
                    <h2 className="popup-title-sucess">Sucesso</h2>
                    <p className="popup-message">
                        Produto cadastrado com sucesso!
                    </p>
                    <div className="popup-actions-sucess">
                        <CustomButton label="OK" className="blue size108" onClick={closePopup}/>
                    </div>
                </div>
            )}
        </>
    );
}
