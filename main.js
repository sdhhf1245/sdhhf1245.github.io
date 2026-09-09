const lastfm = {
key: "61d580c50e6e5e3f14b6bd9527e5395f",
base: "https://audioscrobbler.com"
}

const lanyard = {
id: "1059614915456938084",
socket: "wss://api.lanyard.rest/socket"
}

const Opcodes = {
Event: 0,
Hello: 1,
Initialize: 2,
Heartbeat: 3,
Unsubscribe: 4,
}

function fm() {
	
}


const about = document.getElementById('about');
const contact = document.getElementById('contact');
const music = document.getElementById('music');
music.style.top = `${about.getBoundingClientRect().bottom + 8}px`;
contact.style.top = `${music.getBoundingClientRect().bottom + 8}px`;


const cover = document.getElementById('cover');
const track = document.getElementById('track');

const websocket = new WebSocket(lanyard.socket);

websocket.addEventListener("open", () => {
});

websocket.addEventListener("message", (e) => {
	// console.log(`b: ${e.data}`);
	let data = JSON.parse(e.data);

	if(data.op == Opcodes.Hello) {
		const Op = {
			op: Opcodes.Initialize,
			d: {
				subscribe_to_ids: [lanyard.id]
			}
		}
		websocket.send(JSON.stringify(Op))

		
		ping = setInterval(() => {
    websocket.send(JSON.stringify({ op: Opcodes.Heartbeat }));
  }, data.d.heartbeat_interval);
	}

	if(data.op == Opcodes.Event) {
		let profile;
		if(data.t == "PRESENCE_UPDATE") {
		
		profile = data.d;
		}
		else{
			profile = data.d[lanyard.id]
		}
		// const activity = profile.activities?.find(a => a.type === 2);
		// console.log(activity)
		//
		//       cover.src = activity.assets.large_image.startsWith('mp:external') ? activity.assets.large_image.replace(/mp:external\/([^\/]*)\/(http[s])/g, '$2:/')
		// : `https://discordapp.com{activity.application_id}/${activity.assets.large_image}`
		//       track.textContent = `${activity.details} - ${activity.state}`
		//
	}
	//
	// if(data.op == Opcodes.Hello) {
	// 	const Op = {
	// 		op: Opcodes.Initialize,
	// 		d: {
	// 			subscribe_to_ids: [lanyard.id]
	// 		}
	// 	}
	// 	websocket.send(JSON.stringify(Op))
	// }
	//
	// if(data.op == Opcodes.Hello) {
	// 	const Op = {
	// 		op: Opcodes.Initialize,
	// 		d: {
	// 			subscribe_to_ids: [lanyard.id]
	// 		}
	// 	}
	// 	websocket.send(JSON.stringify(Op))
	// }
	//
	//
	//
});


const bounce = new Audio('/assets/bounce.mp3');

const { Engine, Bodies, Composite, Mouse, MouseConstraint, Body, Events } = Matter;
const engine = Engine.create();
engine.gravity.y = 0;

Events.on(engine, 'collisionStart', () => {
    if(entered) { bounce.cloneNode().play().catch(() => {}); }
});

const elements = document.querySelectorAll('.cont');
const bodies = [];
elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    const body = Bodies.rectangle(
        rect.left + rect.width/2,
        rect.top + rect.height/2,
        rect.width,
        rect.height,
        { restitution: 0.8, friction: 0, frictionAir: 0.01, inertia: Infinity }
    );
    Composite.add(engine.world, body);
    bodies.push({ el, body, w: rect.width, h: rect.height, startLeft: rect.left, startTop: rect.top });
});
const mouse = Mouse.create(document.body);
const constraint = MouseConstraint.create(engine, {
    mouse,
    constraint: { stiffness: 0.2 }
});
Composite.add(engine.world, constraint);
(function update() {
    Engine.update(engine, 1000/60);
    bodies.forEach(({ el, body, w, h, startLeft, startTop }) => {
        const centerw = w/2, centerh = h/2;
        let x = body.position.x, y = body.position.y;
        let hit = false;
        if(x - centerw < 0) { x = centerw; Body.setPosition(body, { x, y }); Body.setVelocity(body, { x: -body.velocity.x, y: body.velocity.y }); hit = true; }
        if(x + centerw > window.innerWidth) { x = window.innerWidth - centerw; Body.setPosition(body, { x, y }); Body.setVelocity(body, { x: -body.velocity.x, y: body.velocity.y }); hit = true; }
        if(y - centerh < 0) { y = centerh; Body.setPosition(body, { x, y }); Body.setVelocity(body, { x: body.velocity.x, y: -body.velocity.y }); hit = true; }
        if(y + centerh > window.innerHeight) { y = window.innerHeight - centerh; Body.setPosition(body, { x, y }); Body.setVelocity(body, { x: body.velocity.x, y: -body.velocity.y }); hit = true; }
        if(hit && entered) { bounce.cloneNode().play().catch(() => {}); }
        el.style.transform = `translate(${x - centerw - startLeft}px, ${y - centerh - startTop}px)`;
    });
    requestAnimationFrame(update);
})();


