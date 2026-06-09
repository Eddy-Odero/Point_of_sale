
function getSeedData() {
  return {
    store: { name:"TINAH COSMETICS", cashier:"Vivian", currency:"KES", vat_rate:0.16 },
    cashiers: [
      { id:1, name:"Tinah",  pin:"1234", role:"manager"  },
      { id:2, name:"Vivian",   pin:"2222", role:"cashier"  },
      { id:3, name:"Grace",   pin:"3333", role:"cashier"  },
      { id:4, name:"Eddy", pin:"4444", role:"manager"  }
    ],
    categories: [
      { id:"clothing", label:"Clothing", subcategories:["Tops & Blouses","Trousers & Pants","Dresses","Skirts","Jackets & Coats","Suits","Knitwear","Activewear","Shorts"] },
      { id:"shoes",    label:"Shoes",    subcategories:["Heels","Flats","Sneakers","Boots","Sandals","Loafers","Mules"] },
      { id:"cosmetics",label:"Cosmetics",subcategories:["Soaps","Creams","Lotions","Serums","Foundations","Perfumes","Lip Colour","Eye Makeup","Hair care","Face care"] }
    ],
    products: [
      { id:1,  name:"Silk Wrap Blouse",    category:"clothing", subcategory:"Tops & Blouses",  price:4200,  stock:8,  sku:"CLO-001", image_url:"https://img.lilysilk.com/cdn-cgi/image/width=1800,height=2700,quality=80,fit=cover/media/catalog/product/N9962/03BU/4.jpg"},
      { id:2,  name:"High-Waist Trousers", category:"clothing", subcategory:"Trousers & Pants", price:5800,  stock:5,  sku:"CLO-002", image_url:"https://m.media-amazon.com/images/I/712gf22WfGL._AC_UY1000_.jpg" },
      { id:3,  name:"Floral Midi Dress",   category:"clothing", subcategory:"Dresses",          price:7500,  stock:3,  sku:"CLO-003", image_url:"https://i5.walmartimages.com/asr/5d2a59a5-cc00-4c31-bc3d-e96399c7c998.39897716b4ae0b580e59ea1497291283.jpeg" },
      { id:4,  name:"Wool Blend Coat",     category:"clothing", subcategory:"Jackets & Coats",  price:18500, stock:4,  sku:"CLO-004", image_url:"https://kaleidoscope.scene7.com/is/image/OttoUK/600w/Witt-Wool-Blend-Belted-Coat~H80467FRSP.jpg" },
      { id:5,  name:"Fitted Blazer",       category:"clothing", subcategory:"Suits",            price:12000, stock:6,  sku:"CLO-005", image_url:"https://media.mango.com/is/image/punto/27041294-99-002?wid=2048" },
      { id:6,  name:"A-Line Mini Skirt",   category:"clothing", subcategory:"Skirts",           price:3200,  stock:11, sku:"CLO-006", image_url:"https://m.media-amazon.com/images/I/61FiyfJK7XL._AC_SX466_.jpg" },
      { id:7,  name:"Strappy Heels",       category:"shoes",    subcategory:"Heels",            price:8900,  stock:7,  sku:"SHO-001", image_url:"https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80" },
      { id:8,  name:"Block Heel Mules",    category:"shoes",    subcategory:"Mules",            price:6400,  stock:4,  sku:"SHO-002", image_url:"https://www.misslola.com/cdn/shop/files/weekend-attire-white-BF4A5645_large@2x.jpg?v=1709669933" },
      { id:9,  name:"Classic Loafers",     category:"shoes",    subcategory:"Loafers",          price:7200,  stock:9,  sku:"SHO-003", image_url:"https://i5.walmartimages.com/asr/0aeb4873-29ad-41e6-ac67-7e015b8c2b51.ad3b5a681ee662d24ba7a63dac7dad03.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF" },
      { id:10, name:"Ankle Boots",         category:"shoes",    subcategory:"Boots",            price:11500, stock:3,  sku:"SHO-004", image_url:"https://media.mango.com/is/image/punto/27082005-99-052?wid=2048" },
      { id:11, name:"Rose Moisturiser",    category:"cosmetics",subcategory:"Creams",           price:2100,  stock:15, sku:"COS-001", image_url:"https://5.imimg.com/data5/SELLER/Default/2025/9/548547056/YB/FP/AP/54980860/rose-moisturizing-cream-500x500.png" },
      { id:12, name:"Argan Body Lotion",   category:"cosmetics",subcategory:"Lotions",          price:1650,  stock:20, sku:"COS-002", image_url:"https://izilbeauty.com/dw/image/v2/BJQV_PRD/on/demandware.static/-/Sites-izil-master-catalog/default/dw39e8f721/images/large/e-Packshots/Amber/FG-330010_Amber-Moisturising-Body-Lotion/FG-330010_Amber-Moisturising-Body-Lotion-3.jpg" },
      { id:13, name:"Gold Radiance Serum", category:"cosmetics",subcategory:"Serums",           price:4800,  stock:10, sku:"COS-003", image_url:"https://drrashelstore.pk/cdn/shop/files/dr_rashel_products_1__jpg.jpg?v=1770731448" },
      { id:14, name:"Shea Butter Soap",    category:"cosmetics",subcategory:"Soaps",            price:580,   stock:30, sku:"COS-004", image_url:"https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=400&q=80" },
      { id:15, name:"Velvet Lip Colour",   category:"cosmetics",subcategory:"Lip Colour",       price:1200,  stock:18, sku:"COS-005", image_url:"https://www.lotus.in/cdn/shop/files/04_6f59dfae-9b2f-4327-94f3-c62dd75045b8.jpg?v=1754469201&width=1600" },
      { id:16, name:"Noir Eau de Parfum",  category:"cosmetics",subcategory:"Perfumes",         price:8500,  stock:7,  sku:"COS-006", image_url:"https://i.ebayimg.com/images/g/UYkAAOSwXBdlZ7~G/s-l1200.jpg" },
      { id:17, name:"Cashmere Knit Sweater", category:"clothing", subcategory:"Sweaters & Knitwear", price:9800, stock:6, sku:"CLO-007", image_url:"https://www.jennikayne.com/cdn/shop/files/cashmere-amelia-crewneck-warm-sand-2.jpg?v=1739307672" },
{ id:18, name:"Denim Jacket", category:"clothing", subcategory:"Jackets & Coats", price:7600, stock:9, sku:"CLO-008", image_url:"https://hips.hearstapps.com/hmg-prod/images/gettyimages-2133930650-66aaf97f8bf25.jpg?crop=0.659xw:1.00xh;0.171xw,0&resize=640:*" },
{ id:19, name:"Pleated Maxi Dress", category:"clothing", subcategory:"Dresses", price:9200, stock:4, sku:"CLO-009", image_url:"https://www.thedressoutlet.com/cdn/shop/files/3147_NAVY_A1.jpg?v=1746660710" },
{ id:20, name:"Tailored Jumpsuit", category:"clothing", subcategory:"Suits", price:10800, stock:5, sku:"CLO-010", image_url:"https://mediahub.prettylittlething.com/cno7236_black_xl?qlt=70&w=480&h=720&dpr=1&fit=cvr" },
{ id:21, name:"Leather Sneakers", category:"shoes", subcategory:"Sneakers", price:9500, stock:10, sku:"SHO-005", image_url:"https://cdn.hophopshop.com/productImages/28093/medium/Tezza-4141.jpg" },
{ id:22, name:"Pointed-Toe Flats", category:"shoes", subcategory:"Flats", price:5400, stock:12, sku:"SHO-006", image_url:"https://venstore.co.ke/vendor/uploads/women_fashion/6780d14ef3aa85.53240029.jpg" },
{ id:23, name:"Vitamin C Face Serum", category:"cosmetics", subcategory:"Serums", price:3900, stock:14, sku:"COS-007", image_url:"https://m.media-amazon.com/images/I/615YQQ63jfL._AC_UF1000,1000_QL80_.jpg" },
{ id:24, name:"Lavender Night Cream", category:"cosmetics", subcategory:"Creams", price:2600, stock:16, sku:"COS-008", image_url:"https://quincehoneyfarm.co.uk/wp-content/uploads/2022/12/Night-Cream3.jpg" },
{ id:25, name:"Coconut Hair Mask", category:"cosmetics", subcategory:"Hair Care", price:1800, stock:22, sku:"COS-009", image_url:"https://lk.spaceylon.com/cdn/shop/files/Virgin_Coconut_Hair_Treatment_Masque_150ml_S1.jpg?v=1754476152&width=1445" },
{ id:26, name:"Matte Finish Foundation", category:"cosmetics", subcategory:"Foundations", price:3200, stock:13, sku:"COS-010", image_url:"https://media6.ppl-media.com/tr:h-235,w-235,c-at_max,dpr-2/static/img/product/356169/faces-canada-weightless-matte-finish-foundation-natural-03-15ml-i-anti-ageing-i-non-clog-pores-i-lightweight-i-olive-seed-oil-i-grape-extract-i-shea-butter-i-cruelty-free-i-paraben-free_5_display_1708507007_6960c72f.jpg" },
{ id:27, name:"Wool Blend Blazer", category:"clothing", subcategory:"Jackets & Coats", price:11500, stock:6, sku:"CLO-011", image_url:"https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI211952179003_alternate10?$rl_4x5_pdp$"},
{ id:28, name:"High-Waist Jeans", category:"clothing", subcategory:"Trousers & Pants", price:6800, stock:11, sku:"CLO-012", image_url:"https://ke.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/11/8911623/1.jpg?5507" },
{ id:29, name:"Oversized Hoodie", category:"clothing", subcategory:"Jackets & Coats", price:5900, stock:15, sku:"CLO-013", image_url:"https://m.media-amazon.com/images/I/61hqvmjloRL._AC_SL1500_.jpg" },
{ id:30, name:"Satin Striped shirt", category:"clothing", subcategory:"Tops & Blouses", price:7400, stock:8, sku:"CLO-014", image_url:"https://street9.com/cdn/shop/products/SHR00008060_1_56f1c445-9251-410a-b0ae-387a5c15fe49.jpg?v=1751977069"},
{ id:31, name:"Cargo Shorts", category:"clothing", subcategory:"Shorts", price:4500, stock:18, sku:"CLO-015", image_url:"https://image.kilimall.com/kenya/shop/store/goods/9438/2023/06/16874280107285143fef066f947369b6312682f231487.jpg" },

{ id:32, name:"High Heels Sandals", category:"shoes", subcategory:"Heels", price:8700, stock:9, sku:"SHO-007", image_url:"https://image.made-in-china.com/2f0j00ecKUZSCqPjbs/New-Design-Women-High-Heel-Sandals-Size-12-Fashion-Ladies-Shoes-High-Heels.webp" },
{ id:33, name:"Chelsea Boots", category:"shoes", subcategory:"Boots", price:12800, stock:5, sku:"SHO-008", image_url:"https://www.bocage.eu/media/catalog/product/7/7/779920_10.jpg?optimize=medium&bg-color=255,255,255&fit=bounds&height=1820&width=1560&canvas=1560:1820" },
{ id:34, name:"Canvas Slip-Ons", category:"shoes", subcategory:"Sneakers", price:4200, stock:17, sku:"SHO-009", image_url:"https://images-na.ssl-images-amazon.com/images/I/814+Gb1oPQL._UL500_.jpg" },
{ id:35, name:"Strappy Heels", category:"shoes", subcategory:"Heels", price:7900, stock:7, sku:"SHO-010", image_url:"https://i5.walmartimages.com/seo/BLTIBY-Women-s-Rhinestone-Strappy-Spiral-Ankle-Strap-Low-Chunky-Block-Heel-Sandals-Fashion-Elegant-Open-Toe-Shoes-Black-36_50373d10-fcfc-44d1-b367-d13f25f4b743.b3fa160800d6c238e35a1bc7f2e1f548.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF"},

{ id:36, name:"Hydrating Face Mist", category:"cosmetics", subcategory:"Face Care", price:2100, stock:20, sku:"COS-011", image_url:"https://media-dynamic.okendo.io/images/67cbc062-a861-42c3-933b-2470b85b3089/6010db3b-f9fe-4e7c-a44b-6441873075c1.jpg?d=1600x1600"},
{ id:37, name:"Rose Lip Balm", category:"cosmetics", subcategory:"Lip Care", price:950, stock:30, sku:"COS-012", image_url:"https://tingd2c.com/cdn/shop/files/Artboard14_262619fc-09b0-4726-936c-b5404259f24d.png?v=1725365868" },
{ id:38, name:"Charcoal Face Wash", category:"cosmetics", subcategory:"Face care", price:1700, stock:25, sku:"COS-013", image_url:"https://drrashel.co.ke/wp-content/uploads/Dr-Rashel-Kenya-photo1692956301-9.jpeg" },
{ id:39, name:"Argan Hair Oil", category:"cosmetics", subcategory:"Hair care", price:2300, stock:19, sku:"COS-014", image_url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmdfNx_8rrw60LDPzlREJw5UdAAlpOLQUuSQ&s" },
{ id:40, name:"Waterproof Mascara", category:"cosmetics", subcategory:"Eye Makeup", price:2800, stock:16, sku:"COS-015", image_url:"https://d1ak51zwgmtslz.cloudfront.net/PRODUCTS_EN/8682536058360_9.jpg" }
    ]
  };
}

//  TRANSACTIONS & RECEIPT SYSTEM

let transactions = [];
let lastTxnId = null;

function buildTransaction() {
  const vr = storeConfig.vat_rate || 0.16;
  const sub = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const afterDisc = sub - discountAmt;
  const vat = afterDisc * vr;
  const total = afterDisc + vat;
  const tendered = payMethod === 'cash'
    ? (parseFloat(document.getElementById('cashTendered').value) || 0) : null;
  const mpesaPhone = payMethod === 'mpesa'
    ? document.getElementById('mpesaPhone').value.trim() : null;

  return {
    id: 'TXN-' + Date.now().toString(36).toUpperCase(),
    date: new Date().toISOString(),
    customer: document.getElementById('customerName').value.trim() || 'Walk-in Customer',
    cashier: activeCashier ? activeCashier.name : (storeConfig.cashier || 'Cashier'),
    cashier_id: activeCashier ? activeCashier.id : null,
    items: cart.map(i => ({ id:i.id, name:i.name, sku:i.sku||'', emoji:i.emoji||'', price:i.price, qty:i.qty })),
    subtotal: sub,
    discount: discountAmt,
    vat: Math.round(vat),
    total: Math.round(total),
    payMethod,
    tendered,
    change: tendered ? Math.max(0, tendered - total) : null,
    mpesaPhone,
    status: 'complete',
    returns: []
  };
}

// ── RECEIPT RENDER ──
function buildReceiptHTML(txn, isCreditNote = false) {
  const cur = storeConfig.currency || 'KES';
  const storeName = storeConfig.name || 'TINAH COSMETICS';
  const date = new Date(txn.date);
  const dateStr = date.toLocaleDateString('en-KE', { day:'numeric', month:'short', year:'numeric' });
  const timeStr = date.toLocaleTimeString('en-KE', { hour:'2-digit', minute:'2-digit' });
  const vatPct = Math.round((storeConfig.vat_rate || 0.16) * 100);

  const creditBanner = isCreditNote
    ? `<div class="receipt-credit-note">★ CREDIT NOTE / RETURN ★</div>` : '';

  const itemRows = txn.items.map(i => `
    <div class="receipt-item-row">
      <span class="receipt-item-name">${i.emoji} ${i.name}</span>
      <span class="receipt-item-qty">×${i.qty}</span>
      <span class="receipt-item-price">${cur} ${(i.price * i.qty).toLocaleString()}</span>
    </div>
  `).join('');

  const discountRow = txn.discount > 0
    ? `<div class="receipt-summary-row"><span>Discount</span><span>− ${cur} ${txn.discount.toLocaleString()}</span></div>` : '';

  const payLine = txn.payMethod === 'cash' && txn.tendered
    ? `<div style="font-size:10px;color:#555">Tendered: ${cur} ${txn.tendered.toLocaleString()} &nbsp;|&nbsp; Change: ${cur} ${Math.round(txn.change||0).toLocaleString()}</div>` : '';

  const mpesaLine = txn.payMethod === 'mpesa' && txn.mpesaPhone
    ? `<div style="font-size:10px;color:#555">M-Pesa: ${txn.mpesaPhone}</div>` : '';

  return `
    <div class="receipt-paper" id="receiptPaper">
      ${creditBanner}
      <div class="receipt-logo">
        <div class="receipt-store-name">${storeName}</div>
        <div class="receipt-store-sub">POINT OF SALE RECEIPT</div>
      </div>
      <hr class="receipt-divider-solid">
      <div class="receipt-meta">
        <div class="receipt-meta-row"><span>Receipt #</span><span><strong>${txn.id}</strong></span></div>
        <div class="receipt-meta-row"><span>Date</span><span>${dateStr} ${timeStr}</span></div>
        <div class="receipt-meta-row"><span>Customer</span><span>${txn.customer}</span></div>
        <div class="receipt-meta-row"><span>Cashier</span><span>${txn.cashier}</span></div>
        <div class="receipt-meta-row"><span>Payment</span><span style="text-transform:uppercase">${txn.payMethod}</span></div>
      </div>
      <hr class="receipt-divider">
      <div style="font-size:10px;font-weight:700;letter-spacing:0.1em;margin-bottom:6px">ITEMS</div>
      ${itemRows}
      <hr class="receipt-divider">
      <div class="receipt-summary">
        <div class="receipt-summary-row"><span>Subtotal</span><span>${cur} ${txn.subtotal.toLocaleString()}</span></div>
        ${discountRow}
        <div class="receipt-summary-row"><span>VAT (${vatPct}%)</span><span>${cur} ${txn.vat.toLocaleString()}</span></div>
      </div>
      <div class="receipt-total-row"><span>TOTAL</span><span>${cur} ${txn.total.toLocaleString()}</span></div>
      <div class="receipt-method">${payLine}${mpesaLine}</div>
      <hr class="receipt-divider" style="margin-top:14px">
      <div class="receipt-footer">
        Thank you for shopping with us!<br>
        Goods once sold are not returnable<br>
        without receipt within 7 days.<br><br>
        <strong>${storeName}</strong>
      </div>
    </div>
  `;
}

function showReceiptModal(txnId) {
  const txn = transactions.find(t => t.id === txnId);
  if (!txn) { toast('⚠ Receipt not found'); return; }
  document.getElementById('receiptContent').innerHTML = buildReceiptHTML(txn);
  document.getElementById('receiptModal').style.display = 'flex';
  // Store current txn for PDF/print
  window._currentReceiptTxn = txn;
}

function closeReceiptModal() {
  document.getElementById('receiptModal').style.display = 'none';
}

function printReceipt() {
  const txn = window._currentReceiptTxn;
  if (!txn) return;
  const html = buildReceiptHTML(txn);
  const win = window.open('', '_blank', 'width=400,height=700');
  win.document.write(`
    <!DOCTYPE html><html><head>
    <meta charset="UTF-8">
    <title>Receipt ${txn.id}</title>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&display=swap" rel="stylesheet">
    <style>
      body{margin:0;background:#fff;font-family:'Courier New',monospace}
      ${document.querySelector('style') ? '' : ''}
      .receipt-paper{padding:24px 20px;font-family:'Courier New',monospace;font-size:12px;line-height:1.6;color:#1a1a1a}
      .receipt-store-name{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;letter-spacing:0.3em;color:#8a6d2f;text-align:center}
      .receipt-store-sub{font-size:10px;letter-spacing:0.15em;color:#555;text-align:center;margin-top:2px}
      .receipt-divider{border:none;border-top:1px dashed #ccc;margin:10px 0}
      .receipt-divider-solid{border:none;border-top:2px solid #1a1a1a;margin:10px 0}
      .receipt-meta{font-size:10px;color:#555;margin-bottom:10px}
      .receipt-meta-row{display:flex;justify-content:space-between}
      .receipt-item-row{display:flex;justify-content:space-between;padding:2px 0}
      .receipt-item-name{flex:1}.receipt-item-qty{color:#555;width:40px;text-align:center}
      .receipt-item-price{width:80px;text-align:right}
      .receipt-summary-row{display:flex;justify-content:space-between;font-size:11px;color:#444;padding:2px 0}
      .receipt-total-row{display:flex;justify-content:space-between;font-size:14px;font-weight:700;border-top:2px solid #1a1a1a;margin-top:8px;padding-top:8px}
      .receipt-method{text-align:center;margin-top:10px;font-size:11px;color:#555}
      .receipt-footer{text-align:center;margin-top:14px;font-size:10px;color:#888;line-height:1.7}
      .receipt-logo{text-align:center;margin-bottom:16px}
      .receipt-credit-note{background:#fff3cd;border:1px solid #ffc107;border-radius:4px;padding:8px 12px;margin-bottom:10px;font-size:11px;color:#856404;text-align:center}
    </style>
    </head><body>${html}<script>window.onload=()=>{window.print();setTimeout(()=>window.close(),500)}<\/script></body></html>
  `);
  win.document.close();
}

function downloadReceiptPDF() {
  const txn = window._currentReceiptTxn;
  if (!txn) return;
  // Use browser's print-to-PDF via a hidden iframe
  const html = buildReceiptHTML(txn);
  let frame = document.getElementById('pdfFrame');
  if (!frame) {
    frame = document.createElement('iframe');
    frame.id = 'pdfFrame';
    frame.style.cssText = 'position:fixed;left:-9999px;top:0;width:400px;height:800px;border:none;';
    document.body.appendChild(frame);
  }
  frame.srcdoc = `<!DOCTYPE html><html><head>
    <meta charset="UTF-8"><title>Receipt ${txn.id}</title>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&display=swap" rel="stylesheet">
    <style>
      @page{size:80mm auto;margin:0}
      body{margin:0;background:#fff;font-family:'Courier New',monospace}
      .receipt-paper{padding:20px;font-family:'Courier New',monospace;font-size:11px;line-height:1.6;color:#1a1a1a}
      .receipt-store-name{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600;letter-spacing:0.3em;color:#8a6d2f;text-align:center}
      .receipt-store-sub{font-size:9px;letter-spacing:0.15em;color:#555;text-align:center;margin-top:2px}
      .receipt-divider{border:none;border-top:1px dashed #ccc;margin:8px 0}
      .receipt-divider-solid{border:none;border-top:2px solid #1a1a1a;margin:8px 0}
      .receipt-meta{font-size:9px;color:#555;margin-bottom:8px}
      .receipt-meta-row{display:flex;justify-content:space-between}
      .receipt-item-row{display:flex;justify-content:space-between;padding:1px 0;font-size:10px}
      .receipt-item-name{flex:1}.receipt-item-qty{color:#555;width:36px;text-align:center}
      .receipt-item-price{width:72px;text-align:right}
      .receipt-summary-row{display:flex;justify-content:space-between;font-size:10px;color:#444;padding:2px 0}
      .receipt-total-row{display:flex;justify-content:space-between;font-size:13px;font-weight:700;border-top:2px solid #1a1a1a;margin-top:6px;padding-top:6px}
      .receipt-method{text-align:center;margin-top:8px;font-size:10px;color:#555}
      .receipt-footer{text-align:center;margin-top:12px;font-size:9px;color:#888;line-height:1.7}
      .receipt-logo{text-align:center;margin-bottom:12px}
      .receipt-credit-note{background:#fff3cd;border:1px solid #ffc107;padding:6px 10px;margin-bottom:8px;font-size:10px;color:#856404;text-align:center}
    </style></head><body>${html}
    <script>window.onload=()=>window.print()<\/script></body></html>`;
  setTimeout(() => {
    try { frame.contentWindow.print(); } catch(e) {}
  }, 800);
  toast('⬇ Opening PDF export…');
}

//  RETURNS & DAMAGED GOODS
let currentReturnTxn = null;
let currentReturnType = 'return';

function renderReturnsTable() {
  const q = (document.getElementById('returnsSearchInput')?.value || '').toLowerCase();
  const list = q
    ? transactions.filter(t =>
        t.id.toLowerCase().includes(q) ||
        t.customer.toLowerCase().includes(q) ||
        t.items.some(i => i.name.toLowerCase().includes(q)))
    : transactions;

  const empty = document.getElementById('returnsEmpty');
  const table = document.getElementById('returnsTable');
  if (!transactions.length) { empty.style.display='block'; table.style.display='none'; return; }
  empty.style.display='none'; table.style.display='table';

  const cur = storeConfig.currency || 'KES';
  document.getElementById('returnsTableBody').innerHTML = list.map(t => {
    const date = new Date(t.date).toLocaleDateString('en-KE', { day:'numeric', month:'short', year:'numeric' });
    const itemsSummary = t.items.slice(0,2).map(i => i.name).join(', ')
      + (t.items.length > 2 ? ` +${t.items.length-2} more` : '');
    const hasReturns = t.returns && t.returns.length > 0;
    const statusBadge = hasReturns
      ? `<span class="badge badge-returned">Returned</span>`
      : `<span class="badge badge-complete">Complete</span>`;
    return `<tr>
      <td style="font-family:'Courier New',monospace;font-size:10px;color:var(--gold)">${t.id}</td>
      <td style="font-size:11px">${date}</td>
      <td style="font-size:11px">${t.customer}</td>
      <td style="font-size:11px;color:var(--text-dim)">${itemsSummary}</td>
      <td class="td-price">${cur} ${t.total.toLocaleString()}</td>
      <td>${statusBadge}</td>
      <td><div class="td-actions">
        <div class="icon-btn" onclick="showReceiptModal('${t.id}')" title="View Receipt">🧾</div>
        <div class="icon-btn" onclick="openReturnModal('${t.id}')" title="Process Return">↩</div>
      </div></td>
    </tr>`;
  }).join('');
}

function openReturnModal(txnId) {
  const txn = transactions.find(t => t.id === txnId);
  if (!txn) return;
  currentReturnTxn = txn;
  currentReturnType = 'return';

  const date = new Date(txn.date).toLocaleDateString('en-KE', { day:'numeric', month:'short', year:'numeric' });
  document.getElementById('returnReceiptInfo').innerHTML = `
    <div class="receipt-meta-row"><span><strong>Receipt:</strong></span><span style="font-family:'Courier New',monospace">${txn.id}</span></div>
    <div class="receipt-meta-row"><span><strong>Date:</strong></span><span>${date}</span></div>
    <div class="receipt-meta-row"><span><strong>Customer:</strong></span><span>${txn.customer}</span></div>
    <div class="receipt-meta-row"><span><strong>Total:</strong></span><span>${storeConfig.currency||'KES'} ${txn.total.toLocaleString()}</span></div>
  `;

  // Reset type buttons
  document.querySelectorAll('.return-type-btn').forEach(b => b.classList.toggle('active', b.dataset.type === 'return'));

  // Render item checkboxes
  document.getElementById('returnItemsList').innerHTML = txn.items.map((item, idx) =>
    `<div class="return-item-row">
      <input type="checkbox" class="return-item-check" id="ri_${idx}" checked>
      <label class="return-item-name" for="ri_${idx}">${item.emoji} ${item.name} <small style="color:var(--text-faint)">${item.sku}</small></label>
      <span class="return-item-qty">×${item.qty}</span>
    </div>`
  ).join('');

  document.getElementById('returnNotes').value = '';
  document.getElementById('returnModal').style.display = 'flex';
}

function closeReturnModal() {
  document.getElementById('returnModal').style.display = 'none';
  currentReturnTxn = null;
}

function selectReturnType(type) {
  currentReturnType = type;
  document.querySelectorAll('.return-type-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.type === type));
}

function confirmReturn() {
  if (!currentReturnTxn) return;
  const checkedItems = currentReturnTxn.items.filter((_, idx) => {
    const el = document.getElementById(`ri_${idx}`);
    return el && el.checked;
  });
  if (!checkedItems.length) { toast('⚠ Select at least one item to return'); return; }

  const notes = document.getElementById('returnNotes').value.trim();
  const returnRecord = {
    date: new Date().toISOString(),
    type: currentReturnType,
    items: checkedItems,
    notes,
    creditNoteId: 'CN-' + Date.now().toString(36).toUpperCase()
  };

  // Restock items if return or damaged
  if (currentReturnType === 'return' || currentReturnType === 'damaged') {
    checkedItems.forEach(ri => {
      const p = products.find(x => x.id === ri.id);
      if (p) p.stock += ri.qty;
    });
  }

  currentReturnTxn.returns.push(returnRecord);
  currentReturnTxn.status = 'returned';

  // Show credit note receipt
  const creditTxn = {
    ...currentReturnTxn,
    id: returnRecord.creditNoteId,
    date: returnRecord.date,
    items: checkedItems,
    subtotal: checkedItems.reduce((s,i) => s + i.price*i.qty, 0),
    discount: 0,
    vat: 0,
    total: checkedItems.reduce((s,i) => s + i.price*i.qty, 0),
  };

  closeReturnModal();
  renderInventoryTable();
  toast(`✓ Return processed — ${returnRecord.creditNoteId}`);
  renderReturnsTable();

  // Show credit note
  window._currentReceiptTxn = creditTxn;
  document.getElementById('receiptContent').innerHTML = buildReceiptHTML(creditTxn, true);
  document.getElementById('receiptModal').style.display = 'flex';
}

//  VOICE COMMAND INPUT
let recognition = null;
let voiceActive = false;

function initVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) { toast('⚠ Voice not supported in this browser (try Chrome/Edge)'); return null; }
  const r = new SpeechRecognition();
  r.continuous = true;
  r.interimResults = true;
  r.lang = 'en-KE';
  r.onresult = e => {
    let interim = '', final = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const t = e.results[i][0].transcript;
      if (e.results[i].isFinal) final += t;
      else interim += t;
    }
    document.getElementById('voiceTranscript').textContent = final || interim || 'Listening…';
    if (final) processVoiceCommand(final.trim().toLowerCase());
  };
  r.onerror = err => {
    if (err.error !== 'no-speech') { toast('🎙 Voice error: ' + err.error); stopVoice(); }
  };
  r.onend = () => { if (voiceActive) r.start(); };
  return r;
}

