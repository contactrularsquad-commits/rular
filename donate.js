/* ==========================================================================
   RULAR SQUAD — Donation page logic
   - Switches between UPI / QR / Bank transfer tabs
   - Only builds a UPI deep link if a verified UPI ID is configured
   - Only shows the QR image if the file actually exists
   - Donation form composes a WhatsApp message (gated on a real number)
   ========================================================================== */

(function () {
  // ---- Tabs ----
  const tabs = document.querySelectorAll('.pay-tab');
  const panels = document.querySelectorAll('.pay-panel');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('is-active'));
      panels.forEach((p) => p.classList.remove('is-active'));
      tab.classList.add('is-active');
      document.getElementById(tab.getAttribute('data-panel')).classList.add('is-active');
    });
  });

  // ---- UPI multi-app payment ----
  const upiIdEl = document.getElementById('upiIdDisplay');
  const amountInput = document.getElementById('upiAmount');
  const appButtons = {
    gpay: { el: document.getElementById('upiGpay'), scheme: 'tez://upi/pay' },
    phonepe: { el: document.getElementById('upiPhonepe'), scheme: 'phonepe://pay' },
    paytm: { el: document.getElementById('upiPaytm'), scheme: 'paytmmp://pay' },
    generic: { el: document.getElementById('upiGeneric'), scheme: 'upi://pay' }
  };

  function buildUpiUrl(scheme) {
    const params = new URLSearchParams({
      pa: SITE_CONFIG.upiId,
      pn: SITE_CONFIG.name,
      cu: 'INR'
    });
    const amount = (amountInput && amountInput.value || '').trim();
    if (amount && Number(amount) > 0) params.set('am', amount);
    return `${scheme}?${params.toString()}`;
  }

  function refreshUpiLinks() {
    Object.values(appButtons).forEach(({ el, scheme }) => {
      if (!el) return;
      if (SITE_CONFIG.upiId) {
        el.href = buildUpiUrl(scheme);
      } else {
        el.removeAttribute('href');
        el.classList.add('is-disabled');
      }
    });
  }

  if (SITE_CONFIG.upiId) {
    upiIdEl.textContent = SITE_CONFIG.upiId;
    refreshUpiLinks();
    if (amountInput) amountInput.addEventListener('input', refreshUpiLinks);
  } else {
    upiIdEl.textContent = '[ADD VERIFIED UPI ID]';
    Object.values(appButtons).forEach(({ el }) => el && el.classList.add('is-disabled'));
  }

  // ---- QR ----
  const qrBox = document.getElementById('qrBox');
  const qrImg = new Image();
  qrImg.onload = () => {
    qrBox.innerHTML = `<img src="${SITE_CONFIG.qrCodeImage}" alt="Rular Squad donation QR code" style="max-width:220px; margin:0 auto; border-radius:12px;">`;
  };
  qrImg.onerror = () => {
    qrBox.innerHTML = `<p style="color:var(--muted); font-size:14.5px;">Official donation QR code will be published here after verification.</p>`;
  };
  qrImg.src = SITE_CONFIG.qrCodeImage;

  // ---- Donation form -> WhatsApp ----
  const form = document.getElementById('donateForm');
  const status = document.getElementById('donateStatus');
  const submitBtn = document.getElementById('donateSubmit');

  applyWhatsAppGate();
  if (!SITE_CONFIG.whatsappNumber && submitBtn) {
    submitBtn.textContent = 'WhatsApp contact coming soon';
    submitBtn.disabled = true;
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const phone = form.phone.value.trim();
      const type = form.type.value;
      const amount = form.amount.value.trim();
      const message = form.message.value.trim();

      if (!name || !phone) {
        status.textContent = 'Please fill in your name and phone number.';
        status.className = 'form-status is-error';
        return;
      }

      const waMessage = [
        'Hello Rular Squad,',
        '',
        `Name: ${name}`,
        `Email: ${email || '-'}`,
        `Phone: ${phone}`,
        `Contribution Type: ${type}`,
        amount ? `Amount: ₹${amount}` : null,
        message ? `Message: ${message}` : null
      ].filter(Boolean).join('\n');

      const link = buildWhatsAppLink(waMessage);
      if (!link) {
        status.textContent = 'Official WhatsApp contact will be added soon. Please reach us at contact.rularsquad@gmail.com.';
        status.className = 'form-status is-error';
        return;
      }

      status.textContent = 'Opening WhatsApp with your contribution details...';
      status.className = 'form-status is-success';
      window.open(link, '_blank');
    });
  }
})();
