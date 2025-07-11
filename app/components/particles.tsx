"use client";

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { type Container, type ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

export const ParticlesBackground = () => {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particlesLoaded = async (container?: Container): Promise<void> => {
        console.log(container);
    };

    const options: ISourceOptions = useMemo(() => ({
        autoPlay: true,
        background: {
            //   color: { value: "#333333" },
            opacity: 0,
        },
        clear: true,
        fullScreen: {
            enable: true,
            zIndex: -1,
        },
        detectRetina: true,
        fpsLimit: 120,
        interactivity: {
            detectsOn: "window",
            events: {
                resize: { enable: true, delay: 0.5 },
            },
            modes: {
                trail: { delay: 1, pauseOnStop: false, quantity: 1 },
                attract: {
                    distance: 200,
                    duration: 0.4,
                    easing: "ease-out-quad",
                    factor: 1,
                    maxSpeed: 50,
                    speed: 1,
                },
                bounce: { distance: 200 },
                bubble: { distance: 200, duration: 0.4 },
                connect: { distance: 80, links: { opacity: 0.5 }, radius: 60 },
                grab: {
                    distance: 100,
                    links: { opacity: 1 },
                },
                push: { quantity: 4 },
                remove: { quantity: 2 },
                repulse: {
                    distance: 200,
                    duration: 0.4,
                    factor: 100,
                    speed: 1,
                    maxSpeed: 50,
                    easing: "ease-out-quad",
                },
                slow: { factor: 3, radius: 200 },
            },
        },
        particles: {
            bounce: {
                horizontal: { value: 1 },
                vertical: { value: 1 },
            },
            collisions: {
                enable: false,
                mode: "bounce",
                overlap: { enable: true },
            },
            color: {
                value: "#fff",
            },
            move: {
                direction: "bottom",
                enable: true,
                outModes: {
                    default: "out",
                    bottom: "out",
                    left: "out",
                    right: "out",
                    top: "out",
                },
                speed: 2,
                straight: true,
            },
            number: {
                density: { enable: true, width: 1920, height: 1080 },
                value: 400,
            },
            opacity: {
                value: 1,
            },
            shape: { type: "circle" },
            size: { value: 3 },
            wobble: {
                enable: true,
                distance: 10,
                speed: {
                    angle: 10,
                    move: 10,
                },
            },
            zIndex: {
                value: { min: 0, max: 100 },
                opacityRate: 10,
                sizeRate: 10,
                velocityRate: 10,
            },
        },
        pauseOnBlur: true,
        pauseOnOutsideViewport: true,
        zLayers: 100,
    }), []);

    if (!init) return null;

    return (
        <Particles id="tsparticles" particlesLoaded={particlesLoaded} options={options} />
    );
};
