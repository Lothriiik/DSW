import React from 'react';
import styles from './Options.module.css';
import Header from '../../../Components/Header';
import { Link } from 'react-router-dom';

function Options() {
    return(
        <main className={styles.Options}>
            <section className={styles['classe-principal']}>
                <Header/>
                <form className={styles['form-container']}>
                    <h1 className={styles['form-titulo']}>Opções de Formulários</h1>
                    <div className={styles['formularios']}>
                        <Link to="/machines" className={styles['form-link']}>Máquina</Link>
                        <Link to="/infraatructure" className={styles['form-link']}>Infraestrutura</Link>
                        <Link to="/feedback" className={styles['form-link']}>Feedback</Link>
                    </div> 
                </form>
            </section>
        </main>

        
    );

}
export default Options;