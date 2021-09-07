import React, { useState, useEffect } from "react";
import styled from "styled-components";
// import PropTypes fomr "prop-types";

const API_ENDPOINT =
  "https://student-json-api.lidemy.me/comments?_sort=createdAt&_order=desc&_limit=3";

//css styled elements
const Page = styled.div`
  width: 360px;
  margin: 0 auto;
  text-align: center;
  padding: 0 3% 2%;
`;
const Title = styled.h1`
  color: #333;
`;
const MessageForm = styled.form``;
const MessageNickname = styled.input`
  margin-bottom: 2%;
  width: 100%;
`;
const MessageTextArea = styled.textarea`
  display: block;
  width: 100%;
`;
const SubmitButton = styled.button`
  margin-top: 8px;
`;

const MessageList = styled.div`
  margin-top: 16px;
`;
const MessageContainer = styled.article`
  border: 1px solid black;
  padding: 8px 16px;
  border-radius: 8px;

  & + & {
    margin-top: 16px;
  }
`;
const MessageHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 5px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
`;
const MessageAuthor = styled.div``;
const MessageTime = styled.div`
  font-style: oblique;
`;
const MessageContent = styled.div`
  margin-top: 16px;
  font-size: 16px;
`;
const Loading = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function Message({ author, time, children }) {
  return (
    <MessageContainer>
      <MessageHead>
        <MessageAuthor>{author}</MessageAuthor>
        <MessageTime>{time}</MessageTime>
      </MessageHead>
      <MessageContent>{children}</MessageContent>
    </MessageContainer>
  );
}

const ErrorMessage = styled.div`
  border: 1px solid red;
  font-size: 1.5rem;
  margin: 4% auto;
`;

// Message.propTypes = {
//   author: PropTypes.string,
//   time: PropTypes.string,
//   children: PropTypes.node
// }

function App() {
  const [messages, setMessages] = useState([]);
  const [messageApiError, setMessageApiError] = useState(null);
  const [value, setValue] = useState();
  const [nickname, setNickname] = useState();
  const [postMessageError, setPostMessageError] = useState(null);
  const [isLoadingPostMessage, setIsLoadingPostMessage] = useState(false);

  const fetchMessages = () => {
    return fetch(API_ENDPOINT)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
      })
      .catch((err) => setMessageApiError(err.message));
  };

  const handleTextAreaChange = (e) => {
    setValue(e.target.value);
  };
  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };
  const handleFormFocus = () => {
    setPostMessageError(null);
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isLoadingPostMessage) {
      return;
    }
    setIsLoadingPostMessage(true);
    fetch("https://student-json-api.lidemy.me/comments", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        nickname: nickname,
        body: value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoadingPostMessage(false);
        if (data.ok === 0) {
          setPostMessageError(data.message);
          return;
        }
        setValue("");
        setNickname("");
        fetchMessages();
      })
      .catch((err) => {
        setIsLoadingPostMessage(false);
        setPostMessageError(err.message);
      });
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <Page>
      {isLoadingPostMessage && <Loading>Loading...</Loading>}
      <Title>Message Board</Title>
      <MessageForm onSubmit={handleFormSubmit}>
        <MessageNickname
          nickname={nickname}
          onChange={handleNicknameChange}
          placeholder={"nickname"}
          onFocus={handleFormFocus}
        />
        <MessageTextArea
          value={value}
          onChange={handleTextAreaChange}
          onFocus={handleFormFocus}
          rows={10}
          placeholder={"comment"}
        />
        <SubmitButton>send</SubmitButton>
        {postMessageError && <ErrorMessage>{postMessageError}</ErrorMessage>}
      </MessageForm>
      {messageApiError && (
        <ErrorMessage>
          something went wrong. {messageApiError.toString()}
        </ErrorMessage>
      )}
      <MessageList>
        {messages.map((message) => (
          <Message
            key={message.id}
            author={message.nickname}
            time={new Date(message.createdAt).toLocaleString()}
          >
            {message.body}
          </Message>
        ))}
      </MessageList>
    </Page>
  );
}

export default App;
