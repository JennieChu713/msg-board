import React, { useState, useEffect } from "react";
import styled from "styled-components";
// import PropTypes fomr "prop-types";

const API_ENDPOINT =
  "https://student-json-api.lidemy.me/comments?_sort=createdAt&_order=desc&_limit=10";

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
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    fetch(API_ENDPOINT)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
      })
      .catch((err) => setApiError(err.message));
  }, []);

  return (
    <Page>
      <Title>Message Board</Title>
      <MessageForm>
        <MessageTextArea rows={10} />
        <SubmitButton>send</SubmitButton>
      </MessageForm>
      {apiError && (
        <ErrorMessage>something went wrong. {apiError.toString()}</ErrorMessage>
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
