
// ─── DATA ───────────────────────────────────────────────
const SUBCATS = {
  Clothing: ['Tops & Blouses','Trousers & Pants','Dresses','Skirts','Jackets & Coats','Suits','Knitwear','Activewear'],
  Shoes: ['Heels','Flats','Sneakers','Boots','Sandals','Loafers','Mules'],
  Cosmetics: ['Soaps','Creams','Lotions','Serums','Foundations','Perfumes','Lip Colour','Eye Makeup']
};

let products = [
  { id:1, name:'Silk Wrap Blouse', cat:'Clothing', sub:'Tops & Blouses', price:4200, stock:8, emoji:'👗' },
  { id:2, name:'High-Waist Trousers', cat:'Clothing', sub:'Trousers & Pants', price:5800, stock:5, emoji:'👖' },
  { id:3, name:'Floral Midi Dress', cat:'Clothing', sub:'Dresses', price:7500, stock:3, emoji:'👒' },
  { id:4, name:'Wool Blend Coat', cat:'Clothing', sub:'Jackets & Coats', price:18500, stock:4, emoji:'🧥' },
  { id:5, name:'Fitted Blazer', cat:'Clothing', sub:'Suits', price:12000, stock:6, emoji:'🤵' },
  { id:6, name:'Strappy Heels', cat:'Shoes', sub:'Heels', price:8900, stock:7, emoji:'👠' },
  { id:7, name:'Block Heel Mules', cat:'Shoes', sub:'Mules', price:6400, stock:4, emoji:'🩴' },
  { id:8, name:'Classic Loafers', cat:'Shoes', sub:'Loafers', price:7200, stock:9, emoji:'👞' },
  { id:9, name:'Ankle Boots', cat:'Shoes', sub:'Boots', price:11500, stock:3, emoji:'👢' },
  { id:10, name:'Rose Moisturiser', cat:'Cosmetics', sub:'Creams', price:2100, stock:15, emoji:'🌹' },
  { id:11, name:'Argan Body Lotion', cat:'Cosmetics', sub:'Lotions', price:1650, stock:20, emoji:'🧴' },
  { id:12, name:'Gold Radiance Serum', cat:'Cosmetics', sub:'Serums', price:4800, stock:10, emoji:'✨' },
  { id:13, name:'Shea Butter Soap', cat:'Cosmetics', sub:'Soaps', price:580, stock:30, emoji:'🧼' },
  { id:14, name:'Velvet Lip Colour', cat:'Cosmetics', sub:'Lip Colour', price:1200, stock:18, emoji:'💄' },
  { id:15, name:'Noir Eau de Parfum', cat:'Cosmetics', sub:'Perfumes', price:8500, stock:7, emoji:'🌺' },
  { id:16, name:'A-Line Mini Skirt', cat:'Clothing', sub:'Skirts', price:3200, stock:11, emoji:'👗' },
];

let cart = [];
let activeCat = 'All';
let activeSub = 'All';
let editingId = null;
let nextId = 17;
let payMethod = 'cash';
let discountAmt = 0;

// ─── CLOCK ──────────────────────────────────────────────
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent =
    now.toLocaleTimeString('en-KE', { hour:'2-digit', minute:'2-digit' }) + ' · ' +
    now.toLocaleDateString('en-KE', { weekday:'short', day:'numeric', month:'short' });
}
setInterval(updateClock, 1000);
updateClock();

// ─── TABS ────────────────────────────────────────────────
function switchView(v) {
  document.getElementById('posView').classList.toggle('hidden', v !== 'pos');
  const inv = document.getElementById('inventoryView');
  inv.classList.toggle('active', v === 'inventory');
  document.querySelectorAll('.tab-btn').forEach((b,i) => b.classList.toggle('active', (i===0 && v==='pos') || (i===1 && v==='inventory')));
  if (v === 'inventory') renderInventoryTable();
}

// ─── CATEGORY CHIPS ──────────────────────────────────────
function renderCatChips() {
  const cats = ['All','Clothing','Shoes','Cosmetics'];
  document.getElementById('catChips').innerHTML = cats.map(c =>
    `<button class="cat-chip ${c===activeCat?'active':''}" onclick="selectCat('${c}')">${c}</button>`
  ).join('');
}

function selectCat(cat) {
  activeCat = cat;
  activeSub = 'All';
  renderCatChips();
  renderSubcats();
  filterProducts();
}

function renderSubcats() {
  const strip = document.getElementById('subcatStrip');
  if (activeCat === 'All') { strip.innerHTML = ''; return; }
  const subs = ['All', ...(SUBCATS[activeCat] || [])];
  strip.innerHTML = subs.map(s =>
    `<button class="subcat-btn ${s===activeSub?'active':''}" onclick="selectSub('${s}')">${s}</button>`
  ).join('');
}

function selectSub(sub) {
  activeSub = sub;
  renderSubcats();
  filterProducts();
}

// ─── PRODUCTS GRID ────────────────────────────────────────
function filterProducts() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  const filtered = products.filter(p => {
    const matchCat = activeCat === 'All' || p.cat === activeCat;
    const matchSub = activeSub === 'All' || p.sub === activeSub;
    const matchQ = !q || p.name.toLowerCase().includes(q) || p.sub.toLowerCase().includes(q);
    return matchCat && matchSub && matchQ;
  });
  renderProducts(filtered);
}

