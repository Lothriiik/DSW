import React, { useEffect }  from 'react';
import './styles.css'; 


const CustomInput = ({ label, placeholder, className, value, onChange, disabled, defaultValue, isUntouchable }) => {
    const [isActive, setIsActive] = React.useState(false);

    useEffect(() => {
        if (disabled) {
            onChange({ target: { value: defaultValue || '' } });
         } 
    }, [disabled, defaultValue, onChange]);

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
                className={`${isActive ? 'active' : ''} ${className} ${isUntouchable ? 'untouchable' : ''}`}
                value={value}  
                onChange={handleInputChange}
                disabled={disabled}
            />
        </div>
    );
};

export default CustomInput;
