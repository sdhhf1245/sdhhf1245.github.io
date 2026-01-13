import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { IoLogoGameControllerB } from "react-icons/io";

type Activity = {
  id: string;
  name: string;
  type: number;
  application_id?: string;
  details?: string;
  state?: string;
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
  timestamps?: {
    start?: number;
    end?: number;
  };
};

export const ActivityType: Record<number, string> = {
  0: "Playing",
  1: "Streaming",
  2: "Listening to",
  3: "Watching",
  4: "Playing",
};

export function FormatElapsed(ms: number): string {
  let total = Math.floor(ms / 1000);
  const seconds = total % 60;
  total = Math.floor(total / 60);
  const minutes = total % 60;
  total = Math.floor(total / 60);
  const hours = total % 24;
  const days = Math.floor(total / 24);

  const pad = (n: number) => n.toString().padStart(2, "0");

  if (days > 0)
    return `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  if (hours > 0) return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  return `${pad(minutes)}:${pad(seconds)}`;
}

export function FormatTime(ms?: number): string {
  if (!ms) return "0:00";
  const total = Math.floor(ms / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function ResolveAsset(
  asset?: string,
  applicationid?: string,
): string | null {
  if (!asset) return null;

  if (asset.startsWith("mp:")) {
    return `https://media.discordapp.net/${asset.replace("mp:", "")}`;
  }

  if (applicationid) {
    return `https://cdn.discordapp.com/app-assets/${applicationid}/${asset}.png`;
  }

  return null;
}

export function ProgressValue(start?: number, end?: number): number {
  if (!start || !end) return 0;
  const now = Date.now();
  return Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
}

export default function Lanyard() {
  const socketref = useRef<WebSocket | null>(null);
  const heartbeatref = useRef<NodeJS.Timeout | null>(null);
  const [activities, setactivities] = useState<Activity[]>([]);
  const [discord, setdiscord] = useState<any>(null);

  useEffect(() => {
    const socket = new WebSocket("wss://api.lanyard.rest/socket");
    socketref.current = socket;

    socket.onmessage = (event) => {
      const payload = JSON.parse(event.data);

      if (payload.op === 1) {
        heartbeatref.current = setInterval(() => {
          socket.send(JSON.stringify({ op: 3 }));
        }, payload.d.heartbeat_interval);

        socket.send(
          JSON.stringify({
            op: 2,
            d: { subscribe_to_ids: ["1059614915456938084"] },
          }),
        );
      }

      if (payload.op === 0) {
        if (payload.t === "INIT_STATE") {
          const presence = payload.d["1059614915456938084"];
          setactivities(presence?.activities ?? []);
          setdiscord(presence);
        }

        if (payload.t === "PRESENCE_UPDATE") {
          setactivities(payload.d.activities ?? []);
          setdiscord(payload.d);
        }
      }
    };

    return () => {
      if (heartbeatref.current) clearInterval(heartbeatref.current);
      socket.close();
    };
  }, []);

  const listening = activities.filter((activity) => activity.type === 2);
  const normal = activities.filter((activity) => activity.type !== 2);

  return (
    <div className="flex gap-2 flex-col lg:flex-row">
      <div className="space-y-2 flex-1">
        {listening.map((activity) => (
          <ListeningActivity key={activity.id} activity={activity} />
        ))}
        {normal.map((activity) => (
          <NormalActivity key={activity.id} activity={activity} />
        ))}
      </div>
      {discord && (
        <div className="lg:w-[400px] flex-shrink-0">
          <ProfileCard discord={discord} />
        </div>
      )}
    </div>
  );
}

