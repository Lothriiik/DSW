import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Laboratories.module.css';
import Sidebar from '../../Components/Sidebar';
import CardLECC from '../../components/CardLECC';

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return '';
};

function Laboratories() {
  const [laboratorios, setLaboratorios] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3

  useEffect(() => {
    const fetchData = async () => {
        try {
            const csrfToken = getCookie('csrftoken');
            const response = await axios.get(`http://127.0.0.1:8000/api/lab-list/`, {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                  'X-CSRFToken': csrfToken,
              }
          });
            console.log(response)
            setLaboratorios(response.data.Laboratorio);
            console.log("Laboratorios recebidos:", response.data.Laboratorio); 
        } catch (error) {
            console.error("Erro ao carregar Laboratorios:", error);
            setError('Erro ao carregar Laboratorios');
        }
    };
    fetchData();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = laboratorios.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(laboratorios.length / itemsPerPage);

    return (
        <main className={styles.Laboratories}>
            <section className={styles['principal']}>
                <Sidebar/>
                <div className={styles['form-container']}>
                    {currentItems.map((laboratorios => {
                      return 
                      <CardLECC 
                        sala={laboratorios.sala_ou_bloco}
                        lab={laboratorios.nome}
                      />
                    }))}
                </div>
                
            </section>
        </main>
    );
}
export default Laboratories;