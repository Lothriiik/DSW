import React from 'react';
import './styles.css';  
import { Tooltip } from 'antd';

const AddIcon = () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.16018 0.680176V7.16018M7.16018 13.6402V7.16018M7.16018 7.16018H13.6402M7.16018 7.16018H0.680176" stroke="white" stroke-width="1.296" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>

);

const CalendarIcon = () => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.9 1.8H16.2V0H13.5V1.8H8.1V0H5.4V1.8H2.7C1.98392 1.8 1.29716 2.08446 0.790812 2.59081C0.284463 3.09716 0 3.78392 0 4.5L0 21.6H21.6V4.5C21.6 3.78392 21.3155 3.09716 20.8092 2.59081C20.3028 2.08446 19.6161 1.8 18.9 1.8ZM2.7 18.9V9H18.9V18.9H2.7Z" fill="white"/>
    </svg>

)

const ObserverIcon = () => (
    <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 12H15V14H5V12ZM5 18H12V16H5V18ZM20 7.586V24H0V3C0 2.20435 0.316071 1.44129 0.87868 0.87868C1.44129 0.31607 2.20435 0 3 0L12.414 0L20 7.586ZM13 7H16.586L13 3.414V7ZM18 22V9H11V2H3C2.73478 2 2.48043 2.10536 2.29289 2.29289C2.10536 2.48043 2 2.73478 2 3V22H18Z" fill="#333333"/>
    </svg>
)



const CircleButton = ({ iconType, onClick, className }) => {
    const computedClassName = className ? `circle ${className}` : "circle blue";

    const tooltipText = {
        add: "Adicionar",
        calendar: "Calendário",
        obs: "Observações"
    }[iconType] || "Botão";

    const renderIcon = () => {
        switch (iconType) {
            case 'add':
                return <AddIcon />;
            case 'calendar':
                return <CalendarIcon />;
            case 'obs':
                return <ObserverIcon />;
            default:
                return null;
        }
    };

    return (
        <Tooltip title={tooltipText}>
            <button className={computedClassName} onClick={onClick}>
                {renderIcon()}
            </button>
         </Tooltip>
    );
};

export default CircleButton;
