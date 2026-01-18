"use client"; // So that I can use await
import { useEffect, useState } from "react";
import { FaLastfmSquare } from "react-icons/fa";

export const Periods = {
  Weekly: "7day",
  Monthly: "1month",
  Quarterly: "3month",
  BiYearly: "6month",
  Yearly: "12month",
  Overall: "overall",
} as const;

type Period = (typeof Periods)[keyof typeof Periods];

export type Album = {
  name?: string;
  mbid?: string;
  url?: string;
  playcount?: string;
  artist?: {
    name?: string;
    url?: string;
    mbid?: string;
  };
  image?: {
    size?: "small" | "medium" | "large" | "extralarge";
    "#text"?: string;
  }[];
  "@attr"?: {
    rank?: string;
  };
};

export default function Lastfm() {
  const [albums, setalbums] = useState<Album[]>([]);
  const [period, setperiod] = useState<Period>(Periods.Weekly);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    // await this so that NextJS doesn't complain about some bs
    async function get() {
      setloading(true);
      const data = await Grid({ period, columns: 5, rows: 5 });
      setalbums(data);
      setloading(false);
    }
    get();
  }, [period]);

  return (
    <div className="flex gap-2 flex-col lg:flex-row">
      <div className="space-y-2 flex-1">
        <div className="bg-[var(--background-900)] z-10 flex flex-col p-3 md:p-4 rounded-xl border-1 border-secondary">
          <h1 className="flex justify-between items-center text-xl md:text-2xl font-bold pb-2">
            Top Albums
            <a href="https://last.fm/user/sdhhf" target="_blank">
              <FaLastfmSquare className="ml-2" />
            </a>
          </h1>

          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar">
            {Object.entries(Periods).map(([name, value]) => (
              <button
                key={name}
                onClick={() => {
                  setalbums([]);
                  setperiod(value);
                }}
                className={`flex-shrink-0 px-3 py-1 rounded-full text-sm transition ${
                  period === value && !loading
                    ? "bg-primary text-background font-semibold"
                    : "bg-[var(--background-800)] text-foreground hover:bg-[var(--background-700)]"
                }`}
              >
                {name}
              </button>
            ))}
          </div>

          {loading ? (
            <span className="text-sm text-foreground/50">Loading...</span>
          ) : albums.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {albums.map((album, idx) => (
                <a key={idx} target="_blank" href={album.url}>
                  <div className="rounded-lg bg-[var(--background-800)] p-3 transition hover:bg-[var(--background-700)]">
                    <div className="aspect-square w-full overflow-hidden rounded-md bg-black/20">
                      {album.image?.[3]?.["#text"] ? (
                        <img
                          src={album.image[3]["#text"]}
                          alt={album.name ?? "album"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-black/30" />
                      )}
                    </div>
                    <div className="mt-3 space-y-0.5">
                      <div className="text-lg font-semibold truncate">
                        {album.name ?? "Unknown Album"}
                      </div>
                      <div className="text-sm text-foreground/50 truncate">
                        {album.artist?.name ?? "Unknown Artist"}
                      </div>
                      <div className="text-xs text-foreground/50 truncate">
                        {album.playcount ? `${album.playcount} play(s)` : ""}
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <span className="text-sm text-foreground/50">No Albums</span>
          )}
        </div>
      </div>
    </div>
  );
}

async function Grid({
  period,
  columns,
  rows,
}: {
  period: Period;
  columns: number;
  rows: number;
}) {
  const user = "sdhhf";
  const key = "61d580c50e6e5e3f14b6bd9527e5395f"; // Not my key!
  const limit = columns * rows + 5;
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${user}&period=${period}&limit=${limit}&api_key=${key}&format=json`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.topalbums?.album ?? [];
  } catch {
    return [];
  }
}
