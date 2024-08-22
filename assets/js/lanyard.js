// yuh this code sucks yuhhhhhhhhh
let id = "1059614915456938084";
let end;
let spotify_card = document.getElementById("spotify-card");
let spotify_cover = document.getElementById("spotify-albumcover");
let spotify_artist = document.getElementById("spotify-artist");
let spotify_album = document.getElementById("spotify-album");
let spotify_title = document.getElementById("spotify-title");
let average = document.getElementById("average");
let pfp = document.getElementById("pfp");
let username = document.getElementById("username");
let position = document.getElementById("position");
let spinner = document.getElementById("spinner");
let sotw = document.getElementById("sotw");
let sotw_container = document.getElementById("sotw-container");
let pos = "retar";

async function av(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
            const id = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = id.data;
            let r = 0, g = 0, b = 0;
            let count = 0;

            for (let i = 0; i < data.length; i += 4) {
                r += data[i];
                g += data[i + 1];
                b += data[i + 2];
                count++;
            }

            r = Math.round(r / count);
            g = Math.round(g / count);
            b = Math.round(b / count);

            r = Math.round(r * 0.5);
            g = Math.round(g * 0.5);
            b = Math.round(b * 0.5);

            resolve(`rgb(${r},${g},${b})`);
        };
        img.onerror = reject;
        img.src = url;
    });
}

function elapsed(t) {
    let now = Date.now();
    let et = now - t;
    let seconds = Math.floor(et / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    seconds = seconds % 60;
    minutes = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} elapsed`;
}

async function lanyard() {
    spinner.style.display = '';
    console.log("fetching...");
    const response = await fetch(`https://api.lanyard.rest/v1/users/${id}`);
    const data = await response.json();
    const spotify = data.data.spotify;
    const kv = data.data.kv;
    const discord = data.data.discord_user;
    const activities = data.data.activities || [];

    console.log(kv)

    if (kv) {
        quote.textContent = `"${kv.qotd}"`;
        pos = kv.position || "re"
        if (kv.sotw) {
            sotw.src = kv.sotw
            sotw_container.style.display = '';
        } else {
            sotw_container.style.display = none;
        }

    }

    if (discord) {
        pfp.src = `https://cdn.discordapp.com/avatars/${discord.id}/${discord.avatar}`;
        username.textContent = discord.username;
        position.textContent = pos;
    }

    if (!spotify) {
        spotify_card.style.display = 'none';
        document.getElementById("spotify-progress").style.display = 'none';
        if (end) {
            clearInterval(end);
        }
    } else {
        spinner.style.display = 'none';
        spotify_card.style.display = '';
        spotify_cover.src = spotify.album_art_url;
        spotify_artist.textContent = "by " + spotify.artist.replace(";", ',');
        spotify_title.textContent = spotify.song;
        spotify_album.textContent = "on " + spotify.album;
        document.getElementById("track").href = "https://open.spotify.com/track/" + spotify.track_id;

        document.getElementById("spotify-progress").style.display = '';

        try {
            const averagecolor = await av(spotify.album_art_url);
            average.style.backgroundColor = averagecolor;
        } catch (error) {
            console.error(error);
        }

        if (end) {
            clearInterval(end);
        }

        end = setInterval(() => {
            console.log('upd spotify')
            let now = Date.now();
            let duration = spotify.timestamps.end - spotify.timestamps.start;
            let elapsed = now - spotify.timestamps.start;
            let percentage = Math.min((elapsed / duration) * 100, 100);
            document.getElementById("spotify-progress-bar").style.width = `${percentage}%`;
            if (elapsed >= duration) {
                clearInterval(end);
            }
        }, 500);
    }

    const con = document.getElementById("cards-container");
    con.innerHTML = '';

    for (const activity of activities) {
        if (activity.name && activity.name !== '' && activity.name !== 'Spotify') {
            spinner.style.display = 'none';
            let card = document.getElementById("card").cloneNode(true);
            card.style.display = '';

            let cover = card.querySelector("#cover");

            let tooltip = document.createElement('div');
            tooltip.id = `tooltip-${activity.name}`;
            tooltip.role = 'tooltip';
            tooltip.classList.add('absolute', 'z-10', 'invisible', 'inline-block', 'px-3', 'py-2', 'text-sm', 'font-medium', 'text-white', 'bg-gray-900', 'rounded-lg', 'shadow-sm', 'opacity-0', 'tooltip', 'dark:bg-gray-700');
            tooltip.textContent = activity.assets?.large_text || 'cuh';

            cover.addEventListener('mouseover', () => {
                tooltip.classList.remove('invisible', 'opacity-0');
            });

            cover.addEventListener('mouseout', () => {
                tooltip.classList.add('invisible', 'opacity-0');
            });

            tooltip.addEventListener('mouseover', () => {
                tooltip.classList.remove('invisible', 'opacity-0');
            });

            tooltip.addEventListener('mouseout', () => {
                tooltip.classList.add('invisible', 'opacity-0');
            });

            card.appendChild(tooltip);

            if (activity.assets && activity.assets.large_image) {
                cover.src = activity.assets.large_image.startsWith('mp:external')
                    ? activity.assets.large_image.replace(/mp:external\/([^\/]*)\/(http[s])/g, '$2:/')
                    : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}`;

                try {
                    const averagecolor = await av(cover.src);
                    card.style.backgroundColor = averagecolor;
                } catch (error) {
                    console.error(error);
                }
            } else {
                cover.src = '';
            }

            let title = card.querySelector("#title");
            title.textContent = activity.name;

            let timestamp = card.querySelector("#timestamp");
            setInterval(() => {
                timestamp.textContent = elapsed(activity.timestamps.start);
            }, 1000);

            let details = card.querySelector("#details");
            details.textContent = activity.details || '';

            let status = card.querySelector("#status");
            status.textContent = activity.state || '';

            con.appendChild(card);
        }
    }

    console.log(spotify);
    console.log(data);
}

lanyard();
setInterval(lanyard, 20000);
