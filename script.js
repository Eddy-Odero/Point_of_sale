// ═══════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════
let storeConfig = {};
let categories = [];
let products = [];
let cart = [];
let activeCat = 'all';
let activeSub = 'all';
let editingId = null;
let nextId = 100;
let payMethod = 'cash';
let discountAmt = 0;
let currentImageData = ''; // base64 or URL

// ═══════════════════════════════════════════════
//  BOOT — load maison-data.json
// ═══════════════════════════════════════════════
async function boot() {
  setLoadStatus('Loading product data…');
  try {
    // Try fetching the JSON file from same directory
    const res = await fetch('maison-data.json');
    if (!res.ok) throw new Error('file not found');
    const data = await res.json();
    ingestData(data);
    setLoadStatus('Ready');
  } catch (e) {
    // Fallback: use embedded seed data
    setLoadStatus('Using built-in catalogue…');
    ingestData(getSeedData());
  }
  await delay(600);
  document.getElementById('loadScreen').style.opacity = '0';
  await delay(400);
  document.getElementById('loadScreen').style.display = 'none';
  init();
}

function ingestData(data) {
  storeConfig = data.store || {};
  categories = data.categories || [];
  products = data.products || [];
  nextId = (Math.max(0, ...products.map(p => p.id)) + 1) || 100;
}

function setLoadStatus(msg) {
  document.getElementById('loadStatus').textContent = msg;
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function init() {
  // Apply store config
  if (storeConfig.cashier) document.getElementById('cashierName').textContent = storeConfig.cashier;
  if (storeConfig.name) document.title = storeConfig.name + ' — POS';
  document.getElementById('vatLabel').textContent = Math.round((storeConfig.vat_rate || 0.16) * 100);

  // Update banner
  document.getElementById('productCount').textContent = products.length;

  // Populate category dropdowns
  populateCatSelects();
  renderCatChips();
  renderSubcats();
  filterProducts();
  updateClock();
  setInterval(updateClock, 1000);
}

// ═══════════════════════════════════════════════
//  JSON I/O
// ═══════════════════════════════════════════════
function triggerJsonLoad() {
  document.getElementById('jsonFileInput').click();
}

function handleJsonFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = evt => {
    try {
      const data = JSON.parse(evt.target.result);
      ingestData(data);
      populateCatSelects();
      renderCatChips();
      renderSubcats();
      filterProducts();
      document.getElementById('productCount').textContent = products.length;
      document.getElementById('jsonSourceLabel').innerHTML =
        `Data loaded from <strong>${file.name}</strong> — <span id="productCount">${products.length}</span> products`;
      toast(`✓ Loaded ${products.length} products from ${file.name}`);
    } catch {
      toast('⚠ Invalid JSON file');
    }
  };
  reader.readAsText(file);
  e.target.value = '';
}

function buildExportJson() {
  return {
    store: storeConfig,
    categories: categories,
    products: products.map(p => {
      // Keep base64 images but note they inflate file size
      return { ...p };
    })
  };
}

function openExportModal() {
  const json = JSON.stringify(buildExportJson(), null, 2);
  document.getElementById('jsonExportPre').textContent = json;
  document.getElementById('exportModal').style.display = 'flex';
}

function downloadJson() {
  const json = JSON.stringify(buildExportJson(), null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'maison-data.json';
  a.click();
  toast('✓ maison-data.json downloaded');
}

// ═══════════════════════════════════════════════
//  CLOCK
// ═══════════════════════════════════════════════
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent =
    now.toLocaleTimeString('en-KE', { hour:'2-digit', minute:'2-digit' }) +
    ' · ' + now.toLocaleDateString('en-KE', { weekday:'short', day:'numeric', month:'short' });
}

// ═══════════════════════════════════════════════
//  TABS
// ═══════════════════════════════════════════════
function switchView(v) {
  document.getElementById('posView').classList.toggle('hidden', v !== 'pos');
  document.getElementById('inventoryView').classList.toggle('active', v === 'inventory');
  document.querySelectorAll('.tab-btn').forEach((b,i) =>
    b.classList.toggle('active', (i===0 && v==='pos') || (i===1 && v==='inventory')));
  if (v === 'inventory') renderInventoryTable();
}