function toggleVoice() {
  if (voiceActive) { stopVoice(); return; }
  recognition = initVoice();
  if (!recognition) return;
  voiceActive = true;
  recognition.start();
  document.getElementById('voiceBtn').classList.add('listening');
  document.getElementById('voiceOverlay').style.display = 'flex';
  document.getElementById('voiceTranscript').textContent = 'Listening…';
  document.getElementById('voiceStatus').style.display = 'flex';
}

function stopVoice() {
  voiceActive = false;
  if (recognition) { try { recognition.stop(); } catch(e){} recognition = null; }
  document.getElementById('voiceBtn').classList.remove('listening');
  document.getElementById('voiceOverlay').style.display = 'none';
  document.getElementById('voiceStatus').style.display = 'none';
}

function processVoiceCommand(cmd) {
  // "add [product name]"
  if (cmd.startsWith('add ')) {
    const query = cmd.slice(4).trim();
    const found = products.find(p => p.name.toLowerCase().includes(query) && p.stock > 0);
    if (found) { addToCart(found.id); document.getElementById('voiceTranscript').textContent = `✓ Added: ${found.name}`; return; }
    toast(`🎙 No match for "${query}"`);
    return;
  }
  // "search [term]"
  if (cmd.startsWith('search ')) {
    const q = cmd.slice(7).trim();
    document.getElementById('searchInput').value = q;
    filterProducts();
    stopVoice();
    return;
  }
  // "clear cart"
  if (cmd.includes('clear cart') || cmd.includes('empty cart')) {
    clearCart(); stopVoice(); toast('🎙 Cart cleared'); return;
  }
  // "checkout" / "pay"
  if (cmd.includes('checkout') || cmd.includes('proceed') || cmd.includes('pay now')) {
    if (cart.length) { openPayment(); stopVoice(); }
    else toast('🎙 Cart is empty'); return;
  }
  // "show all" / "all items"
  if (cmd.includes('show all') || cmd.includes('all items')) {
    selectCat('all'); stopVoice(); return;
  }
  // Category navigation
  for (const cat of categories) {
    if (cmd.includes(cat.label.toLowerCase())) {
      selectCat(cat.id); stopVoice(); return;
    }
  }
}

