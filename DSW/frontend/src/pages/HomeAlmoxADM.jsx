
import CustomButton from '../components/CustomButton'
import CircleButton from '../components/CircleButton'
import CustomInput from '../components/CustomInput'
import PopUpConfirm from '../components/PopUpConfirm';
import PopUpDelete from "../components/PopUpDelete"
import PopUpSucess from "../components/PopUpSucess"
import CardLECC from '../components/CardLECC';
import CardDispositivos from '../components/CardDispositivos';
import CardComputador from '../components/CardComputador';
import CardRelatorioPC from '../components/CardRelatorio';
import Calendary from '../components/Calendary';
import React, { useState } from 'react';
import LabCreatePopUp from '../components/LabCreatePopUp'
import CustomSelect from '../components/CustomSelect';


const HomeAlmoxADM = () => {

  const handleDateSelect = (formattedDate) => {
    console.log('Data selecionada:', formattedDate); 
  };


  return(
    <body class="body">
      <main class="container">

        <CustomInput label="Nome" placeholder="Digite o Nome" className="input-field320" />
        <CustomButton label="Negar" className="red size108" />
        <CustomButton label="Salvar" className="blue size108" />
        <CustomButton label="Confirmar" className="blue size138" />
        <CustomButton label="Confirmar" className="bordergray size108" />
        <CustomButton label="Confirmar" className="borderred size147" />
        <CircleButton iconType="add" />
        <CircleButton iconType="calendar" />
        <CustomSelect 
            label="Ano" 
            labelSelect="Selecione o Ano"
            options={[
                { label: "2020", value: "2020" },
                { label: "2021", value: "2021" },
                { label: "2022", value: "2022" },
            ]}
        />

      </main>
      <CardDispositivos
      tipo='Computador' 
      patrimonio='211110' 
      modelo='Lenovo' 
      status='Funcionando' 
      data='13/01/2004'
      />

      <CardComputador
      tipo='Computador' 
      patrimonio='211110' 
      descrisao='Pc 1' 
      status='Funcionando' 
      data='13/01/2004'
      />
      <Calendary onDateSelect={handleDateSelect} />
      <LabCreatePopUp/>

      
      
    </body>
);
}

export default HomeAlmoxADM;
