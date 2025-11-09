const socket = new WebSocket("wss://api.lanyard.rest/socket");

const id = "1059614915456938084";
let heartbeat_instance = undefined;
let previous = undefined;

// thanks d.js
const ActivityType = Object.freeze({
  Playing: 0,
  Streaming: 1,
  Listening: 2,
  Watching: 3,
  Custom: 4,
  Competing: 5,
});

function heartbeat() {
  if (socket && socket.readyState === WebSocket.OPEN) {
    console.log("heartbeat");
    socket.send(JSON.stringify({ op: 3 }));
  }
}

function create(activity) {
  let box = document.getElementById(activity.name);
  let isnew = false;

  if (!box) {
    box = document.createElement("div");
    box.className = "activity";
    box.id = activity.name;

    box.style.opacity = "0";
    box.style.transform = "scale(0.9)";
    box.style.transition = "opacity 0.3s ease, transform 0.3s ease";

    let image = document.createElement("img");
    image.className = "image";
    box.appendChild(image);

    let title = document.createElement("div");
    title.className = "title";

    let details = document.createElement("h1");
    details.className = "details";
    title.appendChild(details);

    let state = document.createElement("p");
    state.className = "state";
    title.appendChild(state);

    box.appendChild(title);
    document.querySelector(".activities").appendChild(box);

    void box.offsetWidth;
    box.style.opacity = "1";
    box.style.transform = "scale(1)";

    isnew = true;
  }

  box.querySelector(".image").src = activity.assets?.large_image
    ? `https://media.discordapp.net/${activity.assets.large_image.replace("mp:", "")}`
    : "";

  if (activity.type === ActivityType.Playing) {
    box.querySelector(".details").textContent = activity.name || "";
    box.querySelector(".state").textContent = activity.details || "";

    if (activity.state) {
      let title = box.querySelector(".title");
      let state2 = box.querySelector(".state2");
      if (!state2) {
        state2 = document.createElement("p");
        state2.className = "state2";
        title.appendChild(state2);
      }
      state2.textContent = activity.state;
    }
  } else {
    box.querySelector(".details").textContent = activity.details || "";
    box.querySelector(".state").textContent = activity.state || "";
  }

  return { box, isnew };
}

function progressbar(activity, box) {
  if (!activity.timestamps?.start || !activity.timestamps?.end) return;

  const container = box.querySelector(".bar");
  const timer = box.querySelector(".time p:last-child");
  const percentage = box.querySelector(".percentage");

  if (box.interval) clearInterval(box.interval);

  box.interval = setInterval(() => {
    const current = Date.now();
    const start = activity.timestamps.start;
    const end = activity.timestamps.end;

    let percent = ((current - start) / (end - start)) * 100;
    percent = Math.max(0, Math.min(percent, 100));
    percentage.textContent = Math.floor(percent) + "%";
    container.style.width = percent + "%";

    const currentsecond = Math.floor((current - start) / 1000);
    const totalsecond = Math.floor((end - start) / 1000);
    const format = (second) =>
      `${Math.floor(second / 60)}:${String(second % 60).padStart(2, "0")}`;

    timer.textContent = `${format(currentsecond)} / ${format(totalsecond)}`;

    if (percent >= 100) {
      clearInterval(box.interval);
      box.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      box.style.opacity = "0";
      box.style.transform = "scale(0.95)";
      setTimeout(() => box.remove(), 300);
    }
  }, 100);
}

socket.addEventListener("open", () => {});

socket.addEventListener("message", (event) => {
  const opcode = JSON.parse(event.data);
  if (opcode.op === 1) {
    console.log("connected to lanyard!");
    heartbeat_instance = setInterval(heartbeat, opcode.d.heartbeat_interval);
    socket.send(JSON.stringify({ op: 2, d: { subscribe_to_ids: [id] } }));
  }
  if (opcode.op === 0) {
    const data = opcode.t === "INIT_STATE" ? opcode.d[id] : opcode.d;

    const boxes = document.querySelectorAll(".activity");
    const names = data.activities.map((a) => a.name);

    boxes.forEach((b) => {
      if (!names.includes(b.id)) {
        b.style.transition = "opacity 0.3s ease, transform 0.3s ease";
        b.style.opacity = "0";
        b.style.transform = "scale(0.95)";
        setTimeout(() => b.remove(), 300);
      }
    });

    for (const activity of data.activities) {
      switch (activity.type) {
        case ActivityType.Playing:
          if (previous !== activity.created_at) {
            previous = activity.created_at;

            let { box } = create(activity);

            if (activity.timestamps?.start && !box.querySelector(".elapsed")) {
              let elapsed = document.createElement("p");
              elapsed.className = "elapsed";

              let strong = document.createElement("strong");
              let code = document.createElement("code");
              code.textContent = "00:00";

              strong.appendChild(code);
              elapsed.appendChild(strong);
              box.querySelector(".title").appendChild(elapsed);
            }

            if (activity.timestamps?.start) {
              if (box.interval) clearInterval(box.interval);
              let code = box.querySelector(".elapsed code");

              box.interval = setInterval(() => {
                let start = activity.timestamps.start;
                let now = Date.now();
                let passed = now - start;

                let hours = Math.floor(passed / 3600000);
                let minutes = Math.floor((passed % 3600000) / 60000);
                let seconds = Math.floor((passed % 60000) / 1000);

                let text;
                if (hours > 0) {
                  text =
                    String(hours).padStart(2, "0") +
                    ":" +
                    String(minutes).padStart(2, "0") +
                    ":" +
                    String(seconds).padStart(2, "0");
                } else {
                  text =
                    String(minutes).padStart(2, "0") +
                    ":" +
                    String(seconds).padStart(2, "0");
                }

                code.textContent = text;
              }, 1000);
            }
          }
          break;

        case ActivityType.Listening:
          if (previous !== activity.created_at) {
            previous = activity.created_at;

            let { box, isnew } = create(activity);
            let title = box.querySelector(".title");

            let album = box.querySelector(".album");
            if (!album) {
              album = document.createElement("p");
              album.className = "album";
              title.appendChild(album);
            }
            album.textContent = activity.assets.large_text || "";

            if (isnew) {
              let time = document.createElement("div");
              time.className = "time";

              let percentage = document.createElement("p");
              percentage.textContent = "0%";
              percentage.className = "percentage";
              time.appendChild(percentage);

              let barcont = document.createElement("div");
              barcont.className = "bar-cont";

              let bar = document.createElement("div");
              bar.className = "bar";
              barcont.appendChild(bar);

              time.appendChild(barcont);

              let timer = document.createElement("p");
              timer.textContent = "0:00 / 0:00";
              time.appendChild(timer);

              title.appendChild(time);
            }

            progressbar(activity, box);
          }
          break;

        case ActivityType.Custom:
          break;
      }
    }
  }
});
