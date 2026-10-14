/* Kantrol — landing page
   ===== CONFIGURAÇÃO: troque pelos dados reais antes de publicar ===== */
var KANTROL = {
  whatsapp: "5511954432047",            // DDI + DDD + número, só dígitos
  whatsappTexto: "(11) 95443-2047",      // como o número aparece na página
  email: "operacoes@kantrol.com.br"
};
/* =================================================================== */

(function () {
  "use strict";
  var waBase = "https://wa.me/" + KANTROL.whatsapp;

  // Contatos
  document.querySelectorAll("[data-whatsapp-link]").forEach(function (a) {
    a.href = waBase; a.target = "_blank"; a.rel = "noopener";
  });
  document.querySelectorAll("[data-whatsapp-display]").forEach(function (el) { el.textContent = KANTROL.whatsappTexto; });
  document.querySelectorAll("[data-email-link]").forEach(function (a) { a.href = "mailto:" + KANTROL.email; });
  document.querySelectorAll("[data-email-display]").forEach(function (el) { el.textContent = KANTROL.email; });

  // Ano no rodapé
  var ano = document.getElementById("ano");
  if (ano) ano.textContent = String(new Date().getFullYear());

  // Cabeçalho sólido ao rolar
  var header = document.querySelector(".site-header");
  function onScroll() { if (header) header.classList.toggle("is-solid", window.scrollY > 24); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Menu mobile
  var toggle = document.getElementById("menu-toggle");
  var menu = document.getElementById("menu");
  function setMenu(open) {
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () { setMenu(!menu.classList.contains("is-open")); });
    menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  }

  // Formulário → WhatsApp
  var form = document.getElementById("contact-form");
  var result = document.getElementById("form-result");
  if (!form) return;

  function setError(input, msg) {
    var field = input.closest(".k-field");
    var old = field.querySelector(".k-field-error");
    if (old) old.remove();
    if (msg) {
      field.setAttribute("data-invalid", "");
      var p = document.createElement("span");
      p.className = "k-field-error"; p.id = input.id + "-erro"; p.textContent = msg;
      field.appendChild(p);
      input.setAttribute("aria-invalid", "true");
      input.setAttribute("aria-describedby", p.id);
    } else {
      field.removeAttribute("data-invalid");
      input.removeAttribute("aria-invalid");
      input.removeAttribute("aria-describedby");
    }
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var nome = form.elements.nome, msg = form.elements.mensagem;
    var ok = true;
    setError(nome, nome.value.trim() ? "" : "Informe seu nome para sabermos com quem falar.");
    setError(msg, msg.value.trim() ? "" : "Conte em poucas linhas o que você precisa.");
    if (!nome.value.trim()) { ok = false; nome.focus(); }
    else if (!msg.value.trim()) { ok = false; msg.focus(); }
    if (!ok) return;

    var empresa = form.elements.empresa.value.trim();
    var texto =
      "Olá, Kantrol! Meu nome é " + nome.value.trim() +
      (empresa ? " (" + empresa + ")" : "") + ".\n" +
      "Preciso de: " + form.elements.servico.value + "\n\n" + msg.value.trim();
    var url = waBase + "?text=" + encodeURIComponent(texto);

    result.hidden = false;
    result.innerHTML = "";
    var link = document.createElement("a");
    link.href = url; link.target = "_blank"; link.rel = "noopener";
    link.textContent = "Abrir conversa no WhatsApp";
    result.append("Mensagem pronta. Se o WhatsApp não abrir sozinho, toque em ", link, ".");
    var win = window.open(url, "_blank", "noopener");
    if (win) win.opener = null;
  });
})();
