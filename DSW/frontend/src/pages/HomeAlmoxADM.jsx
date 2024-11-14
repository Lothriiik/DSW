
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
import PopUpTableSoftware from '../components/PopUpTableSoftware';


const HomeAlmoxADM = () => {

  const handleDateSelect = (formattedDate) => {
    console.log('Data selecionada:', formattedDate); 
  };


  return(
    <body class="body">
      <LabCreatePopUp/>
      <PopUpTableSoftware idDispositivo='2'/>
      
      
    </body>
);
}

export default HomeAlmoxADM;
