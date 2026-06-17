
(function () {
  if (document.getElementById('tinahEnhCSS')) return;
  var s = document.createElement('style');
  s.id = 'tinahEnhCSS';
  s.textContent =
    '#rptTabRow{display:flex;gap:8px;padding:10px 20px 6px;flex-shrink:0;border-bottom:1px solid var(--border);margin-bottom:4px}' +
    '.rpt-view-btn{padding:6px 18px;border-radius:20px;border:1px solid var(--border);background:var(--card);color:var(--text-faint);cursor:pointer;font-size:11px;letter-spacing:.08em;text-transform:uppercase;font-family:inherit;transition:all .15s}' +
    '.rpt-view-btn.active{background:var(--gold);border-color:var(--gold);color:#1a1208;font-weight:700}' +
    '#txnLogSection{padding:0 20px 24px}' +
    '.txn-summary-bar{display:flex;flex-wrap:wrap;background:var(--card);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:16px}' +
    '.txn-ss{flex:1;min-width:95px;padding:12px 14px;border-right:1px solid var(--border);text-align:center}' +
    '.txn-ss:last-child{border-right:none}' +
    '.txn-ss-lbl{font-size:10px;letter-spacing:.1em;color:var(--text-faint);margin-bottom:3px;text-transform:uppercase}' +
    '.txn-ss-val{font-size:15px;font-weight:700;font-family:"Cormorant Garamond",serif;color:var(--text)}' +
    '.txn-ss-val.gold{color:var(--gold)}' +
    '.txn-filters{display:flex;flex-direction:column;gap:10px;margin-bottom:14px}' +
    '.txn-pills{display:flex;gap:6px;flex-wrap:wrap}' +
    '.txn-pill{padding:5px 14px;border-radius:20px;border:1px solid var(--border);background:var(--card);color:var(--text-faint);cursor:pointer;font-size:11px;letter-spacing:.06em;font-family:inherit;transition:all .15s}' +
    '.txn-pill.active{background:var(--gold);border-color:var(--gold);color:#1a1208;font-weight:700}' +
    '.txn-filter-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}' +
    '.txn-sel,.txn-txt,.txn-date{background:var(--card);border:1px solid var(--border);color:var(--text);padding:5px 10px;border-radius:var(--radius);font-size:12px;font-family:inherit}' +
    '.txn-date{padding:4px 8px}' +
    '.txn-tbl-wrap{overflow-x:auto;border-radius:var(--radius);border:1px solid var(--border)}' +
    '.txn-tbl{width:100%;border-collapse:collapse;font-size:12px}' +
    '.txn-tbl thead th{background:var(--card);padding:9px 12px;text-align:left;font-size:10px;letter-spacing:.1em;color:var(--text-faint);text-transform:uppercase;border-bottom:1px solid var(--border);white-space:nowrap}' +
    '.txn-tbl tbody tr{border-bottom:1px solid var(--border);transition:background .1s}' +
    '.txn-tbl tbody tr:hover{background:rgba(201,168,76,.04)}' +
    '.txn-tbl tbody td{padding:9px 12px;vertical-align:middle}' +
    '.txn-row-v td{opacity:.38}' +
    '.txn-badge{font-size:10px;padding:3px 8px;border-radius:20px;font-weight:600;letter-spacing:.06em;white-space:nowrap}' +
    '.b-ok{background:rgba(80,180,100,.15);color:var(--success)}' +
    '.b-void{background:rgba(220,60,60,.12);color:var(--danger)}' +
    '.b-pend{background:rgba(201,168,76,.15);color:var(--gold)}' +
    '.b-ret{background:rgba(180,140,60,.15);color:#d4902a}' +
    '.b-exch{background:rgba(91,138,181,.15);color:#5b8ab5}';
  document.head.appendChild(s);
})();

var _rptView = 'analytics';

