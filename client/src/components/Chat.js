import React, { useState } from "react";
import { gql, useMutation, useSubscription } from "@apollo/client";
import {
  Button,
  TextField,
} from "@material-ui/core";

const GET_MESSAGES = gql`
  subscription {
    messages {
      id
      user
      content
    }
  }
`;
const POST_MESSAGE = gql`
  mutation($user: String!, $content: String!) {
    postMessage(user: $user, content: $content)
  }
`;
const Messages = ({ user }) => {
  const { data } = useSubscription(GET_MESSAGES);

  if (!data) {
    return null;
  }
  return (
    <>
      {data.messages.map(({ id, user: messageUser, content }) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: user === messageUser ? "flex-end" : "flex-start",
              paddingBottom: "1em",
            }}
          >
            {user !== messageUser && (
              <div
                style={{
                  height: 50,
                  width: 50,
                  marginRight: "0.5em",
                  border: "2px solid #e5e6ea",
                  borderRadius: 25,
                  textAlign: "center",
                  fontSize: "18pt",
                  paddingTop: 5,
                }}
              >
                {messageUser.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div
              style={{
                background: user === messageUser ? "#3f51b5" : "#e5e6ea",
                color: user === messageUser ? "white" : "black",
                padding: "1em",
                borderRadius: "1em",
                maxWidth: "60%",
              }}
            >
              {content}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default function Chat() {
  const [state, setState] = useState({
    user: "Jack",
    content: "",
  });
  const [postMessage] = useMutation(POST_MESSAGE);
  return (
    <>
      <Messages user={state.user} />
      <form
        autoComplete="off"
        style={{ display: "flex", alignItems: "center" }}
        onSubmit={(e) => {
          e.preventDefault();
          postMessage({variables: state})

        }}
      >
        <TextField
          id="user"
          value={state.user}
          placeholder="User"
          onChange={(e) => setState({ ...state, user: e.target.value })}
          style={{ width: "19%", marginRight: "1%" }}
        />
        <TextField
          id="content"
          value={state.content}
          placeholder="Content"
          onChange={(e) => setState({ ...state, content: e.target.value })}
          multiline
          style={{ width: "69%" }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ width: "7%", marginLeft: "2%" }}
        >
          Send
        </Button>{" "}
      </form>
    </>
  );
}
