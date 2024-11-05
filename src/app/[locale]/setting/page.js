// import TopNav from "../Component/header";
//import Footer from "../Component/footer";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
export default function Setting() {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Folia - Settings</title>
        <link rel="stylesheet" href="./scss/setting.scss" />
        <link rel="icon" type="image/x-icon" href="../favicon.ico" />
      </Head>
      {/* <TopNav/> */}
      <main className="setting">
        <div className="setting__main">
          <h2 className="title">
            <Link href="/home">Home</Link> &gt; Settings
          </h2>
          <div id="avatar-list">
            <div id="closebtn">x</div>
            <div id="addAvatar">
              <span>+</span>
            </div>
          </div>
          <div className="word-box-overlay setting-overlay" />
          <div className="content">
            <div className="content__user-info">
              <div className="userinfos">
                <div className="hover_overlay">Click to change your avatar</div>
                <img src="./img/folia-asvab.png" className="user-img" />
                <div className="user-text">
                  <h2 className="username_text">USERNAME</h2>
                  <h5 className="userId_text">USERID</h5>
                  <h4 className="created_text">Started from 2024</h4>
                </div>
              </div>
              <a href="/profile" style={{ fontSize: 35 }}>
                <i className="fa-solid fa-user" />
              </a>
            </div>
            <hr />
            <div className="content__options account">
              <h5>Account settings</h5>
              <Link href="#" className="languages cta">
                <h6>Languages</h6>
                <i className="fa-solid fa-chevron-right" />
              </Link>
              <Link href="#" className="acc-update cta">
                <h6>Change Account Settings</h6>
                <i className="fa-solid fa-chevron-right" />
              </Link>
              <Link href="#" className="pw cta">
                <h6>Change Password</h6>
                <i className="fa-solid fa-chevron-right" />
              </Link>
              <Link href="#" className="payment cta">
                <h6>Payment Methods</h6>
                <i className="fa-solid fa-chevron-right" />
              </Link>
            </div>
            <hr />
            <div className="content__options more">
              <h5>More</h5>
              <Link href="intro" className="languages cta">
                <h6>About Us</h6>
              </Link>
              <Link href="#" className="pw cta">
                <h6>Privacy Policy</h6>
              </Link>
              <Link href="#" className="payment cta">
                <h6>Terms and Conditions</h6>
              </Link>
            </div>
          </div>
        </div>
        <div className="setting__bkg" />
      </main>
      <div className="popup-container hidden">
        <div className="popup" />
      </div>
      {/* <Footer /> */}
    </>
  );
}
