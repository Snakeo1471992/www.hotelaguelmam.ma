const HOTEL_EMAIL = "aguelmamkhenifra@gmail.com";
const HOTEL_WA = "212524000000";
const ROOMS = {
  classique: { label: "Chambre Classique", price: 400 },
  grand:     { label: "Chambre Grand",     price: 500 },
  deluxe:    { label: "Chambre Deluxe",    price: 600 },
  suite:     { label: "Suite Royale",      price: 800 },
};

function toast(msg, type='') {
  const t = document.getElementById('toast');
  if (!t) return alert(msg);
  t.textContent = msg;
  t.className = 'toast show ' + type;
  setTimeout(() => t.className = 'toast ' + type, 3200);
}
function genRef() {
  return 'AGM-' + Math.random().toString(36).slice(2,7).toUpperCase() + '-' + Date.now().toString(36).slice(-4).toUpperCase();
}
function fmtDate(s) {
  return new Date(s).toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
}
function esc(s) { return String(s).replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reservation-form');
  const wrap = document.getElementById('reservation-wrap');
  const recap = document.getElementById('recap');
  if (!form) return;

  // Pré-sélection de la chambre via ?room=grand
  const params = new URLSearchParams(location.search);
  const preRoom = params.get('room');
  if (preRoom && ROOMS[preRoom]) form.querySelector('[name=room]').value = preRoom;

  // Date min = aujourd'hui
  const today = new Date().toISOString().split('T')[0];
  form.querySelector('[name=checkin]').setAttribute('min', today);
  form.querySelector('[name=checkout]').setAttribute('min', today);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const d = Object.fromEntries(fd.entries());
    if (!d.name || d.name.trim().length < 2) return toast('Nom complet requis', 'error');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return toast('Email invalide', 'error');
    if (!/^[+\d\s().-]{6,}$/.test(d.phone)) return toast('Téléphone invalide', 'error');
    if (!d.checkin || !d.checkout) return toast('Dates requises', 'error');
    const ci = new Date(d.checkin), co = new Date(d.checkout);
    const now = new Date(); now.setHours(0,0,0,0);
    if (ci < now) return toast("Date d'arrivée dans le passé", 'error');
    const nights = Math.round((co - ci) / 86400000);
    if (nights <= 0) return toast('Le départ doit être après l\'arrivée', 'error');
    const room = ROOMS[d.room];
    if (!room) return toast('Chambre invalide', 'error');

    const total = nights * room.price;
    const ref = genRef();

    const text = [
      `Demande de réservation — Hôtel Aguelmam`,
      `Référence : ${ref}`,
      ``,
      `Client : ${d.name}`,
      `Email : ${d.email}`,
      `Téléphone : ${d.phone}`,
      ``,
      `Chambre : ${room.label}`,
      `Arrivée : ${fmtDate(d.checkin)}`,
      `Départ : ${fmtDate(d.checkout)}`,
      `Nuits : ${nights}`,
      `Voyageurs : ${d.guests}`,
      `Total estimé : ${total.toLocaleString('fr-FR')} MAD`,
      ...(d.message ? ['', `Message : ${d.message}`] : []),
    ].join('\n');

    const subject = `Réservation ${ref} — ${d.name}`;
    const mailto = `mailto:${HOTEL_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    const wa = `https://wa.me/${HOTEL_WA}?text=${encodeURIComponent(text)}`;

    recap.innerHTML = `
      <div class="summary">
        <div class="summary-head">
          <div>
            <div class="red-divider" style="margin-bottom:.8rem">Hôtel Aguelmam</div>
            <h2 class="font-display" style="font-size:1.8rem">Récapitulatif</h2>
          </div>
          <div style="text-align:right">
            <div style="font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;color:#888">Référence</div>
            <div class="summary-ref">${ref}</div>
          </div>
        </div>
        <div class="summary-grid">
          <div class="summary-row"><div class="label">Client</div><div>${esc(d.name)}</div></div>
          <div class="summary-row"><div class="label">Voyageurs</div><div>${esc(d.guests)} personne${+d.guests>1?'s':''}</div></div>
          <div class="summary-row"><div class="label">Email</div><div>${esc(d.email)}</div></div>
          <div class="summary-row"><div class="label">Téléphone</div><div>${esc(d.phone)}</div></div>
          <div class="summary-row"><div class="label">Arrivée</div><div>${fmtDate(d.checkin)}</div></div>
          <div class="summary-row"><div class="label">Départ</div><div>${fmtDate(d.checkout)}</div></div>
          <div class="summary-row"><div class="label">Chambre</div><div>${room.label}</div></div>
          <div class="summary-row"><div class="label">Nuits</div><div>${nights}</div></div>
        </div>
        ${d.message ? `<div style="padding:1rem;border:1px solid var(--border);background:rgba(0,0,0,.3);margin-bottom:1.5rem"><div class="label" style="font-size:.7rem;color:var(--red);letter-spacing:.2em;text-transform:uppercase;margin-bottom:.5rem">Message</div><div style="white-space:pre-wrap">${esc(d.message)}</div></div>` : ''}
        <div class="summary-total">
          <span class="font-display" style="font-size:1.3rem">Total estimé</span>
          <span class="amount">${total.toLocaleString('fr-FR')} MAD</span>
        </div>
        <p style="font-size:.8rem;color:var(--muted);margin-bottom:1rem">Cette demande n'est pas une confirmation finale. Notre équipe valide la disponibilité sous 24h.</p>
        <div class="summary-actions no-print">
          <a href="${mailto}" class="btn-red" style="text-align:center">✉ Email</a>
          <a href="${wa}" target="_blank" rel="noopener" class="btn-red" style="text-align:center">💬 WhatsApp</a>
          <button type="button" onclick="window.print()" class="btn-outline">🖨 Imprimer</button>
        </div>
        <button type="button" id="back-btn" class="no-print" style="margin-top:1.2rem;background:transparent;border:none;color:var(--muted);cursor:pointer;font-size:.85rem">← Modifier la demande</button>
      </div>`;
    wrap.style.display = 'none';
    recap.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast('Récapitulatif généré');

    document.getElementById('back-btn')?.addEventListener('click', () => {
      recap.style.display = 'none';
      wrap.style.display = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
});
