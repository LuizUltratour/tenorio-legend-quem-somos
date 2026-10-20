(function (w, d) {
  'use strict';

  var QUEM_SOMOS_URL = 'https://skylineip.s3.sa-east-1.amazonaws.com/Tour+Virtual/tenorio/quem-somos/index.html';

  var overlay    = null;
  var msgHandler = null;

  function _injectStyles() {
    if (d.getElementById('_gc_styles')) return;
    var s = d.createElement('style');
    s.id = '_gc_styles';
    s.textContent =
      '@keyframes _gcIn{from{opacity:0}to{opacity:1}}' +
      '@keyframes _gcOut{to{opacity:0}}';
    d.head.appendChild(s);
  }

  function _open() {
    if (overlay) _close();
    _injectStyles();

    overlay = d.createElement('div');
    overlay.id = '_gc_overlay';
    overlay.style.cssText =
      'position:fixed;inset:0;z-index:2147483646;' +
      'animation:_gcIn 0.3s ease both;';

    var iframe = d.createElement('iframe');
    iframe.src = QUEM_SOMOS_URL + '?v=' + Date.now();
    iframe.style.cssText = 'width:100%;height:100%;border:none;display:block;background:#434040;';
    iframe.setAttribute('allow', 'fullscreen');

    overlay.appendChild(iframe);
    d.body.appendChild(overlay);

    msgHandler = function (e) {
      if (e.data && e.data.action === 'closeGallery') _close();
    };
    w.addEventListener('message', msgHandler);
  }

  function _close() {
    if (!overlay) return;
    overlay.style.animation = '_gcOut 0.25s ease forwards';
    var ref = overlay;
    setTimeout(function () {
      if (ref.parentNode) ref.parentNode.removeChild(ref);
    }, 260);
    overlay = null;
    if (msgHandler) {
      w.removeEventListener('message', msgHandler);
      msgHandler = null;
    }
  }

  // ── API pública ──────────────────────────────────────────────
  // AbrirQuemSomos(1) → abre a tela Quem Somos
  // AbrirQuemSomos(0) → fecha
  w.AbrirQuemSomos = function (show) {
    if (show === 1) _open(); else _close();
  };

}(window, document));
