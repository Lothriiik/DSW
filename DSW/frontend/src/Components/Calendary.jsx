import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment/locale/pt-br';

import './Calendary.css';
import CustomSelect from './CustomSelect';

const Calendary = ({ onDateSelect }) => {
  moment.locale('pt_br');
  const currentYear = moment().year();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleYearChange = (year) => {
    const newYear = year === selectedYear ? null : year;
    setSelectedYear(newYear);
    setSelectedDate(null);
    onDateSelect({ 
      year: selectedYear,
      month: selectedMonth,
      day: selectedDate,
    });
  };

  const handleMonthChange = (month) => {
    const newMonth = month === selectedMonth ? null : month;
    setSelectedMonth(newMonth);
    setSelectedDate(null);

    const monthData = { year: selectedYear };

    if (!isNaN(newMonth) && newMonth !== null && newMonth !== "") {
      monthData.month = newMonth;
    }

    onDateSelect(monthData);
  };

  const handleDateSelect = (date) => {
    const newDate = selectedDate && selectedDate.isSame(date, 'day') ? null : date;
    setSelectedDate(newDate);

    onDateSelect({
      year: selectedYear,
      month: selectedMonth,
      day: newDate ? newDate.date() : null,
    });
  };

  const renderDays = () => {
    if (selectedMonth === null) {
      return null;
    }

    const days = [];
    const startOfMonth = moment({ year: selectedYear, month: selectedMonth }).startOf('month');
    const daysInMonth = startOfMonth.daysInMonth();
    const startDay = startOfMonth.day();

    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="day empty" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = startOfMonth.clone().date(day);
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

  return (
    <div className="styled-calendar">
      <div className="calendar-header firstheader">
        <label className="label-selector">Ano:</label>
        <CustomSelect
          labelSelect="Todos"
          tamanho="w200h36"
          optionMargin="h36"
          options={[
            { label: "Todos", value: 0 },
            ...Array.from({ length: 10 }, (_, i) => ({
              label: (currentYear - 5 + i).toString(),
              value: currentYear - 5 + i,
            })),
          ]}
          onChange={(value) => handleYearChange(parseInt(value, 10))}
        />
      </div>

        <div className="calendar-header secondheader">
          <label className="label-selector">Mês:</label>
          <CustomSelect
            labelSelect="Selecione o mês"
            tamanho="w200h36"
            optionMargin="h36"
            value={selectedMonth !== null ? selectedMonth : ""}
            options={[
              { label: "Selecione o mês", value: null },
              ...moment.months().map((month, index) => ({
                label: month,
                value: index,
              })),
            ]}
            onChange={(value) => handleMonthChange(parseInt(value, 10))}

          />
        </div>


      {selectedMonth !== null && !isNaN(selectedMonth) && (
        <div className="calendar-body">
          <div className="calendar-weekdays">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
              <div key={day} className="weekday">{day}</div>
            ))}
          </div>
          <div className="calendar-days">{renderDays()}</div>
        </div>
      )}
    </div>
  );
};

export default Calendary;
