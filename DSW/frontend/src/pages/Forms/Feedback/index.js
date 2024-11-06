import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import style from './Feedback.module.css'
import Header from '../../../Components/Header';

function Feedback() {
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

    const [inputFeedback, setInputFeedback] = useState('');
    const [inputIdeia, setInputIdeia] = useState('');
    const feedback = useRef(null); 
    const ideia = useRef(null); 

    const handleInputChange1 = (event) => {
        setInputFeedback(event.target.value);
    };

    const handleInputChange2 = (event) => {
        setInputIdeia(event.target.value);
    };

    useEffect(() => {
        if (feedback.current) {
        feedback.current.style.height = 'auto';
       feedback.current.style.height = `${feedback.current.scrollHeight}px`;
        }
    }, [inputFeedback]);

    useEffect(() => {
        if (ideia.current) {
        ideia.current.style.height = 'auto';
        ideia.current.style.height = `${ideia.current.scrollHeight}px`;
        }
    }, [inputIdeia]);

    const [isActive, setIsActive] = useState(false); // Estado para controlar se o menu está ativo
    const dropdownTextRef = useRef(null);
    const optionsRef = useRef([]);

    const [isActive1, setIsActive1] = useState(false);
    const dropdownTextRef1 = useRef(null);
    const optionsRef1 = useRef([]);

    const [isActive2, setIsActive2] = useState(false);
    const dropdownTextRef2 = useRef(null);
    const optionsRef2 = useRef([]);

    const options = ['SIM', 'NÃO'];
    const options1 = ['SIM', 'NÃO'];
    const options2 = ['SIM', 'NÃO'];

    const handleOptionClick = (optionText) => {
    dropdownTextRef.current.innerText = optionText; // Atualiza o texto
    setValue('requestLeccsOption', optionText);
    clearErrors('requestLeccsOption'); 
    setIsActive(false); // Fecha o menu ao selecionar uma opção
    };

    const handleHardwareClick = (optionText) => {
    dropdownTextRef1.current.innerText = optionText;
    setValue('repairLeccsOption', optionText);
    clearErrors('repairLeccsOption'); 
    setIsActive1(false);
    };

    const handleSoftwareClick = (optionText) => {
    dropdownTextRef2.current.innerText = optionText;
    setValue('suggestionOption', optionText);
    clearErrors('suggestionOption'); 
    setIsActive2(false);
    };


    return(
        <main className={style.Feedback}>
            <section className={style["main"]}>
                <Header/>
                <form onSubmit={handleSubmit(onSubmit)} className={style["form"]}>
                    <div className={style["conteiner"]}>
                        <div className={style["conteiner01"]}>
                            <div className={`${style["dropdown-menu"]} ${isActive ? style["active"] : ""}`}>
                                <label htmlFor="lecc" className={style["label"]}>Fez algum pedido de reparo?</label>
                                <div className={`${style["dropdown-select"]} ${errors.requestLeccsOption ? style["dropdown-select-error"] : style["dropdown-select-normal"]}`} 
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
                                <input type="hidden" id="requestLeccsOption" {...register('requestLeccsOption', { required: true })}/> 
                                {errors.requestLeccsOption && (<span className={style["error-message"]}>Por favor, selecione uma opção</span>)}
                            </div>

                            <div className={`${style["dropdown-menu"]} ${isActive1 ? style["active"] : ""}`}>
                                <label htmlFor="lecc" className={style["label"]}>O reparo foi realizado?</label>
                                <div className={`${style["dropdown-select"]} ${errors.repairLeccsOption ? style["dropdown-select-error"] : style["dropdown-select-normal"]}`} 
                                onClick={() => setIsActive1(!isActive1)}>
                                    <span className={style["dropdown-text"]} ref={dropdownTextRef1}>Selecione...</span>
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
                                <input type="hidden" id="repairLeccsOption" {...register('repairLeccsOption', { required: true })}/> 
                                {errors.repairLeccsOption && (<span className={style["error-message"]}>Por favor, selecione uma opção</span>)}
                            </div>

                            <div className={style["form-group"]}>
                                <label htmlFor='feedback' className={style["label"]}>Gostaria de deixar seu feedback...</label>
                                <textarea className={style["textarea"]} id="feedback" name='feedback' {...register('feedback')} 
                                ref={(e) => {feedback.current = e; register('feedback').ref(e);}}
                                value={inputFeedback} onChange={handleInputChange1}/>
                            </div>
                        </div>

                        <div className={style["conteiner02"]}>
                            <div className={`${style["dropdown-menu"]} ${isActive2 ? style["active"] : ""}`}>
                                <label htmlFor="lecc" className={style["label01"]}>Teria alguma ideia ou sugestão de melhoria?</label>
                                <div className={`${style["dropdown-select"]} ${errors.suggestionOption ? style["dropdown-select-error"] : style["dropdown-select-normal"]}`} 
                                onClick={() => setIsActive2(!isActive2)}>
                                    <span className={style["dropdown-text"]} ref={dropdownTextRef2}>Selecione...</span>
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
                                <input type="hidden" id="suggestionOption" {...register('suggestionOption', { required: true })}/> 
                                {errors.suggestionOption && (<span className={style["error-message"]}>Por favor, selecione uma opção</span>)}
                            </div>

                            <div className={style["form-group"]}>
                                <label htmlFor='ideia' className={style["label"]}>Poderia compartilhar com a gente...</label>
                                <textarea className={style["textarea"]} id="respIdeia" name='respIdeia'  {...register('respIdeia')} 
                                ref={(e) => {ideia.current = e; register('respIdeia').ref(e);}}
                                value={inputIdeia} onChange={handleInputChange2 }/>
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
    )

}
export default Feedback;