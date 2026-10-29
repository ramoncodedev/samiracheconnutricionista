(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- header, progresso, parallax ---- */
  var header = $("#header"), bar = $("#progressBar"), archImg = $("#arch img");
  function onScroll() {
    var y = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    header.classList.toggle("is-scrolled", y > 24);
    if (archImg && !reduce && y < 900) archImg.style.transform = "translateY(" + (-y * 0.04) + "px)";
    updateSteps();
  }

  /* ---- menu mobile ---- */
  var burger = $("#burger"), nav = $("#nav");
  burger.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", open);
  });
  $$("#nav a").forEach(function (a) {
    a.addEventListener("click", function () {
      nav.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    });
  });

  /* ---- reveal ---- */
  var items = $$(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---- painéis de atendimento ---- */
  var panels = $$(".panel");
  function openPanel(p) {
    panels.forEach(function (x) {
      var on = x === p;
      x.classList.toggle("is-open", on);
      x.setAttribute("aria-expanded", on);
    });
  }
  panels.forEach(function (p) {
    p.addEventListener("click", function () { openPanel(p); });
    p.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openPanel(p); }
    });
  });

  /* ---- linha do tempo da jornada ---- */
  var steps = $$(".step"), fill = $("#stepsFill"), stepsEl = $("#steps");
  function updateSteps() {
    if (!stepsEl) return;
    var r = stepsEl.getBoundingClientRect(), vh = window.innerHeight;
    var p = (vh * 0.6 - r.top) / r.height;
    p = Math.max(0, Math.min(1, p));
    fill.style.height = p * 100 + "%";
    steps.forEach(function (s) {
      var sr = s.getBoundingClientRect();
      s.classList.toggle("is-on", sr.top < vh * 0.6);
    });
  }

  /* ---- fome ou vontade ---- */
  var boxes = $$("#tool input"), dot = $("#meterDot"), title = $("#resTitle"), text = $("#resText");
  var V = boxes.filter(function (b) { return b.dataset.t === "v"; }).length;
  var F = boxes.length - V;
  function evaluate() {
    var v = 0, f = 0;
    boxes.forEach(function (b) { if (b.checked) { b.dataset.t === "v" ? v++ : f++; } });
    var pos = 50 + 50 * (v / V - f / F);
    dot.style.left = Math.max(4, Math.min(96, pos)) + "%";
    if (!v && !f) {
      title.textContent = "Marque as opções ao lado";
      text.textContent = "O resultado aparece aqui, em tempo real.";
      dot.style.left = "50%";
    } else if (v >= 2 && v / V > f / F + 0.2) {
      title.textContent = "Parece mais vontade de comer";
      text.textContent = "Esse tipo de vontade costuma vir de emoção, hábito ou estímulo, e não de necessidade do corpo. Não é errado, mas vale parar um minuto, respirar e perguntar: o que eu estou sentindo agora?";
    } else if (f >= 2 && f / F > v / V + 0.2) {
      title.textContent = "Parece fome física";
      text.textContent = "Seu corpo está pedindo comida de verdade. Sem culpa: coma com calma, com atenção e escolhendo algo que realmente te satisfaça.";
    } else {
      title.textContent = "Um pouco dos dois";
      text.textContent = "É comum misturar fome e vontade. Observar quando cada uma aparece é o primeiro passo para comer com mais consciência e menos culpa.";
    }
  }
  boxes.forEach(function (b) { b.addEventListener("change", evaluate); });

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
})();