//  CASHIER SYSTEM
function getDefaultCashiers() {
  return [
    { id:1, name:"Tinah",  pin:"1234", role:"manager" },
    { id:2, name:"Vivian",   pin:"2222", role:"cashier" },
    { id:3, name:"Grace",   pin:"3333", role:"cashier" },
    { id:4, name:"Eddy", pin:"4444", role:"manager" }
  ];
}

function isManager() {
  return activeCashier && activeCashier.role === 'manager';
}

async function hashPin(pin) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pin));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

// Show the cashier picker modal (on boot or after end-shift)
function showCashierPicker(isHandover = false) {
  const el = document.getElementById('cashierPickerModal');
  el.style.display = 'flex';
  document.getElementById('cashierPickerTitle').textContent = isHandover ? 'Shift Handover' : 'Select Cashier';
  document.getElementById('cashierPickerSubtitle').textContent = isHandover
    ? 'Previous shift ended. Next cashier, please sign in.'
    : 'Select your name and enter your PIN to begin.';
  renderCashierGrid();
  resetPinEntry();
}

function renderCashierGrid() {
  document.getElementById('cashierGrid').innerHTML = cashiers.map(c => `
    <div class="cashier-tile" onclick="selectCashierTile(${c.id})">
      <div class="cashier-tile-avatar">${c.name[0]}</div>
      <div class="cashier-tile-name">${c.name}</div>
      <div class="cashier-tile-role">${c.role}</div>
    </div>
  `).join('');
}

