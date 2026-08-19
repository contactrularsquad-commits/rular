/* ==========================================================================
   RULAR SQUAD — Central Configuration
   Edit the values below as verified information becomes available.
   Nothing here is invented — empty values simply disable that feature
   until a real one is supplied.
   ========================================================================== */

const SITE_CONFIG = {
  name: "Rular Squad",
  tagline: "Our Village. Our Responsibility. Our Future.",
  email: "contact.rularsquad@gmail.com",
  location: "Malipur, Uttar Pradesh, India",

  whatsappNumber: "919411198963",
  upiId: "yadaveejit@okhdfcbank",
  qrCodeImage: "donation-qr.png",

  // Where the "Join Us" flow points to.
  joinFormUrl: "https://docs.google.com/forms/d/16w0c1QTH7DJI11MlHjnMc1D35bcJsacdhVqRphfm0ss/viewform",

  social: {
    instagram: "https://www.instagram.com/rularsquad?utm_source=qr&igsh=MTAyaWtjaml3NG92bg==",
    youtube: "https://youtube.com/@rularsquad?si=Ktz7-AWxKJqmEOr9",
    facebook: "https://www.facebook.com/share/1BerBPn2XN/",
    x: "",          // [ADD OFFICIAL X LINK]
    whatsapp: "https://wa.me/919411198963"
  }
};

/**
 * Builds a wa.me link with a pre-filled message.
 * Returns null if no official WhatsApp number has been configured,
 * so calling code can disable the button gracefully.
 */
function buildWhatsAppLink(message) {
  if (!SITE_CONFIG.whatsappNumber) return null;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encoded}`;
}

/**
 * Wires up the fixed floating WhatsApp button present on every page.
 * Hides it entirely if no number is configured.
 */
function initWhatsAppFloat() {
  const btn = document.getElementById('waFloat');
  if (!btn) return;
  const link = buildWhatsAppLink(`Hello Rular Squad, I have a question about your work in ${SITE_CONFIG.location}.`);
  if (!link) {
    btn.style.display = 'none';
    return;
  }
  btn.href = link;
  btn.target = '_blank';
  btn.rel = 'noopener noreferrer';
}
document.addEventListener('DOMContentLoaded', initWhatsAppFloat);

/**
 * Applies the WhatsApp-availability state to any element with
 * [data-whatsapp-gate]. If no number is configured, the element is
 * disabled and its label is swapped to an explanatory note.
 */
function applyWhatsAppGate() {
  document.querySelectorAll('[data-whatsapp-gate]').forEach((el) => {
    if (!SITE_CONFIG.whatsappNumber) {
      el.classList.add('is-disabled');
      el.setAttribute('aria-disabled', 'true');
      const fallback = el.getAttribute('data-fallback-text');
      if (fallback) el.textContent = fallback;
    }
  });
}
