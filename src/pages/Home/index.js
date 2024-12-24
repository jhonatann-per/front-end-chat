import React, { useEffect, useState } from 'react';
import { socketUrl } from '../../config/configApi';
import { io } from 'socket.io-client';
import { Container, ChatBox, LoginBox, Input, Select, Button, Message, MessageReceived, MessageInputContainer, MessageContainer, Background, ConteudoMsg } from './styles';

let socket;
const Home = () => {
  const [logado, setLogado] = useState(false);
  const [nome, setNome] = useState('');
  const [sala, setSala] = useState('');

  const [mensagem, setMensagem] = useState('');
  const [listaMensagens, setListaMensagens] = useState([]);

  useEffect(() => {
    socket = io(socketUrl);
  }, []);

  useEffect(() => {
    socket.on("receber_mensagem", (dados) => {
      console.log("Mensagem Recebida: " + dados);
      setListaMensagens([...listaMensagens, dados]);
    });
  });

  const conectarSala = () => {
    console.log(nome + " Está Conectado a Sala " + sala);
    setLogado(true);
    socket.emit("conectar_a_sala", sala);
  };

  const enviarMensagem = async () => {
    console.log("Mensagem Enviada: " + mensagem);
    const conteudoMensagem = {
      sala: sala,
      conteudo: {
        nome,
        mensagem
      }
    };
    console.log(conteudoMensagem);

    await socket.emit("enviar_mensagem", conteudoMensagem);
    setListaMensagens([...listaMensagens, conteudoMensagem.conteudo]);
    setMensagem("");
  };

  return (
    <Container>
      <Background>
        {!logado ? 
          <LoginBox>
            <h1>Entrar</h1>
            <label>Nome:</label>
            <Input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />

            <label>Sala:</label>
            <Select name='sala' value={sala} onChange={(e) => setSala(e.target.value)}>
              <option value=''>Selecione uma sala</option>
              <option value='1'>React.js</option>
              <option value='2'>Node.js</option>
              <option value='3'>React Native</option>
              <option value='4'>Python</option>
            </Select>
            <br />

            <Button onClick={conectarSala}>Entrar</Button>
          </LoginBox>
          : 
          <ChatBox>
            <MessageContainer>
              {listaMensagens.map((msg, key) => {
                return (
                  msg.nome === nome ? 
                  <Message key={key}>
                    <strong>{msg.nome}:</strong>
                    <span>{msg.mensagem}</span>
                  </Message> :
                  <MessageReceived key={key}>
                    <ConteudoMsg>
                      <strong>{msg.nome}:</strong>
                      <span>{msg.mensagem}</span>
                    </ConteudoMsg>
                    
                  </MessageReceived>
                );
              })}
            </MessageContainer>
            <MessageInputContainer>
              <Input type='text' name="mensagem" placeholder=" Enviar Mensagem!" value={mensagem} onChange={(e) => setMensagem(e.target.value)} />
              <Button onClick={enviarMensagem}>Enviar</Button>
            </MessageInputContainer>
          </ChatBox>
        }
      </Background>
    </Container>
  );
};

export default Home;
