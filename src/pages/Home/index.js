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
  const [salas, setSalas] = useState([]);

  const [mensagem, setMensagem] = useState('');
  const [listaMensagens, setListaMensagens] = useState([]);

  const [status , setStatus] = useState({
    type: "",
    mensagem: ""
  });

  useEffect(() => {
    socket = io(socketUrl);
    socket.on('connect', () => {
      console.log('Connected to socket server');
    });
    listarSala();
  }, []);

  useEffect(() => {
    socket.on("receber_mensagem", (dados) => {
      console.log("Mensagem Recebida: " + dados);
      setListaMensagens([...listaMensagens, dados]);
    });
  }, [listaMensagens]);

  const listarSala = async () => {
    await api.get('/listar-salas')
    .then((response) => {
      console.log(response.data);
      setSalas(response.data.salas);
    }).catch((erro) => {
      if (erro.response) {
        setStatus({
          type: 'error',
          mensagem: erro.response.data.mensagem
        });
      } else {
        setStatus({
          erro: 'error',
          mensagem: 'Erro tente novamente mais tarde!'
        });
      }
    });
  }

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
      setStatus({ type: '', mensagem: '' });
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
    socket.emit("enviar_mensagem", conteudoMensagem, (erro) => {
      if (erro) {
        setStatus({ 
          type: 'error', 
          mensagem: 'Erro ao enviar mensagem. Tente novamente mais tarde.' });
        console.log(erro);
      } else {
        setListaMensagens((prevMensagens) => [...prevMensagens, conteudoMensagem.conteudo]);
        setMensagem("");
        setStatus({ type: '', mensagem: '' }); 
      }
    });
    setListaMensagens((prevMensagens) => [...prevMensagens, conteudoMensagem.conteudo]);
    setMensagem(""); 
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
            <Select 
              name='sala' 
              value={sala} 
              onChange={(e) => setSala(e.target.value)}
            >
              <option value=''>Selecione uma sala</option>
              {salas.map((sala) => (
                <option value={sala.id} key={sala.id}>{sala.nome}</option>
              ))}
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
              <Input 
                type='text' 
                name="mensagem" 
                placeholder="Enviar Mensagem!" 
                value={mensagem} 
                onChange={(e) => setMensagem(e.target.value)} 
              />
              <Button>Enviar</Button>
            </MessageFormContainer>
          </ChatBox>
        }
      </Background>
    </Container>
  );
};

export default Home;
