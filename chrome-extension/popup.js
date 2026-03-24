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
          // Deep search helper: find an object with "subject" and "attributes" keys anywhere in a nested structure
          function deepFindAd(obj, depth) {
            if (!obj || typeof obj !== "object" || depth > 8) return null;
            if (obj.subject && Array.isArray(obj.attributes)) return obj;
            if (Array.isArray(obj)) {
              for (const item of obj) {
                const found = deepFindAd(item, depth + 1);
                if (found) return found;
              }
            } else {
              for (const key of Object.keys(obj)) {
                const found = deepFindAd(obj[key], depth + 1);
                if (found) return found;
              }
            }
            return null;
          }

          // Strategy 1: __NEXT_DATA__ — deep search for ad object
          const nd = window.__NEXT_DATA__;
          if (nd) {
            const ad = deepFindAd(nd, 0);
            if (ad) return { ad: JSON.stringify(ad) };
          }

          // Strategy 2: __remixContext
          if (window.__remixContext) {
            const ad = deepFindAd(window.__remixContext, 0);
            if (ad) return { ad: JSON.stringify(ad) };
          }

          // Strategy 3: Search ALL script tags for JSON containing ad data
          const allScripts = document.querySelectorAll("script");
          for (const s of allScripts) {
            const txt = s.textContent || "";
            if (txt.includes('"subject"') && txt.includes('"attributes"')) {
              try {
                const parsed = JSON.parse(txt);
                const ad = deepFindAd(parsed, 0);
                if (ad) return { ad: JSON.stringify(ad) };
              } catch {}
            }
          }

          // Strategy 4: Thorough DOM scraping
          // -- Title --
          const titleEl = document.querySelector('[data-qa-id="adview_title"], [data-testid="ad_title"], h1[class*="title" i], h1[class*="Title"], h1');
          const title = titleEl?.textContent?.trim();

          // -- Price --
          const priceEl = document.querySelector('[data-qa-id="adview_price"], [data-testid="ad_price"], [class*="Price"], [class*="price"]');
          const priceText = priceEl?.textContent?.replace(/\s/g, "")?.replace(/[^\d]/g, "") || "";
          const price = priceText ? parseInt(priceText) : null;

          // -- Description --
          const descEl = document.querySelector('[data-qa-id="adview_description_container"], [data-testid="ad_description"], [class*="Description"], [class*="description"]');
          const description = descEl?.textContent?.trim() || "";

          // -- Images: collect from ALL possible gallery sources --
          const imgSet = new Set();
          // From gallery/carousel
          document.querySelectorAll('[data-qa-id="adview_spotlight_container"] img, [class*="Gallery"] img, [class*="gallery"] img, [class*="Carousel"] img, [class*="carousel"] img, [class*="Slider"] img, [class*="slider"] img, [class*="Slideshow"] img, picture img').forEach(img => {
            const src = img.src || img.dataset?.src || img.currentSrc || "";
            if (src.startsWith("http") && !src.includes("static") && !src.includes("logo") && !src.includes("avatar")) imgSet.add(src);
          });
          // From srcset
          document.querySelectorAll("[srcset]").forEach(el => {
            const parts = el.getAttribute("srcset").split(",");
            parts.forEach(p => {
              const url = p.trim().split(/\s+/)[0];
              if (url.startsWith("http") && url.includes("leboncoin")) imgSet.add(url);
            });
          });
          // From background images
          document.querySelectorAll('[style*="background-image"]').forEach(el => {
            const match = el.style.backgroundImage.match(/url\(["']?(https?:\/\/[^"')]+)["']?\)/);
            if (match && match[1].includes("leboncoin")) imgSet.add(match[1]);
          });
          const images = [...imgSet];

          // -- Specs/criteria: try MANY selectors --
          const keyMap = {
            "marque": "brand", "modèle": "model", "modele": "model",
            "année": "regdate", "annee": "regdate", "année-modèle": "regdate", "mise en circulation": "regdate",
            "kilométrage": "mileage", "kilometrage": "mileage", "km": "mileage",
            "carburant": "fuel", "énergie": "fuel", "energie": "fuel",
            "boîte de vitesse": "gearbox", "boite de vitesse": "gearbox", "transmission": "gearbox",
            "couleur": "vehicle_color",
            "portes": "doors", "nombre de portes": "doors",
            "places": "seats", "nombre de places": "seats",
            "puissance": "horse_power_din", "puissance fiscale": "horse_power_din", "cv fiscaux": "horse_power_din", "chevaux": "horse_power_din",
          };
          const attributes = [];
          const extractedSpecs = {};

          // Method A: data-qa-id criteria items
          document.querySelectorAll('[data-qa-id^="criteria_item"]').forEach(item => {
            const parts = item.querySelectorAll("div, span, p, dd, dt");
            let label = "", value = "";
            parts.forEach((p, i) => {
              const t = p.textContent?.trim() || "";
              if (i === 0 || t.length < 30) { if (!label) label = t; else if (!value) value = t; }
            });
            if (!label) label = item.textContent?.trim() || "";
            const lower = label.toLowerCase();
            for (const [fr, en] of Object.entries(keyMap)) {
              if (lower.includes(fr) && !extractedSpecs[en]) {
                extractedSpecs[en] = value || label;
                attributes.push({ key: en, value: value || label });
              }
            }
          });

          // Method B: data-testid criteria
          document.querySelectorAll('[data-testid^="criteria"], [data-testid^="ad_param"]').forEach(item => {
            const label = (item.querySelector('[class*="label" i], [class*="Label"], dt')?.textContent || "").trim().toLowerCase();
            const value = (item.querySelector('[class*="value" i], [class*="Value"], dd')?.textContent || "").trim();
            for (const [fr, en] of Object.entries(keyMap)) {
              if (label.includes(fr) && !extractedSpecs[en]) {
                extractedSpecs[en] = value;
                attributes.push({ key: en, value: value });
              }
            }
          });

          // Method C: Generic label/value pairs in any list-like structure near the ad
          document.querySelectorAll("li, tr, dl, [class*='Criteria'], [class*='criteria'], [class*='Param'], [class*='param'], [class*='Spec'], [class*='spec']").forEach(item => {
            const text = item.textContent?.trim() || "";
            if (text.length > 200) return; // skip large blocks
            const lower = text.toLowerCase();
            for (const [fr, en] of Object.entries(keyMap)) {
              if (lower.includes(fr) && !extractedSpecs[en]) {
                // Try to extract value after the label
                const children = item.querySelectorAll("span, div, p, dd, td");
                let value = "";
                children.forEach(c => {
                  const ct = c.textContent?.trim() || "";
                  if (!ct.toLowerCase().includes(fr) && ct.length < 50 && ct.length > 0) {
                    if (!value) value = ct;
                  }
                });
                if (!value) {
                  // Try regex extraction from text
                  const regex = new RegExp(fr + "\\s*:?\\s*(.+)", "i");
                  const m = text.match(regex);
                  if (m) value = m[1].trim().split(/\s{2,}/)[0];
                }
                if (value) {
                  extractedSpecs[en] = value;
                  attributes.push({ key: en, value: value });
                }
              }
            }
          });

          if (title) {
            const adFromDom = {
              subject: title,
              body: description,
              price: price ? [price] : [],
              images: { urls_large: images },
              attributes: attributes,
              _fromDom: true,
            };
            return { ad: JSON.stringify(adFromDom) };
          }

          // Nothing found - return debug info
          const ndKeys = nd ? Object.keys(nd.props?.pageProps || {}).join(", ") : "no __NEXT_DATA__";
          const hasRemix = !!window.__remixContext;
          const h1 = document.querySelector("h1")?.textContent?.trim()?.substring(0, 50) || "none";
          return { error: "Pas d'annonce trouvée.\n\nDébug: pageProps=[" + ndKeys + "], remix=" + hasRemix + ", h1=\"" + h1 + "\"\n\nÊtes-vous sur la page d'une annonce Leboncoin ?" };
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