// ═══════════════════════════════════════════════
//  CATEGORY UI
// ═══════════════════════════════════════════════
function populateCatSelects() {
  const sel = document.getElementById('f_cat');
  sel.innerHTML = '<option value="">— Select —</option>';
  categories.forEach(c => {
    const o = document.createElement('option');
    o.value = c.id; o.textContent = c.label;
    sel.appendChild(o);
  });
}

function renderCatChips() {
  const chips = [{ id:'all', label:'All' }, ...categories];
  document.getElementById('catChips').innerHTML = chips.map(c =>
    `<button class="cat-chip ${c.id===activeCat?'active':''}" onclick="selectCat('${c.id}')">${c.label}</button>`
  ).join('');
}

function selectCat(id) {
  activeCat = id;
  activeSub = 'all';
  renderCatChips();
  renderSubcats();
  filterProducts();
}

function renderSubcats() {
  const strip = document.getElementById('subcatStrip');
  if (activeCat === 'all') { strip.innerHTML = ''; return; }
  const cat = categories.find(c => c.id === activeCat);
  if (!cat) { strip.innerHTML = ''; return; }
  const subs = ['all', ...(cat.subcategories || [])];
  strip.innerHTML = subs.map(s =>
    `<button class="subcat-btn ${s===activeSub?'active':''}" onclick="selectSub('${s}')">${s==='all'?'All':s}</button>`
  ).join('');
}

function selectSub(s) {
  activeSub = s;
  renderSubcats();
  filterProducts();
}

function updateSubcats() {
  const catId = document.getElementById('f_cat').value;
  const sel = document.getElementById('f_sub');
  sel.innerHTML = '<option value="">— Select —</option>';
  const cat = categories.find(c => c.id === catId);
  if (cat) {
    cat.subcategories.forEach(s => {
      const o = document.createElement('option');
      o.value = s; o.textContent = s;
      sel.appendChild(o);
    });
  }
}

// ═══════════════════════════════════════════════
//  PRODUCTS GRID
// ═══════════════════════════════════════════════
function filterProducts() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  const filtered = products.filter(p => {
    const matchCat = activeCat === 'all' || p.category === activeCat;
    const matchSub = activeSub === 'all' || p.subcategory === activeSub;
    const matchQ = !q || p.name.toLowerCase().includes(q) ||
      (p.sku || '').toLowerCase().includes(q) ||
      p.subcategory.toLowerCase().includes(q);
    return matchCat && matchSub && matchQ;
  });
  renderProducts(filtered);
}

function imgTag(p, cls = '') {
  if (p.image_url || p.image_data) {
    const src = p.image_data || p.image_url;
    return `<img src="${src}" alt="${p.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" ${cls ? `class="${cls}"` : ''}>
            <div class="img-fallback" style="display:none">${p.emoji || '🏷'}</div>`;
  }
  return `<div class="img-fallback">${p.emoji || '🏷'}</div>`;
}

function renderProducts(list) {
  const grid = document.getElementById('productsGrid');
  if (!list.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:56px;color:var(--text-faint);font-size:13px;letter-spacing:0.1em;">No items found</div>`;
    return;
  }
  grid.innerHTML = list.map(p => `
    <div class="product-card ${p.stock===0?'out-of-stock':''}" onclick="addToCart(${p.id})">
      <div class="product-img">${imgTag(p)}</div>
      <div class="product-actions">
        <div class="icon-btn" onclick="event.stopPropagation();openEditModal(${p.id})" title="Edit">✏</div>
        <div class="icon-btn del" onclick="event.stopPropagation();deleteProduct(${p.id})" title="Delete">✕</div>
      </div>
      <div class="stock-badge ${p.stock<=3 && p.stock>0?'low':''}">${p.stock>0?p.stock:'OUT'}</div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-sub">${p.subcategory}</div>
        <div class="product-price">${storeConfig.currency||'KES'} ${p.price.toLocaleString()}</div>
        ${p.sku ? `<div class="product-sku">${p.sku}</div>` : ''}
      </div>
    </div>
  `).join('');
}

