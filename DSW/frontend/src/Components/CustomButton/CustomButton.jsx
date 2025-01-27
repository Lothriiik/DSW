import React from 'react';
import './styles.css';  

const CustomButton = ({ label, className, onClick, disabled}) => {
    return (
        <button disabled={disabled} className={className} onClick={onClick} >{label}</button>
    );
};

export default CustomButton;
