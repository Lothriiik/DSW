import React from 'react';
import './styles.css';  

const CustomButton = ({ label, className, onClick, disabled, type}) => {
    return (
        <button type={type} disabled={disabled} className={className} onClick={onClick} >{label}</button>
    );
};

export default CustomButton;
