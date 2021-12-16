import { useQuery } from "@apollo/react-hooks";
import { Contract } from "@ethersproject/contracts";
import { getDefaultProvider } from "@ethersproject/providers";
import React, { useEffect, useState } from "react";

import { Body, Button, Header, Image, Link } from "./components";
//import logo from "./ethereumLogo.png";
import logo from "./infinitygaming.jpg";
import useWeb3Modal from "./hooks/useWeb3Modal";

import { addresses, abis } from "@project/contracts";
import GET_TRANSFERS from "./graphql/subgraph";

async function claimTokens(provider) {

  // Create an instance of an ethers.js Contract
  // Read more about ethers.js on https://docs.ethers.io/v5/api/contract/contract/
  const infinityV1 = new Contract(addresses.infinityV1, abis.v1, provider);
  const infinityV2 = new Contract(addresses.infinityV2, abis.v2, provider);
  
  /**************** 
   * This is an outline only.  Not intended to work.
   ****************
   *
   * const allow = await infinityV1.allow()
   * if (allow) {
   *    const claim = await infinityV2.claim()
   *    
   *    console.log({ new tokenBalance: tokenBalance.toString() });
   * } else {
   *    // print failure message
   * }
   * newBalance = await infinityV2.balanceOf(__address__);
   * console.log({balance of new tokens: newBalance.toString()});
   */

}

function WalletButton({ provider, loadWeb3Modal, logoutOfWeb3Modal }) {
  const [account, setAccount] = useState("");
  const [rendered, setRendered] = useState("");

  useEffect(() => {
    async function fetchAccount() {
      try {
        if (!provider) {
          return;
        }

        // Load the user's accounts.
        const accounts = await provider.listAccounts();
        setAccount(accounts[0]);

        // Resolve the ENS name for the first account.
        const name = await provider.lookupAddress(accounts[0]);

        // Render either the ENS name or the shortened account address.
        if (name) {
          setRendered(name);
        } else {
          setRendered(account.substring(0, 6) + "..." + account.substring(36));
        }
      } catch (err) {
        setAccount("");
        setRendered("");
        console.error(err);
      }
    }
    fetchAccount();
  }, [account, provider, setAccount, setRendered]);

  return (
    <Button
      onClick={() => {
        if (!provider) {
          loadWeb3Modal();
        } else {
          logoutOfWeb3Modal();
        }
      }}
    >
      {rendered === "" && "Connect Wallet"}
      {rendered !== "" && rendered}
    </Button>
  );
}

function App() {
  const { loading, error, data } = useQuery(GET_TRANSFERS);
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();

  React.useEffect(() => {
    if (!loading && !error && data && data.transfers) {
      console.log({ transfers: data.transfers });
    }
  }, [loading, error, data]);

  return (
    <div>
      <Header>
        <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal} />
      </Header>
      <Body>
        <Image src={logo} alt="react-logo" />
        {/* Remove the "hidden" prop and open the JavaScript console in the browser to see what this function does */}
        <Button onClick={() => claimTokens(provider)}>
          Claim V2 Tokens
        </Button>
      </Body>
    </div>
  );
}

export default App;
