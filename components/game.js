import { useEffect, useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { Input, Button, useNotification } from "web3uikit";
import { abi, contractAddresses } from "../constants";
export default function Game() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const gameAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;
  const [createAddress, setCreateAddress] = useState("");
  const [createBalance, setCreateBalance] = useState("");
  const [joinBalance, setJoinBalance] = useState("");
  const [gameId, setGameId] = useState("");
  const [commitId, setCommitId] = useState("");
  const [commitMoveId, setCommitMoveId] = useState("");
  const [commitSalt, setCommitSalt] = useState("");
  const [revealId, setrevealId] = useState("");
  const [revealMoveId, setrevealMoveId] = useState("");
  const [revealSalt, setrevealSalt] = useState("");
  const { runContractFunction: commitMove } = useWeb3Contract({
    abi: abi,
    contractAddress: gameAddress,
    functionName: "commitMove",
    params: { _gameId: commitId, moveId: commitMoveId, salt: commitSalt },
  });
  const { runContractFunction: revealMove } = useWeb3Contract({
    abi: abi,
    contractAddress: gameAddress,
    functionName: "revealMove",
    params: { _gameId: revealId, moveId: revealMoveId, salt: revealSalt },
  });
  const { runContractFunction: joinGame } = useWeb3Contract({
    abi: abi,
    contractAddress: gameAddress,
    functionName: "joinGame",
    params: { _gameId: gameId },
    msgValue: joinBalance,
  });
  const { runContractFunction: createGame } = useWeb3Contract({
    abi: abi,
    contractAddress: gameAddress,
    functionName: "createGame",
    params: { participant: createAddress },
    msgValue: createBalance,
  });
  const { runContractFunction: getGameId } = useWeb3Contract({
    abi: abi,
    contractAddress: gameAddress,
    functionName: "getGameId",
    params: {},
  });
  const currentId = async () => {
    const id = await getGameId();
    document.getElementById("currentId").innerHTML = id;
  };

  const dispatch = useNotification();

  const handleError = async (error, id) => {
    const e = error;
    document.getElementById(id).innerHTML =
      error == "[object Object]" ? " : error! please check console" : error;
    console.log(id);
  };
  const handleSuccess = async (tx) => {
    try {
      await tx.wait(1);
      handleNewNotification(tx);
      console.log("hello");
      // updateUI();
    } catch (error) {
      console.log(error);
    }
  };
  const handleNewNotification = () => {
    dispatch({
      type: "info",
      message: "transaction complete!",
      title: "transaction notification",
      position: "topR",
      icon: "bell",
    });
    document.getElementById("createGame").innerHTML = "";
    document.getElementById("joinGame").innerHTML = "";
    document.getElementById("commitMove").innerHTML = "";
    document.getElementById("revealMove").innerHTML = "";
  };

  return (
    <div>
      <div>
        <p className=" flex justify-center font-bold">
          {isWeb3Enabled ? (
            <a
              href="https://goerli.etherscan.io/address/0x2451854256B09ff179D4eC324143BA08675227cB#code"
              className="border-b  border-blue-500"
            >
              More on Etherscan
            </a>
          ) : (
            "Please connect to a supported chain (goerli) to play!"
          )}
        </p>
        <div className="flex justify-center space-x-12 ">
          <div class="box-content bg-slate-200 shadow-xl shadow-amber-700   p-4 border-4 ring-2 border-blue-600  ...">
            <div className="p-1">
              <Input
                label="Enter other participant's address"
                labelBgColor="rgb(226 232 240)"
                name="participant address"
                onBlur={function noRefCheck() {}}
                value={createAddress}
                onChange={({ target }) => setCreateAddress(target?.value)}
                type="text"
              />
            </div>
            <div className="p-1">
              <Input
                label="Enter amount want to play with in wei"
                labelBgColor="rgb(226 232 240)"
                name="amount"
                onBlur={function noRefCheck() {}}
                value={createBalance}
                onChange={({ target }) => setCreateBalance(target?.value)}
                type="number"
              />
            </div>
            <div className=" flex justify-center">
              <Button
                color="red"
                onClick={async () => {
                  await createGame({
                    onSuccess: handleSuccess,
                    onError: (error) => handleError(error, "createGame"),
                  });
                }}
                text="Create Game"
                theme="colored"
              />
              <span id="createGame" className="text-red-600"></span>
            </div>
          </div>
          <div class="box-content bg-slate-200 shadow-xl shadow-amber-700   p-4 border-4 ring-2 border-blue-600  ...">
            <div className="p-1">
              <Input
                label="Enter Game Id to Join or go etherscan"
                labelBgColor="rgb(226 232 240)"
                name="game id"
                onBlur={function noRefCheck() {}}
                value={gameId}
                onChange={({ target }) => setGameId(target?.value)}
                type="number"
              />
            </div>
            <div className="p-1">
              <Input
                label="Enter amount needed to play with in wei"
                labelBgColor="rgb(226 232 240)"
                name="amount"
                onBlur={function noRefCheck() {}}
                value={joinBalance}
                onChange={({ target }) => setJoinBalance(target?.value)}
                type="number"
              />
            </div>
            <div className=" flex justify-center">
              <Button
                color="red"
                onClick={async () => {
                  await joinGame({
                    onSuccess: handleSuccess,
                    onError: (error) => handleError(error, "joinGame"),
                  });
                }}
                text="Join Game"
                theme="colored"
              />
              <span id="joinGame" className="text-red-600"></span>
            </div>
          </div>
        </div>
        <br />
        <div className="flex justify-center space-x-12 ">
          <div class="box-content bg-white space-y-2 shadow-xl shadow-amber-700   p-4 border-4 ring-2 border-blue-600  ...">
            <Input
              label="Enter the id of the game "
              name="commit game id"
              onBlur={function noRefCheck() {}}
              value={commitId}
              onChange={({ target }) => setCommitId(target?.value)}
              type="number"
            />
            <Input
              label="Enter your move"
              name="commit move"
              onBlur={function noRefCheck() {}}
              value={commitMoveId}
              onChange={({ target }) => setCommitMoveId(target?.value)}
              type="number"
            />
            <Input
              label="Enter your salt to hide move before reveal"
              name="commit salt"
              onBlur={function noRefCheck() {}}
              value={commitSalt}
              onChange={({ target }) => setCommitSalt(target?.value)}
              type="number"
            />
            <div className="flex justify-center">
              <Button
                color="green"
                onClick={async () => {
                  await commitMove({
                    onSuccess: handleSuccess,
                    onError: (error) => handleError(error, "commitMove"),
                  });
                }}
                text="Commit your Move"
                theme="colored"
              />
            </div>
            <span id="commitMove" className="text-red-600"></span>
          </div>

          <div class="box-content  space-y-2 bg-white  shadow-xl shadow-amber-700   p-4 border-4 ring-2 border-blue-600  ...">
            <Input
              label="Enter the id of the game"
              name="reveal game id"
              onBlur={function noRefCheck() {}}
              value={revealId}
              onChange={({ target }) => setrevealId(target?.value)}
              type="number"
            />
            <Input
              label="Enter your move to reveal"
              name="reveal move"
              onBlur={function noRefCheck() {}}
              value={revealMoveId}
              onChange={({ target }) => setrevealMoveId(target?.value)}
              type="number"
            />
            <Input
              label="Enter your previous salt for checking"
              name="reveal salt"
              onBlur={function noRefCheck() {}}
              value={revealSalt}
              onChange={({ target }) => setrevealSalt(target?.value)}
              type="number"
            />
            <div className="flex justify-center">
              <Button
                color="green"
                onClick={async () => {
                  await revealMove({
                    onSuccess: handleSuccess,
                    onError: (error) => handleError(error, "revealMove"),
                  });
                }}
                text="Reveal your Move"
                theme="colored"
              />
            </div>
            <span id="revealMove" className="text-red-600"></span>
            <span id="winner" className="text-red-600"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
