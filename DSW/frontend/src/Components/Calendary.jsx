import React, { useState } from 'react';
import moment from 'moment';
import './Calendary.css'; 


const Calendary = ({onDateSelect}) => {
    const [currentDate, setCurrentDate] = useState(moment());
    const [selectedDate, setSelectedDate] = useState(moment()); // Define a data de hoje como a data selecionada inicial

    const prevMonth = () => setCurrentDate(prev => prev.clone().subtract(1, 'month'));
    const nextMonth = () => setCurrentDate(prev => prev.clone().add(1, 'month'));

    const monthName = currentDate.format('MMMM');
    const year = currentDate.format('YYYY');
    const startOfMonth = currentDate.clone().startOf('month');
    const daysInMonth = currentDate.daysInMonth();
    const startDay = startOfMonth.day();

    const renderDays = () => {
        const days = [];

        for (let i = 0; i < startDay; i++) {
        days.push(<div key={`empty-${i}`} className="day empty" />);
        }

        for (let day = 1; day <= daysInMonth; day++) {
        const dayDate = currentDate.clone().date(day);
        const isSelected = selectedDate && selectedDate.isSame(dayDate, 'day');

        days.push(
            <div
            key={day}
            className={`day ${isSelected ? 'selected' : ''}`}
            onClick={() => handleDateSelect(dayDate)}
            >
            {day}
            </div>
        );
        }

        return days;
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        onDateSelect(date); // Chama a função passada pelo componente pai com a data selecionada
    };

    return (
        <div className="styled-calendar">
        <div className="calendar-header">
            <button onClick={prevMonth}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_329_2702)">
                    <path d="M10.6942 16L4.3562 9.65333C3.92011 9.21519 3.67529 8.62218 3.67529 8.004C3.67529 7.38582 3.92011 6.79281 4.3562 6.35467L10.7015 0L12.1135 1.414L5.7682 7.768C5.70571 7.83051 5.67061 7.91528 5.67061 8.00367C5.67061 8.09205 5.70571 8.17682 5.7682 8.23933L12.1055 14.586L10.6942 16Z" fill="#0095DA"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_329_2702">
                    <rect width="16" height="16" fill="white"/>
                    </clipPath>
                    </defs>
                </svg>

            </button>
            <span>{`${monthName} ${year}`}</span>
            <button onClick={nextMonth}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_329_2703)">
                    <path d="M5.418 16L11.756 9.65333C12.1921 9.21519 12.4369 8.62218 12.4369 8.004C12.4369 7.38582 12.1921 6.79281 11.756 6.35467L5.41067 0L4 1.414L10.3453 7.768C10.4078 7.83051 10.4429 7.91528 10.4429 8.00367C10.4429 8.09205 10.4078 8.17682 10.3453 8.23933L4.00667 14.586L5.418 16Z" fill="#0095DA"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_329_2703">
                    <rect width="16" height="16" fill="white"/>
                    </clipPath>
                    </defs>
                </svg>


            </button>
        </div>
        <div className="calendar-body">
            <div className="calendar-weekdays">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                <div key={day} className="weekday">{day}</div>
            ))}
            </div>
            <div className="calendar-days">{renderDays()}</div>
        </div>
        </div>
    );
};
  
  export default Calendary;


