import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import style from './Ingrastructure.module.css';
import Header from '../../../Components/Header';

function Ingrastructure() {
    const {register, handleSubmit, formState: {errors}, setValue, clearErrors} = useForm()
    const [formEnviado, setFormEnviado] = useState(false); // Estado para controlar a mensagem de sucesso

    const onSubmit = (data) => {
        console.log(data);
        setFormEnviado(true); // Exibe a mensagem após envio

        setTimeout(() => {
        setFormEnviado(false); // Esconde a mensagem após 4 segundos
        window.location.reload(); // Recarrega a página
        }, 4000);
    };

    const [inputInfraestrutura, setInputInfraestrutura] = useState('');
    const [inputAdd, setInputAdd] = useState('');
    const infraestrutura = useRef(null); 
    const add = useRef(null); 

    const handleInputChange1 = (event) => {
        setInputInfraestrutura(event.target.value);
        clearErrors('respInfraestrutura');
    };

    const handleInputChange2 = (event) => {
        setInputAdd(event.target.value);
    };

    useEffect(() => {
        if (infraestrutura.current) {
        infraestrutura.current.style.height = 'auto';
        infraestrutura.current.style.height = `${infraestrutura.current.scrollHeight}px`;
        }
    }, [inputInfraestrutura]);

    useEffect(() => {
        if (add.current) {
        add.current.style.height = 'auto';
        add.current.style.height = `${add.current.scrollHeight}px`;
        }
    }, [inputAdd]);

    const [isActive, setIsActive] = useState(false); // Estado para controlar se o menu está ativo
    const dropdownTextRef = useRef(null);
    const optionsRef = useRef([]);
    const options = ['LECC 1', 'LECC 2', 'LECC 3'];

    const handleOptionClick = (optionText) => {
    dropdownTextRef.current.innerText = optionText; // Atualiza o texto
    setValue('ingrastructureOption', optionText);
    clearErrors('ingrastructureOption'); 
    setIsActive(false); // Fecha o menu ao selecionar uma opção
    };


    return(
        <main className={style.Ingrastructure}>
            <section className={style["main"]}>
                <Header/>
                <form onSubmit={handleSubmit(onSubmit)} className={style["form"]}>
                    <div className={style["conteiner"]}>
                        <div className={style["conteiner01"]}>
                            <div className={`${style["dropdown-menu"]} ${isActive ? style["active"] : ""}`}>
                                <label htmlFor="lecc" className={style["label"]}>Selecione o LECC</label>
                                <div className={`${style["dropdown-select"]} ${errors.ingrastructureOption ? style["dropdown-select-error"] : style["dropdown-select-normal"]}`}  
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
                                <input type="hidden" id="ingrastructureOption" {...register('ingrastructureOption', { required: true })}/> 
                                {errors.ingrastructureOption && (<span className={style["error-message"]}>Por favor, selecione uma opção</span>)}
                            </div>

                            <div className={style["form-group"]}>
                                <label htmlFor='respInfraestrutura' className={style["label"]}>Descreva com detalhes o problema</label>
                                <textarea className={`${style["textarea"]} ${errors.respInfraestrutura ? style["textarea-error"] : style["textarea-normal"]}`} 
                                id="respInfraestrutura" name='respInfraestrutura'
                                {...register('respInfraestrutura', {required: true})} ref={(e) => {infraestrutura.current = e; register('respInfraestrutura').ref(e);}} 
                                value={inputInfraestrutura } onChange={handleInputChange1}/>
                                {errors.respInfraestrutura && <span className={style["error-message"]}>Campo obrigatório</span>}
                            </div>
                        </div>

                        <div className={style["conteiner02"]}>
                            <div className={style["form-group"]}>
                                <label htmlFor='adicional' className={style["label01"]}>Forneça quaisquer comentários adicionais...</label>
                                <textarea className={style["textarea"]} id="respAdd" name='respAdd'
                                {...register('respAdd')} ref={(e) => {add.current = e; register('respAdd').ref(e);}}
                                value={inputAdd} onChange={handleInputChange2 }/>
                            </div>
                        </div>
                    </div>
                    
                    <div className={style["button-container"]}>
                        {formEnviado && <p className={style["success-message"]}>Formulário enviado!</p>}
                        <button type="submit" className={style["button"]}>Enviar</button>
                    </div>
                    
                </form>
                
            </section>
        </main>
    );

}
export default Ingrastructure;