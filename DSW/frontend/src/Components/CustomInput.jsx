import React, { useState } from 'react';
import './CustomInput.css'; // Importe o CSS

const CustomInput = ({ label, placeholder, className }) => {
    const [inputValue, setInputValue] = useState('');
    const [isActive, setIsActive] = useState(false);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
        setIsActive(event.target.value.trim() !== '');
    };

    return (
        <div>
            <label htmlFor="customInput">{label}</label>
            <input
                id="customInput"
                type="text"
                placeholder={placeholder}
                className={`input-field ${isActive ? 'active' : ''} ${className}`}
                value={inputValue}
                onChange={handleInputChange}
            />
        </div>
    );
};

export default CustomInput;
