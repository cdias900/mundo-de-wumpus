// Área de importação dos componentes que serão utilizados na renderização em tela
import React, { useEffect, useState } from 'react';
import AdSense from 'react-adsense';

import Modal from '../../components/Layout/Modal';
import axios from '../../services/axios';
import classes from './styles.module.css';
//

export default function Ranking(){

    // Define as variáveis que serão utilizadas para alterar os objetos renderizados na tela
    const [ modal, setModal ] = useState({
        status: true,
        message: '',
        loading: true,
    }); // Tela de carregamento/avisos
    const [ rankingData, setRankingData ] = useState(null); // Dados do ranking armazenados localmente
    const [ visibleRanking, setVisibleRanking ] = useState(null); // Dados do ranking que são exibidos em tela
    const [ selectedValue, setSelectedValue ] = useState(''); // Tamanho do mapa selecionado pelo usuário, para filtrar a busca
    //

    useEffect(() => { // Função que é sempre que a página carrega
        axios.get('/ranking.json') // Busca as informações do ranking salvas no banco de dados
            .then(res => { // Caso as informações sejam encontradas
                const sortedRanking = sortRanking(Object.keys(res.data).map(key => res.data[key])); // Transforma o objeto recebido em uma Array
                setRankingData(sortedRanking); // Atualiza as informações do ranking salvas localmente
                setVisibleRanking(sortedRanking); // Atualiza as informações do ranking que são exibidas na tela
                closeModal(); // Fecha a tela de carregamento
            })
            .catch(err => setModal({ // Caso as informações não sejam encontradas
                status: true,
                message: 'Erro ao carregar ranking!',
                loading: false,
            })); // Mostra uma mensagem de erro ao usuário
    }, []);

    const closeModal = () => { // Fecha a tela de carregamento
        return setModal({
            status: false,
            message: ',',
            loading: false,
        });
    }

    const sortRanking = (r) => { // Ordena as posições do ranking em ordem de pontuação decrescente
        const rank = [...r];
        for(let i = 1; i < rank.length; i++){ // Ordena utilizando um insertion sort
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

    const handleSelectedValueChanged = e => { // Atualiza o tamanho do mapa selecionado pelo usuário e filtra os elementos mostrados em tela utilizando esse valor selecionado
        setSelectedValue(e.target.value);
        filterRanking(rankingData, +e.target.value);
    }

    const filterRanking = (r, mapSize) => { // Atualiza os dados do ranking renderizados em tela para conterem apenas as posições que possuem o tamanho do mapa selecionado
        const rank = r ? [...r] : [];
        return setVisibleRanking(mapSize !== 0 ? rank.filter(pos => pos.mapSize === mapSize) : rank);
    }

    const options = []; // Array de opções de tamanho do mapa
    for(let i = 3; i < 16; i++){ // Os tamanhos vão de 3 a 15
        options.push(i); // Adiciona a posição na Array
    }

    //Renderiza o conteúdo em tela
    return (
        <>
            <div className={classes.MainDiv}>
                <Modal show={modal.status} Loading={modal.loading} Message={modal.message} closeModal={closeModal}/>
                <h1>Ranking</h1>
                <p>Tamanho do mapa:</p>
                <select onChange={handleSelectedValueChanged} value={selectedValue} style={{marginBottom: 10, width: 120}}>
                    <option value="">Qualquer</option>
                    {options.map(opt => <option value={opt} key={opt}>{opt}</option>)}
                </select>
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
                    {visibleRanking && visibleRanking.map((r, i) => (
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
            <div
            style={{
            width: '100%',
            }}
            >
                <AdSense.Google
                client="ca-pub-4408046485122960"
                slot="3869776338"
                style={{ display: 'block' }}
                format="auto"
                responsive="true"
                />
            </div>
        </>
    );
}