// ═══════════════════════════════════════════════
//  CART
// ═══════════════════════════════════════════════
function addToCart(id) {
  const p = products.find(x => x.id === id);
  if (!p || p.stock === 0) return;
  const existing = cart.find(x => x.id === id);
  if (existing) {
    if (existing.qty >= p.stock) { toast('⚠ Max stock reached'); return; }
    existing.qty++;
  } else {
    cart.push({ ...p, qty: 1 });
  }
  renderCart();
  toast(`${p.emoji || '✓'} ${p.name} added`);
}

function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  renderCart();
}

function changeQty(id, delta) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else renderCart();
}

function clearCart() {
  cart = [];
  discountAmt = 0;
  document.getElementById('discountInput').value = '';
  renderCart();
}

function renderCart() {
  const container = document.getElementById('cartItems');
  const total_qty = cart.reduce((s,i) => s+i.qty, 0);
  document.getElementById('cartCount').textContent = total_qty;

  if (!cart.length) {
    container.innerHTML = `<div class="cart-empty"><div class="cart-empty-icon">🛍</div><div class="cart-empty-text">Cart is empty</div></div>`;
  } else {
    container.innerHTML = cart.map(item => {
      const thumbSrc = item.image_data || item.image_url;
      const thumb = thumbSrc
        ? `<div class="cart-item-thumb"><img src="${thumbSrc}" onerror="this.parentElement.innerHTML='${item.emoji||'🏷'}'"></div>`
        : `<div class="cart-item-thumb">${item.emoji||'🏷'}</div>`;
      return `
        <div class="cart-item">
          ${thumb}
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">${storeConfig.currency||'KES'} ${(item.price * item.qty).toLocaleString()}</div>
          </div>
          <div class="qty-ctrl">
            <div class="qty-btn" onclick="changeQty(${item.id},-1)">−</div>
            <span class="qty-num">${item.qty}</span>
            <div class="qty-btn" onclick="changeQty(${item.id},1)">+</div>
          </div>
          <div class="remove-btn" onclick="removeFromCart(${item.id})">✕</div>
        </div>`;
    }).join('');
  }
  recalc();
}

function recalc() {
  const cur = storeConfig.currency || 'KES';
  const vr = storeConfig.vat_rate || 0.16;
  const sub = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const dRaw = document.getElementById('discountInput').value.trim();
  let disc = dRaw.endsWith('%')
    ? sub * (parseFloat(dRaw) / 100 || 0)
    : (parseFloat(dRaw) || 0);
  disc = Math.min(Math.max(disc,0), sub);
  discountAmt = disc;
  const afterDisc = sub - disc;
  const vat = afterDisc * vr;
  const total = afterDisc + vat;

  document.getElementById('subtotal').textContent = `${cur} ${sub.toLocaleString()}`;
  document.getElementById('discountRow').style.display = disc > 0 ? 'flex' : 'none';
  document.getElementById('discountVal').textContent = `− ${cur} ${disc.toLocaleString()}`;
  document.getElementById('vatVal').textContent = `${cur} ${Math.round(vat).toLocaleString()}`;
  document.getElementById('totalVal').textContent = `${cur} ${Math.round(total).toLocaleString()}`;
  document.getElementById('checkoutBtn').disabled = cart.length === 0;
}

