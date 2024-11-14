import React from 'react';
import './CircleButton.css';  

const AddIcon = () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <title>Adicionar</title>
        <path d="M7.16018 0.680176V7.16018M7.16018 13.6402V7.16018M7.16018 7.16018H13.6402M7.16018 7.16018H0.680176" stroke="white" stroke-width="1.296" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>

);

const CalendarIcon = () => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <title>Calendario</title>
        <path d="M18.9 1.8H16.2V0H13.5V1.8H8.1V0H5.4V1.8H2.7C1.98392 1.8 1.29716 2.08446 0.790812 2.59081C0.284463 3.09716 0 3.78392 0 4.5L0 21.6H21.6V4.5C21.6 3.78392 21.3155 3.09716 20.8092 2.59081C20.3028 2.08446 19.6161 1.8 18.9 1.8ZM2.7 18.9V9H18.9V18.9H2.7Z" fill="white"/>
    </svg>

)

const CircleButton = ({ iconType, onClick }) => {
    const renderIcon = () => {
        switch (iconType) {
            case 'add':
                return <AddIcon />;
            case 'calendar':
                return <CalendarIcon />;
            default:
                return null; // ou um ícone padrão, se preferir
        }
    };

    return (
        <button className="circle blue" onClick={onClick}>
            {renderIcon()}
        </button>
    );
};

export default CircleButton;
