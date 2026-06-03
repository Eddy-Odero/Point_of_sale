//  STATE
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
let currentImageData = '';

// Active cashier session state
let cashiers = [];
let activeCashier = null;
let activeSession = null;
let allSessions = [];

const LS = {
  products:'tinah_products', transactions:'tinah_transactions',
  sessions:'tinah_sessions',  queue:'tinah_queue',
  config:'tinah_config',      categories:'tinah_categories', cashiers:'tinah_cashiers',
  customers:'tinah_customers'
};
let customers = [];
let offlineQueue = [];
let netStatus = 'online';
let transactions  = [];
let lastTxnId     = null;
let pendingMpesa  = {};
let lastCartHash  = '';
let lastTxnTime   = 0;
let splitMode     = false;
let splitMethod1  = 'cash';
let splitMethod2  = 'mpesa';
let splitAmount1  = 0;

//  BOOT — load maison-data.json

function lsSet(key,val){try{localStorage.setItem(key,JSON.stringify(val));}catch(e){}}
function lsGet(key){try{const v=localStorage.getItem(key);return v?JSON.parse(v):null;}catch(e){return null;}}

function persistAll(){
  lsSet('tinah_config',storeConfig); lsSet('tinah_categories',categories);
  lsSet('tinah_products',products);  lsSet('tinah_cashiers',cashiers);
  lsSet('tinah_transactions',transactions); lsSet('tinah_sessions',allSessions);
  lsSet(LS.customers, customers);
}

// ── Network status — drives the existing cashier-dot colour ──
function initNetwork(){
  updateNetDot();
  window.addEventListener('online', ()=>{ netStatus='online';  updateNetDot(); });
  window.addEventListener('offline',()=>{ netStatus='offline'; updateNetDot(); });
  setInterval(probeConnection,30000);
  probeConnection();
}

function probeConnection(){
  const t0=Date.now();
  fetch('https://www.gstatic.com/generate_204',{mode:'no-cors',cache:'no-store'})
    .then(()=>{ netStatus=Date.now()-t0>2000?'weak':'online'; updateNetDot(); })
    .catch(()=>{ netStatus='offline'; updateNetDot(); });
}

function updateNetDot(){
  const dot=document.getElementById('netDot'); if(!dot) return;
  dot.classList.remove('net-online','net-weak','net-offline');
  dot.classList.add('net-'+netStatus);
  dot.title={online:'Online',weak:'Slow connection',offline:'Offline'}[netStatus]||netStatus;
}

// (backup/restore moved to main block)


async function boot() {
  setLoadStatus('Loading product data…');
  const saved = lsGet('tinah_products');
  if (saved) {
    storeConfig  = lsGet('tinah_config')      || {};
    categories   = lsGet('tinah_categories')  || [];
    products     = saved;
    cashiers     = lsGet('tinah_cashiers')    || getDefaultCashiers();
    transactions = lsGet('tinah_transactions')|| [];
    allSessions  = lsGet('tinah_sessions')    || [];
    offlineQueue = lsGet('tinah_queue')       || [];
    nextId = (Math.max(0,...products.map(p=>p.id))+1)||100;
    setLoadStatus('Restored from local storage');
  } else {
    try {
      const res = await fetch('maison-data.json');
      if (!res.ok) throw new Error();
      ingestData(await res.json());
    } catch {
      setLoadStatus('Using built-in catalogue…');
      ingestData(getSeedData());
    }
  }
  await delay(600);
  document.getElementById('loadScreen').style.opacity = '0';
  await delay(400);
  document.getElementById('loadScreen').style.display = 'none';
  initNetwork();
  showCashierPicker();
}

function ingestData(data) {
  storeConfig = data.store || {};
  categories = data.categories || [];
  products = data.products || [];
  cashiers = data.cashiers || getDefaultCashiers();
  nextId = (Math.max(0,...products.map(p=>p.id))+1)||100;
  persistAll();
}

function setLoadStatus(msg) {
  document.getElementById('loadStatus').textContent = msg;
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function init() {
  if (storeConfig.name) document.title = storeConfig.name + ' — POS';
  document.getElementById('vatLabel').textContent = Math.round((storeConfig.vat_rate || 0.16) * 100);
  document.getElementById('productCount').textContent = products.length;
  updateCashierBadge();
  populateCatSelects();
  renderCatChips();
  renderSubcats();
  filterProducts();
  updateClock();
  setInterval(updateClock, 1000);
}

function updateCashierBadge() {
  if (!activeCashier) return;
  document.getElementById('cashierName').textContent = activeCashier.name;
  // Show end-shift button only for logged-in cashier
  const endBtn = document.getElementById('endShiftBtn');
  if (endBtn) endBtn.style.display = 'flex';
}

//  JSON I/O
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

function buildExportJson(full=false) {
  const base = { store:storeConfig, categories, cashiers, products:products.map(p=>({...p})) };
  if (full) { base.transactions=transactions; base.sessions=allSessions; }
  return base;
}

function openExportModal() {
  const json = JSON.stringify(buildExportJson(false), null, 2);
  document.getElementById('jsonExportPre').textContent = json;
  document.getElementById('exportModal').style.display = 'flex';
}

function downloadJson() {
  const json = JSON.stringify(buildExportJson(false), null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'maison-data.json';
  a.click();
  toast('✓ maison-data.json downloaded');
}

//  CLOCK
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent =
    now.toLocaleTimeString('en-KE', { hour:'2-digit', minute:'2-digit' }) +
    ' · ' + now.toLocaleDateString('en-KE', { weekday:'short', day:'numeric', month:'short' });
}

//  TABS
function switchView(v) {
  document.getElementById('posView').style.display        = v === 'pos'       ? ''     : 'none';
  document.getElementById('inventoryView').style.display  = v === 'inventory' ? 'flex' : 'none';
  document.getElementById('returnsView').style.display    = v === 'returns'   ? 'flex' : 'none';
  document.getElementById('reportsView').style.display    = v === 'reports'   ? 'flex' : 'none';
  document.getElementById('customersView').style.display  = v === 'customers' ? 'flex' : 'none';
  document.querySelectorAll('.tab-btn').forEach((b,i) =>
    b.classList.toggle('active',
      (i===0&&v==='pos')||(i===1&&v==='inventory')||(i===2&&v==='returns')||(i===3&&v==='reports')||(i===4&&v==='customers')));
  if (v === 'inventory') { renderInventoryTable(); renderExpiryAlerts(); }
  if (v === 'returns')   renderReturnsTable();
  if (v === 'reports')   renderReports();
  if (v === 'customers') { renderCustomersTable(); initSms(); renderSmsOutbox(); }
}

//  CATEGORY UI
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

//  PRODUCTS GRID
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

//  CART
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

//  IMAGE HANDLING
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

//  ADD / EDIT MODAL
function openAddModal() {
  if (!isManager()) { toast('⚠ Manager access required to add items'); return; }
  editingId = null;
  document.getElementById('modalTitle').textContent = 'New Item';
  document.getElementById('saveItemBtn').textContent = 'Save Item';
  ['f_name','f_price','f_stock','f_emoji','f_sku','f_expiry'].forEach(id =>
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
  document.getElementById('f_expiry').value = p.expiryDate || '';
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
  if (!isManager()) { toast('⚠ Manager access required to save changes'); return; }
  const name = document.getElementById('f_name').value.trim();
  const cat = document.getElementById('f_cat').value;
  const sub = document.getElementById('f_sub').value;
  const price = parseFloat(document.getElementById('f_price').value);
  const stock = parseInt(document.getElementById('f_stock').value);
  const emoji    = document.getElementById('f_emoji').value.trim() || '🏷';
  const sku      = document.getElementById('f_sku').value.trim();
  const expiryDate = document.getElementById('f_expiry').value || null;

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
      image_url, image_data, expiryDate });
    const ci = cart.find(x => x.id === editingId);
    if (ci) Object.assign(ci, { name, price, emoji, image_url, image_data });
    toast(`✓ ${name} updated`);
  } else {
    products.push({ id: nextId++, name, category: cat, subcategory: sub,
      price, stock, emoji, sku, image_url, image_data, expiryDate });
    const newProd = products[products.length-1];
    if (newProd.stock > 0) triggerNewStockAlert(newProd);
    toast(`✓ ${name} added`);
  }

  document.getElementById('productCount').textContent = products.length;
  closeItemModal(); filterProducts(); renderCart();
  if (document.getElementById('inventoryView').classList.contains('active')) renderInventoryTable();
  lsSet(LS.products, products);
}

function deleteProduct(id) {
  if (!isManager()) { toast('⚠ Manager access required'); return; }
  const p = products.find(x => x.id === id);
  if (!p) return;
  if (!confirm(`Remove "${p.name}" from inventory?`)) return;
  products = products.filter(x => x.id !== id);
  cart = cart.filter(x => x.id !== id);
  document.getElementById('productCount').textContent = products.length;
  filterProducts();
  renderCart();
  if (document.getElementById('inventoryView').classList.contains('active')) renderInventoryTable();
  lsSet(LS.products, products);
  toast(`✓ ${p.name} removed`);
}

