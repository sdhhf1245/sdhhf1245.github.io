'use client';

import { useEffect, useRef, useState } from 'react';
import { FaDiscord, FaMusic, FaRecordVinyl, FaFaceFrownOpen, FaClock } from "react-icons/fa6";
import Clock from './clock';
import { formatTime } from './utils';

export default function LanyardWebSocketClient() {
    const ws = useRef<WebSocket | null>(null);
    const heartbeat = useRef<NodeJS.Timeout | null>(null);
    const [message, set] = useState<any>(null);
    const [time, setTime] = useState(Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(Date.now());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const socket = new WebSocket('wss://api.lanyard.rest/socket');
        ws.current = socket;

        socket.onopen = () => {
            console.log('connected to lanyard!');
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.op === 1) {
                const interval = data.d.heartbeat_interval;

                socket.send(
                    JSON.stringify({
                        op: 2,
                        d: {
                            subscribe_to_id: '1059614915456938084',
                        },
                    })
                );

                heartbeat.current = setInterval(() => {
                    socket.send(JSON.stringify({ op: 3 }));
                }, interval);
            }

            set(data);
        };

        socket.onerror = (err) => {
            console.error('lanyard error:', err);
        };

        socket.onclose = () => {
            console.log('disconnected from lanyard');
            if (heartbeat.current) clearInterval(heartbeat.current);
        };

        return () => {
            socket.close();
            if (heartbeat.current) clearInterval(heartbeat.current);
        };
    }, []);

    const feishin = message?.d.activities?.find(activity => activity.name === "Feishin");
    const finamp = message?.d.activities?.find(activity => activity.name === "Finamp");

    const player =
        feishin?.assets?.small_text === "playing"
            ? feishin
            : finamp || null;


    return (
        <div className="flex flex-col gap-2 w-full min-w-96 max-w-2xl">
            <section className="relative z-10 w-full p-5 mb-4 tracking-tight bg-[var(--background-100)]/20 backdrop-blur-[6px] border border-[var(--primary-200)] rounded-xl text-[var(--text-900)] hover:border-[var(--primary-300)] transition-all duration-300 hover:shadow-lg hover:scale-105 ">

                <h1 className="text-2xl font-semibold tracking-tighter flex items-center align-middle gap-2">
                    <FaDiscord />
                    Discord
                </h1>

                <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-[var(--primary-300)] to-transparent" />

                <div className="flex items-center gap-2">
                    <img
                        src="https://dcdn.dstn.to/avatars/1059614915456938084.png"
                        alt="User Avatar"
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                        <p className="font-bold flex items-center gap-2">
                            {message ? message.d.discord_user?.username : "..."}
                            <span className={`w-2 h-2 rounded-full inline-block animate-ping ${message?.d?.discord_status === 'online' ? 'bg-green-400' : message?.d?.discord_status === 'idle' ? 'bg-yellow-400' : message?.d?.discord_status === 'dnd' ? 'bg-red-400' : 'bg-gray-400'}`} />
                        </p>

                        {player && (
                            <p className="font-semibold text-[12px] text-[var(--secondary-400)] tracking-tighter flex items-center gap-1">
                                <FaMusic className="text-[12px] align-middle" />
                                Listening to Music
                            </p>
                        )}
                    </div>
                </div>
            </section>

            <section className="relative z-10 w-full p-6 tracking-tight bg-[var(--background-100)]/20 backdrop-blur-[6px] border border-[var(--primary-200)] rounded-xl text-[var(--text-900)] hover:border-[var(--primary-300)] transition-all duration-300 hover:shadow-lg hover:scale-105">
                <h1 className="text-2xl font-semibold tracking-tighter flex items-center align-middle gap-2">
                    <FaRecordVinyl />
                    Music
                </h1>

                <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-[var(--primary-300)] to-transparent" />
                {player ? (
                    <>
                        <div className="flex items-center gap-2">
                            <img
                                src={`https://media.discordapp.net/${player.assets.large_image.replace("mp:", "")}`}
                                alt="Album Art"
                                className="w-20 h-20 rounded-md object-cover"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-xl truncate">{player.details}</p>
                                <p className="font-semibold text-[12px] text-[var(--secondary-400)] tracking-tighter flex items-center gap-1 truncate">
                                    {player.state}
                                </p>

                                {player.timestamps && (
                                    <div className="mt-2">
                                        <div className="flex justify-between text-xs text-[var(--secondary-400)] mb-1">
                                            <span>{formatTime(time - player.timestamps.start)}</span>
                                            <span>{formatTime(player.timestamps.end - player.timestamps.start)}</span>
                                        </div>
                                        <div className="w-full bg-[var(--secondary-700)] rounded-full h-1.5">
                                            <div
                                                className="bg-[var(--accent-500)] h-1.5 rounded-full transition-all duration-1000"
                                                style={{
                                                    width: `${Math.min(100, ((time - player.timestamps.start) / (player.timestamps.end - player.timestamps.start)) * 100)}%`
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                ) : <p className="text-sm font-semibold tracking-tighter flex items-center gap-2 leading-tight">
                    <span className="flex items-center justify-center text-base">
                        <FaFaceFrownOpen />
                    </span>
                    Not listening to anything!
                </p>
                }

            </section>

            <section className="relative z-10 w-full p-5 mt-4 mb-4 tracking-tight bg-[var(--background-100)]/20 backdrop-blur-[6px] border border-[var(--primary-200)] rounded-xl text-[var(--text-900)] hover:border-[var(--primary-300)] transition-all duration-300 hover:shadow-lg hover:scale-105 ">
                <Clock />
            </section>
        </div>
    );
}