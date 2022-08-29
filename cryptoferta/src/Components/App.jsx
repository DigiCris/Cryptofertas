import React, {useState} from "react";
import Button from '@mui/material/Button'

const App = () => {

  const [active, setActive] = useState(false);
  const [account, setAccount] = useState("");

  const getAccount = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0]);
    setActive(true);
    // localStorage.setItem("account", account);
  };

  return (
    <>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "500px",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <div>
        <Button
          variant="contained"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: "auto",
            marginRight: "auto",
          }}
          onClick={getAccount}
        >
          Connect to MetaMask
        </Button>
        <br></br>
        {account ? (
          <span
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Connected with <b>{account}</b>
          </span>
        ) : (
          <span
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Not connected
          </span>
        )}
        <br></br>
        <Button
          variant="contained"
          // onClick={disconnect}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Disconnect
        </Button>
      </div>
    </div>
    </>
  );
}

export default App;
