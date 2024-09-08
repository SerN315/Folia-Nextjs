import Image from "next/image";
import Head from "next/head";
import Script from "next/script";
import Footer from "../Component/footer";
import "../scss/hub.scss";
export default function Hub() {
    return(
<>
<Head>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Folia - Features</title>
  </Head>
  <main className="hub">
  <div className="header">
    <a className="home-link" href="/index">
      <h1 className="logo">FOLIA</h1>
    </a>
  </div>
  <div className="content">
    <div className="title">
      <p>Explore a vast variety of subjects with Folia</p>
      <h2>OUR FEATURES</h2>
    </div>
    <div className="description">
      <p>
        At Folia, we&apos;re your one-stop-shop for mastering multiple subjects.
        Explore a wide range of topics carefully chosen to improve your language
        skills and academic abilities. Our goal is simple: to change how you
        learn, making it easier and more enjoyable for everyone, no matter where
        you come from or what your budget is.
      </p>
      <p>
        With our passion for global education, we break down barriers, offering
        opportunities for learning across borders, online, and abroad. Whether
        you&apos;re starting a language journey or considering studying
        internationally, Folia is here to support you every step of the way.
      </p>
    </div>
    <div className="features">
      <div className="features__title">
        <p>Select your favorite topics and subjects from our list here</p>
        <h2 style={{ wordSpacing: 4 }}>SUBJECTS LIST</h2>
      </div>
      <div className="features__list">
        <a href="/home" className="link link--english">
          <div className="item">
            <Image src="./img/features-icon/english-ico.svg"  width={100}
              height={100} />
            <div className="text">
              <h4>English</h4>
              <p>
                Unlock fluency, confidence, and mastery effortlessly in English
                through our topic-based courses, games and practice excercises
              </p>
            </div>
          </div>
        </a>
        <a href="#" className="link link--asvab">
          <div className="item">
            <Image src="/img/features-icon/asvab-ico.svg" width={100}
              height={100} />
            <div className="text">
              <h4>ASVAB</h4>
              <p>
                Ace your Armed Services Vocational Aptitude Battery (ASVAB)
                certificate with our learning exercises, detailed explanation
                and practice questions
              </p>
            </div>
          </div>
        </a>
        <a href="#" className="link link--sat">
          <div className="item">
            <Image src="/img/features-icon/sat-ico.svg"  width={100}
              height={100}/>
            <div className="text">
              <h4>SAT</h4>
              <p>
                The SAT is an entrance exam used by most colleges and
                universities to make admissions decisions. The SAT is a
                multiple-choice, pencil-and-paper test created and administered
                by the College Board.
              </p>
            </div>
          </div>
        </a>
        <a href="#" className="link link--nclex">
          <div className="item">
            <Image src="/img/features-icon/nclex-ico.svg" width={100}
              height={100}/>
            <div className="text">
              <h4>NCLEX</h4>
              <p>
                The NCLEX-RN, which stands for the National Council Licensure
                Examination [for] Registered Nurses (RN), is a computer adaptive
                test that is required for nursing graduates to successfully pass
                to be licensed as a Registered Nurse in the US and Canada. In
                other words, anyone who wants to become a Registered Nurse in
                either the US or Canada, must pass the NCLEX-RN.
              </p>
            </div>
          </div>
        </a>
        <a href="#" className="link link--act">
          <div className="item">
            <Image src="/img/features-icon/act-ico.svg"  width={100}
              height={100}/>
            <div className="text">
              <h4>ACT</h4>
              <p>
                The ACT is an entrance exam used by most colleges and
                universities to make admissions decisions. It is a
                multiple-choice, pencil-and-paper test administered by ACT,
                Inc.The purpose of the ACT test is to measure a high school
                student&apos;s readiness for college,&nbsp;and&nbsp;provide colleges
                with one common&nbsp;data point that can be used to compare all
                applicants.&nbsp;College admissions officers&nbsp;will review
                standardized test scores alongside your high school GPA, the
                classes you took in high school, letters of recommendation from
                teachers or mentors, extracurricular activities, admissions
                interviews, and personal essays. How important ACT scores are in
                the college application process varies from school to school.
              </p>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
  <Footer/>
</main>
<Script type="module" src="/js/main.js"></Script>
<Script type="module" src="/js/hub.js" strategy="afterInteractive" ></Script>
</>
    )
}