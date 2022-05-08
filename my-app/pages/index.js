import Head from 'next/head'
import { Contract, providers, utils} from "ethers";
import React,{ useState, useRef, useEffect} from 'react';
import {abi , NFT_CONTRACT_ADDRESS } from "../constants/index";
import styles from '../styles/Home.module.css'
import Web3Modal from "web3modal";



//& <------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
export default function Home() {
  
  // * TO keep track of wallet is connected or not 
  const [walletConnected, setWalletConnected ] = useState(false);
  // * While waiting for transaction to complete we should have to show waiting for transaction 
  const [waiting, setWaiting ] = useState(false);
  //  ^ To keep track of how many token ids have neem minted till the present time 
  const [tokenIdsMinted, setTokenIdsMinted] = useState("0");
  // ! Creating web 3 modal instance to connect metamask wallet 
  const web3ModalRef = useRef();
  
  // ? Creating and defining function for Signer and Provider 
  // * Provider :- Only used for interaction like it includes reading transactions , reading balancers, reading state etc
  // ^ Signer :- It contains properties of Provider as well as it is also used to make transactions , Basically it is used for writing transactions to the blockchain 
  // ! needsigner is set to true if we need the signer else by default it will be false .
  


  //& <------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    
    // ! if user is not connected to rinkeby then let them know by alert message
    const {chainId} = await web3Provider.getNetwork();
    if (chainId !== 4 ) {
      window.alert("Change your network to Rinkeby");
      throw new Error("Change the network to Rinkeby");
    }
    
  if (needSigner) {
    const signer = web3Provider.getSigner();
    return signer;
  }
  return web3Provider;

}
//& <----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
// ?  using useEffect to react to changes on the state of the website
useEffect(() => {
  if(!walletConnected) {
    web3ModalRef.current = new Web3Modal({
      network : "rinkeby",
      providerOptions:{},
      disableInjectedProvider: false,
    });

    connectWallet();
    getTokenIdsMinted();

    // Set an Inteval to get number of token IDs minted every 5t second
    setInterval(async function () {
      await getTokenIdsMinted();
    },5 * 1000);
  }
},[walletConnected]);


//&  <---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
// * Function to Connect Wallet

const connectWallet = async () => {
  try {
    // We will need provider here to connect with the metamask
    await getProviderOrSigner();
    setWalletConnected(true);
  } catch (err) {
    console.error(err);
  }
};

//& <----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
//  * Mint function to mint NFT

const publicMint = async () => {
  try{
    console.log("Public Mint");
    // We need a signer function here as we are doing transaction here
    const signer = await getProviderOrSigner(true);
    // Creating new instance of the contract with the signer which allows it to update
    const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);
    // To mint we need mint function from the smart contract
    const tx = await nftContract.mint({
      // defining value for the minting the nft
      value: utils.parseEther("0.01"),
    });
    setWaiting(true);
    // WE have to wait for the transaction to get completed
    await tx.wait();
    setWaiting(false);
    window.alert("You have Successfully minted a BITLORD NFT.");
  } catch (err) {
    console.error(err);
  }
}

//& <------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------>

// *  Function to get number of Token ids minted
const getTokenIdsMinted = async () => {
try {
  // We want to view only so we need provider only
  const provider = await getProviderOrSigner();
  // Creating contract instance to connect 
  const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);
  // CAlling the token id function from the smart contract
  const _tokenIds = await nftContract.tokenIds();
  console.log("tokenIds",_tokenIds);
  // We will get _tokenIds as a BIg number we have to convert it to string
  setTokenIdsMinted(_tokenIds.toString());
} catch(err) {
  console.error(err);
}

};

//& <------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------> 
// * Rendering a button on the basis of the state 
const renderButton = () => {
  if(!walletConnected) {
    return (
      <button onClick={connectWallet} className={styles.button}>
      Connect your Wallet
      </button>
    );

  }
    if (waiting) {
      return <button className={styles.button}>Loading ......</button>;
    }

    return (
      <button className={styles.button} onClick={publicMint} >MINT NFT</button>
    )
}

//  id="myVideo"


  return (
   <div>
  
   <video autoPlay muted loop className={styles.video}>
  <source src="https://res.cloudinary.com/krotcloud/video/upload/v1652019022/world_-_1992_Original_ybm0mu.mp4" type="video/mp4"/>
  </video>
  
{/*  <div className="videoBgWrapper">
    <video loop muted autoplay poster="img/videoframe.jpg" className="videoBg">
        <source src="https://res.cloudinary.com/krotcloud/video/upload/v1652019022/world_-_1992_Original_ybm0mu.mp4" type="video/webm"/>
    </video>
</div> */}
   <Head>
   <title>BitLord NFT</title>
   <meta name="description" content="NFT-Minting_DApp" />
   <link rel="icon" href="/favicon.ico" />
   </Head>
   <div className={styles.main}>
   <div>
   <h1 className={styles.title}>🚀 Welcome to BitLord NFT !👋🏻</h1>
   <div className={styles.description}>
   It is a NFT collection for Demo .
   </div>
   <div className={styles.description}>
   Mint your Own NFT.
   </div>
   <div className={styles.description}>{tokenIdsMinted}/10 have been Minted</div>
   {renderButton()}
   </div>
   </div>
   <footer className={styles.footer}>Made by Yash Patel @2022 </footer>
   </div>
  )
}
