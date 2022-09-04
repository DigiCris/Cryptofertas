import {useState, useEffect} from "react"

const Home = () => {

	const [currentAccount, setCurrentAccount] = useState("");
  

  useEffect(() => {
    const connectWallet = async () => {
      try {
        const { ethereum } = window;
  
        if (!ethereum) {
          alert("Get MetaMask!");
          return;
        }
  
        /*
         * Fancy method to request access to account.
         */
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
  
        /*
         * Boom! This should print out public address once we authorize Metamask.
         */
        console.log("Connected", accounts[0]);
        setCurrentAccount(accounts[0]);
      } catch (error) {
        console.log(error);
      }
    } 

    connectWallet()
  
  }, [])
  
  return (
    <div>Home</div>
  );
};

export default Home;
