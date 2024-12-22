import React, {useEffect, useState} from 'react';
import { socketUrl } from '../../config/configApi';
import { io } from 'socket.io-client';

let socket;
const Home = () => {
  const [logado, setLogado] = useState(false);
  const [nome, setNome] = useState('');
  const [sala, setSala] = useState('');

  const [mensagem, setMensagem] = useState('');
  const [listaMensagens, setListaMensagens] = useState([]);


  useEffect(()=>{
    socket = io(socketUrl);
  },[]);

  useEffect(() => {
    socket.on("receber_mensagem", (dados) => {
      console.log("Mensagem Recebida: " + dados);
      setListaMensagens([...listaMensagens, dados]);
    });
  });

  const conectarSala = () => {
     console.log( nome + " Está Conectado a Sala " + sala);
     setLogado(true)
     socket.emit("conectar_a_sala", sala);
      }

  const enviarMensagem = async () => {
    console.log("Mensagem Enviada: " + mensagem);
    const conteudoMensagem = {
      sala: sala,
      conteudo:{
        nome,
        mensagem
      }
    }; 
    console.log(conteudoMensagem);

    await socket.emit("enviar_mensagem", conteudoMensagem)
    setListaMensagens([...listaMensagens, conteudoMensagem.conteudo]);
    setMensagem("");
  }


  return (
    <div>
      <h1>Home</h1>
      {!logado ? 
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

        <button onClick={conectarSala}>Entrar</button>
      </>
      : 
      <>
      {listaMensagens.map((msg, key) => {
        return (
          <div key={key}>
            <strong>{msg.nome}:</strong>
            <span>{msg.mensagem}</span>
          </div>
        )
      })}
      <input type='text' 
        name="mensagem" 
        placeholder="mensagem..." 
        value={mensagem}
        onChange={texto =>
      {
        setMensagem(texto.target.value)}}/>
        
        <button onClick={enviarMensagem}>Enviar</button>
      </>
      }
    </div>
  );
};

export default Home;
