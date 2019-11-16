import React, { useEffect, useState } from 'react';

import Modal from '../../components/Layout/Modal';
import axios from '../../services/axios';
import classes from './styles.module.css';

export default function Ranking(){

    const [ modal, setModal ] = useState({
        status: true,
        message: '',
        loading: true,
    });
    const [ rankingData, setRankingData ] = useState(null);

    useEffect(() => {
        axios.get('/ranking.json')
            .then(res => {
                setRankingData(sortRanking(Object.keys(res.data).map(key => res.data[key])));
                closeModal();
            })
            .catch(err => setModal({
                status: true,
                message: 'Erro ao carregar ranking!',
                loading: false,
            }));
    }, []);

    const closeModal = () => {
        return setModal({
            status: false,
            message: ',',
            loading: false,
        });
    }

    const sortRanking = (rank) => {
        for(let i = 1; i < rank.length; i++){
            let j = i - 1;
            let aux = rank[i];
            while(j >= 0 && rank[j].score < aux.score){
                rank[j + 1] = rank[j];
                j--;
            }
            rank[j + 1] = aux;
        }
        return rank;
    }

    return (
        <div className={classes.MainDiv}>
            <Modal show={modal.status} Loading={modal.loading} Message={modal.message} closeModal={closeModal}/>
            <h1>Ranking</h1>
            <table>
                <thead>
                    <tr>
                        <td>Classificação</td>
                        <td>Nome</td>
                        <td>Pontuação</td>
                        <td>Tamanho do Mapa</td>
                    </tr>
                </thead>
                <tbody>
                {rankingData && rankingData.map((r, i) => (
                    <tr key={i}>
                        <td>{i+1}</td>
                        <td>{r.username}</td>
                        <td>{r.score}</td>
                        <td>{r.mapSize}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}