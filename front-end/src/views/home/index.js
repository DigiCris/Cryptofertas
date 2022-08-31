import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";
import { connector, getLibrary } from "../../config/web3";

const Home = () => {

  const [balance, setBalance] = useState(0);
  
  const {active, activate, deactivate, account, error, library} = useWeb3React();
  
  const isUnsupportedChain = error instanceof UnsupportedChainIdError;

  const connect = useCallback(() => {
    activate(connector);
    localStorage.setItem("previouslyConnected", "true");
  }, [activate]);

  const disconnect = () => {
    deactivate()
    localStorage.removeItem("previouslyConnected")
  };

  useEffect(() => {
    if(localStorage.getItem("previouslyConnected") === "true") connect();
  }, [connect]);

  const getBalance = useCallback(async() => {
    const toSet = await library.eth.getBalance(account);
    setBalance((toSet / 1e18).toFixed(2));
  }, [library?.eth, account])

  useEffect(()=>{
    if(active) getBalance();
  }, [active, getBalance])

  return (
    <>
      <div>Home</div>
      {active ? 
      <>
      <p>Cuenta: {account}</p>
      <p>Balance: ~{balance}</p>
      <button onClick={disconnect}>Desconectar</button>
      </>
      :
      <button onClick={connect} disabled={isUnsupportedChain}>{isUnsupportedChain ? 'Red no soportada. Cambie a Rinkeby.' : 'Conectar Wallet' }</button>
      }
    </>
  );
};

export default Home;
