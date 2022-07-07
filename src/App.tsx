import "./App.css";
import { formatEther } from "@ethersproject/units";
import { utils } from "ethers";
import { Contract } from "@ethersproject/contracts";
import "bootstrap/dist/css/bootstrap.css";

import {
  useEthers,
  useEtherBalance,
  useSendTransaction,
  useContractFunction,
  useCall,
} from "@usedapp/core";
import { GREETER_ABI, GREETER_ADDRESS } from "./utils/greeter";
import { useState } from "react";

export default function App() {
  const [greeting, setGreeting] = useState("");

  const greeterContract = new Contract(
    GREETER_ADDRESS,
    new utils.Interface(GREETER_ABI)
  );

  const { activateBrowserWallet, account, deactivate } = useEthers();
  const { sendTransaction } = useSendTransaction();
  const greetValue = useGreet();
  const etherBalance = useEtherBalance(account);

  function useGreet(): String | undefined {
    const { value, error } =
      useCall({
        contract: greeterContract,
        method: "greet",
        args: [],
      }) ?? {};
    if (error) {
      console.error(error.message);
      return undefined;
    }
    return value?.[0];
  }

  const MetamaskConnectButton = () => (
    <div style={{ padding: "5px" }}>
      <button
        className={"btn btn-success"}
        onClick={() => activateBrowserWallet()}
      >
        Connect
      </button>
      <p>Connect to wallet to interact with the example.</p>
    </div>
  );

  const GreetButton = () => {
    const { state, send } = useContractFunction(greeterContract, "setGreeting");
    return (
      <div style={{ padding: "5px" }}>
        <button
          className={"btn btn-primary"}
          onClick={async () => {
            console.log("About to greet");
            await send(greeting);
          }}
        >
          Greet!
        </button>
      </div>
    );
  };

  const SendTxButton = () => {
    return (
      <div style={{ padding: "5px" }}>
        <button
          className={"btn btn-primary"}
          onClick={() =>
            sendTransaction({
              to: "0x5Cc1C61c302ea32e9410CA46023aA81C6A4d0517",
              value: "1000000000000000000",
            })
          }
        >
          Send 1 ETH
        </button>
      </div>
    );
  };

  const AccountData = () => {
    if (account) {
      return (
        <div style={{ padding: "5px" }}>
          <div className="form-contorl">
            Account:
            <p>{account}</p>
          </div>
          {etherBalance && (
            <div className="form-contorl">
              Balance:
              <p>{formatEther(etherBalance)} ETH</p>
            </div>
          )}
          <button className={"btn btn-danger"} onClick={deactivate}>
            Disconnect
          </button>
        </div>
      );
    } else {
      return <MetamaskConnectButton />;
    }
  };

  return (
    <div>
      <AccountData />
      {account && (
        <div>
          <div>
            <SendTxButton />
          </div>
          <br />
          <hr />
          <br />

          <div>
            <div className="form-group" style={{ padding: "5px" }}>
              <label>Set Greeting </label>
              <input
                value={greeting}
                onChange={(e) => setGreeting(e.target.value)}
                className="form-control"
              ></input>
              <GreetButton />
            </div>
            <div className="form-contorl" style={{ padding: "5px" }}>
              Greeting value:
              <p>{greetValue}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
