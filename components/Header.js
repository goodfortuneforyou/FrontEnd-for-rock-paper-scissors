import { ConnectButton } from "web3uikit";
export default function Header() {
  return (
    <div className=" border-b-2 flex flex-row bg-lime-100 ">
      <h1 className="py-4 px-4 font-bold">Rock Paper Scissors Dapp</h1>
      <div className="ml-auto py-2 px-4">
        <ConnectButton moralisAuth={false} />
      </div>
    </div>
  );
}
