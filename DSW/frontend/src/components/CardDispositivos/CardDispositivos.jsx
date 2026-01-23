import React, { useState } from 'react';
import './styles.css'; 
import { Tooltip } from 'antd';


export default function CardComputador({tipo, patrimonio, modelo, status, data, onClickDeletar, onClickEditar, onClickCard }) {
    const handleCardClick = (e) => {
        if (e.target.closest('.card-disp-actions-buttons')) return;
        onClickCard();
    };
    return (
        
                <div className="card-dispositivos" onClick={handleCardClick}>
                    <p className="text-disp-tipo">
                        <b>Tipo:</b> {tipo}
                    </p>
                    <p className="text-disp-patrimonio">
                        <b>Patrimônio:</b> {patrimonio} 
                    </p>
                    <p className="text-disp-modelo">
                        <b>Marca/Modelo:</b> {modelo}
                    </p>
                    <p className="text-disp-status">
                        <b>Status:</b> {status}
                    </p>
                    <p className="text-disp-data">
                        <b>Data de Verificação:</b><br/>
                        {data}
                    </p>
                    <div className="card-disp-actions-buttons">
                        <Tooltip title='Editar'>
                            <button className="tam3424 blue" onClick={onClickEditar}>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_314_2914)">
                                    <path d="M11.47 0.529055C11.1301 0.189653 10.6694 -0.000976562 10.189 -0.000976562C9.70864 -0.000976562 9.24792 0.189653 8.908 0.529055L0 9.43705V11.9991H2.562L11.47 3.09105C11.8093 2.75107 11.9998 2.29037 11.9998 1.81006C11.9998 1.32974 11.8093 0.869043 11.47 0.529055V0.529055ZM2.15 10.9991H1V9.84906L7.655 3.19905L8.805 4.34905L2.15 10.9991ZM10.763 2.38405L9.5095 3.63755L8.362 2.48756L9.615 1.23606C9.7675 1.08356 9.97433 0.997882 10.19 0.997882C10.4057 0.997882 10.6125 1.08356 10.765 1.23606C10.9175 1.38855 11.0032 1.59539 11.0032 1.81106C11.0032 2.02672 10.9175 2.23356 10.765 2.38605L10.763 2.38405Z" fill="white"/>
                                    </g>
                                    <defs>
                                    <clipPath id="clip0_314_2914">
                                    <rect width="12" height="12" fill="white"/>
                                    </clipPath>
                                    </defs>
                                </svg>
                            </button>
                        </Tooltip>
                        <Tooltip title='Deletar'>
                            <button className="tam3424 red" onClick={onClickDeletar}>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_314_2937)">
                                    <path d="M11.5 1.5H9V1.25C9 0.918479 8.8683 0.600537 8.63388 0.366117C8.39946 0.131696 8.08152 0 7.75 0L4.25 0C3.91848 0 3.60054 0.131696 3.36612 0.366117C3.1317 0.600537 3 0.918479 3 1.25V1.5H0.5V3H1.5V10.5C1.5 10.8978 1.65804 11.2794 1.93934 11.5607C2.22064 11.842 2.60218 12 3 12H9C9.39782 12 9.77936 11.842 10.0607 11.5607C10.342 11.2794 10.5 10.8978 10.5 10.5V3H11.5V1.5ZM9 10.5H3V3H9V10.5Z" fill="white"/>
                                    <path d="M5.5 4.5H4V9H5.5V4.5Z" fill="white"/>
                                    <path d="M8 4.5H6.5V9H8V4.5Z" fill="white"/>
                                    </g>
                                    <defs>
                                    <clipPath id="clip0_314_2937">
                                    <rect width="12" height="12" fill="white"/>
                                    </clipPath>
                                    </defs>
                                </svg>
                            </button>
                         </Tooltip>
                    </div>
                </div>
            
    );
}


