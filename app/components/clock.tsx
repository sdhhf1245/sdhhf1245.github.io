import { useEffect, useState } from "react";
import { FaClock } from "react-icons/fa";

export default function Clock() {
    const [time, set] = useState(new Date().toLocaleTimeString("en-GB"));

    useEffect(() => {
        const i = setInterval(() => set(new Date().toLocaleTimeString("en-GB")), 1000);
        return () => clearInterval(i);
    }, []);

    return (
        <h1 className="text-2xl font-semibold tracking-tighter flex items-center gap-2">
            <FaClock />
            {time}
        </h1>
    );
}
