
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


const HomeAlmoxADM = () => {


  return(
    <body class="body">
      <main class="container">


        <CustomInput label="Nome" placeholder="Digite o Nome" className="input-field" />
        <CustomButton label="Negar" className="red size108" />
        <CustomButton label="Salvar" className="blue size108" />
        <CustomButton label="Confirmar" className="blue size138" />
        <CustomButton label="Confirmar" className="bordergray size108" />
        <CustomButton label="Confirmar" className="borderred size147" />
        <CircleButton iconType="add" />
        <CircleButton iconType="calendar" />


      </main>
      <Calendary/>
      <CardRelatorioPC lab="Lecc 1" especificacao="Professor"/>
      
      
    </body>
);
}

export default HomeAlmoxADM;
