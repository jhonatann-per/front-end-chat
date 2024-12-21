import React, {useEffect, useState} from 'react';
import { api } from '../../config/configApi';

const Home = () => {
  const [logado, setLogado] = useState(false);
  const [nome, setNome] = useState('');
  const [sala, setSala] = useState('');

  useEffect(() => {
      api.get('/').then((response) => {
        console.log(response.data);
      }) 
      .catch((error) => {
        console.log(error);
        });
      }, []);

      const conectar = async () => {
        console.log( nome + " Está Conectado a Sala " + sala);
      }


  return (
    <div>
      <h1>Home</h1>
      <p>{!logado ? 
      <>
        <label>Nome: </label>
        <input type="text" placeholder="Nome" value={nome} onChange={
          (text) => setNome(text.target.value)} 
        />

        <label>Sala: </label>
        <select name='sala' value={sala} onChange={text => setSala(text.target.value)}>
          <option value=''>Selecione uma sala</option>
          <option value='1'>React.js</option>
          <option value='2'>Node.js</option>
          <option value='3'>React Native</option>
          <option value='4'>Python</option>
        </select>
        <br/>

        <button onClick={conectar}>Entrar</button>
      </>
      : "logado"}</p>
    </div>
  );
};

export default Home;
