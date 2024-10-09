import Image from "next/image";
import Head from "next/head";
import Script from "next/script";
import Footer from "../Component/footer";
import TopNav from "../Component/header";
export default function About() {
  return (
    <>
   <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Folia - About Us</title>
      </Head>
    <TopNav/>
  <main className="hub">
    <div className="header">
      <a className="home-link" href="/">
        <h1 className="logo">FOLIA</h1>
      </a>
    </div>
    <div className="content">
      <div className="title">
        <p>Explore our goals and team</p>
        <h2>About us</h2>
      </div>
      <div className="des_img">
        <h1>FOLIA-YOUR TOP PICK FOR LEARNING</h1>
        <h3>UNLOCK YOUR FULLEST POTENTIAL WITH US</h3>
      </div>
      <div className="description">
        <div className="about_folia">
          <div className="right">
            <h1>WHAT IS FOLIA</h1>
          </div>
          <div className="left">
            <p>
              Folia is a revolutionary online learning platform designed to
              empower learners of all ages to explore, discover, and master a
              diverse range of subjects and topics. Our mission is to make
              learning engaging, accessible, and personalized for every
              individual, whether they&apos;re a student, educator, or lifelong
              learner.
            </p>
          </div>
        </div>
        <p className="para">
          Folia is a revolutionary online learning platform designed to empower
          learners of all ages to explore, discover, and master a diverse range
          of subjects and topics. Our mission is to make learning engaging,
          accessible, and personalized for every individual, whether they&apos;re a
          student, educator, or lifelong learner.
        </p>
        <div className="why_folia">
          <div className="left">
            <p>
              Folia is a revolutionary online learning platform designed to
              empower learners of all ages to explore, discover, and master a
              diverse range of subjects and topics. Our mission is to make
              learning engaging, accessible, and personalized for every
              individual, whether they&apos;re a student, educator, or lifelong
              learner.
            </p>
            <div className="left_decor" />
          </div>
          <div className="right">
            <h1>WHY CHOOSE US</h1>
          </div>
        </div>
      </div>
      {/* <div className="cta">
        <a href="./hub">
          <div className="flex-container">
            <p>Learn more about Folia’s Subjects</p>
            <div className="arrow">
              <span className="arrow__body" />
              <span className="arrow__head" />
            </div>
          </div>
        </a>
      </div> */}
    </div>
  </main>
  <Footer/>
  {/* <Script type="module" src="js/main.js"></Script> */}
  {/* <Script type="module" src="js/intro.js"></Script> */}
  <Script id="googleMeta"
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-T9JC70THEE"
        ></Script>
        <Script id="googleStat"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag() {
                dataLayer.push(arguments);
              }
              gtag("js", new Date());
              gtag("config", "G-T9JC70THEE");
            `,
          }}
        />
</>
);
}