export function ProfileCard({ discord }: { discord: any }) {
  const av = discord.discord_user?.avatar
    ? `https://cdn.discordapp.com/avatars/${discord.discord_user.id}/${discord.discord_user.avatar}.png?size=256`
    : "https://picsum.photos/200";

  const status = discord.discord_status || "offline";
  const colors: Record<string, string> = {
    online: "bg-green-500",
    idle: "bg-yellow-500",
    dnd: "bg-red-500",
    offline: "bg-gray-500",
  };

  const badge = discord.discord_user?.primary_guild?.badge
    ? `https://cdn.discordapp.com/guild-tag-badges/${discord.discord_user?.primary_guild.identity_guild_id}/${discord.discord_user?.primary_guild.badge}.png`
    : null;

  return (
    <div className="bg-[var(--background-900)] z-10 flex flex-col p-3 md:p-4 rounded-xl border-1 border-secondary h-full">
      <div className="flex items-center space-x-3 md:space-x-4">
        <div className="relative w-12 h-12 md:w-20 md:h-20 flex-shrink-0">
          <img
            src={av}
            alt="Profile"
            className="rounded-full w-full h-full object-cover"
          />
          <div
            className={`absolute bottom-0 right-0 w-3 h-3 md:w-5 md:h-5 ${colors[status]} rounded-full border-2 animate-ping border-[var(--background-900)]`}
          ></div>
        </div>

        <div className="flex flex-col justify-center flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xl md:text-2xl font-bold">
              {discord.discord_user?.display_name ||
                discord.discord_user?.username ||
                "..."}
            </span>
            <div className="rounded border border-secondary/50 flex items-center gap-1 px-1">
              {badge && (
                <img
                  src={badge}
                  alt="Guild "
                  className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0"
                />
              )}
              {discord.discord_user?.primary_guild?.tag && (
                <span className="text-xs md:text-base font-bold">
                  {discord.discord_user?.primary_guild.tag}
                </span>
              )}
            </div>
          </div>
          <span className="text-sm md:text-xl text-[var(--text)]/80">
            {discord.discord_user?.username || "..."}
          </span>
        </div>
      </div>

      <div className="h-px bg-secondary my-3 md:my-4"></div>

      {discord.kv?.bio
        ? discord.kv.bio
            .split(/\\n|\\r\\n|[\r\n]/)
            .map((line: string, idx: number) => {
              const urlRegex = /(https?:\/\/[^\s]+)/g;
              const parts = line.split(urlRegex);
              return (
                <span key={idx}>
                  {parts.map((part, i) =>
                    urlRegex.test(part) ? (
                      <a
                        key={i}
                        href={part}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary underline"
                      >
                        {part}
                      </a>
                    ) : (
                      part
                    ),
                  )}
                  <br />
                </span>
              );
            })
        : "..."}
    </div>
  );
}

