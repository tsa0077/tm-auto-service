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

    // Inject script to extract ad data from the page
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        try {
          // Strategy 1: __NEXT_DATA__ (classic Leboncoin)
          const nd = window.__NEXT_DATA__;
          if (nd) {
            // Try common paths
            const ad = nd.props?.pageProps?.ad
              || nd.props?.pageProps?.adContext?.ad
              || nd.props?.pageProps?.classified
              || nd.props?.pageProps?.data?.ad
              || nd.props?.pageProps?.initialProps?.ad;
            if (ad) return { ad: JSON.stringify(ad) };
          }

          // Strategy 2: Look for ad data in __remixContext (if LBC migrated)
          if (window.__remixContext) {
            const loaderData = window.__remixContext?.state?.loaderData;
            if (loaderData) {
              for (const key of Object.keys(loaderData)) {
                const d = loaderData[key];
                if (d?.ad) return { ad: JSON.stringify(d.ad) };
                if (d?.classified) return { ad: JSON.stringify(d.classified) };
              }
            }
          }

          // Strategy 3: Search for JSON-LD structured data in the page
          const ldScripts = document.querySelectorAll('script[type="application/ld+json"]');
          for (const s of ldScripts) {
            try {
              const ld = JSON.parse(s.textContent);
              if (ld["@type"] === "Car" || ld["@type"] === "Product" || ld["@type"] === "Vehicle") {
                return { ad: s.textContent, isLd: true };
              }
            } catch {}
          }

          // Strategy 4: Extract from window.__INITIAL_STATE__ or similar globals
          for (const key of ["__INITIAL_STATE__", "__APOLLO_STATE__", "__RELAY_STORE__"]) {
            if (window[key]) {
              const state = JSON.stringify(window[key]);
              if (state.includes('"subject"') && state.includes('"attributes"')) {
                return { ad: state, isRaw: true };
              }
            }
          }

          // Strategy 5: Scrape directly from the DOM
          const title = document.querySelector('[data-qa-id="adview_title"]')?.textContent
            || document.querySelector('h1')?.textContent;
          const priceEl = document.querySelector('[data-qa-id="adview_price"]')
            || document.querySelector('[class*="Price"]');
          const price = priceEl?.textContent?.replace(/[^\d]/g, "");
          const descEl = document.querySelector('[data-qa-id="adview_description_container"]')
            || document.querySelector('[class*="Description"]');
          const images = [...document.querySelectorAll('[data-qa-id="adview_spotlight_container"] img, [class*="Gallery"] img, [class*="Carousel"] img')]
            .map(img => img.src || img.dataset?.src)
            .filter(Boolean)
            .filter(u => u.startsWith("http"));

          if (title && (price || images.length > 0)) {
            // Build a minimal ad object from DOM
            const adFromDom = {
              subject: title.trim(),
              body: descEl?.textContent?.trim() || "",
              price: price ? [parseInt(price)] : [],
              images: { urls_large: images },
              attributes: [],
              _fromDom: true,
            };

            // Try to extract attributes from the specs section
            const specItems = document.querySelectorAll('[data-qa-id^="criteria_item_"]');
            specItems.forEach(item => {
              const label = item.querySelector('[class*="Label"], [class*="label"], dt')?.textContent?.trim().toLowerCase() || "";
              const value = item.querySelector('[class*="Value"], [class*="value"], dd')?.textContent?.trim() || "";
              const keyMap = {
                "marque": "brand", "modèle": "model", "année-modèle": "regdate",
                "kilométrage": "mileage", "carburant": "fuel", "boîte de vitesse": "gearbox",
                "couleur": "vehicle_color", "nombre de portes": "doors",
                "nombre de places": "seats", "puissance fiscale": "horse_power_din",
              };
              for (const [fr, en] of Object.entries(keyMap)) {
                if (label.includes(fr)) {
                  adFromDom.attributes.push({ key: en, value: value.replace(/[^\d\w]/g, "") || value });
                }
              }
            });

            return { ad: JSON.stringify(adFromDom) };
          }

          // Nothing found - return debug info
          const keys = nd ? Object.keys(nd.props?.pageProps || {}).join(", ") : "no __NEXT_DATA__";
          return { error: "Pas d'annonce trouvée. Données disponibles: [" + keys + "]. Êtes-vous sur la page d'une annonce ?" };
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