// ═══════════════════════════════════════════════
//  IMAGE HANDLING
// ═══════════════════════════════════════════════
function handleDragOver(e) {
  e.preventDefault();
  document.getElementById('imgUploadArea').classList.add('drag-over');
}
function handleDragLeave(e) {
  document.getElementById('imgUploadArea').classList.remove('drag-over');
}
function handleDrop(e) {
  e.preventDefault();
  document.getElementById('imgUploadArea').classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) loadImageFile(file);
}
function handleImageFile(e) {
  const file = e.target.files[0];
  if (file) loadImageFile(file);
}
function loadImageFile(file) {
  const reader = new FileReader();
  reader.onload = evt => {
    currentImageData = evt.target.result; // base64 data URL
    showImgPreview(currentImageData);
    document.getElementById('imgUrlInput').value = '';
  };
  reader.readAsDataURL(file);
}
function previewFromUrl() {
  const url = document.getElementById('imgUrlInput').value.trim();
  if (!url) return;
  currentImageData = url;
  showImgPreview(url);
}
function showImgPreview(src) {
  const area = document.getElementById('imgUploadArea');
  const preview = document.getElementById('imgPreview');
  const placeholder = document.getElementById('imgPlaceholder');
  preview.src = src;
  preview.style.display = 'block';
  placeholder.style.display = 'none';
  area.classList.add('has-image');
}
function clearImgPreview() {
  currentImageData = '';
  const preview = document.getElementById('imgPreview');
  const placeholder = document.getElementById('imgPlaceholder');
  preview.src = '';
  preview.style.display = 'none';
  placeholder.style.display = 'flex';
  document.getElementById('imgUploadArea').classList.remove('has-image');
  document.getElementById('imgUrlInput').value = '';
  document.getElementById('imgFileInput').value = '';
}

// ═══════════════════════════════════════════════
//  ADD / EDIT MODAL
// ═══════════════════════════════════════════════
function openAddModal() {
  editingId = null;
  document.getElementById('modalTitle').textContent = 'New Item';
  document.getElementById('saveItemBtn').textContent = 'Save Item';
  ['f_name','f_price','f_stock','f_emoji','f_sku'].forEach(id =>
    document.getElementById(id).value = '');
  document.getElementById('f_cat').value = '';
  document.getElementById('f_sub').innerHTML = '<option value="">— Select —</option>';
  clearImgPreview();
  document.getElementById('itemModal').style.display = 'flex';
}

function openEditModal(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  editingId = id;
  document.getElementById('modalTitle').textContent = 'Edit Item';
  document.getElementById('saveItemBtn').textContent = 'Update Item';
  document.getElementById('f_name').value = p.name;
  document.getElementById('f_price').value = p.price;
  document.getElementById('f_stock').value = p.stock;
  document.getElementById('f_emoji').value = p.emoji || '';
  document.getElementById('f_sku').value = p.sku || '';
  document.getElementById('f_cat').value = p.category;
  updateSubcats();
  setTimeout(() => document.getElementById('f_sub').value = p.subcategory, 10);

  // Load existing image
  clearImgPreview();
  const src = p.image_data || p.image_url;
  if (src) {
    currentImageData = src;
    showImgPreview(src);
    if (p.image_url && !p.image_data) document.getElementById('imgUrlInput').value = p.image_url;
  }
  document.getElementById('itemModal').style.display = 'flex';
}

function closeItemModal() {
  document.getElementById('itemModal').style.display = 'none';
}

function saveItem() {
  const name = document.getElementById('f_name').value.trim();
  const cat = document.getElementById('f_cat').value;
  const sub = document.getElementById('f_sub').value;
  const price = parseFloat(document.getElementById('f_price').value);
  const stock = parseInt(document.getElementById('f_stock').value);
  const emoji = document.getElementById('f_emoji').value.trim() || '🏷';
  const sku = document.getElementById('f_sku').value.trim();

  if (!name || !cat || !sub || isNaN(price) || isNaN(stock)) {
    toast('⚠ Please fill all required fields'); return;
  }

  // Determine image fields
  const isBase64 = currentImageData.startsWith('data:');
  const image_data = isBase64 ? currentImageData : undefined;
  const image_url = !isBase64 ? (currentImageData || undefined) : undefined;

  if (editingId) {
    const p = products.find(x => x.id === editingId);
    Object.assign(p, { name, category: cat, subcategory: sub, price, stock, emoji, sku,
      image_url, image_data });
    // Update cart item if present
    const ci = cart.find(x => x.id === editingId);
    if (ci) Object.assign(ci, { name, price, emoji, image_url, image_data });
    toast(`✓ ${name} updated`);
  } else {
    products.push({ id: nextId++, name, category: cat, subcategory: sub,
      price, stock, emoji, sku, image_url, image_data });
    toast(`✓ ${name} added`);
  }

  document.getElementById('productCount').textContent = products.length;
  closeItemModal();
  filterProducts();
  renderCart();
  if (document.getElementById('inventoryView').classList.contains('active')) renderInventoryTable();
}

