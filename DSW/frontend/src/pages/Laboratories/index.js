import React from 'react';
import styles from './Laboratories.module.css';
import Header from '../../Components/Header';

function Laboratories() {
    return (
        <main className={styles.Laboratories}>
            <section className={styles['principal']}>
                <Header/>
                <form className={styles['form-container']}>
                    <h1>Tela principal(Laboratórios)</h1>   
                </form>
                
            </section>
        </main>
    );
}
export default Laboratories;