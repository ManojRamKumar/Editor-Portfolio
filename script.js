const cards=[...document.querySelectorAll('.work-card')],stage=document.querySelector('#stackStage');let active=0,start=null,swiped=false;
function render(){cards.forEach((c,i)=>{let o=(i-active+cards.length)%cards.length;if(o>cards.length/2)o-=cards.length;let a=Math.abs(o);c.style.transform=`translate(${o*(innerWidth<600?20:innerWidth>=1000?Math.min(44,stage.clientWidth*.065):52)}px,${a*9}px) rotate(${o*2.5}deg) scale(${1-a*.055})`;c.style.zIndex=30-a;c.style.opacity=a>3?0:a===3?.35:1;c.style.pointerEvents=o===0?'auto':'none';c.inert=o!==0;});document.querySelector('#currentWork').textContent=String(active+1).padStart(2,'0');document.querySelector('#progressBar').style.width=(active+1)/cards.length*100+'%';syncVideos();updateDetails();}
function go(n){active=(active+n+cards.length)%cards.length;render();}
document.querySelector('#prevBtn').onclick=()=>go(-1);document.querySelector('#nextBtn').onclick=()=>go(1);document.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')go(-1);if(e.key==='ArrowRight')go(1)});stage.addEventListener('pointerdown',e=>{start=e.clientX;swiped=false;});window.addEventListener('pointerup',e=>{if(start===null)return;let dx=e.clientX-start;start=null;if(Math.abs(dx)>40){swiped=true;go(dx<0?1:-1);}});stage.addEventListener('pointercancel',()=>start=null);stage.addEventListener('click',e=>{if(swiped){e.preventDefault();swiped=false;}else if(e.target.closest('a')?.getAttribute('href').startsWith('VIDEO_LINK')){e.preventDefault();alert('Replace this placeholder with your reel URL in index.html.');}},true);stage.addEventListener('dragstart',e=>e.preventDefault());window.addEventListener('resize',render);
function syncVideos() {
  cards.forEach((c, i) => {
    const v = c.querySelector('video');

    if (!v) return;

    if (i === active && !document.hidden) {
      v.muted = true;
      v.loop = true;
      v.playsInline = true;

      if (!v.getAttribute('src')) {
        v.src = v.dataset.src;
        v.load();
      }

      v.play().catch(error => {
        console.error('Video playback failed:', error);
      });

    } else {
      v.pause();
    }
  });
}
const indexButtons=cards.map((card,i)=>{const b=document.createElement('button');b.type='button';const n=document.createElement('span');n.className='mono';n.textContent=String(i+1).padStart(2,'0');b.append(n,document.createTextNode(card.querySelector('strong').textContent));b.onclick=()=>{active=i;render();};document.querySelector('#workIndex').append(b);return b;});
function updateDetails(){const c=cards[active];indexButtons.forEach((b,i)=>b.setAttribute('aria-current',String(i===active)));document.querySelector('#detailNumber').textContent=String(active+1).padStart(2,'0');document.querySelector('#detailTitle').textContent=c.querySelector('strong').textContent;document.querySelector('#detailCategory').textContent=c.querySelector('.work-meta small').textContent;document.querySelector('#detailDescription').textContent=c.querySelector('.work-meta p').textContent;const link=document.querySelector('#detailLink');link.href=c.querySelector('a').getAttribute('href');link.target='_blank';link.rel='noopener';}
document.querySelector('#detailLink').addEventListener('click',e=>{if(e.currentTarget.getAttribute('href').startsWith('VIDEO_LINK')){e.preventDefault();alert('Replace this placeholder with your reel URL in index.html.');}});render();
