import { useState, useRef, useCallback } from "react";

// ─── CATÁLOGO REAL DE BELIER ────────────────────────────────────────────────
const CATALOG = [
  { id: "sos-apio", name: "Base Restauradora con Apio", line: "Línea S.O.S", category: "tratamiento", emoji: "🌿", desc: "Mejora la estructura de la uña después de un mal retiro de sistemas artificiales (acrílico/gel). 21 Free.", tags: ["gel_acrylic"] },
  { id: "sos-apio-calcio", name: "Base Apio & Calcio", line: "Línea S.O.S", category: "tratamiento", emoji: "💪", desc: "Genera resistencia a la uña y revitaliza su salud. Ideal para uñas frágiles y quebradizas. 21 Free.", tags: ["gel_acrylic", "nutritional"] },
  { id: "sos-apio-cebolla", name: "Base Apio & Cebolla", line: "Línea S.O.S", category: "tratamiento", emoji: "🌱", desc: "Fortalece las uñas y revitaliza su apariencia. Recomendada para uñas débiles. 21 Free.", tags: ["nutritional"] },
  { id: "sos-apio-keratina", name: "Base Apio & Keratina", line: "Línea S.O.S", category: "tratamiento", emoji: "✨", desc: "Elección ideal para uñas naturales. Recomendada para niñ@s y hombres. 21 Free.", tags: ["nutritional", "general"] },
  { id: "argan-violeta", name: "Tratamiento Argán Violeta 3en1", line: "Línea Argán", category: "tratamiento", emoji: "💜", desc: "Fortalecedor 3 en 1 (base, color y brillo). Activa el crecimiento de uñas débiles por uso de sistemas artificiales. 21 Free. 13 ml.", tags: ["gel_acrylic"] },
  { id: "argan-visos", name: "Tratamiento Argán Visos 3en1", line: "Línea Argán", category: "tratamiento", emoji: "🪙", desc: "Tratamiento regenerador 3 en 1. Regenera en tiempo récord la lámina ungueal dañada. 21 Free. 13 ml.", tags: ["gel_acrylic", "nutritional"] },
  { id: "argan-nude", name: "Tratamiento Argán Nude Boreal 3en1", line: "Línea Argán", category: "tratamiento", emoji: "🩷", desc: "Tratamiento fortalecedor 3 en 1. Revitaliza la uña con extracto de argán y Vitamina E. 21 Free. 13 ml.", tags: ["nutritional"] },
  { id: "esmalte-profesional", name: "Esmalte Profesional 21 Free", line: "Esmalte Profesional", category: "esmalte", emoji: "💅", desc: "+90 tonos. Con extractos naturales (ajo, áloe, romero, tomillo, canela). Secado rápido, sin lámpara UV/LED. Libre de 21 tóxicos.", tags: ["general"] },
  { id: "biogel-master", name: "BioGel Master – Efecto Gel", line: "Línea Efecto Gel", category: "esmalte", emoji: "🌟", desc: "Efecto gel impecable, secado rápido. 72% origen vegetal (caña de azúcar, yuca, maíz, algodón). 25 Free. Duración 10–15 días.", tags: ["general"] },
  { id: "finish-mate", name: "Top Coat Finish Mate", line: "Línea Top Coat", category: "finalizador", emoji: "🪩", desc: "Finalizador que genera un tono mate en las uñas. 21 Free. 13 ml.", tags: ["general"] },
  { id: "brillo-gel", name: "Top Coat Brillo Gel", line: "Línea Top Coat", category: "finalizador", emoji: "✦", desc: "Laca selladora a base de gel. Aumenta brillo, prolonga durabilidad y acelera el secado. 21 Free. 13 ml.", tags: ["general"] },
  { id: "brillo-secante", name: "Top Coat Brillo Secante", line: "Línea Top Coat", category: "finalizador", emoji: "⚡", desc: "Evita fracturas e intensifica el brillo. Secado más rápido. Disponible en 13 ml y 250 ml. 21 Free.", tags: ["general"] },
  { id: "removedor-esmalte", name: "Removedor de Esmalte", line: "Línea Cuidado", category: "cuidado", emoji: "🫧", desc: "Sin acetona ni tolueno. Con aceites naturales y humectantes. No reseca. Disponible en 60 ml, 120 ml, 250 ml, 1 lt y 4 lt.", tags: ["general", "gel_acrylic"] },
  { id: "crema-humectante", name: "Crema Humectante", line: "Línea Cuidado", category: "cuidado", emoji: "🌸", desc: "Con áloe vera, Vitamina E, aceite de coco, argán y filtro solar. Sin parabenos. Regeneración celular. 120 ml / 1 lt.", tags: ["nutritional", "general"] },
  { id: "removedora-cuticula", name: "Crema Removedora de Cutícula", line: "Línea Cuidado", category: "cuidado", emoji: "🧴", desc: "Elimina manchas en uñas, suaviza callosidades, hidrata y protege la piel. Resistente al agua. 120 ml / 1 lt.", tags: ["general"] },
  { id: "aceite-almendras", name: "Aceite de Almendras + Vitamina E", line: "Aceites Humectantes", category: "cuidado", emoji: "🌻", desc: "Fórmula ligera de rápida absorción con Vitamina E y filtro solar. Protege la piel de agentes externos. 120 ml / 1 lt.", tags: ["nutritional", "general"] },
  { id: "aceite-uva", name: "Aceite de Uva Hipoalergénico", line: "Aceites Humectantes", category: "cuidado", emoji: "🍇", desc: "Ideal para pieles sensibles con alto grado de resequedad. Antioxidante, ayuda al aclaramiento de zonas oscuras. 120 ml / 1 lt.", tags: ["nutritional"] },
  { id: "desengrasante", name: "Desengrasante de Uñas", line: "Línea Profesional", category: "profesional", emoji: "🔬", desc: "Prepara las uñas antes del esmalte. Con extracto de tomillo (cicatrizante), antibacterial, hidratante y dermo-protector. 120 ml / 1 lt.", tags: ["gel_acrylic", "general"] },
  { id: "nails-bond", name: "Nails Bond Sin Ácido", line: "Línea Profesional", category: "profesional", emoji: "🔩", desc: "Elimina humedad y grasa. Adhesión óptima con acrílico o gel sin lámpara UV. Resultados profesionales. 13 ml.", tags: ["gel_acrylic"] },
  { id: "lima-sponge", name: "Lima Sponge 100/180", line: "Limas Profesionales", category: "profesional", emoji: "🪄", desc: "Ideal para pulir y dejar lisas las superficies de sistemas artificiales como acrílico y polygel.", tags: ["gel_acrylic"] },
  { id: "lima-240", name: "Lima 240/220", line: "Limas Profesionales", category: "profesional", emoji: "📐", desc: "Diseñada para abrir canales antes de semipermanente y retirar residuos en la uña natural sin maltratarla.", tags: ["gel_acrylic", "general"] },
  { id: "magic-shinner", name: "Lima Magic Shinner", line: "Limas Profesionales", category: "profesional", emoji: "⭐", desc: "En solo dos pasos, la uña natural queda brillante sin necesidad de crema. Acabado impecable.", tags: ["general"] },
  { id: "spa-sales", name: "Sales Relajantes Pomelo Vainilla", line: "Línea Spa", category: "spa", emoji: "🛁", desc: "Sales de Manaure (La Guajira), aceite de pomelo vainilla, flores secas de lavanda, tomillo y caléndula.", tags: ["general"] },
  { id: "spa-mascarilla", name: "Mascarilla Peel Off Uchuva", line: "Línea Spa", category: "spa", emoji: "🌺", desc: "Retira células muertas, fórmula rica en antioxidantes con extracto de uchuva. Piel radiante y luminosa.", tags: ["nutritional", "general"] },
  { id: "spa-manticare", name: "Manticare – Mantequilla Humectante", line: "Línea Spa", category: "spa", emoji: "🧈", desc: "Humectación profunda. Contiene Hammamelis, áloe vera, argán, coco y Vitamina E.", tags: ["nutritional"] },
];