function deleteProduct(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  if (!confirm(`Remove "${p.name}" from inventory?`)) return;
  products = products.filter(x => x.id !== id);
  cart = cart.filter(x => x.id !== id);
  document.getElementById('productCount').textContent = products.length;
  filterProducts();
  renderCart();
  if (document.getElementById('inventoryView').classList.contains('active')) renderInventoryTable();
  toast(`✓ ${p.name} removed`);
}

// ═══════════════════════════════════════════════
//  INVENTORY TABLE
// ═══════════════════════════════════════════════
function renderInventoryTable() {
  const q = (document.getElementById('invSearchInput')?.value || '').toLowerCase();
  const list = q
    ? products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.sku||'').toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q))
    : products;

  document.getElementById('invTableBody').innerHTML = list.map(p => {
    const src = p.image_data || p.image_url;
    const thumb = src
      ? `<div class="inv-thumb"><img src="${src}" onerror="this.parentElement.innerHTML='${p.emoji||'🏷'}'"></div>`
      : `<div class="inv-thumb">${p.emoji||'🏷'}</div>`;
    const cat = categories.find(c => c.id === p.category);
    return `<tr>
      <td>${thumb}</td>
      <td class="td-name">${p.name}</td>
      <td style="font-size:10px;letter-spacing:0.06em;color:var(--text-faint)">${p.sku||'—'}</td>
      <td><span class="badge badge-cat">${cat?.label||p.category}</span></td>
      <td><span class="badge badge-sub">${p.subcategory}</span></td>
      <td class="td-price">${storeConfig.currency||'KES'} ${p.price.toLocaleString()}</td>
      <td style="color:${p.stock<=3?'var(--danger)':'var(--text-dim)'};font-weight:${p.stock<=3?600:400}">${p.stock}</td>
      <td><div class="td-actions">
        <div class="icon-btn" onclick="openEditModal(${p.id})" title="Edit">✏</div>
        <div class="icon-btn del" onclick="deleteProduct(${p.id})" title="Delete">✕</div>
      </div></td>
    </tr>`;
  }).join('');
}

// ═══════════════════════════════════════════════
//  PAYMENT
// ═══════════════════════════════════════════════
function getTotal() {
  const vr = storeConfig.vat_rate || 0.16;
  const sub = cart.reduce((s,i) => s + i.price * i.qty, 0);
  return (sub - discountAmt) * (1 + vr);
}

function openPayment() {
  const cur = storeConfig.currency || 'KES';
  document.getElementById('payAmount').textContent = Math.round(getTotal()).toLocaleString();
  document.getElementById('cashTendered').value = '';
  document.getElementById('changeVal').textContent = `${cur} 0.00`;
  buildNumpad();
  document.getElementById('paymentModal').style.display = 'flex';
  selectPayMethod('cash');
}

function closePayment() { document.getElementById('paymentModal').style.display = 'none'; }

function selectPayMethod(m) {
  payMethod = m;
  ['cash','card','mpesa'].forEach(x => {
    document.getElementById(`pm_${x}`).classList.toggle('active', x===m);
    const s = document.getElementById(`${x}Section`);
    if (s) s.classList.toggle('visible', x===m);
  });
}

