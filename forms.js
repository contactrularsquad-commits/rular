/* ==========================================================================
   RULAR SQUAD — Contact form
   Composes a clean WhatsApp message from the contact form fields.
   ========================================================================== */

(function () {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('contactStatus');
  const submitBtn = document.getElementById('contactSubmit');
  if (!form) return;

  applyWhatsAppGate();
  if (!SITE_CONFIG.whatsappNumber && submitBtn) {
    submitBtn.textContent = 'WhatsApp contact coming soon';
    submitBtn.disabled = true;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    if (!name || !message) {
      status.textContent = 'Please fill in your name and message.';
      status.className = 'form-status is-error';
      return;
    }

    const waMessage = [
      'Hello Rular Squad,',
      '',
      `Name: ${name}`,
      `Email: ${email || '-'}`,
      `Phone: ${phone || '-'}`,
      `Subject: ${subject || '-'}`,
      '',
      'Message:',
      message
    ].join('\n');

    const link = buildWhatsAppLink(waMessage);
    if (!link) {
      status.textContent = 'Official WhatsApp contact will be added soon. Please email contact.rularsquad@gmail.com instead.';
      status.className = 'form-status is-error';
      return;
    }

    status.textContent = 'Opening WhatsApp with your message...';
    status.className = 'form-status is-success';
    window.open(link, '_blank');
  });
})();
