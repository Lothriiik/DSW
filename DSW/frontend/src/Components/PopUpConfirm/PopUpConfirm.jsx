import React, { useState } from 'react';
import './styles.css'; 
import CustomButton from '../CustomButton/CustomButton.jsx'

export default function PopUpConfirm() {
    const [isOpen, setIsOpen] = useState(true); 

    const closePopup = () => {
        setIsOpen(false); 
    };

    return (
        <>
            {isOpen && (
                <div className="popup-overlay">
                    <div className="popup">
                        <div className="popup-header">
                            <span className="popup-icon">
                                <svg width="56" height="49" viewBox="0 0 56 49" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <title>Imagem de Carrinho indicando Confirmação do pedido</title>
                                    <g clip-path="url(#clip0_213_2327)">
                                    <path d="M47.0493 26.5417H12.6443L10.4487 10.2083H28V6.125H9.898L9.8 5.40633C9.59892 3.91714 8.78047 2.54423 7.49977 1.5478C6.21907 0.551361 4.56511 0.000638708 2.85133 0L0 0V4.08333H2.85133C3.42284 4.0834 3.97445 4.26699 4.40153 4.59929C4.82862 4.93159 5.10147 5.38949 5.16833 5.88613L8.86667 33.3833C9.06722 34.8729 9.88544 36.2463 11.1662 37.2431C12.4469 38.24 14.1012 38.791 15.8153 38.7917H46.6667V34.7083H15.8153C15.2435 34.7082 14.6916 34.5243 14.2644 34.1916C13.8373 33.8589 13.5647 33.4005 13.4983 32.9035L13.1927 30.625H50.9507L53.0507 20.4167H48.3117L47.0493 26.5417Z" fill="#0095DA"/>
                                    <path d="M16.3336 49.0011C18.911 49.0011 21.0003 47.173 21.0003 44.9178C21.0003 42.6626 18.911 40.8345 16.3336 40.8345C13.7563 40.8345 11.667 42.6626 11.667 44.9178C11.667 47.173 13.7563 49.0011 16.3336 49.0011Z" fill="#0095DA"/>
                                    <path d="M39.6667 49.0011C42.244 49.0011 44.3333 47.173 44.3333 44.9178C44.3333 42.6626 42.244 40.8345 39.6667 40.8345C37.0893 40.8345 35 42.6626 35 44.9178C35 47.173 37.0893 49.0011 39.6667 49.0011Z" fill="#0095DA"/>
                                    <path d="M39.8481 17.4412H39.9251C40.5039 17.4429 41.0773 17.344 41.612 17.1502C42.1468 16.9563 42.6322 16.6715 43.0401 16.3122L55.3157 5.571L52.0164 2.68408L39.9274 13.2722L34.6914 8.49467L31.3291 11.3244L36.7098 16.2244C37.1118 16.6022 37.5972 16.9048 38.1366 17.1139C38.676 17.323 39.2582 17.4344 39.8481 17.4412V17.4412Z" fill="#0095DA"/>
                                    </g>
                                    <defs>
                                    <clipPath id="clip0_213_2327">
                                    <rect width="56" height="49" fill="white"/>
                                    </clipPath>
                                    </defs>
                                </svg>
                            </span>
                        </div>
                        <h2 className="popup-title-confirm">Confirmar Pedido</h2>
                        <p className="popup-message">
                            Tem certeza de que deseja confirmar este pedido?
                        </p>
                        <div className="popup-actions-confirm">
                            <CustomButton label="Sim" className="blue size189"/>
                            <CustomButton label="Cancelar" className="borderred size108" onClick={closePopup}/>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
