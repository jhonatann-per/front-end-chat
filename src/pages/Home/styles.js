import styled from 'styled-components';
import bgImage from '../../assets/fundo.gif';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: url(${bgImage}) no-repeat center center/cover;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const LoginBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 450px;
  height: 450px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;

  h1 {
    margin-bottom: 20px;
  }
  @media (max-width: 1280px) {
    width: 30%; 
    height: 400px; 
    }
  @media (max-width: 1000px) {
    width: 38%; 
    height: 400px; 
    }
`;

export const ChatBox = styled.div`
  width: 40vw;
  height: 80vh;
  background-color: white;
  border: 5px double #ccc;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;

  @media (max-width: 1280px) {
    width: 50%;
    height: 650px; 
    } 
  @media (max-width: 1000px) {
    width: 50%; 
    height: 500px; 
    }
`;

export const MessageContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 10px;
`;

export const Input = styled.input`
  padding: 8px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
`;

export const Select = styled.select`
  padding: 8px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
`;

export const Button = styled.button`
  padding: 10px 15px;
  margin: 10px 0;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100px;
  align-self: flex-end;
`;

export const MessageInputContainer = styled.div`
  display: flex;
  gap: 10px;
`;

export const Message = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 10px 0;
  padding: 10px;
  background-color: #d4edda;
  border-radius: 4px;
  width: fit-content;
  align-self: flex-end;

  strong {
    margin-right: 5px;
  }

  span {
    word-break: break-word;
  }
`;

export const MessageReceived = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;

  strong {
    margin-right: 5px;
  }

  span {
    word-break: break-word;
  }
`;
export const ConteudoMsg = styled.div`
    border-radius: 4px;
    background-color: #f9c6a3;
    margin: 10px 0;
    padding: 10px;
`;