function renderProducts(list) {
  const grid = document.getElementById('productsGrid');
  if (!list.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:48px;color:var(--text-faint);font-size:13px;letter-spacing:0.1em;">No items found</div>`;
    return;
  }
  grid.innerHTML = list.map(p => `
    <div class="product-card ${p.stock===0?'out-of-stock':''}" onclick="addToCart(${p.id})">
      <div class="product-img">${p.emoji}</div>
      <div class="product-actions">
        <div class="icon-btn" onclick="event.stopPropagation();openEditModal(${p.id})" title="Edit">✏</div>
        <div class="icon-btn del" onclick="event.stopPropagation();deleteProduct(${p.id})" title="Delete">✕</div>
      </div>
      <div class="stock-badge">${p.stock > 0 ? p.stock : 'OUT'}</div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-sub">${p.sub}</div>
        <div class="product-price">KES ${p.price.toLocaleString()}</div>
      </div>
    </div>
  `).join('');
}

// ─── CART ─────────────────────────────────────────────────
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
  toast(`${p.emoji} ${p.name} added`);
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
  document.getElementById('cartCount').textContent = cart.reduce((s,i) => s+i.qty, 0);
  if (!cart.length) {
    container.innerHTML = `<div class="cart-empty"><div class="cart-empty-icon">🛍</div><div class="cart-empty-text">Cart is empty</div></div>`;
  } else {
    container.innerHTML = cart.map(item => `
      <div class="cart-item">
        <span class="cart-item-emoji">${item.emoji}</span>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">KES ${(item.price * item.qty).toLocaleString()}</div>
        </div>
        <div class="qty-ctrl">
          <div class="qty-btn" onclick="changeQty(${item.id},-1)">−</div>
          <span class="qty-num">${item.qty}</span>
          <div class="qty-btn" onclick="changeQty(${item.id},1)">+</div>
        </div>
        <div class="remove-btn" onclick="removeFromCart(${item.id})">✕</div>
      </div>
    `).join('');
  }
  recalc();
}

function recalc() {
  const sub = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const dRaw = document.getElementById('discountInput').value.trim();
  let disc = 0;
  if (dRaw.endsWith('%')) {
    disc = sub * (parseFloat(dRaw) / 100) || 0;
  } else {
    disc = parseFloat(dRaw) || 0;
  }
  disc = Math.min(disc, sub);
  discountAmt = disc;
  const afterDisc = sub - disc;
  const vat = afterDisc * 0.16;
  const total = afterDisc + vat;

  document.getElementById('subtotal').textContent = `KES ${sub.toLocaleString()}`;
  document.getElementById('discountRow').style.display = disc > 0 ? 'flex' : 'none';
  document.getElementById('discountVal').textContent = `− KES ${disc.toLocaleString()}`;
  document.getElementById('vatVal').textContent = `KES ${Math.round(vat).toLocaleString()}`;
  document.getElementById('totalVal').textContent = `KES ${Math.round(total).toLocaleString()}`;
  document.getElementById('checkoutBtn').disabled = cart.length === 0;
}

