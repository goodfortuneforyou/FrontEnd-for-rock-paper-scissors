import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";

import styles from "../styles/Home.module.css";
import Game from "../components/game";

export default function Home() {
  return (
    <div class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ...">
      <Head>
        <title>decentralized game</title>
        <meta name="description" content="game" />
      </Head>
      <Header />
      <Game />
    </div>
  );
}