export function ListeningActivity({ activity }: { activity: Activity }) {
  const image = ResolveAsset(
    activity.assets?.large_image,
    activity.application_id,
  );
  const [progress, setprogress] = useState(
    ProgressValue(activity.timestamps?.start, activity.timestamps?.end),
  );
  const [currenttime, setcurrenttime] = useState(0);

  useEffect(() => {
    let rafid: number;

    const update = () => {
      const start = activity.timestamps?.start ?? 0;
      const end = activity.timestamps?.end ?? 0;
      const now = Date.now();
      const clamped = Math.min(Math.max(now, start), end);
      setcurrenttime(clamped - start);
      setprogress(ProgressValue(start, end));
      rafid = requestAnimationFrame(update);
    };

    rafid = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafid);
  }, [activity.timestamps]);

  const duration =
    (activity.timestamps?.end ?? 0) - (activity.timestamps?.start ?? 0);

  return (
    <div
      className="bg-[var(--background-900)] z-10 flex flex-col p-3 md:p-4 rounded-xl border-1 border-secondary"
      data-activity-type="listening"
    >
      <a className="text-sm md:text-lg font-bold pb-2">{`${ActivityType[activity.type] ?? "Listening to"} ${activity.name}`}</a>
      <div className="flex space-x-3 md:space-x-4">
        {image && (
          <Image
            src={image}
            alt={activity.assets?.large_text ?? "Artwork"}
            width={192}
            height={192}
            className="rounded-md flex-shrink-0 w-20 h-20 md:w-48 md:h-48"
          />
        )}
        <div className="flex flex-col flex-1 min-h-[80px] md:min-h-[192px] justify-between">
          <div className="flex-1 flex flex-col justify-center space-y-0.5 md:space-y-1">
            {activity.details && (
              <a className="text-sm md:text-2xl font-bold line-clamp-2">
                {activity.details}
              </a>
            )}
            {activity.state && (
              <a className="text-xs md:text-xl line-clamp-1">
                {activity.state}
              </a>
            )}
            {activity.assets?.large_text && (
              <a className="text-xs md:text-xl line-clamp-1">
                {activity.assets.large_text}
              </a>
            )}
          </div>
          {activity.timestamps?.start && activity.timestamps?.end && (
            <div className="flex items-center space-x-2">
              <span className="text-xs md:text-xl">
                {FormatTime(currenttime)}
              </span>
              <div className="h-1.5 md:h-2 flex-1 bg-black/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs md:text-xl">{FormatTime(duration)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function NormalActivity({ activity }: { activity: Activity }) {
  const image = ResolveAsset(
    activity.assets?.large_image,
    activity.application_id,
  );

  const small_image = ResolveAsset(
    activity.assets?.small_image,
    activity.application_id,
  );

  const [elapsed, setelapsed] = useState(0);

  useEffect(() => {
    if (!activity.timestamps?.start) return;
    const update = () => {
      setelapsed(Date.now() - activity.timestamps?.start!);
      requestAnimationFrame(update);
    };
    const rafid = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafid);
  }, [activity.timestamps]);

  return (
    <div
      className="bg-[var(--background-900)] z-10 flex flex-col p-3 md:p-4 rounded-xl border-1 border-secondary"
      data-activity-type="normal"
    >
      <a className="text-sm md:text-lg font-bold pb-2">
        {`${ActivityType[activity.type] ?? "Playing"}`}
      </a>
      <div className="flex items-center space-x-3 md:space-x-4">
        {image && (
          <div className="relative w-20 h-20 md:w-48 md:h-48 flex-shrink-0">
            <div className="group/large">
              {activity.assets?.large_text && (
                <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded-md bg-[var(--background-800)] px-2 py-1 text-xs md:text-xl opacity-0 transition-opacity group-hover/large:opacity-100 shadow-lg z-30">
                  {activity.assets.large_text}
                </div>
              )}

              <Image
                src={image}
                alt={activity.assets?.large_text ?? activity.name ?? "Artwork"}
                width={192}
                height={192}
                className="rounded-md z-10 w-full h-full"
		unoptimized
              />
            </div>

            {small_image && (
              <div className="absolute bottom-[-8px] right-[-8px] md:bottom-[-16px] md:right-[-16px] z-20 group/small">
                {activity.assets?.small_text && (
                  <div className="pointer-events-none absolute bottom-full right-1/2 translate-x-1/2 mb-2 whitespace-nowrap rounded-md bg-[var(--background-800)] px-2 py-1 text-xs md:text-xl opacity-0 transition-opacity group-hover/small:opacity-100 shadow-lg z-30">
                    {activity.assets.small_text}
                  </div>
                )}

                <div className="w-8 h-8 md:w-16 md:h-16 bg-[var(--background-900)] rounded-full p-0.5 md:p-1">
                  <Image
                    src={small_image}
                    alt={activity.assets?.small_text ?? "Status"}
                    width={64}
                    height={64}
                    className="rounded-full w-full h-full"
		    unoptimized
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col justify-center flex-1 space-y-0.5 md:space-y-1 min-w-0">
          {activity.name && (
            <a className="text-sm md:text-2xl font-bold line-clamp-1">
              {activity.name}
            </a>
          )}
          {activity.details && (
            <a className="text-xs md:text-xl line-clamp-1">
              {activity.details}
            </a>
          )}
          {activity.state && (
            <a className="text-xs md:text-xl line-clamp-1">{activity.state}</a>
          )}
          {!activity.details && !activity.state && (
            <a className="text-xs md:text-xl line-clamp-1">{activity.name}</a>
          )}
          {activity.timestamps?.start && (
            <div className={`flex gap-1 justify-left items-center`}>
              <IoLogoGameControllerB
                className={"text-sm md:text-xl text-primary"}
              />
              <span className="text-xs md:text-xl text-primary">{`${FormatElapsed(elapsed)}`}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
