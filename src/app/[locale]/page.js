import Image from "next/image";
import Head from "next/head";
import Script from "next/script";
//import Footer from "./Component/footer";
import Link from "next/link";
import initTranslations from '../i18n';
export default async function Home({ params: { locale } }) {
  const { t } = await initTranslations(locale, ['index']);
  
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Folia - Learn with Us</title>
        <meta
          name="description"
          content="Discover a comprehensive multi-subject learning platform, offering diverse courses to expand your knowledge. From language skills to certification programs, access interactive content for effective learning. Start your educational journey today!"
        />
        <meta
          name="keywords"
          content="online learning, English language, certification programs, language skills, interactive learning, multi-disciplinary courses, online education, improve language, flexible learning, effective learning platform"
        />
        {/* OPEN GRAPH */}
        <meta property="og:title" content="Foliastudy" />
        <meta
          property="og:description"
          content="Discover a comprehensive multi-subject learning platform, offering diverse courses to expand your knowledge. From language skills to certification programs, access interactive content for effective learning. Start your educational journey today!"
        />
        <meta property="og:url" content="https://folia-study.com" />
        <meta
          property="og:image"
          content="https://folia-study.com/apple-touch-icon.bb4effea.png"
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Foliastudy" />
      </Head>
      <main className="landing-page">
        <section id="hero">
          <video
            autoPlay=""
            muted=""
            loop=""
            className="theme"
            src="https://player.vimeo.com/external/342387470.sd.mp4?s=523dbb493d35af3abd931359d970544fb3d7e364&profile_id=164&oauth2_token_id=57447761"
          />
          <div className="header">
            <h1>FOLIA</h1>
            <div className="header__nav">
              <Link className="nav-btn" href="/about">
                About Us
              </Link>
              <Link className="nav-btn" href="/hub">
                Features
              </Link>
            </div>
          </div>
          <div className="content">
            <div className="content__container">
              <h1>
                {t('welcome_1')} <br />
                {t('welcome_2')} <highlight>{t('welcome_3')}</highlight>
              </h1>
              <p>
              {t('welcome_des')}
              </p>
              <Link href="/hub">
                <button>
                {t('start_btn')}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={25}
                    height={25}
                    className="bi bi-arrow-right-short"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"
                    />
                  </svg>
                </button>
              </Link>
            </div>
          </div>
        </section>
        <section className="info">
          <div className="info__text">
            <h1>{t('des1_title')}</h1>
            <p>
            {t('des1_detail')}
            </p>
            <Link href="/about">
              <p>{t('about_btn_1')}</p>
              <div className="arrow">
                <span className="arrow__body" />
                <span className="arrow__head" />
              </div>
            </Link>
          </div>
          <div className="info__img">
            <Image
              src="/img/landing-page/introduction-1.png"
              alt="Introduction Image 1"
              width={700}
              height={475}
            />
          </div>
        </section>
        <section className="info info--reverse info--pre">
          <div className="info__text">
            <h1>{t('des2_title')}</h1>
            <p>
            {t('des2_detail')}
            </p>
          </div>
          <div className="info__img">
            <Image
              src="/img/landing-page/introduction-2.png"
              alt="landingimg"
              width={700}
              height={475}
            />
          </div>
        </section>
        <section className="features">
          <div className="features__container">
            <div className="content">
              <div className="effect" />
              <div className="list">
                <div className="list__item list__item--english">
                  <Image
                    src="/img/features-icon/english-ico-invert.svg"
                    alt="landingimg"
                    width={150}
                    height={100}
                  />
                  <div className="text">
                    <h3>{t('function1_title')}</h3>
                    <p>
                    {t('function1_des')}
                    </p>
                  </div>
                </div>
                <div className="list__item list__item--asvab">
                  <Image
                    src="/img/features-icon/asvab-ico-invert.svg"
                    alt="landingimg"
                    width={150}
                    height={100}
                  />
                  <div className="text">
                    <h3>{t('function3_title')}</h3>
                    <p>{t('function3_des')}</p>
                  </div>
                </div>
                <div className="list__item list__item--sat">
                  <Image
                    src="/img/features-icon/sat-ico-invert.svg"
                    alt="landingimg"
                    width={150}
                    height={100}
                  />
                  <div className="text">
                    <h3>{t('function2_title')}</h3>
                    <p>
                    {t('function2_des')}
                    </p>
                  </div>
                </div>
                <div className="list__item list__item--nclex">
                  <Image
                    src="/img/features-icon/nclex-ico-invert.svg"
                    alt="landingimg"
                    width={150}
                    height={200}
                  />
                  <div className="text">
                    <h3>{t('function4_title')}</h3>
                    <p>
                    {t('function4_des')}
                    </p>
                  </div>
                </div>
              </div>
              <Link href="/hub">
                <div className="link">
                  <p>{t('function_btn')}</p>
                  <div className="arrow">
                    <span className="arrow__body" />
                    <span className="arrow__head" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>
        <section className="info">
          <div className="info__text">
            <h1>{t('des3_title')}</h1>
            <p>
            {t('des3_detail')}
            </p>
          </div>
          <div className="info__img">
            <Image
              src="/img/landing-page/introduction-3.png"
              alt="landingimg"
              width={700}
              height={475}
            />
          </div>
        </section>
        <section className="info info--reverse">
          <div className="info__text">
            <h1>{t('des4_title')}</h1>
            <p>
            {t('des4_detail')}
            </p>
          </div>
          <div className="info__img">
            <Image
              src="/img/landing-page/introduction-4.png"
              alt="landingimg"
              width={700}
              height={475}
            />
          </div>
        </section>
        <section className="info info--final">
          <div className="info__text">
            <h1>{t('des5_title')}</h1>
            <p>
            {t('des5_detail')}
            </p>
            <Link href="/hub">
              <p>{t('des5_btn')}</p>
              <div className="arrow">
                <span className="arrow__body" />
                <span className="arrow__head" />
              </div>
            </Link>
          </div>
          <div className="info__img">
            <Image
              src="/img/landing-page/introduction-5.png"
              alt="landingimg"
              width={700}
              height={475}
            />
          </div>
        </section>
        {/* <Footer /> */}
      </main>
    </>
  );
}