const PRODUCT_TAGS = {
  gel_acrylic: CATALOG.filter((p) => p.tags.includes("gel_acrylic")),
  nutritional: CATALOG.filter((p) => p.tags.includes("nutritional")),
  general: CATALOG.filter((p) => p.tags.includes("general")).slice(0, 8),
};

const WHATSAPP_NUMBER = "573183421985"; // ← Reemplaza con el número real de Belier

const QUESTIONS = [
  { id: "q1", text: "¿Con qué frecuencia usas gel o acrílico en tus uñas?", options: ["Nunca", "Ocasionalmente (1-2 veces/año)", "Frecuentemente (cada mes)", "Constantemente"] },
  { id: "q2", text: "¿Cómo describes el estado actual de tus uñas?", options: ["Fuertes y saludables", "Un poco frágiles", "Se quiebran fácilmente", "Muy dañadas y laminadas"] },
  { id: "q3", text: "¿Notas alguno de estos síntomas?", options: ["Ninguno", "Manchas blancas o amarillas", "Surcos o líneas horizontales", "Uñas muy delgadas o transparentes"] },
  { id: "q4", text: "¿Cómo es tu alimentación en general?", options: ["Muy balanceada", "Bastante balanceada", "Irregular, a veces descuido nutrición", "Poca variedad"] },
  { id: "q5", text: "¿Cuánto tiempo llevas con este problema?", options: ["Menos de 1 mes", "1 a 3 meses", "3 a 6 meses", "Más de 6 meses"] },
];

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function analyzeWithAI(imageBase64, answers) {
  const answersText = QUESTIONS.map((q) => `${q.text}\nRespuesta: ${answers[q.id] || "No respondida"}`).join("\n\n");
  const prompt = `Eres un experto en salud ungueal de Cosméticos Belier, marca colombiana vegana y cruelty-free con 25 años de experiencia. Analiza esta imagen de uñas junto con el cuestionario.

CUESTIONARIO:
${answersText}

Responde con este formato exacto:

DIAGNÓSTICO PRINCIPAL:
[una frase clara]

HALLAZGOS:
• [hallazgo 1]
• [hallazgo 2]
• [hallazgo 3]

CAUSAS PROBABLES:
• [causa 1]
• [causa 2]

SEVERIDAD: [Leve / Moderado / Severo]

CATEGORÍAS DE PRODUCTO RECOMENDADAS: [escribe exactamente las que apliquen separadas por coma: gel_acrylic, nutritional, general]

CONSEJOS PRÁCTICOS:
1. [consejo 1]
2. [consejo 2]
3. [consejo 3]

Responde en español, con calidez y profesionalismo.`;

  const response = await fetch("/.netlify/functions/diagnose", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": "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", "anthropic-version": "2023-06-01" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: [{ type: "image", source: { type: "base64", media_type: "image/jpeg", data: imageBase64 } }, { type: "text", text: prompt }] }],
    }),
  });
  const data = await response.json();
  return data.content[0].text;
}

