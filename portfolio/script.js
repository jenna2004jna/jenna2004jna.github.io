/* =========================================================
   EASY HELPERS
========================================================= */
const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => Array.from(el.querySelectorAll(s));

/* =========================================================
   LOADER
========================================================= */
window.addEventListener("load", () => {
  setTimeout(() => {
    $("#loader").style.display = "none";
    $$(".reveal").forEach(el => el.classList.add("in"));
  }, 700);
});

/* =========================================================
   CURSOR
========================================================= */
const cursor = $("#cursor");
window.addEventListener("mousemove", e=>{
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

/* =========================================================
   PARTICLES BACKGROUND
========================================================= */
const canvas = $("#particles");
if(canvas){
  const ctx = canvas.getContext("2d");
  let w, h, particles = [];

  const resize = () => {
    w = canvas.width = canvas.clientWidth;
    h = canvas.height = canvas.clientHeight;
  };
  resize();
  window.addEventListener("resize", resize);

  const rand = (min,max) => Math.random()*(max-min)+min;

  for(let i=0;i<70;i++){
    particles.push({ x:rand(0,w), y:rand(0,h), vx:rand(-0.4,0.4), vy:rand(-0.4,0.4), r:rand(0.6,2.3) });
  }

  const frame = () => {
    ctx.clearRect(0,0,w,h);
    particles.forEach(p=>{
      p.x += p.vx;
      p.y += p.vy;
      if(p.x<0) p.x=w;
      if(p.x>w) p.x=0;
      if(p.y<0) p.y=h;
      if(p.y>h) p.y=0;

      ctx.beginPath();
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fill();
    });
    requestAnimationFrame(frame);
  };
  frame();
}

/* =========================================================
   TYPEWRITER
========================================================= */
const roles = [
  "Embedded Engineer",
  "Firmware Developer",
  "LabVIEW Automation Engineer",
  "RTOS & Communication Protocols"
];

let ri = 0, ci = 0, forward = true;
const tEl = $("#typewriter");

function typeLoop(){
  const text = roles[ri];
  if(forward){
    ci++;
    tEl.textContent = text.slice(0,ci);
    if(ci === text.length){
      forward = false;
      setTimeout(typeLoop, 900);
      return;
    }
  } else {
    ci--;
    tEl.textContent = text.slice(0,ci);
    if(ci === 0){
      forward = true;
      ri = (ri+1)%roles.length;
    }
  }
  setTimeout(typeLoop, forward ? 120 : 40);
}
typeLoop();

/* =========================================================
   SMOOTH SCROLL NAV
========================================================= */
$$("[data-target]").forEach(a=>{
  a.addEventListener("click", e=>{
    e.preventDefault();
    const id = a.getAttribute("href");
    if($(id)) $(id).scrollIntoView({behavior:"smooth"});
  });
});

/* =========================================================
   INTERSECTION REVEAL
========================================================= */
const io = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting) entry.target.classList.add("in");
  });
},{threshold:0.1});

$$(".reveal").forEach(r=>io.observe(r));

/* =========================================================
   SKILL CATEGORY FILTERS
========================================================= */
const scatBtns = $$(".scat");
scatBtns.forEach(btn=>{
  btn.addEventListener("click", ()=>{
    scatBtns.forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");

    const cat = btn.dataset.cat;
    $$(".skill-block").forEach(block=>{
      if(cat==="all"){
        block.style.display = "";
      } else {
        block.style.display = block.dataset.cat.includes(cat) ? "" : "none";
      }
    });
  });
});

/* =========================================================
   3D TILT CARDS
========================================================= */
const tiltToggle = $("#tiltToggle");
const tiltEnabled = () => tiltToggle.checked;