let selectedCashierId = null;
let pinBuffer = '';

function selectCashierTile(id) {
  selectedCashierId = id;
  const c = cashiers.find(x => x.id === id);
  document.querySelectorAll('.cashier-tile').forEach(t => t.classList.remove('selected'));
  document.querySelector(`.cashier-tile:nth-child(${cashiers.indexOf(c)+1})`).classList.add('selected');
  document.getElementById('pinSection').style.display = 'block';
  document.getElementById('pinCashierName').textContent = c.name;
  resetPinEntry();
  document.getElementById('pinEntry').focus();
}

function resetPinEntry() {
  pinBuffer = '';
  renderPinDots();
  document.getElementById('pinError').style.display = 'none';
  document.getElementById('pinEntry').value = '';
}

function renderPinDots() {
  const dots = document.querySelectorAll('.pin-dot');
  dots.forEach((d, i) => d.classList.toggle('filled', i < pinBuffer.length));
}

function pinKeyPress(k) {
  if (pinBuffer.length >= 4) return;
  pinBuffer += k;
  renderPinDots();
  if (pinBuffer.length === 4) setTimeout(submitPin, 150);
}

function pinBackspace() {
  pinBuffer = pinBuffer.slice(0, -1);
  renderPinDots();
}

function handlePinInput(e) {
  // Sync physical keyboard input with pinBuffer
  const val = e.target.value.replace(/\D/g, '').slice(0, 4);
  pinBuffer = val;
  e.target.value = val;
  renderPinDots();
  if (pinBuffer.length === 4) setTimeout(submitPin, 150);
}

async function submitPin() {
  if (!selectedCashierId) return;
  const c = cashiers.find(x => x.id === selectedCashierId);
  const hashed = await hashPin(pinBuffer);
  const expectedHash = await hashPin(c.pin);
  if (hashed !== expectedHash) {
    document.getElementById('pinError').style.display = 'block';
    pinBuffer = '';
    renderPinDots();
    return;
  }
  // Login success
  activeCashier = c;
  activeSession = {
    cashier_id: c.id,
    cashier_name: c.name,
    role: c.role,
    clockIn: new Date().toISOString(),
    clockOut: null,
    sales: 0,
    revenue: 0,
    discounts: 0
  };
  allSessions.push(activeSession);
  document.getElementById('cashierPickerModal').style.display = 'none';
  init();
  toast(`✓ Welcome, ${c.name}! (${c.role})`);
}

// End shift — show summary then re-show picker
function endShift() {
  if (!activeCashier || !activeSession) return;
  activeSession.clockOut = new Date().toISOString();
  const cur = storeConfig.currency || 'KES';
  const clockIn = new Date(activeSession.clockIn);
  const clockOut = new Date(activeSession.clockOut);
  const mins = Math.round((clockOut - clockIn) / 60000);
  const h = Math.floor(mins / 60), m = mins % 60;

  document.getElementById('shiftSummaryAvatar').textContent = activeSession.cashier_name[0];
  document.getElementById('shiftSummaryName').textContent = activeSession.cashier_name;
  document.getElementById('shiftSummaryRole').textContent = activeSession.role;
  document.getElementById('shiftSummaryClockin').textContent = clockIn.toLocaleTimeString('en-KE', { hour:'2-digit', minute:'2-digit' });
  document.getElementById('shiftSummaryClockout').textContent = clockOut.toLocaleTimeString('en-KE', { hour:'2-digit', minute:'2-digit' });
  document.getElementById('shiftSummaryDuration').textContent = `${h}h ${m}m`;
  document.getElementById('shiftSummarySales').textContent = activeSession.sales;
  document.getElementById('shiftSummaryRevenue').textContent = `${cur} ${activeSession.revenue.toLocaleString()}`;
  document.getElementById('shiftSummaryDiscounts').textContent = `${cur} ${activeSession.discounts.toLocaleString()}`;
  document.getElementById('shiftSummaryModal').style.display = 'flex';
}

function closeShiftSummary() {
  document.getElementById('shiftSummaryModal').style.display = 'none';
  activeCashier = null;
  activeSession = null;
  clearCart();
  showCashierPicker(true);
}

// ═══════════ DATA ═══════════
const _seed     = getSeedData();
const _bridge   = window.TINAH_BRIDGE || {};

// Use live POS data if available, otherwise fall back to seed data
const PRODS    = _bridge.products   || _seed.products;
const CATS     = _bridge.categories || _seed.categories;
const _config  = _bridge.config     || _seed.store || {};
const CUR      = _config.currency   || 'KES';
const DELIVERY = 300;

// Show a subtle indicator when live POS data is loaded
if (_bridge.hasLiveData) {
  console.info('[TINAH] Live POS data loaded — ' + PRODS.length + ' products, stock levels synced.');
}

// ═══════════ STATE ═══════════
let cart = [];
let activeFilter = 'all';
let visibleCount = 12;
let ckStep = 1;
let selPM = 'mpesa';

// ═══════════ CUSTOM CURSOR ═══════════
const $cursor = document.getElementById('cursor');
const $ring   = document.getElementById('cursorRing');
document.addEventListener('mousemove', e => {
  $cursor.style.cssText = `left:${e.clientX}px;top:${e.clientY}px`;
  $ring.style.cssText   = `left:${e.clientX}px;top:${e.clientY}px`;
});
document.addEventListener('mouseover', e => {
  $ring.classList.toggle('hov', !!e.target.closest('button,a,.prod-card,.cat-card,.s-item,.ci'));
});

// ═══════════ NAV SCROLL ═══════════
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 40);
});

// ═══════════ MOBILE NAV ═══════════
function toggleMobileNav(){ document.getElementById('mobileNav').classList.toggle('open'); }
function closeMobileNav(){ document.getElementById('mobileNav').classList.remove('open'); }

// ═══════════ REVEAL ON SCROLL ═══════════
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); ro.unobserve(e.target); }});
}, { threshold: 0.08 });
function observe(){ document.querySelectorAll('.reveal:not(.visible)').forEach(el => ro.observe(el)); }

// ═══════════ MARQUEE ═══════════
function buildMarquee(){
  const items = [
    'Free Delivery in Nairobi','New Arrivals Weekly','Premium Quality',
    'Authentic Products','Secure M-Pesa Payment','Easy 7-Day Returns',
    'Same-Day Delivery Available','Trusted by 1,000+ Customers','TINAH COSMETICS'
  ];
  const double = [...items,...items];
  document.getElementById('marqueeTrack').innerHTML = double.map(t =>
    `<div class="marquee-item"><span class="marquee-dot"></span>${t}</div>`
  ).join('');
}