function calcChange() {
  const cur = storeConfig.currency || 'KES';
  const total = getTotal();
  const tendered = parseFloat(document.getElementById('cashTendered').value) || 0;
  const change = tendered - total;
  document.getElementById('changeVal').textContent =
    `${cur} ${Math.max(0,change).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}`;
  document.getElementById('changeVal').style.color = change >= 0 ? 'var(--success)' : 'var(--danger)';
}

function buildNumpad() {
  const keys = ['1','2','3','4','5','6','7','8','9','0','⌫'];
  document.getElementById('numpad').innerHTML = keys.map(k =>
    `<button class="numpad-btn${k==='0'?' zero':''}" onclick="numpadPress('${k}')">${k}</button>`
  ).join('');
}

function numpadPress(k) {
  const inp = document.getElementById('cashTendered');
  inp.value = k === '⌫' ? inp.value.slice(0,-1) : inp.value + k;
  calcChange();
}

function completePayment() {
  if (payMethod === 'cash') {
    const total = getTotal();
    const tendered = parseFloat(document.getElementById('cashTendered').value) || 0;
    if (tendered < total) { toast('⚠ Insufficient cash tendered'); return; }
  }
  cart.forEach(item => {
    const p = products.find(x => x.id === item.id);
    if (p) p.stock = Math.max(0, p.stock - item.qty);
  });
  closePayment();
  showSuccess();
}

function showSuccess() {
  const cur = storeConfig.currency || 'KES';
  const customer = document.getElementById('customerName').value.trim() || 'Walk-in Customer';
  const lines = cart.map(i =>
    `<div class="receipt-line">
      <span>${i.emoji||''} ${i.name} ×${i.qty}</span>
      <span>${cur} ${(i.price*i.qty).toLocaleString()}</span>
    </div>`).join('');
  document.getElementById('receiptLines').innerHTML = lines +
    `<div class="receipt-line total-line">
      <span>TOTAL PAID</span>
      <span>${cur} ${Math.round(getTotal()).toLocaleString()}</span>
    </div>`;
  document.getElementById('successSub').textContent = `Thank you, ${customer}!`;
  document.getElementById('successModal').style.display = 'flex';
}

function newTransaction() {
  document.getElementById('successModal').style.display = 'none';
  clearCart();
  document.getElementById('customerName').value = '';
  filterProducts();
}