$$(".tilt").forEach(card=>{
  card.addEventListener("mousemove", e=>{
    if(!tiltEnabled()) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left)/r.width - 0.5;
    const y = (e.clientY - r.top)/r.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${-y*10}deg) rotateY(${x*12}deg) translateY(-4px)`;
  });
  card.addEventListener("mouseleave", ()=>{
    card.style.transform = "";
  });
});

/* =========================================================
   PROJECT LIGHTBOX
========================================================= */
const lightbox = $("#lightbox");
const lbMedia = $("#lbMedia");
const lbTitle = $("#lbTitle");
const lbDesc = $("#lbDesc");
const lbCode = $("#lbCode");

function openLightbox(data){
  lbMedia.innerHTML = "";
  lbTitle.textContent = data.title;
  lbDesc.textContent = data.desc || "";
  lbCode.href = data.repo || "#";

  if(data.video){
    const v = document.createElement("video");
    v.src = data.video;
    v.controls = true;
    v.autoplay = true;
    lbMedia.appendChild(v);
  } else {
    const img = document.createElement("img");
    img.src = data.img;
    lbMedia.appendChild(img);
  }

  lightbox.setAttribute("aria-hidden","false");
}

document.addEventListener("click", e=>{
  const btn = e.target.closest(".project-card .view");
  if(btn){
    const card = btn.closest(".project-card");
    openLightbox({
      title: card.dataset.title,
      desc: $(".card-content p", card)?.textContent,
      img: card.dataset.img || card.dataset.thumb,
      video: btn.dataset.type==="video" ? card.dataset.video : ""
    });
  }

  if(e.target.matches("[data-close]") || e.target===lightbox){
    lightbox.setAttribute("aria-hidden","true");
  }
});

/* =========================================================
   CERTIFICATION SLIDER
========================================================= */
(function(){
  const slider = $("#certSlider"),
        prev = $("#certPrev"),
        next = $("#certNext");

  if(!slider) return;

  let pos = 0;
  const step = 1;

  prev.addEventListener("click", ()=>{
    pos = Math.max(0, pos - step);
    slider.style.transform = `translateX(${-pos*260}px)`;
  });

  next.addEventListener("click", ()=>{
    pos = Math.min(slider.children.length - 1, pos + step);
    slider.style.transform = `translateX(${-pos*260}px)`;
  });
})();

/* =========================================================
   FORM + CONFETTI
========================================================= */
function confettiBurst(){
  for(let i=0;i<40;i++){
    const el = document.createElement("div");
    el.className = "confetti";
    const size = 6 + Math.random()*8;

    el.style.position = "fixed";
    el.style.left = (20 + Math.random()*60) + "%";
    el.style.top = "20%";
    el.style.width = size + "px";
    el.style.height = size*0.6 + "px";
    el.style.background = `hsl(${Math.random()*360}, 80%, 60%)`;
    el.style.zIndex = 9999;

    document.body.appendChild(el);

    el.animate([
      { transform:"translateY(0px)", opacity:1 },
      { transform:"translateY(400px)", opacity:0 }
    ],{
      duration:1200+Math.random()*600,
      easing:"cubic-bezier(.17,.67,.3,1)"
    });

    setTimeout(()=>el.remove(),2000);
  }
}

$("#contactForm")?.addEventListener("submit", e=>{
  e.preventDefault();
  $("#formMsg").textContent = "Sending...";
  setTimeout(()=>{
    $("#formMsg").textContent = "Message sent!";
    confettiBurst();
  }, 800);
});

/* =========================================================
   DARK/LIGHT MODE
========================================================= */
$("#themeToggle")?.addEventListener("click", ()=>{
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
});

/* =========================================================
   BACK TO TOP
========================================================= */
const topBtn = $("#topBtn");
window.addEventListener("scroll", ()=>{
  topBtn.style.display = window.scrollY > 300 ? "inline-block" : "none";
});
topBtn.addEventListener("click", ()=>window.scrollTo({top:0,behavior:"smooth"}));

/* =========================================================
   MOBILE NAV
========================================================= */
$("#menuToggle")?.addEventListener("click", ()=>{
  $("#navLinks").classList.toggle("open");
});

/* =========================================================
   LAZY LOAD IMAGES
========================================================= */
const lazyImgs = $$("img.lazy");
const lazyObs = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      let img = entry.target;
      img.src = img.dataset.src;
      img.classList.remove("lazy");
      lazyObs.unobserve(img);
    }
  });
},{rootMargin:"200px"});
lazyImgs.forEach(img=>lazyObs.observe(img));

/* =========================================================
   YEAR FOOTER
========================================================= */
$("#year").textContent = new Date().getFullYear();
