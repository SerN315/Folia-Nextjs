import Image from "next/image";
import Head from "next/head";
import Script from "next/script";
import Footer from "../Component/footer";
import TopNav from "../Component/header";
import "../scss/cate.scss";
export default function Category() {
  return (
    <>
    <Head>
    <meta charSet="UTF-8" />
  <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>English - Category</title>
  <link rel="icon" type="image/x-icon" href="../favicon.ico" />
    </Head>
    <TopNav/>
  <main className="category">
    <h1 className="category__title">
      Browse our categories list
      <i aria-hidden="true" className="fa-solid fa-arrow-down fa-xs" />
    </h1>
    <div className="category__content">
      <div className="placeholder-item">
        <h3 className="title placeholder-glow">
          <span className="placeholder col-2" />
        </h3>
        <div className="ph-item-list">
          <div className="ph-item">
            <div className="img placeholder-glow">
              <span className="placeholder col-12" />
            </div>
            <div className="des placeholder-glow">
              <h4 className="placeholder col-9" />
            </div>
            <div className="cnt placeholder-glow">
              <span className="placeholder col-4" />
            </div>
          </div>
          <div className="ph-item">
            <div className="img placeholder-glow">
              <span className="placeholder col-12" />
            </div>
            <div className="des placeholder-glow">
              <h4 className="placeholder col-9" />
            </div>
            <div className="cnt placeholder-glow">
              <span className="placeholder col-4" />
            </div>
          </div>
          <div className="ph-item">
            <div className="img placeholder-glow">
              <span className="placeholder col-12" />
            </div>
            <div className="des placeholder-glow">
              <h4 className="placeholder col-9" />
            </div>
            <div className="cnt placeholder-glow">
              <span className="placeholder col-4" />
            </div>
          </div>
        </div>
      </div>
      <div className="placeholder-item">
        <h3 className="title placeholder-glow">
          <span className="placeholder col-2" />
        </h3>
        <div className="ph-item-list">
          <div className="ph-item">
            <div className="img placeholder-glow">
              <span className="placeholder col-12" />
            </div>
            <div className="des placeholder-glow">
              <h4 className="placeholder col-9" />
            </div>
            <div className="cnt placeholder-glow">
              <span className="placeholder col-4" />
            </div>
          </div>
          <div className="ph-item">
            <div className="img placeholder-glow">
              <span className="placeholder col-12" />
            </div>
            <div className="des placeholder-glow">
              <h4 className="placeholder col-9" />
            </div>
            <div className="cnt placeholder-glow">
              <span className="placeholder col-4" />
            </div>
          </div>
          <div className="ph-item">
            <div className="img placeholder-glow">
              <span className="placeholder col-12" />
            </div>
            <div className="des placeholder-glow">
              <h4 className="placeholder col-9" />
            </div>
            <div className="cnt placeholder-glow">
              <span className="placeholder col-4" />
            </div>
          </div>
        </div>
      </div>
      <div className="placeholder-item">
        <h3 className="title placeholder-glow">
          <span className="placeholder col-2" />
        </h3>
        <div className="ph-item-list">
          <div className="ph-item">
            <div className="img placeholder-glow">
              <span className="placeholder col-12" />
            </div>
            <div className="des placeholder-glow">
              <h4 className="placeholder col-9" />
            </div>
            <div className="cnt placeholder-glow">
              <span className="placeholder col-4" />
            </div>
          </div>
          <div className="ph-item">
            <div className="img placeholder-glow">
              <span className="placeholder col-12" />
            </div>
            <div className="des placeholder-glow">
              <h4 className="placeholder col-9" />
            </div>
            <div className="cnt placeholder-glow">
              <span className="placeholder col-4" />
            </div>
          </div>
          <div className="ph-item">
            <div className="img placeholder-glow">
              <span className="placeholder col-12" />
            </div>
            <div className="des placeholder-glow">
              <h4 className="placeholder col-9" />
            </div>
            <div className="cnt placeholder-glow">
              <span className="placeholder col-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <Footer/>
    </>
  )}