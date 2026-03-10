import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

interface Props {
  end: number;
  suffix?: string;
  label: string;
}

const Counter = ({ end, suffix = "", label }: Props) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end]);

  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl md:text-5xl font-serif font-bold text-accent">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-sm text-primary-foreground/70 mt-2 uppercase tracking-wider">{label}</p>
    </div>
  );
};

export default Counter;