// ═══════════ CATEGORY GRID ═══════════
const CAT_IMAGES = {
  clothing: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80',
  shoes:    'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80',
  cosmetics:'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80',
};
const CAT_EMOJI = { clothing:'👗', shoes:'👠', cosmetics:'💄' };

function buildCatGrid(){
  document.getElementById('catGrid').innerHTML = CATS.map(cat => {
    const count = PRODS.filter(p => p.category === cat.id).length;
    const img   = CAT_IMAGES[cat.id];
    return `<div class="cat-card reveal" onclick="filterGo('${cat.id}')">
      ${img
        ? `<img class="cat-img" src="${img}" alt="${cat.label}" loading="lazy">`
        : `<div class="cat-img" style="background:var(--card);display:flex;align-items:center;justify-content:center;font-size:80px">${CAT_EMOJI[cat.id]}</div>`}
      <div class="cat-overlay">
        <div class="cat-tag">Explore</div>
        <div class="cat-name">${cat.label}</div>
        <div class="cat-count">${count} products</div>
        <div class="cat-arrow">Shop Now
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </div>
      </div>
    </div>`;
  }).join('');
  observe();
}

// ═══════════ SPOTLIGHT ═══════════
function buildSpotlight(){
  const feat = PRODS.find(p => p.id === 16) || PRODS[12] || PRODS[0];
  const cat  = CATS.find(c => c.id === feat.category);
  const src  = feat.image_data || feat.image_url;

  const imgEl = document.getElementById('spotImg');
  if(src){
    imgEl.insertAdjacentHTML('afterbegin',
      `<img src="${src}" alt="${feat.name}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(.85)" loading="lazy">`);
  } else {
    imgEl.insertAdjacentHTML('afterbegin',
      `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:110px">${feat.emoji||'🌸'}</div>`);
  }
  imgEl.style.position = 'relative';

  document.getElementById('spotContent').innerHTML = `
    <div class="spot-eyebrow">\u2736 Featured Product</div>
    <div class="spot-name">${feat.name.split(' ').slice(0,2).join(' ')}<br><em>${feat.name.split(' ').slice(2).join(' ')}</em></div>
    <div class="spot-desc">A signature piece from our ${cat?.label||''} collection. Crafted with precision, designed for the woman who knows her worth. Every detail considered, every stitch intentional.</div>
    <div class="spot-price">${CUR} ${feat.price.toLocaleString()}</div>
    <div class="spot-perks">
      <div class="perk">Premium quality, authentically sourced</div>
      <div class="perk">Free delivery on orders over KES 3,000</div>
      <div class="perk">Easy 7-day returns policy</div>
    </div>
    <div class="spot-btns">
      <button class="btn-primary" onclick="openDrawer(${feat.id})">Quick View</button>
      <button class="btn-secondary" onclick="addToCart(${feat.id})">Add to Bag</button>
    </div>`;}

// ═══════════ FILTER PILLS ═══════════
function buildPills(){
  const all = [{id:'all',label:'All'},...CATS];
  document.getElementById('pills').innerHTML = all.map(c =>
    `<button class="pill ${c.id===activeFilter?'active':''}" onclick="setFilter('${c.id}')">${c.label}</button>`
  ).join('');
}
function setFilter(f){ activeFilter=f; visibleCount=12; buildPills(); renderShop(); }
function filterGo(cat){
  activeFilter = cat; visibleCount = 12;
  buildPills(); renderShop();
  setTimeout(() => document.getElementById('shop').scrollIntoView({behavior:'smooth'}), 50);
}

// ═══════════ SHOP GRID ═══════════
function getSorted(){
  const sort = document.getElementById('sortSel').value;
  let list = activeFilter==='all' ? [...PRODS] : PRODS.filter(p => p.category===activeFilter);
  if(sort==='asc')  list.sort((a,b)=>a.price-b.price);
  else if(sort==='desc') list.sort((a,b)=>b.price-a.price);
  else if(sort==='name') list.sort((a,b)=>a.name.localeCompare(b.name));
  return list;
}
function renderShop(){
  const list    = getSorted();
  const visible = list.slice(0, visibleCount);
  document.getElementById('prodGrid').innerHTML = visible.map(p => {
    const src = p.image_data || p.image_url;
    const stockClass = p.stock===0 ? 'sold' : p.stock<=3 ? 'low' : '';
    const stockLabel = p.stock===0 ? 'Sold Out' : p.stock<=3 ? 'Low Stock' : '';
    return `<div class="prod-card reveal" onclick="openDrawer(${p.id})">
      <div class="prod-img-wrap">
        ${src
          ? `<img src="${src}" alt="${p.name}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'prod-fallback\\'>${p.emoji||'🏷'}</div>'">`
          : `<div class="prod-fallback">${p.emoji||'🏷'}</div>`}
        ${stockLabel ? `<div class="prod-badge ${stockClass}">${stockLabel}</div>` : ''}
        <button class="wish-btn" onclick="event.stopPropagation();toggleWish(this)" title="Wishlist">\u2661</button>
        <div class="prod-actions">
          <button class="add-btn" onclick="event.stopPropagation();addToCart(${p.id})" ${p.stock===0?'disabled':''}>
            ${p.stock===0 ? 'Sold Out' : 'Add to Bag'}
          </button>
        </div>
      </div>
      <div class="prod-info">
        <div class="prod-subcat">${p.subcategory}</div>
        <div class="prod-name">${p.name}</div>
        <div class="prod-price">${CUR} ${p.price.toLocaleString()}</div>
        ${p.sku ? `<div class="prod-sku">${p.sku}</div>` : ''}
      </div>
    </div>`;
  }).join('');
  const lmBtn = document.getElementById('loadMoreBtn');
  lmBtn.style.display = visibleCount >= list.length ? 'none' : 'inline-block';
  observe();
}
function loadMore(){ visibleCount += 8; renderShop(); }
function toggleWish(btn){
  btn.classList.toggle('on');
  btn.textContent = btn.classList.contains('on') ? '\u2665' : '\u2661';
  toast(btn.classList.contains('on') ? '\u2665 Saved to wishlist' : 'Removed from wishlist');
}

// ═══════════ VARIANT DATA ═══════════
// Sizes and colours per category. Availability is per-size stock simulation.
const VARIANTS = {
  clothing: {
    sizes: [
      {label:'XS', avail:true},
      {label:'S',  avail:true},
      {label:'M',  avail:true},
      {label:'L',  avail:true},
      {label:'XL', avail:true},
      {label:'XXL',avail:false},
    ],
    colours: [
      {name:'Midnight Black', hex:'#1a1a1a'},
      {name:'Ivory White',    hex:'#f5f0e8'},
      {name:'Gold Sand',      hex:'#c9a84c'},
      {name:'Dusty Rose',     hex:'#d4927c'},
      {name:'Forest Green',   hex:'#2d5a3d'},
      {name:'Navy Blue',      hex:'#1c2e4a'},
    ]
  },
  shoes: {
    sizes: [
      {label:'36', avail:true},
      {label:'37', avail:true},
      {label:'38', avail:true},
      {label:'39', avail:true},
      {label:'40', avail:true},
      {label:'41', avail:false},
      {label:'42', avail:false},
    ],
    colours: [
      {name:'Black',      hex:'#1a1a1a'},
      {name:'Nude',       hex:'#c9a07a'},
      {name:'White',      hex:'#f0ebe0'},
      {name:'Gold',       hex:'#c9a84c'},
      {name:'Brown',      hex:'#7a5230'},
    ]
  },
  cosmetics: {
    sizes: [
      {label:'30ml',  avail:true},
      {label:'50ml',  avail:true},
      {label:'100ml', avail:true},
      {label:'200ml', avail:false},
    ],
    colours: [
      {name:'Original',   hex:'#c9a84c'},
      {name:'Rose Gold',  hex:'#e8a090'},
      {name:'Pearl',      hex:'#f0ebe0'},
      {name:'Noir',       hex:'#2a2020'},
    ]
  }
};

// ═══════════ RECOMMENDATION ENGINE ═══════════
/**
 * Score every product against the current one and return the top N.
 * Scoring rubric:
 *   +40  — same sub-category (most relevant)
 *   +20  — same category (e.g. both Shoes)
 *   +15  — price within 30% of current price (similar spend level)
 *   +10  — price within 60% of current price
 *   -999 — exclude the product itself
 */
function getRecommendations(product, count = 4) {
  const scored = PRODS
    .filter(p => p.id !== product.id && p.stock > 0)
    .map(p => {
      let score = 0;
      if (p.subcategory === product.subcategory)  score += 40;
      else if (p.category === product.category)   score += 20;
      const priceDiff = Math.abs(p.price - product.price) / product.price;
      if (priceDiff <= 0.30) score += 15;
      else if (priceDiff <= 0.60) score += 10;
      // Small random nudge so identical scores don't always show same order
      score += Math.random() * 3;
      return { ...p, _score: score };
    })
    .sort((a, b) => b._score - a._score);

  // Always try to include at least one cross-category pick for discovery
  const sameCat   = scored.filter(p => p.category === product.category).slice(0, count - 1);
  const crossCat  = scored.filter(p => p.category !== product.category).slice(0, 1);
  const merged    = [...sameCat, ...crossCat]
    .filter((p, i, arr) => arr.findIndex(x => x.id === p.id) === i) // dedupe
    .slice(0, count);

  return merged;
}

