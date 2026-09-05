
// Header scroll
const h=document.getElementById('siteHeader');
window.addEventListener('scroll',()=>{h&&h.classList.toggle('scrolled',window.scrollY>40)});
// Burger
const b=document.getElementById('burger'),mm=document.getElementById('mobileMenu');
b&&b.addEventListener('click',()=>mm.classList.toggle('open'));
// Reveal on scroll
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('on')),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
// Lightbox
const lb=document.getElementById('lightbox'),lbImg=document.getElementById('lbImg'),lbClose=document.getElementById('lbClose');
document.querySelectorAll('.gallery a').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();lbImg.src=a.dataset.full;lb.classList.add('open')}));
lbClose&&lbClose.addEventListener('click',()=>lb.classList.remove('open'));
lb&&lb.addEventListener('click',e=>{if(e.target===lb)lb.classList.remove('open')});
// Reservation form
const f=document.getElementById('resForm');
if(f){
  const showError=(name,msg)=>{const el=f.querySelector(`[data-for="${name}"]`);if(el)el.textContent=msg||''};
  const clearErrors=()=>f.querySelectorAll('.field-error').forEach(e=>e.textContent='');
  f.addEventListener('submit',ev=>{
    ev.preventDefault();clearErrors();
    const d=Object.fromEntries(new FormData(f));
    let ok=true;
    if(!d.name||d.name.trim().length<2){showError('name','Nom requis');ok=false}
    if(!/^\S+@\S+\.\S+$/.test(d.email||'')){showError('email','Email invalide');ok=false}
    if(!d.phone||d.phone.length<6){showError('phone','Téléphone invalide');ok=false}
    if(!d.room){showError('room','Choisissez une chambre');ok=false}
    if(!d.checkin){showError('checkin','Date requise');ok=false}
    if(!d.checkout){showError('checkout','Date requise');ok=false}
    if(d.checkin&&d.checkout&&new Date(d.checkout)<=new Date(d.checkin)){showError('checkout','Doit être après arrivée');ok=false}
    if(!ok)return;
    const [roomName,price]=d.room.split('|');
    const n1=new Date(d.checkin),n2=new Date(d.checkout);
    const nights=Math.max(1,Math.round((n2-n1)/86400000));
    const total=nights*parseInt(price,10);
    const lines=[
      ['Nom',d.name],['Email',d.email],['Téléphone',d.phone],
      ['Chambre',roomName],['Arrivée',d.checkin],['Départ',d.checkout],
      ['Nuits',nights],['Voyageurs',`${d.adults} adulte(s), ${d.children||0} enfant(s)`],
      ['Tarif',`${price} MAD / nuit`]
    ];
    if(d.message)lines.push(['Message',d.message]);
    document.getElementById('summaryLines').innerHTML=lines.map(([k,v])=>`<div class="line"><span style="color:#a5a5a5">${k}</span><span>${v}</span></div>`).join('');
    document.getElementById('summaryTotal').textContent=`Total estimé : ${total.toLocaleString('fr-FR')} MAD`;
    document.getElementById('summary').style.display='block';
    const hotelPhone = "212661849319"; // <-- Dir hna numéro WhatsApp Business dyalek

const msg =
`🏨 *Nouvelle demande de réservation*

👤 *Nom :* ${d.name}
📧 *Email :* ${d.email}
📞 *Téléphone :* ${d.phone}

🛏️ *Chambre :* ${roomName}

📅 *Arrivée :* ${d.checkin}
📅 *Départ :* ${d.checkout}

🌙 *Nombre de nuits :* ${nights}

👨 *Adultes :* ${d.adults}
👶 *Enfants :* ${d.children || 0}

💰 *Montant estimé :* ${total} MAD

💬 *Message :*
${d.message || "Aucun"}

Merci.`;

document.getElementById('mailtoLink').href =
`mailto:aguelmam@gmail.ma?subject=${encodeURIComponent('Demande de réservation - '+d.name)}&body=${encodeURIComponent(msg)}`;

document.getElementById('waLink').href =
`https://wa.me/${hotelPhone}?text=${encodeURIComponent(msg)}`;
    document.getElementById('waLink').href=`https://wa.me/212661849319?text=${encodeURIComponent(msg)}`;
    document.getElementById('summary').scrollIntoView({behavior:'smooth'});
  });
}
