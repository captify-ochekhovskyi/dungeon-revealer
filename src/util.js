import { useState, useEffect, useRef } from "react";

/**
 * Utility for preloading an image as a promise
 */
export const loadImage = src => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = src;
    const removeEventListeners = () => {
      image.removeEventListener("load", loadListener);
      image.removeEventListener("error", errorListener);
    };
    const loadListener = () => {
      removeEventListeners();
      resolve(image);
    };
    const errorListener = err => {
      removeEventListeners();
      reject(err);
    };
    image.addEventListener("load", loadListener);
    image.addEventListener("error", errorListener);
  });
};

/**
 * longpress hook inspired by https://stackoverflow.com/a/54749871/4202031
 * works with touch an mouse events
 */
export const useLongPress = (callback = () => {}, ms = 300) => {
  const [startLogPress, setStartLongPress] = useState(false);
  const currentEventRef = useRef(null);

  useEffect(() => {
    let timerId;
    if (startLogPress) {
      timerId = setTimeout(() => {
        callback(currentEventRef.current);
        currentEventRef.current = null;
      }, ms);
    } else {
      clearTimeout(timerId);
      currentEventRef.current = null;
    }

    return () => {
      clearTimeout(timerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startLogPress]);

  useEffect(() => {
    const onMouseDown = ev => {
      currentEventRef.current = ev;
      setStartLongPress(true);
    };
    const onMouseUp = () => setStartLongPress(false);
    const onMouseMove = () => setStartLongPress(false);
    const onTouchMove = () => {
      setStartLongPress(false);
    };
    const onMouseLeave = () => setStartLongPress(false);

    const onTouchStart = ev => {
      ev.preventDefault();
      currentEventRef.current = ev;
      setStartLongPress(true);
    };
    const onTouchEnd = () => setStartLongPress(false);

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("touchstart", onTouchStart);
    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  });
};