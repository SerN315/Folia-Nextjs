// js/commonFunctions/scrollDrags.js
import { useEffect } from 'react';

export const useDragScroll = (ref) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    // Mouse events
    const mouseDownHandler = (e) => {
      isDown = true;
      element.classList.add('active');
      startX = e.pageX - element.offsetLeft;
      scrollLeft = element.scrollLeft;
    };

    const mouseLeaveHandler = () => {
      isDown = false;
      element.classList.remove('active');
    };

    const mouseUpHandler = () => {
      isDown = false;
      element.classList.remove('active');
    };

    const mouseMoveHandler = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - element.offsetLeft;
      const walk = (x - startX) * 2; // Adjust speed as necessary
      element.scrollLeft = scrollLeft - walk;
    };

    // Touch events
    const touchStartHandler = (e) => {
      isDown = true;
      startX = e.touches[0].pageX - element.offsetLeft;
      scrollLeft = element.scrollLeft;
    };

    const touchEndHandler = () => {
      isDown = false;
    };

    const touchMoveHandler = (e) => {
      if (!isDown) return;
      const x = e.touches[0].pageX - element.offsetLeft;
      const walk = (x - startX) * 2;
      element.scrollLeft = scrollLeft - walk;
    };

    // Attach event listeners
    element.addEventListener('mousedown', mouseDownHandler);
    element.addEventListener('mouseleave', mouseLeaveHandler);
    element.addEventListener('mouseup', mouseUpHandler);
    element.addEventListener('mousemove', mouseMoveHandler);

    element.addEventListener('touchstart', touchStartHandler);
    element.addEventListener('touchend', touchEndHandler);
    element.addEventListener('touchmove', touchMoveHandler);

    // Cleanup event listeners on component unmount
    return () => {
      element.removeEventListener('mousedown', mouseDownHandler);
      element.removeEventListener('mouseleave', mouseLeaveHandler);
      element.removeEventListener('mouseup', mouseUpHandler);
      element.removeEventListener('mousemove', mouseMoveHandler);

      element.removeEventListener('touchstart', touchStartHandler);
      element.removeEventListener('touchend', touchEndHandler);
      element.removeEventListener('touchmove', touchMoveHandler);
    };
  }, [ref]);
};
