import Image from "next/image";
import Head from "next/head";
import Script from "next/script";
export default function Footer() {
  return (
    <section className="footer">
  <div className="footer__container">
    <div className="footer__container__left">
      <div className="left__logo">
        <h1>FOLIA</h1>
      </div>
      <div className="left__social">
        <a href="#" />
        <a href="#" />
        <a href="#" />
        <a href="#" />
      </div>
      <div className="left__des">
        <h3>
          Folia is a fun learning platform for all levels. Personalized lessons
          improve your desirable subjects. Track progress and set goals easily.
          Start your journey with Folia!
        </h3>
      </div>
    </div>
    <div className="footer__container__right">
      <div className="right__contact">
        <h1>Contact Us</h1>
        <div className="phonenumber">
          <h3>0123456789</h3>
        </div>
        <div className="email">
          <h3>folia@gmail.com</h3>
        </div>
        <div className="address">
          <h3>78 Giai Phong street, HaNoi,Vietnam</h3>
        </div>
      </div>
      <div className="right__ourservices">
        <h1>Our services</h1>
        <a href="/about">About us</a>
      </div>
      <div className="right__partner">
        <h1>Partner</h1>
      </div>
    </div>
  </div>
  <div className="footer__rights">
    <h3>Copyright by Folia 2023 All rights reserved</h3> |{" "}
    <a href="#">Privacy Policy</a>
  </div>
</section>
);
}