//  INVENTORY TABLE
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
      <td class="td-name">${p.name}${getExpiryBadgeHTML(p)}</td>
      <td style="font-size:10px;letter-spacing:0.06em;color:var(--text-faint)">${p.sku||'—'}</td>
      <td><span class="badge badge-cat">${cat?.label||p.category}</span></td>
      <td><span class="badge badge-sub">${p.subcategory}</span></td>
      <td class="td-price">${storeConfig.currency||'KES'} ${p.price.toLocaleString()}</td>
      <td style="color:${p.stock<=3?'var(--danger)':'var(--text-dim)'};font-weight:${p.stock<=3?600:400}">${p.stock}</td>
      <td><div class="td-actions">
        <div class="icon-btn" onclick="openEditModal(${p.id})" title="Edit">✏</div>
        ${p.expiryDate?`<div class="icon-btn" onclick="openDisposeModal(${p.id})" title="Dispose">🗑</div>`:''}
        <div class="icon-btn del" onclick="deleteProduct(${p.id})" title="Delete">✕</div>
      </div></td>
    </tr>`;
  }).join('');
}

//  PAYMENT
function getTotal() {
  const vr = storeConfig.vat_rate || 0.16;
  const sub = cart.reduce((s,i) => s + i.price * i.qty, 0);
  return (sub - discountAmt) * (1 + vr);
}

// openPayment — replaced below

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

// completePayment — replaced below

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
  document.getElementById('successSub').textContent = `Thank you, ${customer}! · Ref: ${lastTxnId}`;
  document.getElementById('successModal').style.display = 'flex';
}

function newTransaction() {
  document.getElementById('successModal').style.display = 'none';
  clearCart();
  document.getElementById('customerName').value = '';
  filterProducts();
}

//  TOAST
function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<span class="toast-dot"></span><span>${msg}</span>`;
  document.getElementById('toastContainer').appendChild(t);
  setTimeout(() => t.remove(), 2800);
}

//  SEED DATA (fallback when JSON file not found)
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

  // Build the correct stamp based on what actually happened
  const lastReturn   = txn.returns && txn.returns.length ? txn.returns[txn.returns.length-1] : null;
  const stampStyles = {
    base:     'border-radius:4px;padding:10px 14px;margin-bottom:12px;text-align:center;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase',
    yellow:   'background:#fff8e1;border:2px solid #f9a825;color:#7c5a00',
    green:    'background:#e8f5e9;border:2px solid #388e3c;color:#1b5e20',
    red:      'background:#fce8e8;border:2px solid #c62828;color:#b71c1c',
    blue:     'background:#e3f2fd;border:2px solid #1565c0;color:#0d47a1',
    grey:     'background:#f5f5f5;border:2px solid #757575;color:#424242',
  };
  const getStamp = () => {
    if (isCreditNote && lastReturn && lastReturn.type === 'exchange')
      return `<div style="${stampStyles.base};${stampStyles.blue}">🔄 EXCHANGE CREDIT NOTE · ${lastReturn.creditNoteId||txn.id}</div>`;
    if (isCreditNote)
      return `<div style="${stampStyles.base};${stampStyles.yellow}">↩ REFUND / CREDIT NOTE · ${txn.id}</div>`;
    if (txn.status === 'voided')
      return `<div style="${stampStyles.base};${stampStyles.red}">🚫 VOIDED — ${txn.voidReason||''}</div>`;
    if (txn.status === 'exchanged' || (lastReturn && lastReturn.type === 'exchange'))
      return `<div style="${stampStyles.base};${stampStyles.blue}">🔄 EXCHANGED</div>`;
    if (txn.status === 'returned' || lastReturn)
      return `<div style="${stampStyles.base};${stampStyles.yellow}">↩ RETURNED / REFUNDED</div>`;
    if (txn.status === 'pending')
      return `<div style="${stampStyles.base};${stampStyles.grey}">⏳ PAYMENT PENDING</div>`;
    return '';
  };
  const creditBanner = getStamp();

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
  selectOutcome('refund');
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

function selectOutcome(outcome) {
  const isExchange = outcome === 'exchange';
  // Update hidden toggle value (confirmReturn reads this)
  const toggle = document.getElementById('exchangeToggle');
  if (toggle) toggle.value = isExchange ? 'true' : 'false';
  // Highlight the chosen button
  document.getElementById('outcomeRefund').classList.toggle('active', !isExchange);
  document.getElementById('outcomeExchange').classList.toggle('active', isExchange);
  // Show/hide relevant rows
  document.getElementById('returnReasonRow').style.display = isExchange ? 'none' : 'block';
  document.getElementById('exchangeHint').style.display    = isExchange ? 'block' : 'none';
  // Update confirm button label
  const btn = document.getElementById('confirmReturnBtn');
  if (btn) btn.textContent = isExchange ? 'Start Exchange →' : 'Confirm Refund';
}

