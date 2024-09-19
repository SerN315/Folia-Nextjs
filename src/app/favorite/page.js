import Image from "next/image";
import Head from "next/head";
import Script from "next/script";
import Footer from "../Component/footer";
import TopNav from "../Component/header";
import "../scss/favorite.scss";
export default function Favorite() {
  return (
    <>
    <Head>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Favorite - Folia</title>
  <link rel="icon" href="../favicon.ico" />
    </Head>
    <TopNav/>
    <main className="favorite-content">
    <h1 className="favorite-title">Favorite List</h1>
    <div className="favorite__list" />
  </main>
  <Footer/>
    </>
  )}