import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import style from './Machines.module.css';


function Machines() {
  const {register, handleSubmit, formState: { errors }, setValue, clearErrors} = useForm()
    const onSubmit = (data) => console.log(data)

  const [inputHardware, setInputHardware] =useState('');
  const [inputSoftware, setInputSoftware] = useState('');
  const [inputAdd, setInputAdd] = useState('');
  const hardware = useRef(null);
  const software = useRef(null); 
  const add = useRef(null); 

  const handleInputChange0 = (event) => {
    setInputHardware(event.target.value);
  };

  const handleInputChange1 = (event) => {
    setInputSoftware(event.target.value);
  };

  const handleInputChange2 = (event) => {
    setInputAdd(event.target.value);
  };

  useEffect(() => {
    if (hardware.current) {
      hardware.current.style.height = 'auto';
      hardware.current.style.height = `${hardware.current.scrollHeight}px`;
    }
  }, [inputHardware]);

  useEffect(() => {
    if (software.current) {
      software.current.style.height = 'auto';
      software.current.style.height = `${software.current.scrollHeight}px`;
    }
  }, [inputSoftware]);

  useEffect(() => {
    if (add.current) {
      add.current.style.height = 'auto';
      add.current.style.height = `${add.current.scrollHeight}px`;
    }
  }, [inputAdd]);


const [isActive, setIsActive] = useState(false); // Estado para controlar se o menu está ativo
const dropdownTextRef = useRef(null);
const optionsRef = useRef([]);

const [isActive1, setIsActive1] = useState(false);
const hardwareTextRef = useRef(null);
const optionsRef1 = useRef([]);

const [isActive2, setIsActive2] = useState(false);
const softwareTextRef = useRef(null);
const optionsRef2 = useRef([]);

const options = ['LECC 1', 'LECC 2', 'LECC 3'];
const options1 = ['SIM', 'NÃO'];
const options2 = ['SIM', 'NÃO'];

const handleOptionClick = (optionText) => {
  dropdownTextRef.current.innerText = optionText; // Atualiza o texto do botão
  setValue('selectedOption', optionText);
  clearErrors('selectedOption'); 
  setIsActive(false); // Fecha o menu ao selecionar uma opção
};

const handleHardwareClick = (optionText) => {
  hardwareTextRef.current.innerText = optionText;
  setValue('hardwareOption', optionText);
  clearErrors('hardwareOption'); 
  setIsActive1(false);
};

const handleSoftwareClick = (optionText) => {
  softwareTextRef.current.innerText = optionText;
  setValue('softwareOption', optionText);
  clearErrors('softwareOption'); 
  setIsActive2(false);
};


  return (
    <main className={style.Machines}>
      <section className={style["main"]}> 
        <form onSubmit={handleSubmit(onSubmit)} className={style["form"]}>
          <div className={`${style["dropdown-menu"]} ${isActive ? style["active"] : ""}`}>
            <label htmlFor="lecc" className={style["label"]}>Selecione o LECC</label>
            <div className={`${style["dropdown-select"]} ${errors.selectedOption ? style["dropdown-select-error"] : style["dropdown-select-normal"]}`} 
            onClick={() => setIsActive(!isActive)}>
                <span className={style["dropdown-text"]} ref={dropdownTextRef}>Selecione...</span>
                <i className={"bx bx-chevron-down"}></i>
            </div>

            <ul className={style["options"]}>
              {options.map((option, index) => (
                <li key={index} className={style["option"]} ref={(el) => optionsRef.current[index] = el} // Armazena a referência
                  onClick={() => handleOptionClick(option)}>
                  <span className={style["option-text"]}>{option}</span>
                </li>
              ))}
            </ul>
            <input type="hidden" id="selectedOption" {...register('selectedOption', { required: true })}/> 
            {errors.selectedOption && (<span className={style["error-message"]}>Por favor, selecione uma opção</span>)}
          </div>
          
          <div className={style["form-group"]}>
            <label htmlFor="numMaquina" className={style["label"]}>N° da máquina</label>
            <input type="text" id="numMaquina" className={`${style["input"]} ${errors.numMaquina ? style["input-error"] : style["input-normal"]}`} {...register('numMaquina', { required: true })}/>
            {errors.numMaquina && (<span className={style["error-message"]}>Número da máquina é obrigatório</span>
            )}
          </div>

          <div className={`${style["dropdown-menu"]} ${isActive1 ? style["active"] : ""}`}>
            <label htmlFor="lecc" className={style["label"]}>O hardware apresenta problemas?</label>
            <div className={`${style["dropdown-select"]} ${errors.hardwareOption ? style["dropdown-select-error"] : style["dropdown-select-normal"]}`} 
            onClick={() => setIsActive1(!isActive1)}>
                <span className={style["dropdown-text"]} ref={hardwareTextRef}>Selecione...</span>
                <i className={"bx bx-chevron-down"}></i>
            </div>

            <ul className={style["options"]}>
              {options1.map((option, index) => (
                <li key={index} className={style["option"]} ref={(el) => optionsRef1.current[index] = el}
                  onClick={() => handleHardwareClick(option)}>
                  <span className={style["option-text"]}>{option}</span>
                </li>
              ))}
            </ul>
            <input type="hidden" id="hardwareOption" {...register('hardwareOption', { required: true })}/> 
            {errors.hardwareOption && (<span className={style["error-message"]}>Por favor, selecione uma opção</span>)}
          </div>

          <div className={style["form-group"]}>
            <label htmlFor="hardwareResp" className={style["label"]}>Descreva com detalhes o problema se escolheu a opção "Sim" na resposta anterior</label>
            <textarea  className={style["textarea"]} id="hardwareResp" name="hardwareResp" {...register('hardwareResp')}
              ref={(e) => { hardware.current = e; register('hardwareResp').ref(e);}}
              value={inputHardware} onChange={handleInputChange0}/>
          </div>

          <div className={`${style["dropdown-menu"]} ${isActive2 ? style["active"] : ""}`}>
            <label htmlFor="lecc" className={style["label"]}>O software apresenta problemas?</label>
            <div className={`${style["dropdown-select"]} ${errors.softwareOption ? style["dropdown-select-error"] : style["dropdown-select-normal"]}`} 
            onClick={() => setIsActive2(!isActive2)}>
                <span className={style["dropdown-text"]} ref={softwareTextRef}>Selecione...</span>
                <i className={"bx bx-chevron-down"}></i>
            </div>

            <ul className={style["options"]}>
              {options2.map((option, index) => (
                <li key={index} className={style["option"]} ref={(el) => optionsRef2.current[index] = el}
                  onClick={() => handleSoftwareClick(option)}>
                  <span className={style["option-text"]}>{option}</span>
                </li>
              ))}
            </ul>
            <input type="hidden" id="softwareOption" {...register('softwareOption', { required: true })}/> 
            {errors.softwareOption && (<span className={style["error-message"]}>Por favor, selecione uma opção</span>)}
          </div>

          <div className={style["form-group"]}>
            <label htmlFor="softwareResp" className={style["label"]}>Descreva com detalhes o problema se escolheu a opção "Sim" na resposta anterior</label>
            <textarea className={style["textarea"]} id="softwareResp" name="softwareResp"
              {...register('softwareResp')}  ref={(e) => { software.current = e; register('softwareResp').ref(e); }}
              value={inputSoftware}
              onChange={handleInputChange1}
            />
          </div>

          <div className={style["form-group"]}>
            <label htmlFor="addResp" className={style["label"]}>Forneça quaisquer comentários adicionais...</label>
            <textarea className={style["textarea"]} id="addResp" name="addResp"
              {...register('addResp')} ref={(e) => { add.current = e; register('addResp').ref(e);}}
              value={inputAdd}
              onChange={handleInputChange2}
            />
          </div>

          <div className={style["button-container"]}>
            <button type="submit" className={style["button"]}>Enviar</button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default Machines;