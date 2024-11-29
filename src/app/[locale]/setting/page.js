// import TopNav from "../Component/header";
//import Footer from "../Component/footer";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import initTranslations from '../../i18n';
export default async function Setting({ params: { locale } }) {
  const { t } = await initTranslations(locale, ['profile+setting']);
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
            <Link href="home">Home</Link> &gt; Settings
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
                <div className="hover_overlay">{t('changeavatar')}</div>
                <img src="./img/folia-asvab.png" className="user-img" />
                <div className="user-text">
                  <h2 className="username_text">USERNAME</h2>
                  <h5 className="userId_text">USERID</h5>
                  <h4 className="created_text">{t('time')} 2024</h4>
                </div>
              </div>
              <a href="/profile" style={{ fontSize: 35 }}>
                <i className="fa-solid fa-user" />
              </a>
            </div>
            <hr />
            <div className="content__options account">
              <h5>{t('title_1')}</h5>
              {/* <Link href="#" className="languages cta">
                <h6>{t('language')}</h6>
                <i className="fa-solid fa-chevron-right" />
              </Link> */}
              <Link href="#" className="acc-update cta">
                <h6>{t('accountS')}</h6>
                <i className="fa-solid fa-chevron-right" />
              </Link>
              <Link href="#" className="pw cta">
                <h6>{t('password')}</h6>
                <i className="fa-solid fa-chevron-right" />
              </Link>
              {/* <Link href="#" className="payment cta">
                <h6>{t('payment')}</h6>
                <i className="fa-solid fa-chevron-right" />
              </Link> */}
            </div>
            <hr />
            <div className="content__options more">
              <h5>{t('title_2')}</h5>
              <Link href="about" className="languages cta">
                <h6>{t('aboutus')}</h6>
              </Link>
              {/* <Link href="#" className="pw cta">
                <h6>{t('privacy')}</h6>
              </Link>
              <Link href="#" className="payment cta">
                <h6>{t('term')}</h6>
              </Link> */}
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
