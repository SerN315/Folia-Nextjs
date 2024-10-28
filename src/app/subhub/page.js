'use client';
import Image from "next/image";
import Head from "next/head";
import Script from "next/script";
//import Footer from "../Component/footer";
import "../scss/practice.scss";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
export default function Subhub() {
    const useParams = useSearchParams();
    const id = useParams.get("topic");
    const tag = useParams.get("tag");
  return (
<>
<Head>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Hobbies - Practice</title>
</Head>
  <main>
    {/* PRACTICE PAGE CONTENT */}
    <h2 className="practice-title">Practices</h2>
    <h2 className="descriptions">Choose Your Prefered Practice Style</h2>
    <div className="practice-content-box">
      <div className="grid-container">
        <div className="practice__multi-choice">
          <Link href={`/multichoices?topic=${id}&tag=${tag}`}>
            <button className="practice-button multi-choice">
              Multiple choices
            </button>
          </Link>
        </div>
        <div className="practice__flashcard">
          <Link href={`/flashcard?topic=${id}&tag=${tag}`}>
            <button className="practice-button flashcard">Flashcard</button>
          </Link>
        </div>
        <div className="practice__text-ex">
          <Link href={`/fillblank?topic=${id}&tag=${tag}`}>
            <button className="practice-button text-ex">Fill The Blank</button>
          </Link>
        </div>
        <div className="practice__matching">
          <Link href={`/dragdrop?topic=${id}&tag=${tag}`}>
            <button className="practice-button matching">Drag and Drop</button>
          </Link>
        </div>
      </div>
    </div>
  </main>
</>
  )
}