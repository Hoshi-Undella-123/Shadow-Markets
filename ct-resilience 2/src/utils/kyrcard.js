/**
 * Generate a printable Know Your Rights wallet card (3"×5") in 4 languages.
 * Includes the 6 core ICE rights + key hotlines.
 * Designed to be printed and distributed in communities.
 */
export const generateKYRCard = () => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Know Your Rights — CT Immigrant Community Card</title>
<style>
  @page { size: 5in 3in; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Arial', sans-serif; background: #fff; }
  
  .card {
    width: 5in; height: 3in;
    display: flex; overflow: hidden;
    border: 2px solid #1D4ED8;
    border-radius: 4px;
    page-break-after: always;
  }
  
  /* Left side: English + Spanish */
  .left {
    width: 50%; height: 100%;
    padding: 10px 12px;
    border-right: 1.5px solid #1D4ED8;
    display: flex; flex-direction: column;
  }
  
  /* Right side: Portuguese + French Creole */
  .right {
    width: 50%; height: 100%;
    padding: 10px 12px;
    display: flex; flex-direction: column;
  }
  
  .lang-header {
    font-size: 7pt; font-weight: 900; letter-spacing: 0.1em;
    text-transform: uppercase; margin-bottom: 4px;
    padding: 2px 6px; border-radius: 3px;
    display: inline-block;
  }
  .en-header { background: #1D4ED8; color: #fff; }
  .es-header { background: #DC2626; color: #fff; }
  .pt-header { background: #16A34A; color: #fff; }
  .ht-header { background: #7C3AED; color: #fff; }
  
  .rights { flex: 1; margin: 4px 0; }
  .right-item {
    font-size: 6pt; line-height: 1.3;
    margin-bottom: 3px; padding-left: 8px;
    position: relative;
  }
  .right-item::before {
    content: "•"; position: absolute; left: 0;
    color: #1D4ED8; font-weight: 700;
  }
  .right-item strong { color: #111; }
  
  .lang-divider {
    height: 1px; background: #E5E7EB;
    margin: 5px 0;
  }
  
  .hotlines {
    background: #EFF6FF; border-radius: 3px;
    padding: 4px 6px; margin-top: 4px;
  }
  .hotline-title { font-size: 5.5pt; font-weight: 700; color: #1D4ED8; margin-bottom: 2px; }
  .hotline-item { font-size: 5.5pt; color: #374151; line-height: 1.4; }
  .hotline-num { font-weight: 700; color: #DC2626; }
  
  .card-title {
    font-size: 7.5pt; font-weight: 900; color: #1D4ED8;
    letter-spacing: 0.05em; text-align: center;
    border-bottom: 1px solid #1D4ED8; padding-bottom: 3px;
    margin-bottom: 5px;
  }
  
  .logo-row {
    display: flex; justify-content: space-between; align-items: center;
    font-size: 5pt; color: #9CA3AF; margin-top: 3px;
  }
  
  @media print {
    body { background: white; }
    .card { border: 2px solid #1D4ED8; }
  }
</style>
</head>
<body>

<!-- CARD FRONT -->
<div class="card">
  <div class="left">
    <div class="card-title">KNOW YOUR RIGHTS / CONOZCA SUS DERECHOS</div>
    
    <span class="lang-header en-header">ENGLISH</span>
    <div class="rights">
      <div class="right-item"><strong>REMAIN SILENT.</strong> You don't have to answer questions about where you were born or how you entered.</div>
      <div class="right-item"><strong>REFUSE ENTRY.</strong> Don't open your door. ICE needs a JUDICIAL warrant signed by a judge.</div>
      <div class="right-item"><strong>REQUEST A LAWYER.</strong> Say: "I want a lawyer." Don't sign anything.</div>
      <div class="right-item"><strong>DO NOT SIGN</strong> any documents without a lawyer.</div>
      <div class="right-item"><strong>DOCUMENT</strong> agent names, badge #s, vehicles.</div>
    </div>
    
    <div class="lang-divider"/>
    
    <span class="lang-header es-header">ESPAÑOL</span>
    <div class="rights">
      <div class="right-item"><strong>PERMANEZCA EN SILENCIO.</strong> No responda preguntas sobre su lugar de nacimiento.</div>
      <div class="right-item"><strong>NO ABRA LA PUERTA.</strong> ICE necesita una orden judicial firmada por un juez.</div>
      <div class="right-item"><strong>PIDA UN ABOGADO.</strong> Diga: "Quiero un abogado." No firme nada.</div>
      <div class="right-item"><strong>NO FIRME</strong> ningún documento sin abogado.</div>
    </div>
    
    <div class="hotlines">
      <div class="hotline-title">🚨 CT RAPID RESPONSE</div>
      <div class="hotline-item">211 (All languages, 24/7) &nbsp;|&nbsp; <span class="hotline-num">CIRA: (860) 906-8000</span></div>
      <div class="hotline-item">Make the Road CT: <span class="hotline-num">(203) 549-5220</span> &nbsp;|&nbsp; NLG: <span class="hotline-num">(203) 896-7221</span></div>
    </div>
  </div>
  
  <div class="right">
    <div style="height:20px"/>
    
    <span class="lang-header pt-header">PORTUGUÊS</span>
    <div class="rights">
      <div class="right-item"><strong>PERMANEÇA EM SILÊNCIO.</strong> Você não precisa responder perguntas sobre onde nasceu.</div>
      <div class="right-item"><strong>NÃO ABRA A PORTA.</strong> O ICE precisa de uma ordem judicial assinada por um juiz.</div>
      <div class="right-item"><strong>PEÇA UM ADVOGADO.</strong> Diga: "Quero um advogado." Não assine nada.</div>
      <div class="right-item"><strong>NÃO ASSINE</strong> nenhum documento sem advogado.</div>
    </div>
    
    <div class="lang-divider"/>
    
    <span class="lang-header ht-header">KREYÒL AYISYEN</span>
    <div class="rights">
      <div class="right-item"><strong>RETE SILANS.</strong> Ou pa oblije reponn kesyon sou kote ou te fèt.</div>
      <div class="right-item"><strong>PA OUVRI PÒT LA.</strong> ICE bezwen yon manda jidisyè siyen pa yon jij.</div>
      <div class="right-item"><strong>MANDE YON AVOKA.</strong> Di: "Mwen vle yon avoka." Pa siyen anyen.</div>
      <div class="right-item"><strong>PA SIYEN</strong> okenn dokiman san avoka.</div>
    </div>
    
    <div class="hotlines">
      <div class="hotline-title">THESE RIGHTS APPLY TO ALL — REGARDLESS OF STATUS</div>
      <div class="hotline-item">CT Legal Services: <span class="hotline-num">(800) 798-0671</span></div>
      <div class="hotline-item">Sanctuary CT: <span class="hotline-num">(860) 519-0966</span> &nbsp;|&nbsp; CT Bail Fund: ctbailfund.org</div>
    </div>
    
    <div class="logo-row">
      <span>CT Resilience Network · ctphilanthropy.org</span>
      <span>Print & Distribute Freely</span>
    </div>
  </div>
</div>

<div style="text-align:center;padding:20px;font-family:Arial;font-size:11px;color:#374151">
  <p><strong>Print Instructions:</strong> Print at 100% scale. Cut along border. Laminate for durability.</p>
  <p>Share freely. Available at ctphilanthropy.org · Questions: info@ctphilanthropy.org</p>
  <br/>
  <button onclick="window.print()" style="background:#1D4ED8;color:#fff;border:none;padding:10px 24px;border-radius:6px;font-size:13px;font-weight:700;cursor:pointer">
    🖨 Print KYR Card
  </button>
</div>

</body>
</html>`;

  const win = window.open("", "_blank", "width=820,height=520");
  if (!win) {
    const blob = new Blob([html], { type:"text/html" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `CT-KYR-WalletCard.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return;
  }
  win.document.write(html);
  win.document.close();
};
