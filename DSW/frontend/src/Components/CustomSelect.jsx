import React, { useState } from 'react';
import './CustomSelect.css';

const CustomSelect = ({ label, labelSelect, options, optionMargin, tamanho , onChange, disabled }) => {
  const [selectedValue, setSelectedValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value, label) => {
    setSelectedValue(label);
    setIsOpen(false);
    onChange(value);
  };

  return (
    <div className={`custom-select-container ${tamanho}`}>
      {label && <label>{label}</label>}

      <div
        className={`custom-select ${isOpen ? 'open' : ''} ${tamanho} ${disabled ? 'disabled' : ''}`}
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
          }
        }}
      >
        <div className="selected-value">{selectedValue || labelSelect}</div>
        <div className={`arrow ${isOpen ? 'open' : ''}`} />
      </div>

      {isOpen && !disabled && (
        <div className={`options-container ${optionMargin}`}>
          {options.map((option) => (
            <div
              key={option.value}
              className="option"
              onClick={() => handleSelect(option.value, option.label)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