function _injectReportTabs() {
  // Already injected?
  if (document.getElementById('rptTabRow')) return;

  var rv = document.getElementById('reportsView');
  if (!rv) return;

  // Tab row
  var row = document.createElement('div');
  row.id = 'rptTabRow';
  row.innerHTML =
    '<button id="rptBtnAna" class="rpt-view-btn active" onclick="_switchRptView(\'analytics\')">📊 Analytics</button>' +
    '<button id="rptBtnLog" class="rpt-view-btn"        onclick="_switchRptView(\'log\')">📋 Sales Log</button>';

  // Insert as first child of reportsView (before the toolbar)
  rv.insertBefore(row, rv.firstChild);

  // Sales log pane appended to the scroll area
  var scroll = rv.querySelector('.report-scroll');
  if (scroll && !document.getElementById('txnLogSection')) {
    var sec = document.createElement('div');
    sec.id = 'txnLogSection';
    sec.style.display = 'none';
    sec.innerHTML = '<div id="txnLogWrap"></div>';
    scroll.appendChild(sec);
  }
}

window._switchRptView = function (view) {
  _rptView = view;
  var isAna = (view === 'analytics');

  var anaBtn = document.getElementById('rptBtnAna');
  var logBtn = document.getElementById('rptBtnLog');
  if (anaBtn) anaBtn.classList.toggle('active',  isAna);
  if (logBtn) logBtn.classList.toggle('active', !isAna);

  // Hide/show analytics content (everything in .report-scroll except txnLogSection)
  var scroll = document.querySelector('#reportsView .report-scroll');
  if (scroll) {
    Array.prototype.slice.call(scroll.children).forEach(function (el) {
      if (el.id === 'txnLogSection') return;
      el.style.display = isAna ? '' : 'none';
    });
  }

  var sec = document.getElementById('txnLogSection');
  if (sec) sec.style.display = isAna ? 'none' : '';

  if (!isAna) renderTxnLog();
};

// Patch renderReports to inject tabs then run normally
(function () {
  var _orig = window.renderReports;
  window.renderReports = function () {
    _injectReportTabs();
    // If we're on the Sales Log tab, keep analytics hidden after re-render
    if (_rptView === 'log') {
      if (typeof _orig === 'function') _orig();
      // re-hide analytics content
      var scroll = document.querySelector('#reportsView .report-scroll');
      if (scroll) {
        Array.prototype.slice.call(scroll.children).forEach(function (el) {
          if (el.id === 'txnLogSection') return;
          el.style.display = 'none';
        });
      }
      var sec = document.getElementById('txnLogSection');
      if (sec) sec.style.display = '';
      renderTxnLog();
    } else {
      if (typeof _orig === 'function') _orig();
    }
  };
})();

var _LS_ORDERS = 'tinah_web_orders';

function _getOrders() {
  try { var v = localStorage.getItem(_LS_ORDERS); return v ? JSON.parse(v) : []; } catch(e) { return []; }
}
function _saveOrders(o) {
  try { localStorage.setItem(_LS_ORDERS, JSON.stringify(o)); } catch(e) {}
}
function _ordersHash(orders) {
  return orders.map(function(o){ return o.id+':'+o.status; }).join('|');
}
function _updateBadge(orders) {
  if (!orders) orders = _getOrders();
  var pending = orders.filter(function(o){ return o.status==='pending'; }).length;
  var badge = document.getElementById('onlineOrdersBadge');
  if (badge) { badge.textContent = pending; badge.style.display = pending>0?'inline-flex':'none'; }
  var tab = document.getElementById('onlineOrdersTab');
  if (tab) tab.style.color = pending>0?'var(--gold)':'';
}

// ── Live refresh while Orders tab is open ─────────────────────────
var _liveInterval = null;
var _lastHash = '';

function _startLive() {
  if (_liveInterval) return;
  _liveInterval = setInterval(function () {
    var orders = _getOrders();
    var hash   = _ordersHash(orders);
    _updateBadge(orders);
    if (hash !== _lastHash) {
      _lastHash = hash;
      _doRenderOrders(orders);
    }
  }, 5000);
}
function _stopLive() {
  if (_liveInterval) { clearInterval(_liveInterval); _liveInterval = null; }
}