const quotes = [
  "SDHHF HAS BEEN FOUND ALIVE",
  "FOLLOWING THE UNEXPECTED POPULARITY OF HIS SHITTY DISCORD BOT \"WIIMOTE\" AND MID-WAY THROUGH WORKING ON THE UNFINISHED BACKEND FOR A \"DECENTRALIZED CHAT SYSTEM\"",
  "JAMAICAN BITCH CODE-MONKEY SDHHF HAD A TOTALMENTAL BREAKDOWN AND WENT INTO ISOLATION",
  "WITH THE HELP OF A FRIEND \"BEEF\"",
  "PREVIOUSLY KNOWN AS \"BEEF THE RETARD\"",
  "SDHHF FAKED HIS DEATH",
  "AS THE JEALOUS INTERNET SOUNDCLOUD-GRADE DEVS FORMED BY 15 YEAR OLD PYTHONFANBOYS ON DISCORD PUT A BOUNTY ON SDHHF'S HEAD",
  "SIFTING THROUGH ANY GITHUB REPO THEY CAN FIND TO FIND A REASON TO CALL OUR BELOVED SDHHF OUT AND DEEM HIM PROBLEMATIC FOR USING SYNTAX THEY DON'T UNDERSTAND",
  "SINCE THEN",
  "SDHHF HAS BEEN HIDING AWAY IN A DISCORD VOICE CHANNEL IN THE UNITED STATES",
  "HOMELESS",
  "LIVING IN HIS SERVER",
  "AND WORKING ON A NEW CODEBASE WITH A CRACKED MOUSE",
  "A MONITOR",
  "AND A KEYBOARD HE FOUND IN THE E-WASTE DUMP",
  "UNFORTUNATELY (OR FORTUNATELY) FOR BEEF ",
  "HE HAD A BRIEF STAY IN DISCORD JAIL UNTIL IT WAS DISCOVERED THAT THE DELETION WAS AN ORCHESTRATED RUSE",
  "BEEF IS CURRENTLY ON PROBATION",
  "HOSTING A TECH SUPPORT CHANNEL",
  "AND SDHHFAND HIM ARE STILL BEST BUDS",
  "THIS CODEBASE IS PARTLY THE COMPLETED MISSING PIECES OF THE PREVIOUS SDHHF BACKEND",
  "AND ADDITIONALLY THE RESULT OF \"2 YEARS OF LAYING LOW",
  "BEING VINDICTIVE AND BITTER",
  "SOMETIMES SELF REFLECTING TO A POINT OF TOTAL SELF HATRED",
  "AND INCORRECTLY DEALING WITH A LIFE RUINING AND DEBILITATING CODING ADDICTION THAT ONLY WORKED TO FURTHERBURN SDHHF AND THOSE AROUND HIM",
  "AND AS SO",
  "THIS NEW REPOSITORY IS TITLED \"BEEF.C#\"",
  "BECAUSE THIS CODEBASE IS ABOUT THE BEEF",
  "THIS CODEBASE IS BEEF",
  "ANY BEEF",
  "MY BEEF",
  "YOUR BEEF",
  "SYNTAX BEEF",
  "THIS IS BEEF",
  "IF YOU HAVE BEEF",
  "THIS IS THE CODEBASE YOU BEEF TO",
  "GET READY TO BEEF",
  "SDHHF HAS RETURNED",
  "FUCK YOU AND DIE",
  "SDHHF SUPREMACY"
]