function parseAIResponse(text) {
  const categories = [];
  if (text.includes("gel_acrylic")) categories.push("gel_acrylic");
  if (text.includes("nutritional")) categories.push("nutritional");
  if (text.includes("general") || categories.length === 0) categories.push("general");
  let severity = "Moderado";
  if (/severo/i.test(text)) severity = "Severo";
  else if (/leve/i.test(text)) severity = "Leve";
  return { rawText: text, categories, severity };
}

const sevColor = {
  Leve: { bg: "#d4f4d4", text: "#2d6a2d", dot: "#4caf50" },
  Moderado: { bg: "#fff3cd", text: "#7d5a00", dot: "#f5a623" },
  Severo: { bg: "#fde8e8", text: "#7d1a1a", dot: "#e53935" },
};

const catLabel = { tratamiento: "Tratamiento", esmalte: "Esmalte", finalizador: "Finalizador", cuidado: "Cuidado", profesional: "Profesional", spa: "Spa" };
const catColor = { tratamiento: "#e8d5f5", esmalte: "#d5eef5", finalizador: "#f5f0d5", cuidado: "#f5d5e8", profesional: "#d5f5e8", spa: "#f5e8d5" };

function ProductCarousel({ products }) {
  const [idx, setIdx] = useState(0);
  const total = products.length;
  const prev = () => setIdx((i) => (i - 1 + total) % total);
  const next = () => setIdx((i) => (i + 1) % total);
  const product = products[idx];
  if (!product) return null;
  const waMsg = encodeURIComponent(`Hola Belier! Me interesa el producto: ${product.name} (${product.line}). ¿Me pueden dar más información?`);
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`;

  return (
    <div style={cs.wrap}>
      <div style={cs.inner}>
        <button style={cs.arrow} onClick={prev}>‹</button>
        <div style={cs.card}>
          <div style={cs.top}>
            <span style={cs.emoji}>{product.emoji}</span>
            <span style={{ ...cs.badge, background: catColor[product.category] || "#eee" }}>{catLabel[product.category] || product.category}</span>
          </div>
          <p style={cs.lineName}>{product.line}</p>
          <h4 style={cs.name}>{product.name}</h4>
          <p style={cs.desc}>{product.desc}</p>
          <a href={waUrl} target="_blank" rel="noopener noreferrer" style={cs.waBtn}>
            <span style={{ fontSize: "16px" }}>💬</span> Pedir por WhatsApp
          </a>
        </div>
        <button style={cs.arrow} onClick={next}>›</button>
      </div>
      <div style={cs.dots}>
        {products.map((_, i) => (
          <button key={i} style={{ ...cs.dot, background: i === idx ? "#8b5e3c" : "#d5b89a" }} onClick={() => setIdx(i)} />
        ))}
      </div>
      <p style={cs.counter}>{idx + 1} / {total}</p>
    </div>
  );
}

const cs = {
  wrap: { margin: "0 -4px" },
  inner: { display: "flex", alignItems: "center", gap: "8px" },
  arrow: { width: "32px", height: "32px", borderRadius: "50%", border: "1.5px solid rgba(139,94,60,0.3)", background: "rgba(253,246,238,0.9)", cursor: "pointer", fontSize: "20px", color: "#8b5e3c", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, lineHeight: 1, fontFamily: "Georgia, serif" },
  card: { flex: 1, background: "linear-gradient(135deg, rgba(253,246,238,0.95), rgba(245,230,210,0.8))", borderRadius: "16px", padding: "20px", border: "1px solid rgba(201,169,110,0.3)", minHeight: "210px" },
  top: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" },
  emoji: { fontSize: "28px" },
  badge: { fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px", color: "#4d2f1a", letterSpacing: "0.04em" },
  lineName: { fontSize: "11px", color: "#a08060", margin: "0 0 4px", letterSpacing: "0.06em", textTransform: "uppercase" },
  name: { fontSize: "15px", fontWeight: "700", color: "#3d2012", margin: "0 0 8px", lineHeight: "1.3" },
  desc: { fontSize: "12.5px", color: "#5a3a20", lineHeight: "1.55", margin: "0 0 16px" },
  waBtn: { display: "flex", alignItems: "center", gap: "6px", justifyContent: "center", padding: "10px 16px", background: "#25D366", color: "#fff", borderRadius: "10px", textDecoration: "none", fontSize: "13px", fontWeight: "700", fontFamily: "Georgia, serif" },
  dots: { display: "flex", gap: "6px", justifyContent: "center", marginTop: "12px" },
  dot: { width: "8px", height: "8px", borderRadius: "50%", border: "none", cursor: "pointer", padding: 0 },
  counter: { textAlign: "center", fontSize: "11px", color: "#a08060", margin: "4px 0 0" },
};

export default function NailDiagnosticApp() {
  const [step, setStep] = useState("intro");
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQ, setCurrentQ] = useState(0);
  const [diagnosis, setDiagnosis] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const fileInputRef = useRef();

  const handleImageUpload = useCallback(async (file) => {
    if (!file) return;
    setImage(URL.createObjectURL(file));
    setImageBase64(await fileToBase64(file));
    setStep("questions");
  }, []);

  const handleAnswer = (qId, answer) => {
    const newAnswers = { ...answers, [qId]: answer };
    setAnswers(newAnswers);
    if (currentQ < QUESTIONS.length - 1) setCurrentQ(currentQ + 1);
    else runDiagnosis(newAnswers);
  };

  const runDiagnosis = async (finalAnswers) => {
    setStep("analyzing");
    setError(null);
    try {
      const aiText = await analyzeWithAI(imageBase64, finalAnswers);
      const parsed = parseAIResponse(aiText);
      setDiagnosis(parsed);
      setActiveTab(parsed.categories[0]);
      setStep("results");
    } catch {
      setError("Hubo un error. Por favor intenta de nuevo.");
      setStep("questions");
    }
  };

  const reset = () => { setStep("intro"); setImage(null); setImageBase64(null); setAnswers({}); setCurrentQ(0); setDiagnosis(null); setError(null); setActiveTab(null); };

  const tabProducts = activeTab ? (PRODUCT_TAGS[activeTab] || []) : [];
  const tabLabels = { gel_acrylic: "🔧 Daño Gel/Acrílico", nutritional: "🥗 Deficiencia Nutricional", general: "💆 Cuidado General" };

  return (
    <div style={S.app}>
      <div style={S.bgDecor1} /><div style={S.bgDecor2} />
      <div style={S.container}>
        <header style={S.header}>
          <div style={S.logo}><span style={S.logoIcon}>✦</span><span style={S.logoText}>BELIER</span></div>
          <p style={S.tagline}>Diagnóstico Inteligente de Uñas · #ViveLibre</p>
        </header>

        {step === "intro" && (
          <div style={S.card}>
            <div style={{ fontSize: "48px", textAlign: "center", marginBottom: "16px" }}>💅</div>
            <h1 style={S.introTitle}>¿Cómo están tus uñas?</h1>
            <p style={S.introDesc}>Nuestra IA analiza el estado de tus uñas y te recomienda los productos Belier perfectos — 25 años cuidando la belleza colombiana.</p>
            <div style={S.steps}>
              {[{ i: "📸", t: "Sube una foto de tu uña" }, { i: "📋", t: "Responde 5 preguntas rápidas" }, { i: "🔬", t: "Recibe diagnóstico + productos del catálogo Belier" }].map((s, j) => (
                <div key={j} style={S.stepItem}><span style={{ fontSize: "20px" }}>{s.i}</span><span style={S.stepText}>{s.t}</span></div>
              ))}
            </div>
            <button style={S.btnPrimary} onClick={() => setStep("photo")}>Comenzar diagnóstico</button>
          </div>
        )}

        {step === "photo" && (
          <div style={S.card}>
            <h2 style={S.sectionTitle}>Foto de tus uñas</h2>
            <p style={S.sectionDesc}>Toma una foto clara con buena iluminación.</p>
            <div style={S.dropzone} onClick={() => fileInputRef.current.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); handleImageUpload(e.dataTransfer.files[0]); }}>
              <span style={{ fontSize: "36px", display: "block", marginBottom: "8px" }}>📷</span>
              <p style={{ fontSize: "15px", color: "#5a3a20", fontWeight: "600", margin: "0 0 4px" }}>Haz clic o arrastra tu foto aquí</p>
              <p style={{ fontSize: "12px", color: "#a08060", margin: 0 }}>JPG, PNG — máximo 10MB</p>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleImageUpload(e.target.files[0])} />
            <button style={S.btnSecondary} onClick={() => setStep("intro")}>← Volver</button>
          </div>
        )}

        {step === "questions" && (
          <div style={S.card}>
            {image && <div style={S.imagePreviewRow}><img src={image} alt="Uña" style={S.imageThumb} /><span style={{ fontSize: "13px", color: "#5a3a20", fontWeight: "600" }}>Foto cargada ✓</span></div>}
            <div style={S.progressRow}>{QUESTIONS.map((_, i) => <div key={i} style={{ ...S.progressDot, background: i < currentQ ? "#c9a96e" : i === currentQ ? "#8b5e3c" : "#e5d5c0" }} />)}</div>
            <p style={{ fontSize: "12px", color: "#a08060", margin: "0 0 8px", letterSpacing: "0.06em", textTransform: "uppercase" }}>Pregunta {currentQ + 1} de {QUESTIONS.length}</p>
            <h2 style={S.qText}>{QUESTIONS[currentQ].text}</h2>
            {error && <p style={{ fontSize: "13px", color: "#c0392b", background: "#fde8e8", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px" }}>{error}</p>}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {QUESTIONS[currentQ].options.map((opt) => (
                <button key={opt} style={S.optionBtn} onClick={() => handleAnswer(QUESTIONS[currentQ].id, opt)}>{opt}</button>
              ))}
            </div>
          </div>
        )}

        {step === "analyzing" && (
          <div style={{ ...S.card, textAlign: "center", padding: "56px 28px" }}>
            <div style={S.spinner} />
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#3d2012", margin: "0 0 10px" }}>Analizando tus uñas...</h2>
            <p style={{ fontSize: "14px", color: "#7a5040", lineHeight: "1.6", margin: 0 }}>Nuestra IA revisa tu foto y respuestas para darte el diagnóstico más preciso.</p>
          </div>
        )}

        {step === "results" && diagnosis && (
          <div style={S.card}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={S.resultsCheck}>✓</div>
              <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#3d2012", margin: 0 }}>Tu Diagnóstico</h2>
            </div>
            <div style={{ ...S.severityBadge, background: sevColor[diagnosis.severity]?.bg || "#f5f5f5", color: sevColor[diagnosis.severity]?.text || "#333" }}>
              <span style={{ ...S.severityDot, background: sevColor[diagnosis.severity]?.dot || "#999" }} />
              Severidad: <strong>{diagnosis.severity}</strong>
            </div>
            <div style={S.analysisBox}>
              <h3 style={S.boxTitle}>📋 Análisis Completo</h3>
              <p style={{ fontSize: "13px", color: "#5a3a20", lineHeight: "1.75", margin: 0, whiteSpace: "pre-wrap" }}>{diagnosis.rawText}</p>
            </div>

            {/* Catalog with tabs + carousel */}
            <div style={{ marginBottom: "24px" }}>
              <h3 style={S.boxTitle}>✦ Productos Belier Recomendados</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                {diagnosis.categories.map((cat) => (
                  <button key={cat} style={{ padding: "7px 14px", borderRadius: "20px", border: "1.5px solid rgba(201,169,110,0.4)", background: activeTab === cat ? "linear-gradient(135deg, #8b5e3c, #c9a96e)" : "transparent", color: activeTab === cat ? "#fff" : "#7a5040", fontSize: "12px", cursor: "pointer", fontFamily: "Georgia, serif" }} onClick={() => setActiveTab(cat)}>
                    {tabLabels[cat] || cat}
                  </button>
                ))}
              </div>
              {tabProducts.length > 0 ? <ProductCarousel products={tabProducts} /> : <p style={{ fontSize: "13px", color: "#a08060", textAlign: "center", padding: "20px" }}>No hay productos en esta categoría.</p>}
            </div>

            {image && (
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", padding: "12px", background: "rgba(253,246,238,0.5)", borderRadius: "12px" }}>
                <img src={image} alt="Uña analizada" style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "10px", border: "2px solid rgba(201,169,110,0.4)" }} />
                <span style={{ fontSize: "13px", color: "#7a5040", fontStyle: "italic" }}>Imagen analizada</span>
              </div>
            )}
            <button style={S.btnPrimary} onClick={reset}>Hacer otro diagnóstico</button>
          </div>
        )}

        <footer style={{ textAlign: "center", fontSize: "12px", color: "#a08060", marginTop: "8px", letterSpacing: "0.04em" }}>
          <p>Cosméticos Belier · Saludable · Vegano · Cruelty-Free 🌿 · 25 años</p>
        </footer>
      </div>
    </div>
  );
}

const S = {
  app: { minHeight: "100vh", background: "linear-gradient(135deg, #fdf6ee 0%, #f5e6d3 50%, #fdf0e8 100%)", fontFamily: "'Georgia', 'Times New Roman', serif", position: "relative", overflow: "hidden" },
  bgDecor1: { position: "fixed", top: "-120px", right: "-120px", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,169,110,0.18) 0%, transparent 70%)", pointerEvents: "none" },
  bgDecor2: { position: "fixed", bottom: "-80px", left: "-80px", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,94,60,0.12) 0%, transparent 70%)", pointerEvents: "none" },
  container: { maxWidth: "520px", margin: "0 auto", padding: "24px 16px 40px", position: "relative", zIndex: 1 },
  header: { textAlign: "center", marginBottom: "32px" },
  logo: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "4px" },
  logoIcon: { fontSize: "20px", color: "#c9a96e" },
  logoText: { fontSize: "28px", fontWeight: "700", letterSpacing: "0.18em", color: "#3d2012" },
  tagline: { fontSize: "12px", color: "#8b6a50", letterSpacing: "0.08em", margin: 0 },
  card: { background: "rgba(255,255,255,0.82)", backdropFilter: "blur(16px)", borderRadius: "20px", padding: "32px 28px", boxShadow: "0 8px 40px rgba(139,94,60,0.12)", border: "1px solid rgba(201,169,110,0.25)", marginBottom: "16px" },
  introTitle: { fontSize: "26px", fontWeight: "700", color: "#3d2012", textAlign: "center", margin: "0 0 12px" },
  introDesc: { fontSize: "15px", color: "#6b4c35", textAlign: "center", lineHeight: "1.6", margin: "0 0 28px" },
  steps: { display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" },
  stepItem: { display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", background: "rgba(201,169,110,0.1)", borderRadius: "12px", border: "1px solid rgba(201,169,110,0.2)" },
  stepText: { fontSize: "14px", color: "#4d2f1a", fontWeight: "500" },
  btnPrimary: { width: "100%", padding: "16px", background: "linear-gradient(135deg, #8b5e3c, #c9a96e)", color: "#fff", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "600", cursor: "pointer", letterSpacing: "0.04em", fontFamily: "Georgia, serif", boxShadow: "0 4px 20px rgba(139,94,60,0.35)" },
  btnSecondary: { marginTop: "12px", width: "100%", padding: "12px", background: "transparent", color: "#8b5e3c", border: "1px solid rgba(139,94,60,0.3)", borderRadius: "12px", fontSize: "14px", cursor: "pointer", fontFamily: "Georgia, serif" },
  sectionTitle: { fontSize: "22px", fontWeight: "700", color: "#3d2012", margin: "0 0 8px" },
  sectionDesc: { fontSize: "14px", color: "#7a5040", margin: "0 0 24px", lineHeight: "1.5" },
  dropzone: { border: "2px dashed rgba(201,169,110,0.5)", borderRadius: "16px", padding: "40px 24px", textAlign: "center", cursor: "pointer", background: "rgba(253,246,238,0.5)", marginBottom: "16px" },
  imagePreviewRow: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", padding: "10px 14px", background: "rgba(201,169,110,0.1)", borderRadius: "10px" },
  imageThumb: { width: "44px", height: "44px", objectFit: "cover", borderRadius: "8px", border: "2px solid rgba(201,169,110,0.4)" },
  progressRow: { display: "flex", gap: "8px", marginBottom: "16px", justifyContent: "center" },
  progressDot: { width: "10px", height: "10px", borderRadius: "50%", transition: "background 0.3s" },
  qText: { fontSize: "18px", fontWeight: "700", color: "#3d2012", margin: "0 0 24px", lineHeight: "1.4" },
  optionBtn: { padding: "14px 18px", background: "rgba(253,246,238,0.8)", border: "1.5px solid rgba(201,169,110,0.3)", borderRadius: "12px", fontSize: "14px", color: "#4d2f1a", cursor: "pointer", textAlign: "left", fontFamily: "Georgia, serif" },
  spinner: { width: "52px", height: "52px", border: "4px solid rgba(201,169,110,0.2)", borderTop: "4px solid #c9a96e", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 24px" },
  resultsCheck: { width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, #8b5e3c, #c9a96e)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "700", flexShrink: 0 },
  severityBadge: { display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 14px", borderRadius: "20px", fontSize: "13px", marginBottom: "20px" },
  severityDot: { width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0 },
  analysisBox: { background: "rgba(253,246,238,0.7)", borderRadius: "14px", padding: "20px", marginBottom: "24px", border: "1px solid rgba(201,169,110,0.2)" },
  boxTitle: { fontSize: "15px", fontWeight: "700", color: "#3d2012", margin: "0 0 12px", letterSpacing: "0.02em" },
};

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
}
