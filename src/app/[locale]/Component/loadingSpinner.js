import Image from "next/image";
import Head from "next/head";
import Script from "next/script";
import Link from "next/link";
import "../scss/spinner.scss"
export default function LoadingSpinner() {
    return(
<div className="bookshelf_wrapper">
  <ul className="books_list">
    <li className="book_item first" />
    <li className="book_item second" />
    <li className="book_item third" />
    <li className="book_item fourth" />
    <li className="book_item fifth" />
    <li className="book_item sixth" />
  </ul>
  <div className="shelf" />
</div>
    )
}
