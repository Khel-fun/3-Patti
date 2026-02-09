import React, { useEffect, useRef, useMemo } from "react";

const GlowingBackground = () => {
    const containerRef = useRef(null);

    // Generate random icons once on mount
    const icons = useMemo(() => {
        const svgAssets = [
            "/background assets/ace-of-clovers-svgrepo-com.svg", // Note: Ensure the path handles spaces correctly
            "/background assets/ace-of-hearts-svgrepo-com.svg",
            "/background assets/card-backwards-svgrepo-com.svg"
        ];

        const items = [];
        const cols = 60; // Covers ~3000px width
        const rows = 40; // Covers ~2000px height
        const density = 0.05; // 5% of cells have an icon

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (Math.random() < density) {
                    items.push({
                        id: `${r}-${c}`,
                        src: svgAssets[Math.floor(Math.random() * svgAssets.length)],
                        left: c * 50,
                        top: r * 50,
                        // Random slight rotation for "tossed" look, or 0/90/180/270 for neat look.
                        // "Inside each box" implies fit. Let's do neat grid alignment.
                        rotation: Math.floor(Math.random() * 4) * 90,
                    });
                }
            }
        }
        return items;
    }, []);

    useEffect(() => {
        const updateMousePosition = (ev) => {
            if (!containerRef.current) return;
            const { clientX, clientY } = ev;
            containerRef.current.style.setProperty("--x", `${clientX}px`);
            containerRef.current.style.setProperty("--y", `${clientY}px`);
        };

        window.addEventListener("mousemove", updateMousePosition);

        return () => {
            window.removeEventListener("mousemove", updateMousePosition);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 pointer-events-none overflow-hidden"
        >
            {/* Ambient Background Blobs */}
            <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] bg-blue-500/5 rounded-full blur-[150px] animate-pulse delay-1000"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px] animate-pulse delay-700"></div>

            {/* Base Grid Pattern opacity-20 */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

            {/* Faint Base Layer of Icons (Barely visible always) */}
            <div className="absolute inset-0 overflow-hidden opacity-[0.05]">
                {icons.map((icon) => (
                    <img
                        key={`base-${icon.id}`}
                        src={icon.src}
                        alt=""
                        className="absolute w-8 h-8 opacity-50 invert"
                        style={{
                            left: icon.left + 9, // Center in 50px (50-32)/2 = 9
                            top: icon.top + 9,
                            transform: `rotate(${icon.rotation}deg)`
                        }}
                    />
                ))}
            </div>

            {/* Glowing Mouse Follower Layer - Contains Grids + Icons */}
            <div
                className="absolute inset-0"
                style={{
                    maskImage: "radial-gradient(350px circle at var(--x, 0px) var(--y, 0px), black, transparent)",
                    WebkitMaskImage: "radial-gradient(350px circle at var(--x, 0px) var(--y, 0px), black, transparent)"
                }}
            >
                {/* Brighter Grid in the glow area */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

                {/* Brighter Icons in the glow area */}
                <div className="absolute inset-0 overflow-hidden">
                    {icons.map((icon) => (
                        <img
                            key={`glow-${icon.id}`}
                            src={icon.src}
                            alt=""
                            className="absolute w-8 h-8 opacity-40 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] invert"
                            style={{
                                left: icon.left + 9,
                                top: icon.top + 9,
                                transform: `rotate(${icon.rotation}deg)`
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Soft Light Overlay for extra glow effect */}
            <div
                className="absolute inset-0"
                style={{
                    background: "radial-gradient(400px circle at var(--x, 0px) var(--y, 0px), rgba(59, 130, 246, 0.08), transparent 40%)"
                }}
            ></div>
        </div>
    );
};

export default GlowingBackground;
