const statusEl = document.getElementById("status");
const extractBtn = document.getElementById("extractBtn");
const openAdminBtn = document.getElementById("openAdmin");
const previewEl = document.getElementById("preview");
const previewText = document.getElementById("previewText");

function setStatus(type, msg) {
  statusEl.className = "status " + type;
  statusEl.textContent = msg;
}

extractBtn.addEventListener("click", async () => {
  extractBtn.disabled = true;
  extractBtn.innerHTML = '<div class="spinner"></div> Extraction...';

  try {
    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab.url || !tab.url.includes("leboncoin.fr")) {
      setStatus("warning", "Cette page n'est pas une annonce Leboncoin. Ouvrez une annonce et réessayez.");
      extractBtn.disabled = false;
      extractBtn.innerHTML = "📋 Extraire l'annonce";
      return;
    }

    // Inject script to extract __NEXT_DATA__
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        try {
          const nd = window.__NEXT_DATA__;
          if (!nd) return { error: "Pas de données Next.js trouvées sur cette page." };
          const ad = nd.props?.pageProps?.ad;
          if (!ad) return { error: "Pas d'annonce trouvée. Êtes-vous sur la page d'une annonce ?" };
          return { ad: JSON.stringify(ad) };
        } catch (e) {
          return { error: "Erreur: " + e.message };
        }
      },
    });

    const result = results[0]?.result;

    if (!result || result.error) {
      setStatus("error", result?.error || "Impossible d'extraire les données.");
      extractBtn.disabled = false;
      extractBtn.innerHTML = "📋 Extraire l'annonce";
      return;
    }

    // Copy to clipboard
    await navigator.clipboard.writeText(result.ad);

    // Parse for preview
    const ad = JSON.parse(result.ad);
    const title = ad.subject || "Véhicule";
    const price = Array.isArray(ad.price) ? ad.price[0] : ad.price;
    const imgCount = ad.images?.urls_large?.length || ad.images?.urls?.length || 0;

    previewText.innerHTML =
      '<span class="title">' + title + "</span><br>" +
      (price ? price.toLocaleString("fr-FR") + " €" : "Prix non défini") +
      " • " + imgCount + " photo" + (imgCount > 1 ? "s" : "");
    previewEl.style.display = "block";

    setStatus("success", "✅ Données copiées ! Allez sur le dashboard TM AUTO → Ajouter véhicule → Collez (Ctrl+V) → Importer.");

    openAdminBtn.style.display = "flex";
    extractBtn.innerHTML = "✅ Copié !";

  } catch (err) {
    setStatus("error", "Erreur: " + err.message);
    extractBtn.disabled = false;
    extractBtn.innerHTML = "📋 Extraire l'annonce";
  }
});

openAdminBtn.addEventListener("click", () => {
  chrome.tabs.create({ url: "https://tm-auto-service.com/admin/vehicules/nouveau" });
});
