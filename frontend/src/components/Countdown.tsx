import { useMotionValueEvent } from 'framer-motion';
import React, { useEffect, useState } from 'react'

const Countdown = ({ endTime }) => {
    const [timeleft, setTimeLeft] = useState('');
    useEffect(() => {
        const timer = setInterval(() => {
            const end = new Date(endTime).getTime();
            const current = new Date().getTime();
            const diff = end - current;
            if (diff < 0) {
                setTimeLeft('Contest ended');
                clearInterval(timer);
            }
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);

        }, 1);
    }, [endTime])


    return (
        <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
        Time Left: {timeleft}
      </div>
    )
}

export default Countdown