// ═══════════════════════════════════════════════
//  TOAST
// ═══════════════════════════════════════════════
function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<span class="toast-dot"></span><span>${msg}</span>`;
  document.getElementById('toastContainer').appendChild(t);
  setTimeout(() => t.remove(), 2800);
}

// ═══════════════════════════════════════════════
//  SEED DATA (fallback when JSON file not found)
// ═══════════════════════════════════════════════
function getSeedData() {
  return {
    store: { name:"MAISON Boutique", cashier:"Amara", currency:"KES", vat_rate:0.16 },
    categories: [
      { id:"clothing", label:"Clothing", subcategories:["Tops & Blouses","Trousers & Pants","Dresses","Skirts","Jackets & Coats","Suits","Knitwear","Activewear"] },
      { id:"shoes",    label:"Shoes",    subcategories:["Heels","Flats","Sneakers","Boots","Sandals","Loafers","Mules"] },
      { id:"cosmetics",label:"Cosmetics",subcategories:["Soaps","Creams","Lotions","Serums","Foundations","Perfumes","Lip Colour","Eye Makeup"] }
    ],
    products: [
      { id:1,  name:"Silk Wrap Blouse",    category:"clothing", subcategory:"Tops & Blouses",  price:4200,  stock:8,  sku:"CLO-001", image_url:"https://img.lilysilk.com/cdn-cgi/image/width=1800,height=2700,quality=80,fit=cover/media/catalog/product/N9962/03BU/4.jpg", emoji:"👗" },
      { id:2,  name:"High-Waist Trousers", category:"clothing", subcategory:"Trousers & Pants", price:5800,  stock:5,  sku:"CLO-002", image_url:"https://m.media-amazon.com/images/I/712gf22WfGL._AC_UY1000_.jpg", emoji:"👖" },
      { id:3,  name:"Floral Midi Dress",   category:"clothing", subcategory:"Dresses",          price:7500,  stock:3,  sku:"CLO-003", image_url:"https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&q=80", emoji:"🌸" },
      { id:4,  name:"Wool Blend Coat",     category:"clothing", subcategory:"Jackets & Coats",  price:18500, stock:4,  sku:"CLO-004", image_url:"https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&q=80", emoji:"🧥" },
      { id:5,  name:"Fitted Blazer",       category:"clothing", subcategory:"Suits",            price:12000, stock:6,  sku:"CLO-005", image_url:"https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400&q=80", emoji:"🤵" },
      { id:6,  name:"A-Line Mini Skirt",   category:"clothing", subcategory:"Skirts",           price:3200,  stock:11, sku:"CLO-006", image_url:"https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&q=80", emoji:"👗" },
      { id:7,  name:"Strappy Heels",       category:"shoes",    subcategory:"Heels",            price:8900,  stock:7,  sku:"SHO-001", image_url:"https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80", emoji:"👠" },
      { id:8,  name:"Block Heel Mules",    category:"shoes",    subcategory:"Mules",            price:6400,  stock:4,  sku:"SHO-002", image_url:"https://www.misslola.com/cdn/shop/files/weekend-attire-white-BF4A5645_large@2x.jpg?v=1709669933", emoji:"🩴" },
      { id:9,  name:"Classic Loafers",     category:"shoes",    subcategory:"Loafers",          price:7200,  stock:9,  sku:"SHO-003", image_url:"https://i5.walmartimages.com/asr/0aeb4873-29ad-41e6-ac67-7e015b8c2b51.ad3b5a681ee662d24ba7a63dac7dad03.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF", emoji:"👞" },
      { id:10, name:"Ankle Boots",         category:"shoes",    subcategory:"Boots",            price:11500, stock:3,  sku:"SHO-004", image_url:"https://media.mango.com/is/image/punto/27082005-99-052?wid=2048", emoji:"👢" },
      { id:11, name:"Rose Moisturiser",    category:"cosmetics",subcategory:"Creams",           price:2100,  stock:15, sku:"COS-001", image_url:"https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80", emoji:"🌹" },
      { id:12, name:"Argan Body Lotion",   category:"cosmetics",subcategory:"Lotions",          price:1650,  stock:20, sku:"COS-002", image_url:"https://izilbeauty.com/dw/image/v2/BJQV_PRD/on/demandware.static/-/Sites-izil-master-catalog/default/dw39e8f721/images/large/e-Packshots/Amber/FG-330010_Amber-Moisturising-Body-Lotion/FG-330010_Amber-Moisturising-Body-Lotion-3.jpg", emoji:"🧴" },
      { id:13, name:"Gold Radiance Serum", category:"cosmetics",subcategory:"Serums",           price:4800,  stock:10, sku:"COS-003", image_url:"https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80", emoji:"✨" },
      { id:14, name:"Shea Butter Soap",    category:"cosmetics",subcategory:"Soaps",            price:580,   stock:30, sku:"COS-004", image_url:"https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=400&q=80", emoji:"🧼" },
      { id:15, name:"Velvet Lip Colour",   category:"cosmetics",subcategory:"Lip Colour",       price:1200,  stock:18, sku:"COS-005", image_url:"https://www.lotus.in/cdn/shop/files/04_6f59dfae-9b2f-4327-94f3-c62dd75045b8.jpg?v=1754469201&width=1600", emoji:"💄" },
      { id:16, name:"Noir Eau de Parfum",  category:"cosmetics",subcategory:"Perfumes",         price:8500,  stock:7,  sku:"COS-006", image_url:"https://i.ebayimg.com/images/g/UYkAAOSwXBdlZ7~G/s-l1200.jpg", emoji:"🌺" }
    ]
  };
}

// ── BOOT ──
boot();