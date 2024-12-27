import React, { useEffect, useState } from 'react';
import { socketUrl } from '../../config/configApi';
import { io } from 'socket.io-client';
import { Container, ChatBox, LoginForm, Input, Select, 
  Button, Message, MessageReceived, MessageFormContainer, MessageContainer, Background, ConteudoMsg } from './styles';
import { api } from '../../config/configApi';
let socket;
const Home = () => {
  const [logado, setLogado] = useState(false);
  const [nome, setNome] = useState('');
  const [idUser, setIdUser] = useState('');
  const [email, setEmail] = useState('');
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
  }, [listaMensagens]);

  const conectarSala = async (e) => {
    e.preventDefault();
    const headers = {
      'Content-Type': 'application/json'
    };
    await api.post('/login', { email}, { headers })
    .then((response) => {
      console.log(response.data.mensagem);
      setNome(response.data.usuario.nome);
      setIdUser(response.data.usuario.id);
      setLogado(true);
      socket.emit("conectar_a_sala", sala);
     }).catch((error) => {
        console.log(error);
     });
  };

  const enviarMensagem = async (e) => {
    e.preventDefault();
    console.log("Mensagem Enviada: " + mensagem);
    const conteudoMensagem = {
      sala,
      conteudo: {
        mensagem,
        usuario:{
          id: idUser,
          nome
        }
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
          <LoginForm onSubmit={conectarSala}>
            <h1>Entrar</h1>
            <label>Email:</label>
            <Input type="text" placeholder="E-mail" value={email} 
            onChange={(e) => setEmail(e.target.value)} />

            <label>Sala:</label>
            <Select name='sala' value={sala} onChange={(e) => setSala(e.target.value)}>
              <option value=''>Selecione uma sala</option>
              <option value='1'>React.js</option>
              <option value='2'>Node.js</option>
              <option value='3'>React Native</option>
              <option value='4'>Python</option>
            </Select>
            <br />
            <Button>Entrar</Button>
          </LoginForm>
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
            <MessageFormContainer onSubmit={enviarMensagem}>
              <Input type='text' name="mensagem" placeholder=" Enviar Mensagem!" value={mensagem} onChange={(e) => setMensagem(e.target.value)} />
              <Button >Enviar</Button>
            </MessageFormContainer>
          </ChatBox>
        }
      </Background>
    </Container>
  );
};

export default Home;