function confirmReturn() {
  if (!currentReturnTxn) return;

  // Collect which items are being returned
  const checkedItems = currentReturnTxn.items.filter((_, idx) => {
    const el = document.getElementById(`ri_${idx}`);
    return el && el.checked;
  });
  if (!checkedItems.length) { toast('⚠ Select at least one item to return'); return; }

  const notes        = document.getElementById('returnNotes').value.trim();
  const isExchange   = document.getElementById('exchangeToggle')?.value === 'true';
  const returnedValue = checkedItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  // Build the return record
  const returnRecord = {
    date: new Date().toISOString(),
    type: isExchange ? 'exchange' : currentReturnType,
    items: checkedItems,
    notes,
    creditNoteId: 'CN-' + Date.now().toString(36).toUpperCase(),
    creditValue: returnedValue
  };

  // Always restock the returned items immediately
  checkedItems.forEach(ri => {
    const p = products.find(x => x.id === ri.id);
    if (p) p.stock += ri.qty;
  });

  currentReturnTxn.returns.push(returnRecord);
  currentReturnTxn.status = isExchange ? 'exchanged' : 'returned';
  lsSet(LS.products, products);
  lsSet(LS.transactions, transactions);
  closeReturnModal();

  if (isExchange) {
    // Hand off to exchange flow — cashier picks new items then settles
    renderReturnsTable();
    startExchange(returnRecord);
    return;
  }

  // Plain refund — show credit note receipt
  const cur = storeConfig.currency || 'KES';
  const creditTxn = {
    ...currentReturnTxn,
    id: returnRecord.creditNoteId,
    date: returnRecord.date,
    items: checkedItems,
    subtotal: returnedValue,
    discount: 0, vat: 0,
    total: returnedValue,
  };

  renderInventoryTable();
  renderReturnsTable();
  toast('✓ Return processed — ' + returnRecord.creditNoteId + ' · Refund: ' + cur + ' ' + returnedValue.toLocaleString());
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

function hashPin(pin) { return pin; } // plain compare — crypto.subtle breaks on HTTP/LAN

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

function submitPin() {
  if (!selectedCashierId) return;
  const c = cashiers.find(x => x.id === selectedCashierId);
  const hashed = hashPin(pinBuffer);
  const expectedHash = hashPin(c.pin);
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
  lsSet(LS.sessions, allSessions);
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


// ── localStorage helpers ──

// ── PAYMENT INTEGRITY ──

function cartHash() {
  return cart.map(i=>i.id+':'+i.qty).sort().join('|')+':'+Math.round(getTotal());
}

function openPayment() {
  const cur = storeConfig.currency || 'KES';
  document.getElementById('payAmount').textContent = Math.round(getTotal()).toLocaleString();
  document.getElementById('cashTendered').value = '';
  document.getElementById('changeVal').textContent = cur+' 0.00';
  buildNumpad();
  splitMode=false; splitAmount1=0;
  const stBtn=document.getElementById('splitToggleBtn');
  const stSec=document.getElementById('splitSection');
  if(stBtn) stBtn.classList.remove('active');
  if(stSec) stSec.style.display='none';
  document.getElementById('paymentModal').style.display='flex';
  selectPayMethod('cash');
}

function toggleSplit() {
  splitMode=!splitMode;
  document.getElementById('splitToggleBtn').classList.toggle('active',splitMode);
  document.getElementById('splitSection').style.display=splitMode?'block':'none';
  if(splitMode) updateSplitCalc();
}

function updateSplitCalc() {
  const total=Math.round(getTotal());
  splitAmount1=parseFloat(document.getElementById('splitAmount1Input').value)||0;
  const rem=Math.max(0,total-splitAmount1);
  const cur=storeConfig.currency||'KES';
  document.getElementById('splitRemainder').textContent=cur+' '+rem.toLocaleString();
  splitMethod1=document.getElementById('splitMethod1').value;
  splitMethod2=document.getElementById('splitMethod2').value;
}

function completePayment() {
  const total=Math.round(getTotal());
  const hash=cartHash();
  if(hash===lastCartHash && Date.now()-lastTxnTime<10000){ showTxnError('duplicate',null); return; }
  if((payMethod==='cash'&&!splitMode)||(splitMode&&splitMethod1==='cash')){
    const tendered=parseFloat(document.getElementById('cashTendered').value)||0;
    const needed=splitMode?splitAmount1:total;
    if(tendered<needed){ toast('⚠ Insufficient cash tendered'); return; }
  }
  const usesMpesa=(payMethod==='mpesa'&&!splitMode)||(splitMode&&(splitMethod1==='mpesa'||splitMethod2==='mpesa'));
  if(usesMpesa){
    const phone=document.getElementById('mpesaPhone').value.trim();
    if(!phone){ toast('⚠ Enter M-Pesa phone number'); return; }
    // Only queue when offline or weak — online M-Pesa completes immediately
    if(netStatus==='offline' || netStatus==='weak'){
      startMpesaPending(phone,total);
    } else {
      finalisePayment();
      toast('📱 M-Pesa confirmed — STK sent to '+phone);
    }
    return;
  }
  finalisePayment();
}

function finalisePayment() {
  cart.forEach(item=>{ const p=products.find(x=>x.id===item.id); if(p) p.stock=Math.max(0,p.stock-item.qty); });
  const txn=buildTransaction();
  transactions.unshift(txn); lastTxnId=txn.id;
  lastCartHash=cartHash(); lastTxnTime=Date.now();
  if(activeSession){
    activeSession.sales++; activeSession.revenue+=txn.total; activeSession.discounts+=txn.discount;
    lsSet(LS.sessions,allSessions);
  }
  lsSet(LS.products,products); lsSet(LS.transactions,transactions);
  recordLoyalty(txn);
  splitMode=false; splitAmount1=0;
  closePayment(); showSuccess();
}

function startMpesaPending(phone,total) {
  cart.forEach(item=>{ const p=products.find(x=>x.id===item.id); if(p) p.stock=Math.max(0,p.stock-item.qty); });
  const txn=buildTransaction('pending'); txn.mpesaPhone=phone;
  transactions.unshift(txn);
  if(activeSession){ activeSession.sales++; activeSession.revenue+=txn.total; activeSession.discounts+=txn.discount; lsSet(LS.sessions,allSessions); }
  lsSet(LS.products,products); lsSet(LS.transactions,transactions);
  closePayment(); clearCart(); document.getElementById('customerName').value='';
  addPendingBar(txn,phone,total);
  toast('📱 STK sent to '+phone+' — serve next customer while waiting');
}

function addPendingBar(txn,phone,total) {
  const cur=storeConfig.currency||'KES';
  const tray=document.getElementById('mpesaTray');
  if(!tray) return;
  tray.style.display='block';
  const card=document.createElement('div');
  card.className='mpesa-card'; card.id='mpesa-card-'+txn.id;
  card.innerHTML=`
    <div class="mpesa-card-top">
      <span class="mpesa-card-icon">📱</span>
      <div class="mpesa-card-info">
        <div class="mpesa-card-title">${txn.customer} · ${phone}</div>
        <div class="mpesa-card-amt">${cur} ${total.toLocaleString()}</div>
      </div>
      <div class="mpesa-card-timer" id="mpesa-timer-${txn.id}">60s</div>
    </div>
    <div class="mpesa-card-id">${txn.id}</div>
    <div class="mpesa-card-actions">
      <button class="btn-gold" style="flex:1;padding:7px" onclick="confirmMpesaById('${txn.id}')">✓ Paid</button>
      <button class="btn-outline" style="flex:1;padding:7px" onclick="cancelMpesaById('${txn.id}')">✕ Cancel</button>
    </div>`;
  tray.querySelector('.mpesa-tray-list').prepend(card);
  let secs=60;
  const iv=setInterval(()=>{
    secs--;
    const el=document.getElementById('mpesa-timer-'+txn.id);
    if(el){ el.textContent=secs+'s'; el.style.color=secs<=15?'var(--danger)':''; }
    if(secs<=0){
      clearInterval(iv); delete pendingMpesa[txn.id];
      txn.status='failed'; txn.failReason='timeout'; lsSet(LS.transactions,transactions);
      removePendingCard(txn.id); showTxnError('mpesa_timeout',txn);
    }
  },1000);
  pendingMpesa[txn.id]={iv,txn};
}

function removePendingCard(txnId) {
  const card=document.getElementById('mpesa-card-'+txnId); if(card) card.remove();
  const tray=document.getElementById('mpesaTray');
  if(tray && !tray.querySelector('.mpesa-card')) tray.style.display='none';
}

function confirmMpesaById(txnId) {
  const entry=pendingMpesa[txnId]; if(!entry) return;
  clearInterval(entry.iv); delete pendingMpesa[txnId];
  entry.txn.status='complete'; entry.txn.mpesaConfirmedAt=new Date().toISOString();
  lsSet(LS.transactions,transactions);
  removePendingCard(txnId);
  const cur=storeConfig.currency||'KES';
  toast('✓ M-Pesa confirmed — '+entry.txn.customer+' · '+cur+' '+entry.txn.total.toLocaleString());
}

function cancelMpesaById(txnId) {
  const entry=pendingMpesa[txnId];
  if(entry){ clearInterval(entry.iv); delete pendingMpesa[txnId]; }
  const txn=entry?entry.txn:transactions.find(t=>t.id===txnId);
  if(txn){
    txn.items.forEach(item=>{ const p=products.find(x=>x.id===item.id); if(p) p.stock+=item.qty; });
    txn.status='failed'; txn.failReason='cancelled';
    if(activeSession){ activeSession.sales=Math.max(0,activeSession.sales-1); activeSession.revenue=Math.max(0,activeSession.revenue-txn.total); lsSet(LS.sessions,allSessions); }
    lsSet(LS.products,products); lsSet(LS.transactions,transactions);
  }
  removePendingCard(txnId);
  toast('M-Pesa cancelled — stock restored');
}

function retryMpesa() { document.getElementById('txnErrorModal').style.display='none'; openPayment(); selectPayMethod('mpesa'); }
function switchToCash() { document.getElementById('txnErrorModal').style.display='none'; openPayment(); selectPayMethod('cash'); }

function showTxnError(type,txn) {
  const msgs={
    duplicate:      {title:'Duplicate Sale Detected',  body:'Same cart charged less than 10 seconds ago. Is this genuinely a new sale?', actions:'<button class="btn-gold" onclick="proceedDuplicate()">Yes, charge again</button><button class="btn-cancel" onclick="closeTxnError()">Cancel</button>'},
    mpesa_timeout:  {title:'M-Pesa Timed Out',         body:'STK push not confirmed in 60 seconds. Items still in cart.',                actions:'<button class="btn-gold" onclick="retryMpesa()">🔄 Retry M-Pesa</button><button class="btn-outline" onclick="switchToCash()">💵 Switch to Cash</button><button class="btn-cancel" onclick="closeTxnError()">Cancel</button>'},
    mpesa_rejected: {title:'M-Pesa Rejected',          body:'Customer declined or wrong PIN. Stock not deducted.',                       actions:'<button class="btn-gold" onclick="retryMpesa()">🔄 Retry</button><button class="btn-outline" onclick="switchToCash()">💵 Switch to Cash</button><button class="btn-cancel" onclick="closeTxnError()">Cancel</button>'},
    card_declined:  {title:'Card Declined',            body:'Terminal declined. Stock not deducted.',                                    actions:'<button class="btn-gold" onclick="closeTxnError();openPayment()">🔄 Try Again</button><button class="btn-outline" onclick="switchToCash()">💵 Switch to Cash</button><button class="btn-cancel" onclick="closeTxnError()">Cancel</button>'},
  };
  const m=msgs[type]||msgs.mpesa_timeout;
  document.getElementById('txnErrorTitle').textContent=m.title;
  document.getElementById('txnErrorBody').textContent=m.body;
  document.getElementById('txnErrorActions').innerHTML=m.actions;
  if(txn){ txn.status='failed'; txn.failReason=type; lsSet(LS.transactions,transactions); }
  document.getElementById('txnErrorModal').style.display='flex';
}
function closeTxnError(){ document.getElementById('txnErrorModal').style.display='none'; }
function proceedDuplicate(){ closeTxnError(); lastCartHash=''; finalisePayment(); }

// ── EXCHANGE & VOID ──

function startExchange(returnRecord) {
  const credit = returnRecord.creditValue;
  const cur = storeConfig.currency || 'KES';
  clearCart();
  window._exchangeCredit = credit;
  window._exchangeCreditNoteId = returnRecord.creditNoteId;
  document.getElementById('customerName').value = currentReturnTxn ? currentReturnTxn.customer : '';
  // Show banner with credit amount so cashier knows what's available
  const banner = document.getElementById('exchangeBanner');
  if (banner) {
    banner.style.display = 'flex';
    document.getElementById('exchangeCreditAmt').textContent = cur + ' ' + credit.toLocaleString();
    document.getElementById('exchangeCNId').textContent = returnRecord.creditNoteId;
  }
  switchView('pos');
  toast('Exchange started — credit: ' + cur + ' ' + credit.toLocaleString() + '. Add new items then click Proceed.');
}

function cancelExchange() {
  window._exchangeCredit = 0;
  window._exchangeCreditNoteId = null;
  const banner = document.getElementById('exchangeBanner');
  if (banner) banner.style.display = 'none';
  clearCart();
}

// Called when cashier clicks "Proceed to Exchange" from the exchange banner
function applyExchangeCredit() {
  const credit = window._exchangeCredit || 0;
  if (!credit) { toast('⚠ No exchange credit active'); return; }
  if (!cart.length) { toast('⚠ Add items to cart first'); return; }
  const newTotal = Math.round(getTotal());
  const cur = storeConfig.currency || 'KES';
  const topUp = Math.max(0, newTotal - credit);
  const refund = Math.max(0, credit - newTotal);

  if (topUp === 0 && refund === 0) {
    // Exact match — complete silently, no payment needed
    discountAmt = credit;
    recalc();
    finaliseExchange('exact', 0);
    return;
  }

  // Open the exchange settlement modal to collect top-up or show refund
  openExchangeSettlement(credit, newTotal, topUp, refund);
}

function openExchangeSettlement(credit, newTotal, topUp, refund) {
  const cur = storeConfig.currency || 'KES';
  const modal = document.getElementById('exchangeSettleModal');
  document.getElementById('exSettleCreditVal').textContent = cur + ' ' + credit.toLocaleString();
  document.getElementById('exSettleNewTotal').textContent  = cur + ' ' + newTotal.toLocaleString();

  const topUpRow    = document.getElementById('exSettleTopUpRow');
  const refundRow   = document.getElementById('exSettleRefundRow');
  const topUpInput  = document.getElementById('exSettleTopUpInput');
  const methodWrap  = document.getElementById('exSettleMethodWrap');
  const refundNote  = document.getElementById('exSettleRefundNote');
  const confirmBtn  = document.getElementById('exSettleConfirmBtn');

  if (topUp > 0) {
    // Customer owes more — show payment input
    topUpRow.style.display  = 'flex';
    refundRow.style.display = 'none';
    topUpInput.value = topUp;
    methodWrap.style.display = 'block';
    refundNote.style.display = 'none';
    document.getElementById('exSettleTopUpVal').textContent = cur + ' ' + topUp.toLocaleString();
    confirmBtn.textContent = 'Collect ' + cur + ' ' + topUp.toLocaleString() + ' & Complete';
  } else {
    // Store owes customer change
    topUpRow.style.display  = 'none';
    refundRow.style.display = 'flex';
    methodWrap.style.display = 'none';
    refundNote.style.display = 'block';
    document.getElementById('exSettleRefundVal').textContent = cur + ' ' + refund.toLocaleString();
    refundNote.textContent = 'Return ' + cur + ' ' + refund.toLocaleString() + ' change to customer.';
    confirmBtn.textContent = 'Give Refund & Complete';
  }

  window._exSettleTopUp  = topUp;
  window._exSettleRefund = refund;
  window._exSettleCredit = credit;
  modal.style.display = 'flex';
}

function confirmExchangeSettlement() {
  const topUp  = window._exSettleTopUp  || 0;
  const refund = window._exSettleRefund || 0;
  const credit = window._exSettleCredit || 0;
  const cur = storeConfig.currency || 'KES';

  if (topUp > 0) {
    // Validate cashier entered the top-up amount
    const entered = parseFloat(document.getElementById('exSettleTopUpInput').value) || 0;
    if (entered < topUp) { toast('⚠ Top-up amount is less than required'); return; }
  }

  document.getElementById('exchangeSettleModal').style.display = 'none';
  const type = topUp > 0 ? 'topup' : (refund > 0 ? 'refund' : 'exact');
  discountAmt = Math.min(credit, Math.round(getTotal()));
  recalc();
  finaliseExchange(type, topUp > 0 ? topUp : refund);
}

function finaliseExchange(type, amount) {
  const cur = storeConfig.currency || 'KES';
  // Hide banner
  const banner = document.getElementById('exchangeBanner');
  if (banner) banner.style.display = 'none';

  // Complete the transaction normally — discount covers the credit portion
  finalisePayment();

  // Override the success message to reflect the exchange
  const msgs = {
    exact:  '✓ Exchange complete — exact match, no extra payment',
    topup:  '✓ Exchange complete — customer paid extra ' + cur + ' ' + amount.toLocaleString(),
    refund: '✓ Exchange complete — refunded ' + cur + ' ' + amount.toLocaleString() + ' to customer',
  };
  // finalisePayment already showed success modal — update the sub text
  const sub = document.getElementById('successSub');
  if (sub) sub.textContent = msgs[type] || msgs.exact;

  window._exchangeCredit = 0;
  window._exchangeCreditNoteId = null;
}

function openVoidModal(txnId) {
  if(!isManager()){ toast('⚠ Manager access required to void'); return; }
  const txn=transactions.find(t=>t.id===txnId); if(!txn) return;
  if(new Date(txn.date).toDateString()!==new Date().toDateString()){ toast('⚠ Can only void transactions from today'); return; }
  if(txn.status==='voided'){ toast('⚠ Already voided'); return; }
  window._voidTxnId=txnId;
  const ref=document.getElementById('voidTxnRef'); if(ref) ref.textContent=txnId;
  const mgr=document.getElementById('voidManagerName'); if(mgr) mgr.value=activeCashier?activeCashier.name:'Manager';
  const rsn=document.getElementById('voidReason'); if(rsn) rsn.value='';
  const modal=document.getElementById('voidModal'); if(modal) modal.style.display='flex';
}

function confirmVoid() {
  const txn=transactions.find(t=>t.id===window._voidTxnId); if(!txn) return;
  const reason=document.getElementById('voidReason').value.trim();
  if(!reason){ toast('⚠ Enter a reason for voiding'); return; }
  txn.items.forEach(item=>{ const p=products.find(x=>x.id===item.id); if(p) p.stock+=item.qty; });
  txn.status='voided'; txn.voidedBy=activeCashier?activeCashier.name:'Manager';
  txn.voidedAt=new Date().toISOString(); txn.voidReason=reason;
  lsSet(LS.products,products); lsSet(LS.transactions,transactions);
  document.getElementById('voidModal').style.display='none';
  renderReturnsTable(); renderInventoryTable();
  toast('✓ '+window._voidTxnId+' voided — stock reversed');
}

// ── NETWORK ──

function initNetwork(){
  updateNetDot();
  window.addEventListener('online', ()=>{ netStatus='online'; updateNetDot(); });
  window.addEventListener('offline',()=>{ netStatus='offline'; updateNetDot(); });
  setInterval(probeConnection,30000);
  probeConnection();
}

function probeConnection(){
  const t0=Date.now();
  fetch('https://www.gstatic.com/generate_204',{mode:'no-cors',cache:'no-store'})
    .then(()=>{ netStatus=Date.now()-t0>2000?'weak':'online'; updateNetDot(); })
    .catch(()=>{ netStatus='offline'; updateNetDot(); });
}

function updateNetDot(){
  const dot=document.getElementById('netDot'); if(!dot) return;
  dot.classList.remove('net-online','net-weak','net-offline');
  dot.classList.add('net-'+netStatus);
  dot.title={online:'Online',weak:'Slow connection',offline:'Offline'}[netStatus]||netStatus;
}

// ── BACKUP / RESTORE ──

function openBackupModal(){
  const el=document.getElementById('backupModal'); if(!el){ toast('⚠ backupModal missing'); return; }
  document.getElementById('backupStats').textContent=
    products.length+' products · '+transactions.length+' transactions · '+allSessions.length+' sessions';
  document.querySelectorAll('.backup-manager-only').forEach(el=>el.style.display=isManager()?'block':'none');
  el.style.display='flex';
}

function downloadFullBackup(){
  const now=new Date().toISOString().slice(0,10);
  const blob=new Blob([JSON.stringify(buildExportJson(true),null,2)],{type:'application/json'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob);
  a.download='tinah-backup-'+now+'.json'; a.click();
  toast('✓ Backup saved to your computer');
}

function triggerRestoreFile(){ document.getElementById('restoreFileInput').click(); }

function handleRestoreFile(e){
  const file=e.target.files[0]; if(!file) return;
  const r=new FileReader();
  r.onload=evt=>{
    try{
      const data=JSON.parse(evt.target.result);
      if(!data.products){ toast('⚠ Not a valid backup file'); return; }
      if(!confirm('Restore from '+file.name+'?\n\nReplaces ALL current data.')) return;
      ingestData(data);
      if(data.transactions){ transactions=data.transactions; lsSet(LS.transactions,transactions); }
      if(data.sessions){ allSessions=data.sessions; lsSet(LS.sessions,allSessions); }
      populateCatSelects(); renderCatChips(); renderSubcats(); filterProducts();
      document.getElementById('productCount').textContent=products.length;
      document.getElementById('backupModal').style.display='none';
      toast('✓ Restored: '+products.length+' products, '+transactions.length+' transactions');
    }catch(e){ toast('⚠ Could not read file: '+e.message); }
  };
  r.readAsText(file); e.target.value='';
}

function clearLocalStorage(){
  if(!isManager()){ toast('⚠ Manager access required'); return; }
  if(!confirm('Wipe all local data and reset to sample catalogue?')) return;
  Object.values(LS).forEach(k=>localStorage.removeItem(k));
  toast('✓ Cleared — refresh the page to reload');
}


// ── BOOT ──
boot();
// ═══════════════════════════════════════════════════════
//  REPORTS & ANALYTICS
// ═══════════════════════════════════════════════════════

let reportPeriod = 'today';
let chartRevenue = null, chartDonut = null, chartBest = null;

// ── Date helpers ──
function periodDates(period) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (period === 'today') {
    return { from: today, to: new Date(today.getTime() + 86400000 - 1) };
  }
  if (period === 'week') {
    const mon = new Date(today); mon.setDate(today.getDate() - today.getDay() + 1);
    return { from: mon, to: new Date(today.getTime() + 86400000 - 1) };
  }
  if (period === 'month') {
    return { from: new Date(now.getFullYear(), now.getMonth(), 1),
             to:   new Date(today.getTime() + 86400000 - 1) };
  }
  if (period === 'custom') {
    const f = document.getElementById('reportFrom').value;
    const t = document.getElementById('reportTo').value;
    if (!f || !t) return periodDates('today');
    return { from: new Date(f), to: new Date(new Date(t).getTime() + 86400000 - 1) };
  }
  return periodDates('today');
}

function setReportPeriod(p) {
  reportPeriod = p;
  document.querySelectorAll('.report-period-btn').forEach((b,i) => {
    const labels = ['today','week','month','custom'];
    b.classList.toggle('active', labels[i] === p);
  });
  document.getElementById('reportCustomRange').style.display = p === 'custom' ? 'flex' : 'none';
  if (p !== 'custom') renderReports();
}

// ── Filter transactions to period, exclude failed/voided ──
function txnsInPeriod(from, to) {
  return transactions.filter(t => {
    if (t.status === 'failed' || t.status === 'voided' || t.status === 'pending') return false;
    const d = new Date(t.date);
    return d >= from && d <= to;
  });
}

// ── Main render orchestrator ──
function renderReports() {
  const { from, to } = periodDates(reportPeriod);
  const txns = txnsInPeriod(from, to);
  renderKPIs(txns, from, to);
  renderRevenueTrend(txns, from, to);
  renderCategoryDonut(txns);
  renderHeatmap(txns);
  renderBestSellers();
  renderDeadStock();
  renderCashierLeaderboard(txns);
}

// ── KPI cards ──
function renderKPIs(txns, from, to) {
  const cur = storeConfig.currency || 'KES';
  const revenue   = txns.reduce((s,t) => s + t.total, 0);
  const units     = txns.reduce((s,t) => s + t.items.reduce((a,i) => a+i.qty, 0), 0);
  const avgBasket = txns.length ? Math.round(revenue / txns.length) : 0;
  const discounts = txns.reduce((s,t) => s + (t.discount||0), 0);
  const topCashier = (() => {
    const map = {};
    txns.forEach(t => { map[t.cashier] = (map[t.cashier]||0) + t.total; });
    const top = Object.entries(map).sort((a,b)=>b[1]-a[1])[0];
    return top ? top[0] : '—';
  })();
  const returns   = txns.filter(t => t.returns && t.returns.length).length;

  const kpis = [
    { icon:'💰', label:'Revenue',      val: cur+' '+revenue.toLocaleString(),    sub: txns.length+' transactions' },
    { icon:'📦', label:'Units Sold',   val: units.toLocaleString(),              sub: 'items across all sales' },
    { icon:'🛒', label:'Avg Basket',   val: cur+' '+avgBasket.toLocaleString(),  sub: 'per transaction' },
    { icon:'🏷', label:'Discounts',    val: cur+' '+discounts.toLocaleString(),  sub: 'total given' },
    { icon:'👑', label:'Top Cashier',  val: topCashier,                          sub: 'by revenue' },
    { icon:'↩', label:'Returns',       val: returns.toString(),                  sub: 'transactions' },
  ];
  document.getElementById('kpiRow').innerHTML = kpis.map(k => `
    <div class="kpi-card">
      <div class="kpi-icon">${k.icon}</div>
      <div class="kpi-label">${k.label}</div>
      <div class="kpi-val">${k.val}</div>
      <div class="kpi-sub">${k.sub}</div>
    </div>`).join('');
}

// ── Revenue trend line chart ──
function renderRevenueTrend(txns, from, to) {
  const canvas = document.getElementById('chartRevenueTrend');
  if (!canvas) return;
  // Build daily buckets between from and to
  const days = [];
  const cur = new Date(from);
  while (cur <= to) {
    days.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  const labels = days.map(d => d.toLocaleDateString('en-KE', {day:'numeric',month:'short'}));
  const data   = days.map(d => {
    const next = new Date(d.getTime() + 86400000);
    return txns.filter(t => {
      const td = new Date(t.date);
      return td >= d && td < next;
    }).reduce((s,t) => s + t.total, 0);
  });

  if (chartRevenue) chartRevenue.destroy();
  chartRevenue = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Revenue',
        data,
        borderColor: '#c9a84c',
        backgroundColor: 'rgba(201,168,76,0.10)',
        borderWidth: 2,
        pointRadius: data.length <= 7 ? 4 : 2,
        pointBackgroundColor: '#c9a84c',
        fill: true,
        tension: 0.35,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false },
        tooltip: { callbacks: { label: ctx => (storeConfig.currency||'KES')+' '+ctx.parsed.y.toLocaleString() } } },
      scales: {
        x: { grid: { color:'rgba(255,255,255,0.04)' }, ticks: { color:'#888', font:{size:10} } },
        y: { grid: { color:'rgba(255,255,255,0.04)' }, ticks: { color:'#888', font:{size:10},
            callback: v => (storeConfig.currency||'KES')+' '+v.toLocaleString() } }
      }
    }
  });
}

