import Image from "next/image";
import Head from "next/head";
import Script from "next/script";
//import Footer from "../Component/footer";
import "../scss/hub.scss";
import Link from "next/link";
import initTranslations from '../../i18n';
export default async function Hub({ params: { locale } }) {
  const { t } = await initTranslations(locale, ['hub']);
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Folia - Features</title>
      </Head>
      <main className="hub">
        <div className="header">
          <Link className="home-link" href="/">
            <h1 className="logo">FOLIA</h1>
          </Link>
        </div>
        <div className="content">
          <div className="title">
            <p>{t('header_1')}</p>
            <h2>{t('header_2')}</h2>
          </div>
          <div className="description">
            <p>
            {t('header_des')}
            </p>
            <p>
            {t('header_des2')}
            </p>
          </div>
          <div className="features">
            <div className="features__title">
              <p>{t('header_3')}</p>
              <h2 style={{ wordSpacing: 4 }}>{t('header_4')}</h2>
            </div>
            <div className="features__list">
            <h2>{t('header_5')}</h2>
              <div className="Language">
              <Link href="/home" className="link link--english">
                <div className="item">
                  <Image
                    src="/img/features-icon/E.svg"
                    width={100}
                    height={100}
                  />
                  <div className="text">
                    <h4>English</h4>
                    <p>
                    {t('subject_eng')}
                    </p>
                  </div>
                </div>
              </Link>
              {/* <Link href="/home" className="link link--vie">
                <div className="item">
                  <Image
                    src="/img/features-icon/V.svg"
                    width={100}
                    height={100}
                    
                  />
                  <div className="text">
                    <h4>Vietnamese</h4>
                    <p>
                      Unlock fluency, confidence, and mastery effortlessly in
                      Vietnamese through our topic-based courses, games and
                      practice excercises
                    </p>
                  </div>
                </div>
              </Link>
              <Link href="/home" className="link link--fr">
                <div className="item">
                  <Image
                    src="/img/features-icon/F.svg"
                    width={100}
                    height={100}
                  />
                  <div className="text">
                    <h4>French</h4>
                    <p>
                      Unlock fluency, confidence, and mastery effortlessly in
                      French through our topic-based courses, games and
                      practice excercises
                    </p>
                  </div>
                </div>
              </Link> */}
              </div>
              <h2>{t('header_6')}</h2>
              <div className="cert">
              <Link href="/subhome?topic=folia-asvab" className="link link--asvab">
                <div className="item">
                  <Image
                    src="/img/features-icon/asvab-ico.svg"
                    width={100}
                    height={100}
                  />
                  <div className="text">
                    <h4>ASVAB</h4>
                    <p>
                      {t('subject_asvab')}
                    </p>
                  </div>
                </div>
              </Link>
              {/* <Link href="/subhome?topic=folia-SAT" className="link link--sat">
                <div className="item">
                  <Image
                    src="/img/features-icon/sat-ico.svg"
                    width={100}
                    height={100}
                  />
                  <div className="text">
                    <h4>SAT</h4>
                    <p>
                      The SAT is an entrance exam used by most colleges and
                      universities to make admissions decisions. The SAT is a
                      multiple-choice, pencil-and-paper test created and
                      administered by the College Board.
                    </p>
                  </div>
                </div>
              </Link>
              <Link href="/subhome?topic=folia-NCLEX" className="link link--nclex">
                <div className="item">
                  <Image
                    src="/img/features-icon/nclex-ico.svg"
                    width={100}
                    height={100}
                  />
                  <div className="text">
                    <h4>NCLEX</h4>
                    <p>
                      The NCLEX-RN, which stands for the National Council
                      Licensure Examination [for] Registered Nurses (RN), is a
                      computer adaptive test that is required for nursing
                      graduates to successfully pass to be licensed as a
                      Registered Nurse in the US and Canada. In other words,
                      anyone who wants to become a Registered Nurse in either
                      the US or Canada, must pass the NCLEX-RN.
                    </p>
                  </div>
                </div>
              </Link>
              <Link href="/subhome?topic=folia-ACT" className="link link--act">
                <div className="item">
                  <Image
                    src="/img/features-icon/act-ico.svg"
                    width={100}
                    height={100}
                  />
                  <div className="text">
                    <h4>ACT</h4>
                    <p>
                      The ACT is an entrance exam used by most colleges and
                      universities to make admissions decisions. It is a
                      multiple-choice, pencil-and-paper test administered by
                      ACT, Inc.The purpose of the ACT test is to measure a high
                      school student&apos;s readiness for
                      college,&nbsp;and&nbsp;provide colleges with one
                      common&nbsp;data point that can be used to compare all
                      applicants.&nbsp;College admissions officers&nbsp;will
                      review standardized test scores alongside your high school
                      GPA, the classes you took in high school, letters of
                      recommendation from teachers or mentors, extracurricular
                      activities, admissions interviews, and personal essays.
                      How important ACT scores are in the college application
                      process varies from school to school.
                    </p>
                  </div>
                </div>
              </Link> */}
              </div>
            </div>
          </div>
        </div>
        {/* <Footer /> */}
      </main>
    </>
  );
}