function renderRecommendations(product) {
  const recos = getRecommendations(product, 4);
  if (!recos.length) return '';

  const cards = recos.map(p => {
    const src   = p.image_data || p.image_url;
    const isSub = p.subcategory === product.subcategory;
    const img   = src
      ? `<img src="${src}" alt="${p.name}" loading="lazy"
           onerror="this.style.display='none'">`
      : `<span style="font-size:32px">${p.emoji || '🏷'}</span>`;
    const badge = isSub
      ? `<div class="reco-badge same-sub">Similar</div>`
      : p.category !== product.category
        ? `<div class="reco-badge">You'll love</div>`
        : '';

    return `
      <div class="reco-card" onclick="openDrawer(${p.id})">
        <div class="reco-img">
          ${img}
          ${badge}
        </div>
        <div class="reco-name" title="${p.name}">${p.name}</div>
        <div class="reco-price">${CUR} ${p.price.toLocaleString()}</div>
        <button class="reco-add"
          onclick="event.stopPropagation();addToCart(${p.id})"
          ${p.stock===0 ? 'disabled' : ''}>
          ${p.stock===0 ? 'Sold Out' : '+ Add'}
        </button>
      </div>`;
  }).join('');

  return `
    <div class="reco-section">
      <div class="reco-label">You may also like</div>
      <div class="reco-track-wrap">
        <div class="reco-track">${cards}</div>
      </div>
    </div>`;
}

// Active drawer selections
let drawerSelectedSize   = null;
let drawerSelectedColour = null;
let drawerCurrentProduct = null;
let drawerWishlisted     = false;

// ═══════════ PRODUCT DRAWER ═══════════
function openDrawer(id){
  const p   = PRODS.find(x => x.id===id);
  if(!p) return;
  drawerCurrentProduct = p;
  drawerSelectedSize   = null;
  drawerSelectedColour = null;
  drawerWishlisted     = false;

  const cat    = CATS.find(c => c.id===p.category);
  const src    = p.image_data || p.image_url;
  const vars   = VARIANTS[p.category] || VARIANTS.cosmetics;

  // Image
  document.getElementById('drawerImg').innerHTML = src
    ? `<img class="drawer-img" src="${src}" alt="${p.name}" onerror="this.outerHTML='<div class=\\'drawer-img-fb\\'>${p.emoji||'🏷'}</div>'">`
    : `<div class="drawer-img-fb">${p.emoji||'🏷'}</div>`;

  // Size label word
  const sizeWord = p.category==='shoes' ? 'Size (EU)' : p.category==='cosmetics' ? 'Size / Volume' : 'Size';

  // Build size buttons
  const sizeBtns = vars.sizes.map(s =>
    `<button class="size-btn ${s.avail?'':'unavail'}"
      onclick="selectSize('${s.label}',${s.avail})"
      title="${s.avail?'':'Out of stock'}">${s.label}</button>`
  ).join('');

  // Build colour swatches
  const colourBtns = vars.colours.map(c =>
    `<button class="colour-btn" onclick="selectColour('${c.name}','${c.hex}')" title="${c.name}">
      <div class="colour-swatch" style="background:${c.hex}"></div>
    </button>`
  ).join('');

  // Body HTML
  document.getElementById('drawerBody').innerHTML = `
    <div class="d-cat">${cat?.label||''} &bull; ${p.subcategory}</div>
    <div class="d-name">${p.name}</div>
    <div class="d-price" id="dPrice">${CUR} ${p.price.toLocaleString()}</div>
    <div class="d-div"></div>

    <!-- COLOUR SELECTOR -->
    <div class="v-section">
      <div class="v-label">Colour <span id="selectedColourName"></span></div>
      <div class="colour-grid" id="colourGrid">${colourBtns}</div>
      <div class="colour-name-display" id="colourNameDisplay">Select a colour</div>
    </div>

    <!-- SIZE SELECTOR -->
    <div class="v-section">
      <div class="v-label">${sizeWord} <span id="selectedSizeName"></span></div>
      <div class="size-grid" id="sizeGrid">${sizeBtns}</div>
    </div>

    <!-- ERROR MESSAGE -->
    <div class="v-error" id="variantError">Please select a size and colour to continue</div>

    <div class="d-div"></div>
    <div class="d-desc">A premium piece from our curated ${cat?.label||''} collection. Crafted for quality and enduring style — designed to last.</div>
    <div class="d-stock">
      <div class="s-dot ${p.stock>3?'in':p.stock>0?'low':'out'}"></div>
      ${p.stock>10 ? 'In stock' : p.stock>0 ? `Only ${p.stock} left` : 'Out of stock'}
    </div>
    ${p.sku ? `<div style="font-size:10px;color:var(--text-faint);letter-spacing:.1em;margin-top:9px">SKU: ${p.sku}</div>` : ''}

    <!-- RECOMMENDATIONS -->
    ${renderRecommendations(p)}`;

  // Footer button state
  const addBtn  = document.getElementById('dAddBtn');
  const wishBtn = document.getElementById('dWishBtn');

  if(p.stock===0){
    addBtn.disabled = true;
    addBtn.textContent = 'Out of Stock';
  } else {
    addBtn.disabled = false;
    addBtn.textContent = 'Add to Bag \u2192';
    addBtn.onclick = () => drawerAddToBag();
  }

  // Wishlist button
  wishBtn.textContent = '\u2661';
  wishBtn.classList.remove('on');
  wishBtn.onclick = () => {
    drawerWishlisted = !drawerWishlisted;
    wishBtn.textContent = drawerWishlisted ? '\u2665' : '\u2661';
    wishBtn.classList.toggle('on', drawerWishlisted);
    toast(drawerWishlisted ? `\u2665 ${p.name} saved to wishlist` : 'Removed from wishlist');
  };

  document.getElementById('drawerBg').classList.add('on');
  document.getElementById('drawer').classList.add('on');
  document.body.style.overflow = 'hidden';
}

function selectSize(label, avail){
  if(!avail) return;
  drawerSelectedSize = label;
  // Update button states
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.textContent.trim() === label);
  });
  document.getElementById('selectedSizeName').textContent = label;
  document.getElementById('variantError').classList.remove('show');
}

function selectColour(name, hex){
  drawerSelectedColour = {name, hex};
  // Update swatch states
  document.querySelectorAll('.colour-btn').forEach(btn => {
    const sw = btn.querySelector('.colour-swatch');
    btn.classList.toggle('selected', sw && sw.style.background === hex);
  });
  document.getElementById('selectedColourName').textContent = name;
  document.getElementById('colourNameDisplay').textContent  = name;
  document.getElementById('colourNameDisplay').style.color  = 'var(--gold-light)';
  document.getElementById('variantError').classList.remove('show');
}

function drawerAddToBag(){
  const p = drawerCurrentProduct;
  if(!p) return;
  // Validate selections
  const hasSize   = !!drawerSelectedSize;
  const hasColour = !!drawerSelectedColour;
  if(!hasSize || !hasColour){
    document.getElementById('variantError').classList.add('show');
    // Shake the error
    const errEl = document.getElementById('variantError');
    errEl.style.transform = 'translateX(-4px)';
    setTimeout(()=>{ errEl.style.transform='translateX(4px)'; }, 80);
    setTimeout(()=>{ errEl.style.transform='none'; errEl.style.transition='transform .15s'; }, 160);
    return;
  }
  addToCartWithVariant(p.id, drawerSelectedSize, drawerSelectedColour);
  const btn = document.getElementById('dAddBtn');
  btn.textContent = '\u2713 Added!';
  btn.style.background = 'linear-gradient(135deg,var(--success),#2d7a50)';
  setTimeout(()=>{
    btn.textContent = 'Add to Bag \u2192';
    btn.style.background = '';
  }, 1600);
}

function closeDrawer(){
  document.getElementById('drawerBg').classList.remove('on');
  document.getElementById('drawer').classList.remove('on');
  document.body.style.overflow = '';
}

// ═══════════ CART (variant-aware) ═══════════
function addToCartWithVariant(id, size, colour){
  const p = PRODS.find(x=>x.id===id);
  if(!p || p.stock===0) return;
  // Cart key = id + size + colour so same product in different variants = separate line
  const key = `${id}__${size}__${colour.name}`;
  const ex  = cart.find(x=>x._key===key);
  if(ex){ if(ex.qty>=p.stock){ toast('Max stock reached'); return; } ex.qty++; }
  else cart.push({...p, qty:1, _key:key, selectedSize:size, selectedColour:colour});
  renderCart(); updateBadge();
  toast(`\u2713 ${p.name} (${colour.name}, ${size}) added`);
}