// ── Category donut chart ──
function renderCategoryDonut(txns) {
  const canvas = document.getElementById('chartCategoryDonut');
  if (!canvas) return;
  const map = {};
  txns.forEach(t => t.items.forEach(i => {
    const p = products.find(x => x.id === i.id);
    const cat = p ? (categories.find(c=>c.id===p.category)?.label || p.category || 'Other') : 'Other';
    map[cat] = (map[cat]||0) + i.price * i.qty;
  }));
  const entries = Object.entries(map).sort((a,b)=>b[1]-a[1]).slice(0, 7);
  const palette = ['#c9a84c','#a07030','#6d9e6d','#5b8ab5','#a06080','#7a6fa0','#888'];

  if (chartDonut) chartDonut.destroy();
  chartDonut = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: entries.map(e=>e[0]),
      datasets: [{ data: entries.map(e=>e[1]), backgroundColor: palette, borderWidth: 0 }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position:'bottom', labels:{ color:'#aaa', font:{size:10}, boxWidth:10 } },
        tooltip: { callbacks: { label: ctx => ctx.label+': '+(storeConfig.currency||'KES')+' '+ctx.parsed.toLocaleString() } }
      }
    }
  });
}

// ── Hourly heatmap (24 hours × 7 days-of-week) ──
function renderHeatmap(txns) {
  const wrap = document.getElementById('heatmapWrap');
  if (!wrap) return;
  const grid = Array.from({length:7}, () => new Array(24).fill(0));
  txns.forEach(t => {
    const d = new Date(t.date);
    grid[d.getDay()][d.getHours()] += t.total;
  });
  const max = Math.max(1, ...grid.flat());
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  let html = '<div class="heatmap-grid">';
  // Hour labels
  html += '<div class="heatmap-corner"></div>';
  for (let h=0;h<24;h++) html += `<div class="heatmap-hlabel">${h}</div>`;
  // Rows
  grid.forEach((row, di) => {
    html += `<div class="heatmap-dlabel">${days[di]}</div>`;
    row.forEach((val, hi) => {
      const intensity = Math.round((val/max)*100);
      const bg = val === 0 ? 'var(--card)' : `rgba(201,168,76,${(val/max*0.85+0.1).toFixed(2)})`;
      const cur = storeConfig.currency||'KES';
      html += `<div class="heatmap-cell" style="background:${bg}" title="${days[di]} ${hi}:00 — ${cur} ${val.toLocaleString()}"></div>`;
    });
  });
  html += '</div>';
  wrap.innerHTML = html;
}

