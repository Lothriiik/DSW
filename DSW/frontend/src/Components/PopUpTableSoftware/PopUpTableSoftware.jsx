import React, { useState } from 'react';
import SoftwareTable from '../SoftwareTable/SoftwareTable.jsx';
import './styles.css';

const PopUpTableSoftware = ({ idDispositivo, closePopup}) => {
    
    const [isOpen, setIsOpen] = useState(true);

    return (
        <>
            {isOpen && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h1 className='title-table'>Softwares</h1>
                        <button className="close-button" onClick={closePopup}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_2033_6804)">
                                    <path d="M7 7L17 17M7 17L17 7" stroke="black" strokeOpacity="0.61" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </g>
                                <defs>
                                    <clipPath id="clip0_2033_6804">
                                        <rect width="24" height="24" fill="white"/>
                                    </clipPath>
                                </defs>
                            </svg>
                        </button>
                        <div className="container-table">
                            <SoftwareTable idDispositivo={idDispositivo} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PopUpTableSoftware;