const layer = document.getElementById('main');
const lanes = Array(1,2,3,4,5,6,7,8,9,10); 
const speeds = Array(1,2,3,4,5,6,7,8,9,10);

const reg = {};
lanes.forEach(l => { reg[l] = 0; });

const q = Array();
quotes.forEach(item => q.push(item));

const sb = document.createElement('div');
sb.style.position = 'absolute';
sb.style.visibility = 'hidden';
sb.style.whiteSpace = 'nowrap';
sb.style.fontFamily = 'Impact, sans-serif';
sb.style.fontWeight = 'black';
sb.style.fontSize = '28px';
document.body.appendChild(sb);

function go() {
  if (q.length === 0) return;

  const scrw = window.innerWidth || document.documentElement.clientWidth || 1024;
  const now = Date.now();
  const fr = lanes.filter(l => now >= reg[l]);
  
  if (fr.length === 0) {
    setTimeout(go, 100);
    return;
  }

  const tx = q.shift();
  sb.innerText = tx;
  const txtw = sb.offsetWidth || (tx.length * 18);

  const l = fr[Math.floor(Math.random() * fr.length)];
  const mul = speeds[Math.floor(Math.random() * speeds.length)];
  const pps = mul * 40;
  const dist = scrw + txtw;
  const dur = dist / pps;

  const div = document.createElement('div');
  div.innerText = tx;
  div.style.position = 'absolute';
  div.style.whiteSpace = 'nowrap';
  div.style.top = `${l * 45}px`;
  div.style.left = `${scrw}px`;
    div.classList.add("marquee");
  div.style.transform = 'translateX(0px)';
  layer.appendChild(div);

  reg[l] = now + (dur * 1000) + 200;;

  const start = performance.now();
  const init = 0;
  const target = -dist;

  function anim() {
    const elapsed = (performance.now() - start) / 1000;
    const progress = Math.min(elapsed / dur, 1);
    const currentX = init + (target - init) * progress;
    div.style.transform = `translateX(${currentX}px)`;

    if (progress < 1) {
      requestAnimationFrame(anim);
    } else {
      div.remove();
    }
  }

  requestAnimationFrame(anim);

  const delay = Math.floor(Math.random() * 1800) + 5900;
  setTimeout(go, delay);
}
document.addEventListener('DOMContentLoaded', () => {
  if (layer) {
    setTimeout(go,10000);
  }
});

const playlist = [
  "8. we (interlude).flac",
  "2. ...i love u n im scared.flac",
  "4. is there a point (girl u know).flac",
  "9. never even done.flac"
]

let audio = new Audio();

let entered = false;

function ent(e) {
  if (e) e.stopPropagation();
  if (entered) return;
  entered = true;

  audio.volume = 0.2;
  
  play();

  document.getElementById("overlay").classList.add("hidden");
  enter.classList.add("hidden");
}

enter.addEventListener('touchend', ent);
enter.addEventListener('click', ent);

async function play() {
  const file = playlist[Math.floor(Math.random() * playlist.length)];
  const url = `/assets/songs/${encodeURIComponent(file)}`;

  audio.src = url;
  audio.play();

  audio.onended = play;
  audio.onerror = play;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const blob = await response.blob();

    const metadata = await window.musicMetadata.parseBlob(blob);
    const tags = metadata.common;

    track.innerHTML = `<span>${tags.title || file} – ${tags.artist || 'sdhhf'}</span>`;

    if (tags.picture?.length) {
      const pic = tags.picture[0];
      cover.src = URL.createObjectURL(new Blob([pic.data], { type: pic.format }));
    }
  } catch (err) {
    console.error(err);
  }
}


const vol = document.getElementById('volume');

vol.addEventListener('input', (e) => {
  audio.volume = parseFloat(e.target.value);
});

vol.addEventListener('pointerdown', (e) => {
  e.stopPropagation();
});
vol.addEventListener('mousedown', (e) => {
  e.stopPropagation();
});
vol.addEventListener('touchstart', (e) => {
  e.stopPropagation();
});