// ── Best sellers bar chart ──
function renderBestSellers() {
  const canvas = document.getElementById('chartBestSellers');
  if (!canvas) return;
  const map = {};
  transactions.filter(t=>t.status!=='voided'&&t.status!=='failed').forEach(t =>
    t.items.forEach(i => {
      if (!map[i.name]) map[i.name] = { units:0, revenue:0 };
      map[i.name].units   += i.qty;
      map[i.name].revenue += i.price * i.qty;
    }));
  const top = Object.entries(map).sort((a,b)=>b[1].revenue-a[1].revenue).slice(0,8);
  if (chartBest) chartBest.destroy();
  chartBest = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: top.map(e=>e[0].length>16?e[0].slice(0,14)+'…':e[0]),
      datasets: [{
        label: 'Revenue',
        data: top.map(e=>e[1].revenue),
        backgroundColor: 'rgba(201,168,76,0.75)',
        borderRadius: 4,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: { legend:{display:false},
        tooltip:{ callbacks:{ label: ctx=>(storeConfig.currency||'KES')+' '+ctx.parsed.x.toLocaleString() } } },
      scales: {
        x:{ grid:{color:'rgba(255,255,255,0.04)'}, ticks:{color:'#888',font:{size:10},
            callback:v=>(storeConfig.currency||'KES')+' '+v.toLocaleString()} },
        y:{ grid:{display:false}, ticks:{color:'#ccc',font:{size:10}} }
      }
    }
  });
}

