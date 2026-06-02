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
  config:'tinah_config',      categories:'tinah_categories', cashiers:'tinah_cashiers'
};
let offlineQueue = [];
let netStatus = 'online';

//  BOOT — load maison-data.json
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
  document.getElementById('posView').classList.toggle('hidden', v !== 'pos');
  document.getElementById('inventoryView').classList.toggle('active', v === 'inventory');
  document.getElementById('returnsView').classList.toggle('active', v === 'returns');
  document.querySelectorAll('.tab-btn').forEach((b,i) =>
    b.classList.toggle('active', (i===0 && v==='pos') || (i===1 && v==='inventory') || (i===2 && v==='returns')));
  if (v === 'inventory') renderInventoryTable();
  if (v === 'returns') renderReturnsTable();
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
  if (!isManager()) { toast('⚠ Manager access required to save changes'); return; }
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
  closeItemModal(); filterProducts(); renderCart();
  if (document.getElementById('inventoryView').classList.contains('active')) renderInventoryTable();
  lsSet('tinah_products', products);
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
  lsSet('tinah_products', products);
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

//  PAYMENT
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

  const txn = buildTransaction();
  transactions.unshift(txn);
  lastTxnId = txn.id;
  // Credit this sale to the active session
  if (activeSession) {
    activeSession.sales++; activeSession.revenue+=txn.total; activeSession.discounts+=txn.discount;
    lsSet('tinah_sessions', allSessions);
  }
  lsSet('tinah_products', products);
  lsSet('tinah_transactions', transactions);
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
  if (cmd.includes('check out') || cmd.includes('proceed') || cmd.includes('pay now')) {
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
  lsSet('tinah_sessions', allSessions);
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
function lsSet(key,val){try{localStorage.setItem(key,JSON.stringify(val));}catch(e){}}
function lsGet(key){try{const v=localStorage.getItem(key);return v?JSON.parse(v):null;}catch(e){return null;}}

function persistAll(){
  lsSet('tinah_config',storeConfig); lsSet('tinah_categories',categories);
  lsSet('tinah_products',products);  lsSet('tinah_cashiers',cashiers);
  lsSet('tinah_transactions',transactions); lsSet('tinah_sessions',allSessions);
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

// ── Backup / Restore ──
function openBackupModal(){
  const el=document.getElementById('backupModal');
  if(!el){ toast('⚠ backupModal not found in HTML'); return; }
  document.getElementById('backupStats').textContent =
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
      if(!confirm('Restore from '+file.name+'?\n\nThis replaces ALL current data.')) return;
      ingestData(data);
      if(data.transactions){ transactions=data.transactions; lsSet('tinah_transactions',transactions); }
      if(data.sessions){ allSessions=data.sessions; lsSet('tinah_sessions',allSessions); }
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
  ['tinah_products','tinah_transactions','tinah_sessions','tinah_queue',
   'tinah_config','tinah_categories','tinah_cashiers'].forEach(k=>localStorage.removeItem(k));
  toast('✓ Cleared — refresh the page to reload');
}

// ── BOOT ──
boot();