import React from 'react';
import styles from './Options.module.css';

function Options() {
    return(
        <main className={styles.Options}>
            <section className={styles['classe-principal']}>
                <form className={styles['form-container']}>
                    <header>
                        <h1 className={styles['form-titulo']}>Opções de Formularios</h1> 
                    </header>

                    <a className={styles['form-link']} href='/machines' rel='noopener noreferrer'>Formulario para Máquinas</a>  

                    <a className={styles['form-link']} href='/infraatructure' rel='noopener noreferrer'>Formulario para Infraestrutura</a> 

                    <a className={styles['form-link']} href='/feedback' rel='noopener noreferrer'>Feedback</a>   
                </form>
            </section>
        </main>

        
    );

}
export default Options;