// ── Dead stock ──
function renderDeadStock() {
  const wrap = document.getElementById('deadStockList');
  if (!wrap) return;
  const cutoff = new Date(Date.now() - 30*24*60*60*1000);
  const soldRecently = new Set();
  transactions.filter(t=>t.status!=='voided'&&t.status!=='failed').forEach(t => {
    if (new Date(t.date) >= cutoff) t.items.forEach(i => soldRecently.add(i.id));
  });
  const dead = products.filter(p => !soldRecently.has(p.id) && p.stock > 0);
  const cur  = storeConfig.currency||'KES';
  if (!dead.length) {
    wrap.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-faint);font-size:12px;letter-spacing:0.06em">🎉 No dead stock — everything has sold recently</div>';
    return;
  }
  wrap.innerHTML = dead.slice(0,12).map(p => {
    const cat = categories.find(c=>c.id===p.category)?.label||'';
    return `<div class="dead-stock-row">
      <span class="dead-stock-emoji">${p.emoji||'📦'}</span>
      <div class="dead-stock-info">
        <div class="dead-stock-name">${p.name}</div>
        <div class="dead-stock-meta">${cat} · Stock: ${p.stock}</div>
      </div>
      <span class="dead-stock-price">${cur} ${p.price.toLocaleString()}</span>
    </div>`;
  }).join('');
}

// ── Cashier leaderboard ──
function renderCashierLeaderboard(txns) {
  const wrap = document.getElementById('cashierLeaderboard');
  if (!wrap) return;
  const cur = storeConfig.currency||'KES';
  const map = {};
  txns.forEach(t => {
    const name = t.cashier||'Unknown';
    if (!map[name]) map[name] = {sales:0,revenue:0,discounts:0,returns:0};
    map[name].sales++;
    map[name].revenue   += t.total;
    map[name].discounts += (t.discount||0);
    if (t.returns && t.returns.length) map[name].returns++;
  });
  const rows = Object.entries(map).sort((a,b)=>b[1].revenue-a[1].revenue);
  if (!rows.length) {
    wrap.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-faint);font-size:12px">No transactions in this period</div>';
    return;
  }
  const maxRev = rows[0][1].revenue;
  wrap.innerHTML = rows.map(([name,d],i) => `
    <div class="leaderboard-row">
      <div class="leaderboard-rank">${i===0?'🥇':i===1?'🥈':i===2?'🥉':'#'+(i+1)}</div>
      <div class="leaderboard-name">${name}</div>
      <div class="leaderboard-bar-wrap">
        <div class="leaderboard-bar" style="width:${Math.round(d.revenue/maxRev*100)}%"></div>
      </div>
      <div class="leaderboard-stats">
        <span>${cur} ${d.revenue.toLocaleString()}</span>
        <span>${d.sales} sales</span>
      </div>
    </div>`).join('');
}

// ── Export CSV ──
function exportReportCSV() {
  const { from, to } = periodDates(reportPeriod);
  const txns = txnsInPeriod(from, to);
  const cur  = storeConfig.currency||'KES';
  const rows = [
    ['Transaction ID','Date','Time','Customer','Cashier','Items','Subtotal','Discount','VAT','Total','Payment','Status'],
    ...txns.map(t => [
      t.id,
      new Date(t.date).toLocaleDateString('en-KE'),
      new Date(t.date).toLocaleTimeString('en-KE',{hour:'2-digit',minute:'2-digit'}),
      t.customer,
      t.cashier,
      t.items.map(i=>`${i.name} x${i.qty}`).join(' | '),
      t.subtotal,
      t.discount||0,
      t.vat||0,
      t.total,
      t.payMethod,
      t.status,
    ])
  ];
  const csv  = rows.map(r=>r.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(',')).join('\n');
  const blob = new Blob([csv],{type:'text/csv'});
  const a    = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'tinah-report-'+from.toISOString().slice(0,10)+'.csv';
  a.click();
  toast('✓ CSV downloaded');
}

// ── Export PDF (print-ready report page) ──
function exportReportPDF() {
  const { from, to } = periodDates(reportPeriod);
  const txns = txnsInPeriod(from, to);
  const cur  = storeConfig.currency||'KES';
  const revenue  = txns.reduce((s,t)=>s+t.total,0);
  const units    = txns.reduce((s,t)=>s+t.items.reduce((a,i)=>a+i.qty,0),0);
  const avgBasket= txns.length ? Math.round(revenue/txns.length) : 0;
  const storeName= storeConfig.name||'TINAH COSMETICS';
  const dateRange= from.toLocaleDateString('en-KE',{day:'numeric',month:'short',year:'numeric'})
    + (reportPeriod!=='today' ? ' – '+to.toLocaleDateString('en-KE',{day:'numeric',month:'short',year:'numeric'}) : '');

  // Top cashiers
  const cashierMap = {};
  txns.forEach(t=>{ cashierMap[t.cashier]=(cashierMap[t.cashier]||0)+t.total; });
  const cashierRows = Object.entries(cashierMap).sort((a,b)=>b[1]-a[1])
    .map(([n,v])=>`<tr><td>${n}</td><td style="text-align:right">${cur} ${v.toLocaleString()}</td></tr>`).join('');

  // Item breakdown
  const itemMap = {};
  txns.forEach(t=>t.items.forEach(i=>{
    if(!itemMap[i.name]) itemMap[i.name]={units:0,revenue:0};
    itemMap[i.name].units+=i.qty; itemMap[i.name].revenue+=i.price*i.qty;
  }));
  const itemRows = Object.entries(itemMap).sort((a,b)=>b[1].revenue-a[1].revenue).slice(0,15)
    .map(([n,d])=>`<tr><td>${n}</td><td style="text-align:right">${d.units}</td><td style="text-align:right">${cur} ${d.revenue.toLocaleString()}</td></tr>`).join('');

  const win = window.open('','_blank','width=800,height=900');
  win.document.write(`<!DOCTYPE html><html><head><title>${storeName} — Report</title>
  <style>
    body{font-family:'Helvetica Neue',sans-serif;padding:32px 40px;color:#1a1a1a;font-size:13px}
    h1{font-size:22px;letter-spacing:0.2em;color:#8a6d2f;margin:0}
    .sub{font-size:11px;color:#888;letter-spacing:0.1em;margin-top:4px;margin-bottom:24px}
    .kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px}
    .kpi{background:#faf9f6;border:1px solid #e8e0cc;border-radius:6px;padding:12px 16px}
    .kpi-l{font-size:10px;letter-spacing:0.1em;color:#888;text-transform:uppercase;margin-bottom:4px}
    .kpi-v{font-size:18px;font-weight:700;color:#8a6d2f}
    table{width:100%;border-collapse:collapse;margin-bottom:24px}
    th{background:#f5f0e8;text-align:left;padding:7px 10px;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#7a6030}
    td{padding:6px 10px;border-bottom:1px solid #f0ece0;font-size:12px}
    h2{font-size:13px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#555;margin:20px 0 8px}
    @media print{body{padding:16px}}
  </style></head><body>
  <h1>${storeName}</h1>
  <div class="sub">SALES REPORT &nbsp;·&nbsp; ${dateRange}</div>
  <div class="kpis">
    <div class="kpi"><div class="kpi-l">Revenue</div><div class="kpi-v">${cur} ${revenue.toLocaleString()}</div></div>
    <div class="kpi"><div class="kpi-l">Transactions</div><div class="kpi-v">${txns.length}</div></div>
    <div class="kpi"><div class="kpi-l">Units Sold</div><div class="kpi-v">${units}</div></div>
    <div class="kpi"><div class="kpi-l">Avg Basket</div><div class="kpi-v">${cur} ${avgBasket.toLocaleString()}</div></div>
    <div class="kpi"><div class="kpi-l">Discounts Given</div><div class="kpi-v">${cur} ${txns.reduce((s,t)=>s+(t.discount||0),0).toLocaleString()}</div></div>
    <div class="kpi"><div class="kpi-l">Returns</div><div class="kpi-v">${txns.filter(t=>t.returns&&t.returns.length).length}</div></div>
  </div>
  <h2>Cashier Performance</h2>
  <table><tr><th>Cashier</th><th style="text-align:right">Revenue</th></tr>${cashierRows}</table>
  <h2>Top Products</h2>
  <table><tr><th>Product</th><th style="text-align:right">Units</th><th style="text-align:right">Revenue</th></tr>${itemRows}</table>
  <script>window.onload=()=>window.print()<\/script></body></html>`);
  win.document.close();
}


