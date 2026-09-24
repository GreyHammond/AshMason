// AshMason — small, self-contained page script
// - marks nav when scrolled off the hero
// - copy-to-clipboard on server address buttons with a toast confirmation
// - flags "Open" ledger gates so the CSS can render them quieter than gated ones

(function () {
  const nav = document.querySelector('.nav');
  const toast = document.getElementById('toast');
  let toastTimer = null;

  // -- Nav scroll state -----------------------------------------------------
  const setNavState = () => {
    if (!nav) return;
    if (window.scrollY > 40) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', setNavState, { passive: true });
  setNavState();

  // -- Copy-to-clipboard ----------------------------------------------------
  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 1800);
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (_) {
      // Fallback for older browsers / non-secure contexts
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'absolute';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (_) {}
      document.body.removeChild(ta);
      return ok;
    }
  };

  document.querySelectorAll('.join-copy').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const value = btn.dataset.copy;
      if (!value) return;
      const ok = await copyText(value);
      showToast(ok ? `Copied ${value}` : `Couldn't copy — select it manually`);
    });
  });

  // -- Mark "Open" gates so CSS can dim them ---------------------------------
  document.querySelectorAll('.ledger-gate').forEach((el) => {
    const val = (el.textContent || '').trim().toLowerCase();
    if (val === 'open') el.setAttribute('data-open', '');
  });
})();
