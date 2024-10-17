import Image from "next/image";
import Head from "next/head";
import Script from "next/script";
import Footer from "./Component/footer";
export default function Home() {
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
        <a className="nav-btn" href="/about">
          About Us
        </a>
        <a className="nav-btn" href="/hub">
          Features
        </a>
      </div>
    </div>
    <div className="content">
      <div className="content__container">
        <h1>
          WELCOME TO FOLIA. YOUR <br />
          TOP PICK FOR <highlight>EVERYTHING</highlight>
        </h1>
        <p>
          We stands out by offering a plethora of subjects for exploration,
          transcending traditional learning platforms, fostering deeper
          understanding, creativity, and personal growth beyond knowledge.
        </p>
        <a href="/hub">
          <button>
            Get start with us now
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
        </a>
      </div>
    </div>
  </section>
  <section className="info">
    <div className="info__text">
      <h1>FROM A GROUP OF DEDICATED LEARNERS</h1>
      <p>
        Welcome to Folia! Our multi-subject learning platform is designed for
        beginners, offering a diverse array of tools and resources. Join us
        today to explore exciting subjects and unlock your full potential!
      </p>
      <a href="/about">
        <p>Learn more about us</p>
        <div className="arrow">
          <span className="arrow__body" />
          <span className="arrow__head" />
        </div>
      </a>
    </div>
    <div className="info__img">
      <Image   src="/img/landing-page/introduction-1.png"
            alt="Introduction Image 1"
            width={700}
            height={475}
            />
    </div>
  </section>
  <section className="info info--reverse info--pre">
    <div className="info__text">
      <h1>MORE THAN JUST “KNOWLEDGE”</h1>
      <p>
        We strive to bring knowledge to everyone through our tailored courses
        for learning new topics and subjects. Folia also offers multiple games,
        quizzes, and interactive activities to help you keep up with the pace
        and make learning more enjoyable for than ever before.
      </p>
    </div>
    <div className="info__img">
      <Image src="/img/landing-page/introduction-2.png" alt="landingimg" 
            width={700}
            height={475} />
    </div>
  </section>
  <section className="features">
    <div className="features__container">
      <div className="content">
        <div className="effect" />
        <div className="list">
          <div className="list__item list__item--english">
            <Image src="/img/features-icon/english-ico-invert.svg" alt="landingimg"
            width={150}
            height={100}/>
            <div className="text">
              <h3>English with Folia</h3>
              <p>
                Unlock fluency, confidence, and mastery effortlessly in English.
              </p>
            </div>
          </div>
          <div className="list__item list__item--asvab">
            <Image src="/img/features-icon/asvab-ico-invert.svg" alt="landingimg" 
             width={150}
             height={100}/>
            <div className="text">
              <h3>ASVAB with Folia</h3>
              <p>Elevate military test readiness with expert guidance.</p>
            </div>
          </div>
          <div className="list__item list__item--sat">
            <Image src="/img/features-icon/sat-ico-invert.svg" alt="landingimg"
             width={150}
             height={100}/>
            <div className="text">
              <h3>SAT with Folia</h3>
              <p>
                The SAT is an entrance exam used by most colleges and
                universities to make admissions decisions.
              </p>
            </div>
          </div>
          <div className="list__item list__item--nclex">
            <Image src="/img/features-icon/nclex-ico-invert.svg" alt="landingimg" 
             width={150}
             height={200}/>
            <div className="text">
              <h3>NCLEX with Folia</h3>
              <p>
                The NCLEX-RN, which stands for the National Council Licensure
                Examination [for] Registered Nurses (RN), is a computer adaptive
                test that is required for nursing graduates to successfully pass
                to be licensed as a Registered Nurse in the US and Canada.
              </p>
            </div>
          </div>
        </div>
        <a href="/hub">
          <div className="link">
            <p>View more of our features here</p>
            <div className="arrow">
              <span className="arrow__body" />
              <span className="arrow__head" />
            </div>
          </div>
        </a>
      </div>
    </div>
  </section>
  <section className="info">
    <div className="info__text">
      <h1>PRACTICE EXERCISES AND GAMES</h1>
      <p>
        As peers, learners and students, we know the journey in learning can be
        sometimes hard, because of that, FOLIA was built as a learning tool for
        students and learners all around the world to fasten the learning
        process while making the learning journey even more fun and enjoyable!
      </p>
    </div>
    <div className="info__img">
      <Image src="/img/landing-page/introduction-3.png" alt="landingimg" 
      width={700}
      height={475}/>
    </div>
  </section>
  <section className="info info--reverse">
    <div className="info__text">
      <h1>MULTIPLE PLATFORMS SUPPORTED</h1>
      <p>
        We strive to bring knowledge to everyone through our tailored courses
        for learning new topics and subjects. Folia also offers multiple games,
        quizzes, and interactive activities to help you keep up with the pace
        and make learning more enjoyable for than ever before.
      </p>
    </div>
    <div className="info__img">
      <Image src="/img/landing-page/introduction-4.png" alt="landingimg" 
      width={700}
      height={475}/>
    </div>
  </section>
  <section className="info info--final">
    <div className="info__text">
      <h1>READY TO START?</h1>
      <p>
        Join the thriving Folia community today and dive into a world of
        interactive lessons, expert guidance, and personalized learning paths.
        Your journey to knowledge and growth begins here, where every click
        brings you closer to unlocking your full potential.
      </p>
      <a href="/hub">
        <p>Get start now</p>
        <div className="arrow">
          <span className="arrow__body" />
          <span className="arrow__head" />
        </div>
      </a>
    </div>
    <div className="info__img">
      <Image src="/img/landing-page/introduction-5.png" alt="landingimg" 
      width={700}
      height={475}/>
    </div>
  </section>
<Footer />
</main>
</>
  );
}
