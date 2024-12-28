import React, { useEffect, useState } from 'react';
import { socketUrl } from '../../config/configApi';
import { io } from 'socket.io-client';
import { Container, ChatBox, LoginForm, Input, Select, 
  Button, Message, MessageReceived, MessageFormContainer, MensageContainer, Background, ConteudoMsg } from './styles';
import { api } from '../../config/configApi';
import ScrollToBottom from 'react-scroll-to-bottom'; 

let socket;
const Home = () => {
  const [logado, setLogado] = useState(false);
  const [nome, setNome] = useState('');
  const [idUser, setIdUser] = useState('');
  const [email, setEmail] = useState('');
  const [sala, setSala] = useState('');

  const [mensagem, setMensagem] = useState('');
  const [listaMensagens, setListaMensagens] = useState([]);

  const [status , setStatus] = useState({
    type: "",
    mensagem: ""
  });

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
    await api.post('/login', { email }, { headers })
    .then((response) => {
      console.log(response.data.mensagem);
      setNome(response.data.usuario.nome);
      setIdUser(response.data.usuario.id);
      setLogado(true);
      socket.emit("conectar_a_sala", sala);
      listarMensagens();
      setStatus({ type: '', mensagem: '' }); // Limpar qualquer mensagem de erro
    }).catch((error) => {
      setStatus({ 
        type: 'error', 
        mensagem: 'Erro: E-mail incorreto!' });
      console.log(error);
    });
  };

  const listarMensagens = async () => {
    await api.get('/listar-mensagens/' + sala)
    .then((response) => {
      console.log(response.data.mensagens);
      setListaMensagens(response.data.mensagens);
    }).catch((erro) => {
      setStatus({ 
        type: 'error', 
        mensagem: 'Erro ao listar mensagens. Tente novamente mais tarde.' });
      console.log(erro);
    });
  };

  const enviarMensagem = async (e) => {
    e.preventDefault();
    console.log("Mensagem Enviada: " + mensagem);
    const conteudoMensagem = {
      sala,
      conteudo: {
        mensagem,
        usuario: {
          id: idUser,
          nome
        }
      }
    };
    console.log(conteudoMensagem);
    await socket.emit("enviar_mensagem", conteudoMensagem, (erro) => {
      if (erro) {
        setStatus({ 
          type: 'error', 
          mensagem: 'Erro ao enviar mensagem. Tente novamente mais tarde.' });
        console.log(erro);
      } else {
        setListaMensagens([...listaMensagens, conteudoMensagem.conteudo]);
        setMensagem("");
        setStatus({ type: '', mensagem: '' }); 
      }
    });
  };

  return (
    <Container>
      <Background>
        {!logado ? 
          <LoginForm onSubmit={conectarSala}>
            <h1>Entrar</h1>
            {status.type === 'error' && <p style={{ color: 'red' }}>{status.mensagem}</p>}
            <label>Email:</label>
            <Input type="text" placeholder="E-mail" value={email} 
            onChange={(e) => setEmail(e.target.value)} />

            <label>Sala:</label>
            <Select name='sala' 
            value={sala} 
            onChange={(e) => setSala(e.target.value)}>
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
            <ScrollToBottom className='scrollMsg'>
              <MensageContainer>
                {listaMensagens.map((msg, key) => {
                  return (
                    msg.usuario && idUser === msg.usuario.id ? 
                    <Message key={key}>
                      <strong>{msg.usuario.nome}:</strong>
                      <span>{msg.mensagem}</span>
                    </Message> :
                    msg.usuario ?
                    <MessageReceived key={key}>
                      <ConteudoMsg>
                        <strong>{msg.usuario.nome}:</strong>
                        <span>{msg.mensagem}</span>
                      </ConteudoMsg>
                    </MessageReceived> : null
                  );
                })}
              </MensageContainer>
            </ScrollToBottom>
            <MessageFormContainer onSubmit={enviarMensagem}>
              <Input type='text' 
                name="mensagem" 
                placeholder=" Enviar Mensagem!" 
                value={mensagem} 
                onChange={(e) => setMensagem(e.target.value)} />
              <Button >Enviar</Button>
            </MessageFormContainer>
          </ChatBox>
        }
      </Background>
    </Container>
  );
};

export default Home;
