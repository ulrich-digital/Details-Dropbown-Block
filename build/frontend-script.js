/******/ (() => { // webpackBootstrap
/*!****************************!*\
  !*** ./src/js/frontend.js ***!
  \****************************/
document.addEventListener("DOMContentLoaded", function () {
  /* =============================================================== *\
     Dropdown-Verhalten initialisieren: jedes Dropdown durchlaufen
  \* =============================================================== */
  document.querySelectorAll(".details-dropdown-frontend").forEach(dropdown => {
    const toggle = dropdown.querySelector("[data-toggle]");
    const content = dropdown.querySelector("[data-content]");
    if (!toggle || !content) return;

    /* =============================================================== *\
       Startzustand: eingeklappt, mit overflow versteckt
    \* =============================================================== */
    content.style.maxHeight = "0px";
    content.style.overflow = "hidden";

    // Klick auf Toggle-Element behandelt das Ein-/Ausklappen
    toggle.addEventListener("click", () => {
      const isExpanded = content.classList.contains("is-open");
      content.classList.toggle("is-open", !isExpanded);
      toggle.classList.toggle("open", !isExpanded);

      // Animate: Höhe setzen oder zurücksetzen
      if (!isExpanded) {
        content.style.maxHeight = content.scrollHeight + "px";
      } else {
        content.style.maxHeight = "0px";
      }

      // Event feuern, z. B. für Analytics oder Scroll-Ziele
      dropdown.dispatchEvent(new CustomEvent("dropdownToggled", {
        bubbles: true
      }));
    });
  });

  /* =============================================================== *\
     Sichtbarkeit basierend auf Inhalt: nur mit echtem Text sichtbar
  \* =============================================================== */
  document.querySelectorAll(".details-dropdown-frontend").forEach(wrapper => {
    const richContent = wrapper.querySelector(".details-richtext-content");
    const linkList = wrapper.querySelector(".linkliste");
    let hasRichContent = false;
    let hasLinks = false;

    /* =============================================================== *\
       Rich Content prüfen und leere Kinder entfernen
    \* =============================================================== */
    if (richContent) {
      const children = Array.from(richContent.children);
      const hasNonEmptyChild = children.some(child => {
        const isEmpty = child.innerHTML.trim() === "" && child.textContent.trim() === "";
        return !isEmpty;
      });
      if (hasNonEmptyChild) {
        hasRichContent = true;
      }
    }

    /* =============================================================== *\
       Linkliste prüfen und leere <li> entfernen
    \* =============================================================== */
    if (linkList) {
      Array.from(linkList.querySelectorAll("li")).forEach(li => {
        const anchor = li.querySelector("a[href]");
        const linkText = li.textContent.trim();
        if (!anchor || linkText === "") {
          //				li.remove();
        }
      });
      if (linkList.querySelectorAll("li").length > 0) {
        hasLinks = true;
      } else {
        //			linkList.remove();
      }
    }

    /* =============================================================== *\
       Sichtbarkeit des Blocks steuern
    \* =============================================================== */
    if (hasRichContent || hasLinks) {
      wrapper.classList.add("is-visible");
    } else {
      wrapper.classList.remove("is-visible");
      //console.log("wrapper bleibt unsichtbar");
    }
  });
});
/******/ })()
;
//# sourceMappingURL=frontend-script.js.map