// ═══════════════════════════════════════════════════════
//  CUSTOMER LOYALTY
// ═══════════════════════════════════════════════════════

const TIERS = [
  { name:'VIP',    minVisits:20, minSpend:50000, pct:15, color:'#c9a84c', icon:'👑' },
  { name:'Gold',   minVisits:10, minSpend:20000, pct:10, color:'#d4af37', icon:'🥇' },
  { name:'Silver', minVisits:5,  minSpend:5000,  pct:5,  color:'#a0a0a0', icon:'🥈' },
  { name:'Bronze', minVisits:2,  minSpend:0,     pct:0,  color:'#cd7f32', icon:'🥉' },
];

function getTier(c) {
  for (const t of TIERS) {
    if (c.visits >= t.minVisits || c.totalSpend >= t.minSpend) return t;
  }
  return null;
}

function findOrCreateCustomer(nameOrPhone) {
  if (!nameOrPhone || nameOrPhone === 'Walk-in Customer') return null;
  let c = customers.find(x =>
    x.name.toLowerCase() === nameOrPhone.toLowerCase() || x.phone === nameOrPhone);
  if (!c) {
    c = { id: 'CUS-'+Date.now().toString(36).toUpperCase(),
      name: nameOrPhone, phone: '', email: '',
      visits:0, totalSpend:0, notes:'',
      createdAt: new Date().toISOString() };
    customers.push(c);
  }
  return c;
}

function recordLoyalty(txn) {
  if (!txn || txn.status === 'failed' || txn.status === 'voided') return;
  const nameOrPhone = document.getElementById('customerName').value.trim();
  const c = findOrCreateCustomer(nameOrPhone);
  if (!c) return;
  c.visits++;
  c.totalSpend += txn.total;
  c.lastVisit = txn.date;
  txn.customerId = c.id;
  lsSet(LS.customers, customers);
}

// Called when cashier types in customer name field — show tier + auto-discount
function lookupCustomer() {
  const val = document.getElementById('customerName').value.trim();
  const badge = document.getElementById('loyaltyBadge');
  if (!val || val.length < 2) { if (badge) badge.style.display='none'; return; }
  const c = customers.find(x =>
    x.name.toLowerCase().startsWith(val.toLowerCase()) || x.phone.startsWith(val));
  if (!c) { if (badge) badge.style.display='none'; return; }
  const tier = getTier(c);
  if (!tier || tier.pct === 0) { if (badge) badge.style.display='none'; return; }
  const cur = storeConfig.currency||'KES';
  if (badge) {
    badge.style.display = 'flex';
    badge.innerHTML = `
      <span style="color:${tier.color}">${tier.icon} ${tier.name}</span>
      <span style="color:var(--text-faint)">${c.visits} visits · ${cur} ${c.totalSpend.toLocaleString()} spend</span>
      <button class="loyalty-apply-btn" onclick="applyLoyaltyDiscount(${tier.pct})">Apply ${tier.pct}% discount</button>`;
  }
  // Auto-fill name with full name
  document.getElementById('customerName').value = c.name;
}

function applyLoyaltyDiscount(pct) {
  document.getElementById('discountInput').value = pct+'%';
  recalc();
  toast(`${pct}% loyalty discount applied`);
}

// ── Customer management (Customers tab) ──
function renderCustomersTable() {
  const q = (document.getElementById('custSearchInput')?.value||'').toLowerCase();
  const cur = storeConfig.currency||'KES';
  const list = q ? customers.filter(c =>
    c.name.toLowerCase().includes(q) || (c.phone||'').includes(q))
    : [...customers].sort((a,b)=>b.totalSpend-a.totalSpend);

  const empty = document.getElementById('custEmpty');
  const table = document.getElementById('custTable');
  if (!customers.length) { empty.style.display='block'; table.style.display='none'; return; }
  empty.style.display='none'; table.style.display='table';

  document.getElementById('custTableBody').innerHTML = list.map(c => {
    const tier = getTier(c);
    const tierBadge = tier ? `<span class="badge" style="background:${tier.color}22;color:${tier.color};border:1px solid ${tier.color}">${tier.icon} ${tier.name}</span>` : '<span class="badge badge-complete" style="color:var(--text-faint)">New</span>';
    const lastV = c.lastVisit ? new Date(c.lastVisit).toLocaleDateString('en-KE',{day:'numeric',month:'short'}) : '—';
    return `<tr>
      <td style="font-size:12px;font-weight:600">${c.name}</td>
      <td style="font-size:11px;color:var(--text-faint)">${c.phone||'—'}</td>
      <td>${tierBadge}</td>
      <td style="font-size:12px;text-align:center">${c.visits}</td>
      <td class="td-price">${cur} ${c.totalSpend.toLocaleString()}</td>
      <td style="font-size:11px;color:var(--text-faint)">${lastV}</td>
      <td style="text-align:center">
        <button onclick="toggleSmsOptIn('${c.id}')" style="background:none;border:1px solid ${c.smsOptIn&&c.phone?'var(--success)':'var(--border)'};border-radius:var(--radius);padding:3px 8px;cursor:pointer;font-size:11px;color:${c.smsOptIn&&c.phone?'var(--success)':'var(--text-faint)'}" title="${c.phone?'Toggle SMS opt-in':'Add phone number first'}">
          ${c.smsOptIn&&c.phone?'✓ On':'Off'}
        </button>
      </td>
      <td><div class="td-actions">
        <div class="icon-btn" onclick="openEditCustomer('${c.id}')" title="Edit">✏️</div>
        <div class="icon-btn" onclick="deleteCustomer('${c.id}')" title="Delete">🗑</div>
      </div></td>
    </tr>`;
  }).join('');
}

function openEditCustomer(id) {
  const c = id ? customers.find(x=>x.id===id) : null;
  document.getElementById('custModalTitle').textContent = c ? 'Edit Customer' : 'New Customer';
  document.getElementById('cf_name').value  = c?.name  || '';
  document.getElementById('cf_phone').value = c?.phone || '';
  document.getElementById('cf_email').value = c?.email || '';
  document.getElementById('cf_notes').value = c?.notes || '';
  document.getElementById('cf_vip_pct').value = c?.vipPct || '';
  document.getElementById('custModal').dataset.editId = id||'';
  document.getElementById('custModal').style.display = 'flex';
}

function saveCustomer() {
  const id     = document.getElementById('custModal').dataset.editId;
  const name   = document.getElementById('cf_name').value.trim();
  const phone  = document.getElementById('cf_phone').value.trim();
  const email  = document.getElementById('cf_email').value.trim();
  const notes  = document.getElementById('cf_notes').value.trim();
  const vipPct = parseFloat(document.getElementById('cf_vip_pct').value)||0;
  if (!name) { toast('⚠ Name is required'); return; }
  if (id) {
    const c = customers.find(x=>x.id===id);
    Object.assign(c, { name, phone, email, notes, vipPct });
  } else {
    customers.push({ id:'CUS-'+Date.now().toString(36).toUpperCase(),
      name, phone, email, notes, vipPct,
      visits:0, totalSpend:0, createdAt:new Date().toISOString() });
  }
  lsSet(LS.customers, customers);
  document.getElementById('custModal').style.display='none';
  renderCustomersTable();
  toast('✓ Customer saved');
}

function deleteCustomer(id) {
  if (!confirm('Remove this customer profile?')) return;
  customers = customers.filter(c=>c.id!==id);
  lsSet(LS.customers, customers);
  renderCustomersTable();
  toast('✓ Customer removed');
}

// ═══════════════════════════════════════════════════════
//  EXPIRY & DISPOSAL
// ═══════════════════════════════════════════════════════

function getExpiryStatus(p) {
  if (!p.expiryDate) return null;
  const exp  = new Date(p.expiryDate);
  const now  = new Date();
  const days = Math.ceil((exp - now) / 86400000);
  if (days < 0)  return { label:'Expired',       days, cls:'expiry-expired' };
  if (days <= 7) return { label:'Expires in '+days+'d', days, cls:'expiry-critical' };
  if (days <= 30) return { label:'Expires in '+days+'d', days, cls:'expiry-warning' };
  return { label:'Expires '+exp.toLocaleDateString('en-KE',{day:'numeric',month:'short',year:'numeric'}), days, cls:'expiry-ok' };
}

