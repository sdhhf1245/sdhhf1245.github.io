async function topalbums(period, cols, rows) {
  const user = "sdhhf";
  const key = "61d580c50e6e5e3f14b6bd9527e5395f"; // not mine lmfao
  const limit = cols * rows + 5;

  const url = `https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${user}&period=${period}&limit=${limit}&api_key=${key}&format=json`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.topalbums || !data.topalbums.album) {
      console.log("none");
      return;
    }

    const list = data.topalbums.album
      .map((a) => ({
        img: a.image?.find((i) => i.size === "extralarge")?.["#text"],
        plays: a.playcount,
        name: a.name,
        artist: a.artist?.name,
      }))
      .filter((a) => a.img && !a.img.includes("default_album"));

    makebox(list, cols, rows);
  } catch (err) {
    console.error("error", err);
  }
}

function makebox(list, cols, rows) {
  const box = document.createElement("div");
  box.className = "box";
  box.style.display = "grid";
  box.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  box.style.gap = "2px";
  box.style.backgroundColor = "var(--background-color)";
  box.style.padding = "4px";
  // box.style.aspectRatio = `${cols}/${rows}`;
  box.style.overflow = "hidden";

  list.slice(0, cols * rows).forEach(({ img: src, plays, name, artist }) => {
    const wrap = document.createElement("div");
    wrap.className = "tilewrap";

    const img = document.createElement("img");
    img.src = src;
    img.loading = "lazy";
    img.className = "tile";

    const text = document.createElement("div");
    text.className = "tiletext";

    const album = document.createElement("div");
    album.className = "albumtext";
    album.textContent = name;

    const art = document.createElement("div");
    art.className = "artisttext";
    art.textContent = artist;

    const play = document.createElement("div");
    play.className = "playtext";
    play.textContent = `${plays} plays`;

    text.appendChild(album);
    text.appendChild(art);
    text.appendChild(play);

    wrap.appendChild(img);
    wrap.appendChild(text);
    box.appendChild(wrap);
  });

  const collage = document.querySelector(".collage");
  collage.innerHTML = "";
  collage.appendChild(box);
}

document.getElementById("load").addEventListener("click", () => {
  const period = document.getElementById("period").value;
  const rows = parseInt(document.getElementById("rows").value);
  const cols = parseInt(document.getElementById("cols").value);
  topalbums(period, cols, rows);
});

topalbums("7day", 3, 3);
