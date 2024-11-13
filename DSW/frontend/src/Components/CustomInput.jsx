import React from 'react';
import './CustomInput.css'; 

const CustomInput = ({ label, placeholder, className, value, onChange }) => {
    const [isActive, setIsActive] = React.useState(false);

    const handleInputChange = (event) => {
        onChange(event);  
        setIsActive(event.target.value.trim() !== '');
    };

    return (
        <div className='container-input'>
            {label && <label htmlFor="customInput" className="input-label">{label}</label>}
            <input
                id="customInput"
                type="text"
                placeholder={placeholder}
                className={`${isActive ? 'active' : ''} ${className}`}
                value={value}  
                onChange={handleInputChange}
            />
        </div>
    );
};

export default CustomInput;