function addToCart(id){
  // Legacy path used by spotlight Add to Bag (no variant required)
  const p = PRODS.find(x=>x.id===id);
  if(!p || p.stock===0) return;
  // Open drawer so user can pick variant
  openDrawer(id);
}
function removeFromCart(key){
  cart = cart.filter(x => (x._key||x.id) !== key);
  renderCart(); updateBadge();
}
function changeQty(key, d){
  const item = cart.find(x => (x._key||x.id) === key);
  if(!item) return;
  item.qty += d;
  if(item.qty<=0) removeFromCart(key); else { renderCart(); updateBadge(); }
}
function updateBadge(){
  document.getElementById('cartBadge').textContent = cart.reduce((s,i)=>s+i.qty,0);
}
function renderCart(){
  const list = document.getElementById('cartList');
  const foot = document.getElementById('cartFoot');
  if(!cart.length){
    list.innerHTML = `<div class="cart-empty-st"><div class="ic">&#x1F6CD;</div><p>Your bag is empty</p></div>`;
    foot.style.display='none'; return;
  }
  list.innerHTML = cart.map(item => {
    const src = item.image_data||item.image_url;
    const thumb = src
      ? `<div class="ci-img"><img src="${src}" alt="${item.name}" onerror="this.parentElement.innerHTML='${item.emoji||'🏷'}'"></div>`
      : `<div class="ci-img">${item.emoji||'🏷'}</div>`;
    // Variant display
    const variantLine = item.selectedSize || item.selectedColour
      ? `<div class="ci-variant">
          ${item.selectedColour ? `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${item.selectedColour.hex};border:1px solid rgba(255,255,255,.2);vertical-align:middle;margin-right:4px"></span>${item.selectedColour.name}` : ''}
          ${item.selectedSize && item.selectedColour ? ' &nbsp;·&nbsp; ' : ''}
          ${item.selectedSize ? item.selectedSize : ''}
        </div>`
      : '';
    return `<div class="ci">${thumb}
      <div class="ci-info">
        <div class="ci-sub">${item.subcategory}</div>
        <div class="ci-name">${item.name}</div>
        ${variantLine}
        <div class="ci-price">${CUR} ${(item.price*item.qty).toLocaleString()}</div>
        <div class="ci-row">
          <button class="q-btn" onclick="changeQty('${item._key||item.id}',-1)">&minus;</button>
          <span class="q-num">${item.qty}</span>
          <button class="q-btn" onclick="changeQty('${item._key||item.id}',1)">+</button>
          <button class="ci-del" onclick="removeFromCart('${item._key||item.id}')">&times;</button>
        </div>
      </div>
    </div>`;
  }).join('');
  const sub = cart.reduce((s,i)=>s+i.price*i.qty,0);
  document.getElementById('cSubtotal').textContent = `${CUR} ${sub.toLocaleString()}`;
  document.getElementById('cTotal').textContent    = `${CUR} ${(sub+DELIVERY).toLocaleString()}`;
  foot.style.display = 'block';
}
function openCart(){
  closeDrawer();
  document.getElementById('cartBg').classList.add('on');
  document.getElementById('cartSide').classList.add('on');
  document.body.style.overflow = 'hidden';
}
function closeCart(){
  document.getElementById('cartBg').classList.remove('on');
  document.getElementById('cartSide').classList.remove('on');
  document.body.style.overflow = '';
}

// ═══════════ CHECKOUT ═══════════
function openCheckout(){
  if(!cart.length) return;
  closeCart(); ckStep=1; renderCkStep();
  document.getElementById('ckOverlay').classList.add('on');
  document.body.style.overflow = 'hidden';
}
function closeCheckout(){
  document.getElementById('ckOverlay').classList.remove('on');
  document.body.style.overflow = '';
}
function renderCkStep(){
  const sub   = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const total = sub + DELIVERY;
  const body  = document.getElementById('ckBody');
  const title = document.getElementById('ckTitle');

  if(ckStep===1){
    title.textContent = 'Delivery Details';
    body.innerHTML = `
      <div class="f-group"><label class="f-label">Full Name</label><input class="f-input" id="ck_name" placeholder="Jane Mwangi"></div>
      <div class="f-group"><label class="f-label">Phone Number</label><input class="f-input" id="ck_phone" placeholder="07XX XXX XXX"></div>
      <div class="f-group"><label class="f-label">Delivery Address</label><input class="f-input" id="ck_addr" placeholder="Street, Estate, City"></div>
      <div class="f-row2">
        <div class="f-group"><label class="f-label">City</label><input class="f-input" id="ck_city" value="Nairobi"></div>
        <div class="f-group"><label class="f-label">Postal Code</label><input class="f-input" id="ck_postal" placeholder="00100"></div>
      </div>
      <div class="o-sum">
        <div style="font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--text-faint);margin-bottom:9px">Order Summary</div>
        ${cart.map(i=>`<div class="o-row"><span>${i.name} ${i.selectedSize?`(${i.selectedColour?.name||''}, ${i.selectedSize})`:''}  \u00d7${i.qty}</span><span>${CUR} ${(i.price*i.qty).toLocaleString()}</span></div>`).join('')}
        <div class="o-row"><span>Delivery</span><span>${CUR} ${DELIVERY.toLocaleString()}</span></div>
        <div class="o-row tot"><span>Total</span><span class="tp">${CUR} ${total.toLocaleString()}</span></div>
      </div>
      <button class="place-btn" onclick="goToPayment()">Continue to Payment &rarr;</button>`;
  } else if(ckStep===2){
    title.textContent = 'Payment';
    body.innerHTML = `
      <div class="f-group">
        <label class="f-label">Payment Method</label>
        <div class="pay-methods">
          <div class="pm on" id="pm_mpesa" onclick="setPM('mpesa')"><div class="pm-icon">&#x1F4F1;</div><div class="pm-lbl">M-Pesa</div></div>
          <div class="pm" id="pm_card" onclick="setPM('card')"><div class="pm-icon">&#x1F4B3;</div><div class="pm-lbl">Card</div></div>
          <div class="pm" id="pm_cash" onclick="setPM('cash')"><div class="pm-icon">&#x1F4B5;</div><div class="pm-lbl">On Delivery</div></div>
        </div>
      </div>
      <div id="pmDetail">
        <div class="f-group"><label class="f-label">M-Pesa Phone</label><input class="f-input" placeholder="07XX XXX XXX"></div>
        <div style="font-size:11px;color:var(--text-faint);letter-spacing:.06em;margin-top:5px">You will receive an STK push to complete payment.</div>
      </div>
      <div class="o-sum">
        <div class="o-row tot"><span>Total to Pay</span><span class="tp">${CUR} ${total.toLocaleString()}</span></div>
      </div>
      <button class="place-btn" onclick="placeOrder()">Place Order \u2713</button>
      <button class="back-btn" onclick="ckStep=1;renderCkStep()">&larr; Back</button>`;
  }
}
function goToPayment(){
  const name  = document.getElementById('ck_name').value.trim();
  const phone = document.getElementById('ck_phone').value.trim();
  const addr  = document.getElementById('ck_addr').value.trim();
  if(!name||!phone||!addr){ toast('Please fill all required fields'); return; }
  ckStep=2; renderCkStep();
}
function setPM(m){
  selPM = m;
  ['mpesa','card','cash'].forEach(x => document.getElementById(`pm_${x}`).classList.toggle('on',x===m));
  const d = document.getElementById('pmDetail');
  if(m==='mpesa'){
    d.innerHTML = `<div class="f-group"><label class="f-label">M-Pesa Phone</label><input class="f-input" placeholder="07XX XXX XXX"></div><div style="font-size:11px;color:var(--text-faint);letter-spacing:.06em;margin-top:5px">You will receive an STK push.</div>`;
  } else if(m==='card'){
    d.innerHTML = `<div class="f-group"><label class="f-label">Card Number</label><input class="f-input" placeholder="**** **** **** ****"></div><div class="f-row2"><div class="f-group"><label class="f-label">Expiry</label><input class="f-input" placeholder="MM/YY"></div><div class="f-group"><label class="f-label">CVV</label><input class="f-input" placeholder="***" type="password"></div></div>`;
  } else {
    d.innerHTML = `<div style="padding:14px;background:var(--card);border:1px solid var(--border);font-size:12px;color:var(--text-dim);letter-spacing:.04em;line-height:1.8">Pay cash when your order arrives. Our delivery agent will collect payment at the door.</div>`;
  }
}

function placeOrder() {
  const sub   = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const total = sub + DELIVERY;

  // Submit to localStorage bridge for POS to see
  const orderId = window.submitWebOrder({
    customer:  document.getElementById('ck_name')?.value?.trim()   || 'Customer',
    phone:     document.getElementById('ck_phone')?.value?.trim()  || '',
    address:   document.getElementById('ck_addr')?.value?.trim()   || '',
    city:      document.getElementById('ck_city')?.value?.trim()   || 'Nairobi',
    payMethod: selPM,
    items: cart.map(i => ({
      id:     i.id,
      name:   i.name,
      price:  i.price,
      qty:    i.qty,
      size:   i.selectedSize   || null,
      colour: i.selectedColour?.name || null,
      sku:    i.sku || '',
    })),
    subtotal: sub,
    delivery: DELIVERY,
    total,
  });

  // Show confirmation
  document.getElementById('ckTitle').textContent = 'Order Confirmed!';
  document.getElementById('ckBody').innerHTML = `
    <div class="order-ok">
      <div class="ok-icon">✓</div>
      <div class="ok-title">Thank You!</div>
      <div class="ok-sub">
        Order <strong style="color:var(--gold)">${orderId}</strong> placed successfully.<br><br>
        ${selPM === 'mpesa'  ? 'An M-Pesa STK push will be sent shortly.' :
          selPM === 'card'   ? 'Card payment processed.' :
                               'Our agent will collect cash on delivery.'}<br><br>
        Estimated delivery: <strong style="color:var(--gold-light)">1–3 business days, Nairobi</strong>
      </div>
    </div>
    <button class="place-btn" style="margin-top:22px"
      onclick="closeCheckout();cart=[];renderCart();updateBadge()">
      Continue Shopping
    </button>`;
  toast('✓ Order ' + orderId + ' placed!');
}


// ═══════════ SEARCH ═══════════
function openSearch(){
  document.getElementById('searchModal').classList.add('on');
  document.body.style.overflow = 'hidden';
  setTimeout(()=> document.getElementById('sInput').focus(), 100);
}
function closeSearch(){
  document.getElementById('searchModal').classList.remove('on');
  document.body.style.overflow = '';
  document.getElementById('sInput').value = '';
  document.getElementById('sResults').innerHTML = '';
}
document.addEventListener('keydown', e => {
  if(e.key==='Escape'){ closeSearch(); closeDrawer(); closeCart(); closeCheckout(); }
  if((e.metaKey||e.ctrlKey) && e.key==='k'){ e.preventDefault(); openSearch(); }
});
function doSearch(){
  const q = document.getElementById('sInput').value.trim().toLowerCase();
  const r = document.getElementById('sResults');
  if(!q){ r.innerHTML=''; return; }
  const found = PRODS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.subcategory.toLowerCase().includes(q) ||
    (p.sku||'').toLowerCase().includes(q)
  ).slice(0,8);
  if(!found.length){
    r.innerHTML=`<div style="padding:22px 0;font-size:12px;color:var(--text-faint);letter-spacing:.08em">No results for &ldquo;${q}&rdquo;</div>`;
    return;
  }
  r.innerHTML = found.map(p => {
    const src = p.image_data||p.image_url;
    const thumb = src
      ? `<div class="s-item-img"><img src="${src}" alt="${p.name}" onerror="this.parentElement.innerHTML='${p.emoji||'🏷'}'"></div>`
      : `<div class="s-item-img">${p.emoji||'🏷'}</div>`;
    return `<div class="s-item" onclick="closeSearch();openDrawer(${p.id})">
      ${thumb}
      <div><div class="s-item-name">${p.name}</div><div class="s-item-cat">${p.subcategory}</div></div>
      <div class="s-item-price">${CUR} ${p.price.toLocaleString()}</div>
    </div>`;
  }).join('');
}

// ═══════════ TESTIMONIALS ═══════════
function buildTestis(){
  const ts = [
    {stars:5, text:"I ordered the Rose Moisturiser and Velvet Lip Colour — arrived in 24 hours and the packaging was gorgeous. TINAH is my go-to for everything beauty.", author:"Christine W.", loc:"Westlands"},
    {stars:5, text:"The Floral Midi Dress is stunning in person. Quality is beyond what you'd expect at this price. Already placed my second order!", author:"Amina S.", loc:"Karen"},
    {stars:5, text:"Ordered Noir Parfum as a gift. Arrived perfectly wrapped and she absolutely loved it. 10/10 would order again.", author:"David K.", loc:"Kilimani"},
  ];
  document.getElementById('testiGrid').innerHTML = ts.map(t => `
    <div class="testi reveal">
      <div class="t-stars">${'\u2605'.repeat(t.stars)}</div>
      <div class="t-text">&ldquo;${t.text}&rdquo;</div>
      <div class="t-author"><strong>${t.author}</strong> &bull; ${t.loc}, Nairobi</div>
    </div>`).join('');
}

// ═══════════ NEWSLETTER ═══════════
function subscribe(e){
  e.preventDefault();
  toast('\u2713 You\'re subscribed! Welcome to the inner circle.');
  document.getElementById('nlEmail').value = '';
}

// ═══════════ PAGE MODE NAVIGATION ═══════════
// Sections hidden in category/filter mode
const FULL_SECTIONS = ['home','categories','spotlight','about','.newsletter','.marquee-wrap'];
let isFilterMode = false;

function setNavActive(key) {
  ['shop','clothing','shoes','cosmetics','about'].forEach(k => {
    const el = document.getElementById(`nl_${k}`);
    if (el) el.classList.toggle('active', k === key);
  });
}

function showAllSections() {
  FULL_SECTIONS.forEach(sel => {
    const el = sel.startsWith('.') ? document.querySelector(sel) : document.getElementById(sel);
    if (el) { el.style.display = ''; el.style.opacity = '1'; }
  });
  document.body.classList.remove('filter-mode');
  isFilterMode = false;
}

function hideSectionsForFilter() {
  FULL_SECTIONS.forEach(sel => {
    const el = sel.startsWith('.') ? document.querySelector(sel) : document.getElementById(sel);
    if (el) el.style.display = 'none';
  });
  document.body.classList.add('filter-mode');
  isFilterMode = true;
}

// Logo click — go back to full home view
function goHome(e) {
  if (e) e.preventDefault();
  showAllSections();
  setNavActive('shop');
  activeFilter = 'all';
  visibleCount = 12;
  buildPills();
  renderShop();
  window.scrollTo({top:0, behavior:'smooth'});
}

// "Shop" nav — show everything, scroll to shop section, set all filter
function goShopAll(e) {
  if (e) e.preventDefault();
  showAllSections();
  setNavActive('shop');
  activeFilter = 'all';
  visibleCount = 12;
  buildPills();
  renderShop();
  setTimeout(() => document.getElementById('shop').scrollIntoView({behavior:'smooth'}), 30);
}

// Category nav (Clothing / Shoes / Cosmetics) — hide non-shop sections
function filterGo(cat, e) {
  if (e) e.preventDefault();
  // Jump to top instantly first so the hidden hero doesn't flash
  window.scrollTo({top: 0, behavior: 'instant'});
  hideSectionsForFilter();
  setNavActive(cat);
  activeFilter = cat;
  visibleCount = 12;
  buildPills();
  renderShop();
  // Small delay to let display:none apply, then scroll shop into view under nav
  setTimeout(() => {
    const shopEl = document.getElementById('shop');
    if (shopEl) shopEl.scrollIntoView({behavior:'smooth'});
  }, 40);
}

// "About" nav — show all sections, scroll to about
function goAbout(e) {
  if (e) e.preventDefault();
  showAllSections();
  setNavActive('about');
  setTimeout(() => {
    document.getElementById('about').scrollIntoView({behavior:'smooth'});
  }, 60);
}

// Filter pills also need to trigger filterGo logic when in filter mode
function setFilter(f) {
  activeFilter = f;
  visibleCount = 12;
  if (f === 'all') {
    // "All" pill in filter mode — show sections back, set shop active
    showAllSections();
    setNavActive('shop');
  } else {
    hideSectionsForFilter();
    setNavActive(f);
  }
  buildPills();
  renderShop();
}

// ═══════════ WHATSAPP FLOATING BUTTON ═══════════
const WA_NUMBER = '254714757094'; // ← replace with real number (no + or spaces)
let waBubbleDismissed = false;

function buildWaMessage(product, size, colour) {
  if (product) {
    const variantPart = (colour && size)
      ? ` in ${colour.name}, size ${size}`
      : size ? ` in size ${size}`
      : colour ? ` in ${colour.name}` : '';
    return `Hello TINAH COSMETICS! 👋\n\nI'm interested in:\n\n*${product.name}*${variantPart}\nPrice: KES ${product.price.toLocaleString()}\n${product.sku ? `SKU: ${product.sku}\n` : ''}\nCould you please confirm availability and assist with my order?\n\nThank you! 🌟`;
  }
  return `Hello TINAH COSMETICS! 👋\n\nI'd like to enquire about your products. Could you please help me?\n\nThank you!`;
}

function openWhatsApp() {
  // If a product drawer is open, use that product + any selections
  const product = drawerCurrentProduct || null;
  const size    = drawerSelectedSize   || null;
  const colour  = drawerSelectedColour || null;
  const msg     = buildWaMessage(product, size, colour);
  const url     = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
  closeWaBubble();
}

function showWaBubble(product) {
  if (waBubbleDismissed && !product) return;
  const bubble  = document.getElementById('waBubble');
  const title   = document.getElementById('waBubbleTitle');
  const msg     = document.getElementById('waBubbleMsg');
  const btn     = document.getElementById('waBtn');
  const badge   = document.getElementById('waBadge');

  if (product) {
    title.textContent = 'Interested in this?';
    msg.innerHTML     = `Chat with us about <strong>${product.name}</strong> — KES ${product.price.toLocaleString()}. We reply in minutes! 💬`;
    btn.classList.add('ping');
    badge.classList.add('show');
  } else {
    title.textContent = 'Chat with us on WhatsApp';
    msg.innerHTML     = `Hi! Questions about an order or product? We reply within minutes. 👋`;
    btn.classList.remove('ping');
    badge.classList.remove('show');
  }
  bubble.style.display = 'block';
}

function closeWaBubble() {
  document.getElementById('waBubble').style.display = 'none';
  document.getElementById('waBtn').classList.remove('ping');
  document.getElementById('waBadge').classList.remove('show');
  waBubbleDismissed = true;
}

// Hook into openDrawer — show product-specific bubble when drawer opens
const _origOpenDrawer = openDrawer;
openDrawer = function(id) {
  _origOpenDrawer(id);
  // Small delay so drawer is visible first
  setTimeout(() => {
    const p = PRODS.find(x => x.id === id);
    if (p) showWaBubble(p);
  }, 600);
};

// Hook into closeDrawer — reset bubble to generic when drawer closes
const _origCloseDrawer = closeDrawer;
closeDrawer = function() {
  _origCloseDrawer();
  if (!waBubbleDismissed) {
    showWaBubble(null);
  } else {
    closeWaBubble();
    waBubbleDismissed = false; // reset so it can show again next time
  }
};

// Show generic bubble 3 seconds after page load
setTimeout(() => {
  if (!waBubbleDismissed) showWaBubble(null);
}, 3000);

// Auto-hide generic bubble after 8 seconds if user hasn't interacted
setTimeout(() => {
  if (!drawerCurrentProduct && !waBubbleDismissed) closeWaBubble();
}, 11000);
function toast(msg){
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<span class="t-dot"></span><span>${msg}</span>`;
  document.getElementById('toastWrap').appendChild(t);
  setTimeout(()=> t.remove(), 2800);
}

// ═══════════ INIT ═══════════
buildMarquee();
buildCatGrid();
buildSpotlight();
buildPills();
renderShop();
buildTestis();
observe();

(function () {
  const LS_PRODUCTS    = 'tinah_products';
  const LS_CATEGORIES  = 'tinah_categories';
  const LS_WEB_ORDERS  = 'tinah_web_orders';
  const LS_CONFIG      = 'tinah_config';

  function lsGet(key) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; }
    catch { return null; }
  }
  function lsSet(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }

  // ── 1. Load products from POS localStorage ──
  const posProducts   = lsGet(LS_PRODUCTS);
  const posCategories = lsGet(LS_CATEGORIES);
  const posConfig     = lsGet(LS_CONFIG);

  // Expose to web.js — it reads window.TINAH_BRIDGE before falling back to getSeedData()
  window.TINAH_BRIDGE = {
    products:   posProducts   || null,
    categories: posCategories || null,
    config:     posConfig     || null,
    hasLiveData: !!posProducts,
  };

  // ── 2. Submit a website order to localStorage for POS to see ──
  window.submitWebOrder = function (orderData) {
    const orders = lsGet(LS_WEB_ORDERS) || [];
    const order = {
      id:         'WEB-' + Date.now().toString(36).toUpperCase(),
      source:     'website',
      status:     'pending',        // pending → confirmed → dispatched
      placedAt:   new Date().toISOString(),
      customer:   orderData.customer,
      phone:      orderData.phone,
      address:    orderData.address,
      city:       orderData.city,
      payMethod:  orderData.payMethod,
      items:      orderData.items,   // [{id, name, qty, price, size, colour}]
      subtotal:   orderData.subtotal,
      delivery:   orderData.delivery || 300,
      total:      orderData.total,
    };
    orders.unshift(order);
    lsSet(LS_WEB_ORDERS, orders.slice(0, 200)); // keep last 200
    return order.id;
  };

  // ── 3. Check live stock for a product ──
  window.getLiveStock = function (productId) {
    const prods = lsGet(LS_PRODUCTS);
    if (!prods) return null;
    const p = prods.find(x => x.id === productId);
    return p ? p.stock : null;
  };

})();