// ── Core render ───────────────────────────────────────────────────
function _doRenderOrders(orders) {
  var cur   = (storeConfig && storeConfig.currency) ? storeConfig.currency : 'KES';
  var empty = document.getElementById('onlineOrdersEmpty');
  var list  = document.getElementById('onlineOrdersList');
  if (!list) return;

  if (!orders || !orders.length) {
    if (empty) empty.style.display = 'block';
    list.innerHTML = '';
    return;
  }
  if (empty) empty.style.display = 'none';

  var sorted = orders.slice().sort(function(a,b){
    if (a.status==='pending' && b.status!=='pending') return -1;
    if (b.status==='pending' && a.status!=='pending') return  1;
    return new Date(b.placedAt||b.date||0) - new Date(a.placedAt||a.date||0);
  });

  var SC = { pending:'var(--gold)', confirmed:'var(--success)', dispatched:'#5b8ab5', cancelled:'var(--danger)' };
  var SL = { pending:'⏳ Pending', confirmed:'✓ Confirmed', dispatched:'🚚 Dispatched', cancelled:'✗ Cancelled' };

  list.innerHTML = sorted.map(function(o) {
    var placedAt = o.placedAt || o.date || new Date().toISOString();
    var date = new Date(placedAt).toLocaleString('en-KE',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
    var sc = SC[o.status]||'var(--text-faint)';
    var sl = SL[o.status]||o.status;

    var itemsHTML = (o.items||[]).map(function(i){
      return '<div style="font-size:11px;color:var(--text-dim);padding:2px 0">'+
        i.name+(i.size?' ('+(i.colour||'')+' '+i.size+')':'')+' \xd7 '+i.qty+
        '<span style="float:right;color:var(--gold)">'+cur+' '+(i.price*i.qty).toLocaleString()+'</span></div>';
    }).join('');

    var txnBtn = o.txnId
      ? '<button class="btn-outline" style="font-size:11px;padding:5px 12px" onclick="showReceiptModal(\''+o.txnId+'\')">🧾 Receipt</button>'
      : '';

    var actions = '';
    if (o.status === 'pending') {
      actions =
        '<button class="btn-gold"   style="flex:1;padding:8px" onclick="confirmWebOrder(\''+o.id+'\')">✓ Confirm &amp; Record Sale</button>'+
        '<button class="btn-cancel" style="flex:1;padding:8px" onclick="cancelWebOrder(\''+o.id+'\')">✗ Cancel</button>';
    } else if (o.status === 'confirmed') {
      actions =
        '<button class="btn-gold" style="flex:1;padding:8px" onclick="dispatchWebOrder(\''+o.id+'\')">🚚 Mark Dispatched</button>'+
        txnBtn;
    } else {
      actions = txnBtn || '<span style="font-size:11px;color:var(--text-faint)">No further actions</span>';
    }

    return '<div class="online-order-card" id="order-'+o.id+'">'+
      '<div class="online-order-header">'+
        '<div>'+
          '<div class="online-order-id">'+o.id+'</div>'+
          '<div class="online-order-date">'+date+'</div>'+
          (o.txnId?'<div style="font-size:10px;color:var(--text-faint);margin-top:2px">Sale ref: '+o.txnId+'</div>':'')+
        '</div>'+
        '<span style="font-size:11px;font-weight:700;letter-spacing:.06em;color:'+sc+'">'+sl+'</span>'+
      '</div>'+
      '<div class="online-order-customer">'+
        '<div style="font-size:13px;font-weight:600">'+o.customer+'</div>'+
        '<div style="font-size:11px;color:var(--text-faint)">'+(o.phone||'')+' · '+(o.address||'')+', '+(o.city||'')+'</div>'+
        '<div style="font-size:11px;color:var(--text-faint);text-transform:uppercase;letter-spacing:.06em">'+(o.payMethod||'')+'</div>'+
      '</div>'+
      '<div class="online-order-items">'+itemsHTML+'</div>'+
      '<div class="online-order-total">'+
        '<span style="font-size:11px;color:var(--text-faint)">Delivery: '+cur+' '+((o.delivery||0)).toLocaleString()+'</span>'+
        '<span style="font-family:\'Cormorant Garamond\',serif;font-size:18px;color:var(--gold)">'+cur+' '+(o.total||0).toLocaleString()+'</span>'+
      '</div>'+
      '<div class="online-order-actions">'+actions+'</div>'+
    '</div>';
  }).join('');
}

// ── Public API ────────────────────────────────────────────────────
window.renderOnlineOrders = function () {
  var orders = _getOrders();
  _lastHash  = _ordersHash(orders);
  _doRenderOrders(orders);
  _updateBadge(orders);
};

window.confirmWebOrder = function (id) {
  var orders = _getOrders();
  var o = orders.find(function(x){ return x.id===id; });
  if (!o) return;
  if (o.status !== 'pending') { toast('⚠ Order already processed'); return; }

  // Deduct stock
  var warns = [];
  (o.items||[]).forEach(function(item) {
    var p = products.find(function(x){ return x.id===item.id; });
    if (!p) { warns.push(item.name+' (not found)'); return; }
    if (p.stock < item.qty) warns.push(item.name+' (low stock)');
    p.stock = Math.max(0, p.stock - item.qty);
  });

  // Build transaction
  var vr       = storeConfig.vat_rate || 0.16;
  var subtotal = (o.items||[]).reduce(function(s,i){ return s+i.price*i.qty; }, 0);
  var delivery = o.delivery || 0;
  var vat      = Math.round(subtotal * vr);
  var total    = Math.round(subtotal + vat + delivery);

  var txn = {
    id:         'TXN-'+Date.now().toString(36).toUpperCase(),
    date:       new Date().toISOString(),
    customer:   o.customer,
    cashier:    activeCashier ? activeCashier.name : 'Online Order',
    cashier_id: activeCashier ? activeCashier.id   : null,
    items:      (o.items||[]).map(function(i){ return {id:i.id,name:i.name,sku:i.sku||'',emoji:'🛍',price:i.price,qty:i.qty}; }),
    subtotal:   subtotal, discount:0, vat:vat, total:total,
    payMethod:  o.payMethod||'cash',
    tendered:null, change:null, mpesaPhone:o.phone||null,
    status:'complete', returns:[], source:'web', webOrderId:o.id, deliveryFee:delivery
  };

  transactions.unshift(txn);
  if (activeSession) { activeSession.sales++; activeSession.revenue+=txn.total; lsSet('tinah_sessions',allSessions); }
  lsSet('tinah_products', products);
  lsSet('tinah_transactions', transactions);

  o.status='confirmed'; o.confirmedAt=new Date().toISOString();
  o.confirmedBy=activeCashier?activeCashier.name:'System'; o.txnId=txn.id;
  _saveOrders(orders);
  _lastHash = _ordersHash(orders);
  _doRenderOrders(orders);
  _updateBadge(orders);

  toast(warns.length
    ? '✓ Confirmed — ⚠ '+warns.join(', ')
    : '✓ Order #'+id+' confirmed & sale recorded · '+txn.id);
};

window.dispatchWebOrder = function (id) {
  var orders = _getOrders();
  var o = orders.find(function(x){ return x.id===id; });
  if (!o) return;
  o.status='dispatched'; o.dispatchedAt=new Date().toISOString();
  _saveOrders(orders);
  _lastHash = _ordersHash(orders);
  _doRenderOrders(orders);
  _updateBadge(orders);
  toast('🚚 Order #'+id+' dispatched');
};

window.cancelWebOrder = function (id) {
  if (!confirm('Cancel order '+id+'?')) return;
  var orders = _getOrders();
  var o = orders.find(function(x){ return x.id===id; });
  if (!o) return;
  o.status='cancelled'; o.cancelledAt=new Date().toISOString();
  _saveOrders(orders);
  _lastHash = _ordersHash(orders);
  _doRenderOrders(orders);
  _updateBadge(orders);
  toast('✗ Order '+id+' cancelled');
};

// ── Wrap switchView to handle orders tab ──────────────────────────
(function () {
  var _orig = window.switchView;
  window.switchView = function (v) {
    if (typeof _orig === 'function') _orig(v);
    if (v === 'orders') {
      // Render immediately then start live refresh
      window.renderOnlineOrders();
      _startLive();
    } else {
      _stopLive();
    }
    if (v === 'reports') {
      // Inject tabs now that reportsView is visible
      _injectReportTabs();
    }
  };
})();

// ── Background badge poller ───────────────────────────────────────
(function () {
  if (window._ordersInterval) clearInterval(window._ordersInterval);
  var _lastPending = -1;
  function tick() {
    var orders  = _getOrders();
    var pending = orders.filter(function(o){ return o.status==='pending'; }).length;
    _updateBadge(orders);
    if (pending > _lastPending && _lastPending >= 0 && typeof toast==='function') {
      var diff = pending - _lastPending;
      toast('🛍 '+diff+' new online order'+(diff>1?'s':'')+' received!');
    }
    _lastPending = pending;
  }
  setTimeout(tick, 2000);
  window._ordersInterval = setInterval(tick, 15000);
  window.checkOnlineOrdersBadge = tick;
  window.manualRefreshOrders = function () {
    window.renderOnlineOrders(); tick();
    if (typeof toast==='function') toast('✓ Orders refreshed');
  };
})();

var _tlPeriod='month', _tlMonth='', _tlYear='', _tlCashier='all', _tlPay='all', _tlSearch='';
window.setTxnPeriod = function(p){ _tlPeriod=p; renderTxnLog(); };

function _startOfDay(d){ return new Date(d.getFullYear(),d.getMonth(),d.getDate()); }

function _periodBounds(){
  var now=new Date(), today=_startOfDay(now);
  if (_tlPeriod==='today') return {from:today, to:new Date(today.getTime()+86400000)};
  if (_tlPeriod==='week')  return {from:new Date(today.getTime()-6*86400000), to:new Date(today.getTime()+86400000)};
  if (_tlPeriod==='month'){
    var m=(_tlMonth||now.toISOString().slice(0,7)).split('-');
    return {from:new Date(+m[0],+m[1]-1,1), to:new Date(+m[0],+m[1],1)};
  }
  if (_tlPeriod==='year'){
    var y=parseInt(_tlYear||now.getFullYear());
    return {from:new Date(y,0,1), to:new Date(y+1,0,1)};
  }
  if (_tlPeriod==='custom'){
    var fe=document.getElementById('txnLogFrom'), te=document.getElementById('txnLogTo');
    var fp=(fe&&fe.value?fe.value:'2000-01-01').split('-');
    var tp=(te&&te.value?te.value:'2099-12-31').split('-');
    return {from:new Date(+fp[0],+fp[1]-1,+fp[2]), to:new Date(+tp[0],+tp[1]-1,+tp[2]+1)};
  }
  return {from:today, to:new Date(today.getTime()+86400000)};
}

function _getTxns(){
  try{ var r=localStorage.getItem('tinah_transactions'); if(r) return JSON.parse(r); }catch(e){}
  return (typeof transactions!=='undefined')?transactions:[];
}

function _filteredTxns(){
  var b=_periodBounds(), txns=_getTxns();
  return txns.filter(function(t){
    if(t.status==='failed') return false;
    var d=new Date(t.date);
    if(d<b.from||d>=b.to) return false;
    if(_tlCashier!=='all'&&t.cashier!==_tlCashier) return false;
    if(_tlPay!=='all'&&t.payMethod!==_tlPay) return false;
    if(_tlSearch){
      var q=_tlSearch.toLowerCase();
      if(!t.id.toLowerCase().includes(q)&&!t.customer.toLowerCase().includes(q)&&
         !(t.cashier||'').toLowerCase().includes(q)&&
         !t.items.some(function(i){return i.name.toLowerCase().includes(q);})) return false;
    }
    return true;
  });
}

window.renderTxnLog = function(){
  var wrap=document.getElementById('txnLogWrap'); if(!wrap) return;
  var list=_filteredTxns();
  var cur=(typeof storeConfig!=='undefined'&&storeConfig.currency)?storeConfig.currency:'KES';

  var cash=0,card=0,mpesa=0,grand=0,units=0,rets=0,voids=0;
  list.forEach(function(t){
    if(t.status==='voided'){voids++;return;}
    if(t.status==='pending') return;
    grand+=t.total; units+=t.items.reduce(function(s,i){return s+i.qty;},0);
    if(t.returns&&t.returns.length) rets++;
    if(t.payMethod==='cash')  cash+=t.total;
    if(t.payMethod==='card')  card+=t.total;
    if(t.payMethod==='mpesa') mpesa+=t.total;
  });
  var count=list.filter(function(t){return t.status!=='voided'&&t.status!=='pending';}).length;

  // Period label
  var b=_periodBounds();
  var fd=function(d,o){return d.toLocaleDateString('en-KE',o);};
  var lbl='';
  if(_tlPeriod==='today') lbl=fd(b.from,{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  else if(_tlPeriod==='week') lbl=fd(b.from,{day:'numeric',month:'short'})+' \u2013 '+fd(new Date(b.to.getTime()-1),{day:'numeric',month:'short',year:'numeric'});
  else if(_tlPeriod==='month'){var mp=(_tlMonth||new Date().toISOString().slice(0,7)).split('-');lbl=new Date(+mp[0],+mp[1]-1,1).toLocaleDateString('en-KE',{month:'long',year:'numeric'});}
  else if(_tlPeriod==='year') lbl=_tlYear||String(new Date().getFullYear());
  else lbl='Custom range';

  var allT=_getTxns(), cnames=[];
  allT.forEach(function(t){if(t.cashier&&cnames.indexOf(t.cashier)<0) cnames.push(t.cashier);}); cnames.sort();
  var curM=_tlMonth||new Date().toISOString().slice(0,7), curY=_tlYear||String(new Date().getFullYear());

  var extra='';
  if(voids) extra+='<div class="txn-ss"><div class="txn-ss-lbl" style="color:var(--danger)">Voided</div><div class="txn-ss-val" style="color:var(--danger)">'+voids+'</div></div>';
  if(rets)  extra+='<div class="txn-ss"><div class="txn-ss-lbl">Returns</div><div class="txn-ss-val">'+rets+'</div></div>';

  var html=
    '<div style="font-size:11px;color:var(--text-faint);letter-spacing:.08em;margin-bottom:10px;text-transform:uppercase">'+lbl+'</div>'+
    '<div class="txn-summary-bar">'+
    '<div class="txn-ss"><div class="txn-ss-lbl">Total Revenue</div><div class="txn-ss-val gold">'+cur+' '+grand.toLocaleString()+'</div></div>'+
    '<div class="txn-ss"><div class="txn-ss-lbl">\uD83D\uDCB5 Cash</div><div class="txn-ss-val">'+cur+' '+cash.toLocaleString()+'</div></div>'+
    '<div class="txn-ss"><div class="txn-ss-lbl">\uD83D\uDCB3 Card</div><div class="txn-ss-val">'+cur+' '+card.toLocaleString()+'</div></div>'+
    '<div class="txn-ss"><div class="txn-ss-lbl">\uD83D\uDCF1 M-Pesa</div><div class="txn-ss-val">'+cur+' '+mpesa.toLocaleString()+'</div></div>'+
    '<div class="txn-ss"><div class="txn-ss-lbl">Transactions</div><div class="txn-ss-val">'+count+'</div></div>'+
    '<div class="txn-ss"><div class="txn-ss-lbl">Units Sold</div><div class="txn-ss-val">'+units+'</div></div>'+
    extra+'</div>';

  var pills=['today','week','month','year','custom'].map(function(p){
    return '<button class="txn-pill'+(_tlPeriod===p?' active':'')+'" onclick="setTxnPeriod(\''+p+'\')">'+p.charAt(0).toUpperCase()+p.slice(1)+'</button>';
  }).join('');

  html+='<div class="txn-filters">'+
    '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">'+
    '<div class="txn-pills">'+pills+'</div>'+
    '<div style="display:'+(_tlPeriod==='month'?'flex':'none')+';align-items:center;gap:6px">'+
    '<input type="month" class="txn-date" value="'+curM+'" onchange="_tlMonth=this.value;renderTxnLog()"></div>'+
    '<div style="display:'+(_tlPeriod==='year'?'flex':'none')+';align-items:center;gap:6px">'+
    '<select class="txn-sel" onchange="_tlYear=this.value;renderTxnLog()">'+
    [2023,2024,2025,2026].map(function(y){return '<option value="'+y+'"'+(curY===String(y)?' selected':'')+'>'+y+'</option>';}).join('')+
    '</select></div>'+
    '<div style="display:'+(_tlPeriod==='custom'?'flex':'none')+';align-items:center;gap:6px">'+
    '<input type="date" id="txnLogFrom" class="txn-date" onchange="renderTxnLog()">'+
    '<span style="color:var(--text-faint)">\u2192</span>'+
    '<input type="date" id="txnLogTo"   class="txn-date" onchange="renderTxnLog()">'+
    '</div></div>'+
    '<div class="txn-filter-row">'+
    '<select class="txn-sel" onchange="_tlCashier=this.value;renderTxnLog()">'+
    '<option value="all">All Cashiers</option>'+
    cnames.map(function(n){return '<option value="'+n+'"'+(_tlCashier===n?' selected':'')+'>'+n+'</option>';}).join('')+
    '</select>'+
    '<select class="txn-sel" onchange="_tlPay=this.value;renderTxnLog()">'+
    '<option value="all">All Payments</option>'+
    '<option value="cash"'+(_tlPay==='cash'?' selected':'')+'>Cash</option>'+
    '<option value="card"'+(_tlPay==='card'?' selected':'')+'>Card</option>'+
    '<option value="mpesa"'+(_tlPay==='mpesa'?' selected':'')+'>M-Pesa</option>'+
    '</select>'+
    '<input type="text" class="txn-txt" placeholder="Search receipt, customer, item\u2026" value="'+_tlSearch.replace(/"/g,'&quot;')+'" oninput="_tlSearch=this.value;renderTxnLog()" style="flex:1;min-width:160px">'+
    '<button onclick="exportTxnLogCSV()" class="btn-outline" style="font-size:11px;padding:5px 14px;white-space:nowrap">\u2B07 Export CSV</button>'+
    '</div></div>';

  if(!list.length){
    html+='<div style="text-align:center;padding:56px;color:var(--text-faint);font-size:12px;letter-spacing:.08em">'+
      'No transactions found for this period.<br>'+
      '<span style="font-size:11px;display:block;margin-top:6px">Try <strong>Week</strong> or <strong>Month</strong>.</span></div>';
  } else {
    var sorted=list.slice().sort(function(a,b){return new Date(b.date)-new Date(a.date);});
    var bcls={complete:'b-ok',voided:'b-void',pending:'b-pend',returned:'b-ret',exchanged:'b-exch'};
    var blbl={complete:'\u2713 Paid',voided:'\uD83D\uDEAB Voided',pending:'\u23F3 Pending',returned:'\u21A9 Returned',exchanged:'\uD83D\uDD04 Exchanged'};
    var mgr=typeof isManager==='function'&&isManager();
    var pmLabel={cash:'Cash',card:'Card',mpesa:'M-Pesa'};

    html+='<div class="txn-tbl-wrap"><table class="txn-tbl"><thead><tr>'+
      '<th>Time</th><th>Receipt #</th><th>Customer</th><th>Cashier</th>'+
      '<th>Items</th><th>Payment</th><th style="text-align:right">Total</th><th>Status</th><th></th>'+
      '</tr></thead><tbody>';

    sorted.forEach(function(t){
      var d=new Date(t.date);
      var time=d.toLocaleTimeString('en-KE',{hour:'2-digit',minute:'2-digit'});
      var date=d.toLocaleDateString('en-KE',{weekday:'short',day:'numeric',month:'short'});
      var pm=t.payMethod||'cash';
      var sum=t.items.slice(0,2).map(function(i){return i.name+' \xd7'+i.qty;}).join(', ')+(t.items.length>2?' +'+(t.items.length-2)+' more':'');
      var full=t.items.map(function(i){return i.name+' \xd7'+i.qty;}).join(', ');
      var vBtn=(t.status==='complete'&&mgr)?'<div class="icon-btn" onclick="openVoidModal(\''+t.id+'\')" title="Void">\uD83D\uDEAB</div>':'';
      var webTag=t.source==='web'?'<span style="font-size:9px;background:rgba(91,138,181,.2);color:#5b8ab5;border-radius:3px;padding:1px 5px;margin-left:4px">WEB</span>':'';
      var totClr=t.status==='voided'?'var(--text-faint)':'var(--gold)';

      html+='<tr class="'+(t.status==='voided'?'txn-row-v':'')+'">'+
        '<td><div style="font-weight:600;font-size:12px;color:var(--text)">'+time+'</div><div style="font-size:10px;color:var(--text-faint)">'+date+'</div></td>'+
        '<td style="font-family:\'Courier New\',monospace;font-size:10px;color:var(--gold)">'+t.id+webTag+'</td>'+
        '<td style="font-size:12px">'+t.customer+'</td>'+
        '<td style="font-size:12px;color:var(--text-dim)">'+(t.cashier||'\u2014')+'</td>'+
        '<td style="font-size:11px;color:var(--text-dim);max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="'+full+'">'+sum+'</td>'+
        '<td style="font-size:11px;color:var(--text-dim)">'+(pmLabel[pm]||pm)+'</td>'+
        '<td style="text-align:right;font-weight:700;font-size:14px;font-family:\'Cormorant Garamond\',serif;color:'+totClr+'">'+cur+' '+t.total.toLocaleString()+'</td>'+
        '<td><span class="txn-badge '+(bcls[t.status]||'b-ok')+'">'+(blbl[t.status]||t.status)+'</span></td>'+
        '<td><div style="display:flex;gap:4px"><div class="icon-btn" onclick="showReceiptModal(\''+t.id+'\')" title="Receipt">\uD83E\uDDFE</div>'+vBtn+'</div></td></tr>';
    });
    html+='</tbody></table></div>';
  }
  wrap.innerHTML=html;
};

window.exportTxnLogCSV=function(){
  var list=_filteredTxns(), cur=(typeof storeConfig!=='undefined'&&storeConfig.currency)?storeConfig.currency:'KES';
  var rows=[['Date','Time','Receipt ID','Customer','Cashier','Items','Payment','Subtotal','Discount','VAT','Total','Status','Source']];
  list.forEach(function(t){
    var d=new Date(t.date);
    rows.push([d.toLocaleDateString('en-KE'),d.toLocaleTimeString('en-KE',{hour:'2-digit',minute:'2-digit'}),
      t.id,t.customer,t.cashier||'',t.items.map(function(i){return i.name+' x'+i.qty;}).join(' | '),
      t.payMethod,t.subtotal||0,t.discount||0,t.vat||0,t.total,t.status,t.source||'pos']);
  });
  var csv=rows.map(function(r){return r.map(function(c){return '"'+String(c||'').replace(/"/g,'""')+'"';}).join(',');}).join('\n');
  var blob=new Blob([csv],{type:'text/csv'});
  var a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='tinah-sales-'+_tlPeriod+(_tlPeriod==='month'?'-'+_tlMonth:_tlPeriod==='year'?'-'+_tlYear:'')+'.csv';
  a.click(); toast('✓ CSV downloaded');
};