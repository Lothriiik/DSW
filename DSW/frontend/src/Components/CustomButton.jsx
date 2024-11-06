import React from 'react';
import './CustomButton.css';  // Importa o arquivo CSS

const CustomButton = ({ label, className, onClick, isButtonDisabled}) => {
    return (
        <button disabled={isButtonDisabled} className={className} onClick={onClick} >{label}</button>
    );
};

export default CustomButton;