function renderExpiryAlerts() {
  const wrap = document.getElementById('expiryAlerts');
  if (!wrap) return;
  const flagged = products.filter(p => {
    const s = getExpiryStatus(p);
    return s && s.days <= 30;
  }).sort((a,b) => new Date(a.expiryDate)-new Date(b.expiryDate));
  if (!flagged.length) { wrap.innerHTML='<div class="expiry-none">✓ No items expiring in the next 30 days</div>'; return; }
  wrap.innerHTML = flagged.map(p => {
    const st = getExpiryStatus(p);
    return `<div class="expiry-row ${st.cls}">
      <span class="expiry-emoji">${p.emoji||'📦'}</span>
      <div class="expiry-info">
        <div class="expiry-name">${p.name} <span style="color:var(--text-faint);font-size:10px">${p.sku||''}</span></div>
        <div class="expiry-meta">Stock: ${p.stock} · ${st.label}</div>
      </div>
      <button class="btn-outline" style="font-size:10px;padding:4px 10px" onclick="openDisposeModal(${p.id})">Dispose</button>
    </div>`;
  }).join('');
}

function openDisposeModal(productId) {
  const p = products.find(x=>x.id===productId);
  if (!p) return;
  document.getElementById('disposeProductName').textContent = p.name;
  document.getElementById('disposeQtyInput').value = p.stock;
  document.getElementById('disposeQtyInput').max   = p.stock;
  document.getElementById('disposeReason').value   = '';
  document.getElementById('disposeModal').dataset.pid = productId;
  document.getElementById('disposeModal').style.display='flex';
}

function confirmDispose() {
  const pid = parseInt(document.getElementById('disposeModal').dataset.pid);
  const p   = products.find(x=>x.id===pid); if (!p) return;
  const qty = parseInt(document.getElementById('disposeQtyInput').value)||0;
  const reason = document.getElementById('disposeReason').value.trim();
  if (qty <= 0 || qty > p.stock) { toast('⚠ Invalid quantity'); return; }
  if (!reason) { toast('⚠ Enter a disposal reason'); return; }

  // Log disposal as a transaction-like record
  const log = {
    id: 'DIS-'+Date.now().toString(36).toUpperCase(),
    date: new Date().toISOString(),
    type: 'disposal',
    productId: pid, productName: p.name, sku: p.sku||'',
    qty, reason,
    writtenOffValue: p.price * qty,
    cashier: activeCashier ? activeCashier.name : 'Manager'
  };
  if (!storeConfig.disposalLog) storeConfig.disposalLog = [];
  storeConfig.disposalLog.push(log);

  p.stock -= qty;
  if (p.stock === 0) p.status = 'disposed';
  lsSet(LS.products, products);
  lsSet(LS.config, storeConfig);

  document.getElementById('disposeModal').style.display='none';
  renderExpiryAlerts(); renderInventoryTable();
  const cur = storeConfig.currency||'KES';
  toast(`✓ Disposed ${qty}× ${p.name} — ${cur} ${log.writtenOffValue.toLocaleString()} written off`);
}

// Add expiry badge to inventory table rows
function getExpiryBadgeHTML(p) {
  const s = getExpiryStatus(p);
  if (!s) return '';
  const colours = { 'expiry-expired':'var(--danger)', 'expiry-critical':'#e55', 'expiry-warning':'#d4902a', 'expiry-ok':'var(--success)' };
  return `<span style="font-size:9px;padding:2px 6px;border-radius:3px;border:1px solid ${colours[s.cls]};color:${colours[s.cls]};margin-left:4px">${s.label}</span>`;
}


// ═══════════════════════════════════════════════════════
//  SMS ALERTS — PROTOTYPE
//  Stores outbox in localStorage. Real sending via
//  Africa's Talking or Twilio replaces sendSmsNow().
// ═══════════════════════════════════════════════════════

let smsOutbox = [];
const LS_SMS = 'tinah_sms_outbox';

function initSms() {
  smsOutbox = lsGet(LS_SMS) || [];
}

// ── Called from inventory when new stock is added ──
function triggerNewStockAlert(product) {
  const subscribers = customers.filter(c => c.smsOptIn && c.phone);
  if (!subscribers.length) return;
  const storeName = storeConfig.name || 'TINAH COSMETICS';
  const cur = storeConfig.currency || 'KES';
  const msg = `Hi [Name]! ${storeName}: ${product.name} is back in stock at ${cur} ${product.price.toLocaleString()}. Visit us today! Reply STOP to unsubscribe.`;
  openSmsComposer('new_stock', msg, subscribers, product);
}

// ── Manual blast from Customers tab ──
function openSmsBlast() {
  const subscribers = customers.filter(c => c.smsOptIn && c.phone);
  const storeName = storeConfig.name || 'TINAH COSMETICS';
  openSmsComposer('manual', `Hi [Name]! ${storeName}: `, subscribers, null);
}

function openSmsComposer(type, defaultMsg, recipients, context) {
  document.getElementById('smsModal').style.display = 'flex';
  document.getElementById('smsMsgInput').value = defaultMsg;
  document.getElementById('smsRecipientCount').textContent = recipients.length;
  document.getElementById('smsCharCount').textContent = defaultMsg.length;
  document.getElementById('smsMsgInput').oninput = () => {
    document.getElementById('smsCharCount').textContent =
      document.getElementById('smsMsgInput').value.length;
    updateSmsPreview(recipients);
  };
  window._smsPending = { type, recipients, context };
  updateSmsPreview(recipients);
}

function updateSmsPreview(recipients) {
  const msg = document.getElementById('smsMsgInput').value;
  const preview = document.getElementById('smsPreviewArea');
  const first = recipients[0];
  if (!first) { preview.textContent = '— No opted-in recipients —'; return; }
  preview.textContent = msg.replace('[Name]', first.name.split(' ')[0]);
}

function sendSmsBlast() {
  const msg      = document.getElementById('smsMsgInput').value.trim();
  const pending  = window._smsPending;
  if (!msg)                     { toast('⚠ Message cannot be empty'); return; }
  if (!pending?.recipients?.length) { toast('⚠ No opted-in recipients'); return; }

  const results = pending.recipients.map(c => {
    const personalised = msg.replace('[Name]', c.name.split(' ')[0]);
    const entry = {
      id:        'SMS-'+Date.now().toString(36).toUpperCase()+'-'+Math.random().toString(36).slice(2,5),
      sentAt:    new Date().toISOString(),
      to:        c.phone,
      recipient: c.name,
      message:   personalised,
      type:      pending.type,
      status:    'queued',    // 'queued' | 'sent' | 'failed'
      apiRef:    null,
    };
    // ── Prototype: swap this block for real API call ──
    // sendViAfricas Talking(entry) or sendViaTwilio(entry)
    entry.status = simulateSend(entry);
    smsOutbox.unshift(entry);
    return entry;
  });

  lsSet(LS_SMS, smsOutbox.slice(0, 500)); // keep last 500
  document.getElementById('smsModal').style.display = 'none';
  renderSmsOutbox();

  const sent   = results.filter(r=>r.status==='sent').length;
  const failed = results.filter(r=>r.status==='failed').length;
  toast(`📱 ${sent} message${sent!==1?'s':''} queued${failed?' · '+failed+' failed':''}`);
}

// Prototype simulation — replace with real API call
function simulateSend(entry) {
  // In production: POST to your Node.js/Firebase endpoint which calls AT or Twilio
  // For now: mark as 'sent' (no actual SMS delivered)
  return 'sent';
}

// ── Real API stub — uncomment + fill in when backend is ready ──
/*
async function sendViaAfricasTalking(entry) {
  const res = await fetch('https://YOUR-BACKEND/api/sms', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ to: entry.to, message: entry.message })
  });
  const data = await res.json();
  entry.apiRef = data.messageId;
  entry.status = data.success ? 'sent' : 'failed';
}
*/

function renderSmsOutbox() {
  const wrap = document.getElementById('smsOutboxList');
  if (!wrap) return;
  const list = smsOutbox.slice(0, 50);
  if (!list.length) {
    wrap.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-faint);font-size:12px;letter-spacing:0.06em">No messages sent yet</div>';
    return;
  }
  wrap.innerHTML = list.map(m => {
    const d = new Date(m.sentAt).toLocaleString('en-KE',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
    const statusColour = m.status==='sent'?'var(--success)':m.status==='failed'?'var(--danger)':'#d4902a';
    return `<div class="sms-outbox-row">
      <div class="sms-outbox-meta">
        <span class="sms-outbox-recipient">${m.recipient}</span>
        <span class="sms-outbox-phone">${m.to}</span>
        <span class="sms-outbox-date">${d}</span>
        <span style="font-size:10px;font-weight:700;color:${statusColour};letter-spacing:0.08em">${m.status.toUpperCase()}</span>
      </div>
      <div class="sms-outbox-msg">${m.message}</div>
    </div>`;
  }).join('');
}

// ── Opt-in toggle from customer table ──
function toggleSmsOptIn(custId) {
  const c = customers.find(x=>x.id===custId);
  if (!c) return;
  if (!c.phone) { toast('⚠ Add a phone number first'); return; }
  c.smsOptIn = !c.smsOptIn;
  lsSet(LS.customers, customers);
  renderCustomersTable();
  toast(c.smsOptIn ? `✓ ${c.name} opted in to SMS` : `${c.name} opted out`);
}