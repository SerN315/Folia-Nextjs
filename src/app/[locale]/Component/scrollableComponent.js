// components/ScrollableList.js
"use client";
import { useRef, useEffect } from "react";
import { useDragScroll } from '../js/commonFunctions/scrollDrags';

export default function ScrollableList({ children, className }) {
  const scrollRef = useRef();

  // Apply the drag scroll to this ref
  useDragScroll(scrollRef);

  return (
    <div ref={scrollRef} className={className}>
      {children}
    </div>
  );
}
