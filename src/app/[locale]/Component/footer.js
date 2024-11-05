'use client';
import Link from "next/link";
import { useTranslation } from './TranslationProvider';

export default function Footer() {
  const { t, isLoading } = useTranslation();

  if (isLoading) return <div>Loading...</div>;

  return (
    <section className="footer">
      <div className="footer__container">
        <div className="footer__container__left">
          <div className="left__logo">
            <h1>FOLIA</h1>
          </div>
          <div className="left__des">
            <h3>{t('des')}</h3>
          </div>
        </div>
        <div className="footer__container__right">
          <div className="right__contact">
            <h1>{t('contact')}</h1>
            <div className="phonenumber">
              <h3>0123456789</h3>
            </div>
            <div className="email">
              <h3>folia@gmail.com</h3>
            </div>
            <div className="address">
              <h3>78 Giai Phong street, HaNoi, Vietnam</h3>
            </div>
          </div>
          <div className="right__ourservices">
            <h1>{t('services')}</h1>
            <Link href="/about">{t('aboutus', { ns: 'footer' })}</Link>
          </div>
          <div className="right__partner">
            <h1>{t('Partner')}</h1>
          </div>
        </div>
      </div>
      <div className="footer__rights">
        <h3>{t('copyrights')}</h3> |{" "}
        <Link href="#">{t('privacy')}</Link>
      </div>
    </section>
  );
}