// ─── ADD / EDIT MODAL ────────────────────────────────────
function openAddModal() {
  editingId = null;
  document.getElementById('modalTitle').textContent = 'New Item';
  document.getElementById('saveItemBtn').textContent = 'Save Item';
  ['f_name','f_price','f_stock','f_emoji'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('f_cat').value = '';
  document.getElementById('f_sub').innerHTML = '<option value="">— Select —</option>';
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
  document.getElementById('f_emoji').value = p.emoji;
  document.getElementById('f_cat').value = p.cat;
  updateSubcats();
  setTimeout(() => document.getElementById('f_sub').value = p.sub, 10);
  document.getElementById('itemModal').style.display = 'flex';
}

function closeItemModal() {
  document.getElementById('itemModal').style.display = 'none';
}

function updateSubcats() {
  const cat = document.getElementById('f_cat').value;
  const sub = document.getElementById('f_sub');
  sub.innerHTML = '<option value="">— Select —</option>';
  if (cat && SUBCATS[cat]) {
    SUBCATS[cat].forEach(s => {
      const o = document.createElement('option');
      o.value = s; o.textContent = s;
      sub.appendChild(o);
    });
  }
}

function saveItem() {
  const name = document.getElementById('f_name').value.trim();
  const cat = document.getElementById('f_cat').value;
  const sub = document.getElementById('f_sub').value;
  const price = parseFloat(document.getElementById('f_price').value);
  const stock = parseInt(document.getElementById('f_stock').value);
  const emoji = document.getElementById('f_emoji').value.trim() || '🏷';

  if (!name || !cat || !sub || isNaN(price) || isNaN(stock)) {
    toast('⚠ Please fill all fields'); return;
  }

  if (editingId) {
    const p = products.find(x => x.id === editingId);
    Object.assign(p, { name, cat, sub, price, stock, emoji });
    toast(`✓ ${name} updated`);
  } else {
    products.push({ id: nextId++, name, cat, sub, price, stock, emoji });
    toast(`✓ ${name} added`);
  }

  closeItemModal();
  filterProducts();
  if (document.getElementById('inventoryView').classList.contains('active')) renderInventoryTable();
}

function deleteProduct(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  if (!confirm(`Remove "${p.name}" from inventory?`)) return;
  products = products.filter(x => x.id !== id);
  cart = cart.filter(x => x.id !== id);
  filterProducts();
  renderCart();
  if (document.getElementById('inventoryView').classList.contains('active')) renderInventoryTable();
  toast(`✓ ${p.name} removed`);
}

// ─── PAYMENT ─────────────────────────────────────────────
function openPayment() {
  const total = getTotal();
  document.getElementById('payAmount').textContent = Math.round(total).toLocaleString();
  document.getElementById('cashTendered').value = '';
  document.getElementById('changeVal').textContent = 'KES 0.00';
  buildNumpad();
  document.getElementById('paymentModal').style.display = 'flex';
  selectPayMethod('cash');
}

function closePayment() {
  document.getElementById('paymentModal').style.display = 'none';
}

function selectPayMethod(m) {
  payMethod = m;
  ['cash','card','mpesa'].forEach(x => {
    document.getElementById(`pm_${x}`).classList.toggle('active', x === m);
    const sec = document.getElementById(`${x}Section`);
    if (sec) sec.classList.toggle('visible', x === m);
  });
}

function getTotal() {
  const sub = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const afterDisc = sub - discountAmt;
  return afterDisc * 1.16;
}

function calcChange() {
  const total = getTotal();
  const tendered = parseFloat(document.getElementById('cashTendered').value) || 0;
  const change = tendered - total;
  document.getElementById('changeVal').textContent =
    `KES ${Math.max(0, change).toLocaleString(undefined, { minimumFractionDigits:2, maximumFractionDigits:2 })}`;
  document.getElementById('changeVal').style.color = change >= 0 ? 'var(--success)' : 'var(--danger)';
}

function buildNumpad() {
  const np = document.getElementById('numpad');
  const keys = ['1','2','3','4','5','6','7','8','9','0','⌫'];
  np.innerHTML = keys.map((k,i) =>
    `<button class="numpad-btn${k==='0'?' zero':''}" onclick="numpadPress('${k}')">${k}</button>`
  ).join('');
}

function numpadPress(k) {
  const inp = document.getElementById('cashTendered');
  if (k === '⌫') inp.value = inp.value.slice(0,-1);
  else inp.value += k;
  calcChange();
}

function completePayment() {
  if (payMethod === 'cash') {
    const total = getTotal();
    const tendered = parseFloat(document.getElementById('cashTendered').value) || 0;
    if (tendered < total) { toast('⚠ Insufficient cash tendered'); return; }
  }
  // Deduct stock
  cart.forEach(item => {
    const p = products.find(x => x.id === item.id);
    if (p) p.stock -= item.qty;
  });
  closePayment();
  showSuccess();
}

function showSuccess() {
  const customer = document.getElementById('customerName').value.trim() || 'Walk-in Customer';
  const lines = cart.map(i => `<div class="receipt-line"><span>${i.emoji} ${i.name} ×${i.qty}</span><span>KES ${(i.price*i.qty).toLocaleString()}</span></div>`).join('');
  const total = getTotal();
  document.getElementById('receiptLines').innerHTML = lines + `
    <div class="receipt-line total-line"><span>TOTAL PAID</span><span>KES ${Math.round(total).toLocaleString()}</span></div>
  `;
  document.getElementById('successSub').textContent = `Thank you, ${customer}!`;
  document.getElementById('successModal').style.display = 'flex';
}

function newTransaction() {
  document.getElementById('successModal').style.display = 'none';
  clearCart();
  document.getElementById('customerName').value = '';
  filterProducts();
}

// ─── INVENTORY TABLE ─────────────────────────────────────
function renderInventoryTable() {
  const tbody = document.getElementById('invTableBody');
  tbody.innerHTML = products.map(p => `
    <tr>
      <td class="td-name">${p.emoji} ${p.name}</td>
      <td><span class="badge badge-cat">${p.cat}</span></td>
      <td><span class="badge badge-sub">${p.sub}</span></td>
      <td class="td-price">KES ${p.price.toLocaleString()}</td>
      <td style="color:${p.stock<=3?'var(--danger)':'var(--text-dim)'}">${p.stock}</td>
      <td><div class="td-actions">
        <div class="icon-btn" onclick="openEditModal(${p.id})" title="Edit">✏</div>
        <div class="icon-btn del" onclick="deleteProduct(${p.id})" title="Delete">✕</div>
      </div></td>
    </tr>
  `).join('');
}

// ─── TOAST ───────────────────────────────────────────────
function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<span class="toast-dot"></span><span>${msg}</span>`;
  document.getElementById('toastContainer').appendChild(t);
  setTimeout(() => t.remove(), 2800);
}

// ─── INIT ────────────────────────────────────────────────
renderCatChips();
renderSubcats();
filterProducts();