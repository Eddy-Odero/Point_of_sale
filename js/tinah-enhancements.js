// ═══════════════════════════════════════════════════════════════════
//  TINAH POS — ENHANCEMENTS v6
//  Fixed: online orders poller no longer interferes with rendering
//  Fixed: revenue = all payment methods
//  Fixed: week = rolling 7 days
// ═══════════════════════════════════════════════════════════════════

// ── CSS ───────────────────────────────────────────────────────────────
(function () {
  if (document.getElementById('tinahEnhCSS')) return;
  var s = document.createElement('style');
  s.id = 'tinahEnhCSS';
  s.textContent =
    '.rpt-view-btn{padding:6px 16px;border-radius:20px;border:1px solid var(--border);background:var(--card);color:var(--text-faint);cursor:pointer;font-size:11px;letter-spacing:.08em;text-transform:uppercase;font-family:inherit;transition:all .15s}' +
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
    '.b-ok  {background:rgba(80,180,100,.15);color:var(--success)}' +
    '.b-void{background:rgba(220,60,60,.12);color:var(--danger)}' +
    '.b-pend{background:rgba(201,168,76,.15);color:var(--gold)}' +
    '.b-ret {background:rgba(180,140,60,.15);color:#d4902a}' +
    '.b-exch{background:rgba(91,138,181,.15);color:#5b8ab5}';
  document.head.appendChild(s);
})();

// ── One-time DOM setup ────────────────────────────────────────────────
var _rptSetup = false;
function setupReportPanels() {
  if (_rptSetup) return;

  var toolbarRight = document.querySelector('#reportsView .report-toolbar-right');
  if (toolbarRight) {
    var sep = document.createElement('span');
    sep.style.cssText = 'width:1px;background:var(--border);height:20px;display:inline-block;margin:0 4px;vertical-align:middle';
    toolbarRight.insertBefore(sep, toolbarRight.firstChild);

    var logBtn = document.createElement('button');
    logBtn.id = 'rptBtnLog';
    logBtn.className = 'rpt-view-btn';
    logBtn.textContent = '📋 Sales Log';
    logBtn.onclick = function () { showRptView('log'); };
    toolbarRight.insertBefore(logBtn, toolbarRight.firstChild);

    var anaBtn = document.createElement('button');
    anaBtn.id = 'rptBtnAna';
    anaBtn.className = 'rpt-view-btn active';
    anaBtn.textContent = '📊 Analytics';
    anaBtn.onclick = function () { showRptView('analytics'); };
    toolbarRight.insertBefore(anaBtn, toolbarRight.firstChild);
  }

  var scroll = document.querySelector('#reportsView .report-scroll');
  if (scroll) {
    var sec = document.createElement('div');
    sec.id = 'txnLogSection';
    sec.style.display = 'none';
    sec.innerHTML = '<div id="txnLogWrap"></div>';
    scroll.appendChild(sec);
  }

  _rptSetup = true;
}

// ── Switch views ──────────────────────────────────────────────────────
var _rptView = 'analytics';
window.showRptView = function (view) {
  _rptView = view;
  var isAna = view === 'analytics';
  var anaBtn = document.getElementById('rptBtnAna');
  var logBtn = document.getElementById('rptBtnLog');
  if (anaBtn) anaBtn.classList.toggle('active',  isAna);
  if (logBtn) logBtn.classList.toggle('active', !isAna);

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

// ── Patch renderReports ───────────────────────────────────────────────
(function () {
  var _orig = window.renderReports;
  window.renderReports = function () {
    setupReportPanels();
    if (typeof _orig === 'function') _orig();
    if (_rptView === 'log') renderTxnLog();
  };
})();

// ── Sales Log state ───────────────────────────────────────────────────
var _tlPeriod  = 'today';
var _tlMonth   = '';
var _tlYear    = '';
var _tlCashier = 'all';
var _tlPay     = 'all';
var _tlSearch  = '';

window.setTxnPeriod = function (p) { _tlPeriod = p; renderTxnLog(); };

function _startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function _periodBounds() {
  var now   = new Date();
  var today = _startOfDay(now);

  if (_tlPeriod === 'today') {
    return { from: today, to: new Date(today.getTime() + 86400000) };
  }
  if (_tlPeriod === 'week') {
    // Rolling 7 days — never misses sales regardless of which day it is
    return { from: new Date(today.getTime() - 6 * 86400000), to: new Date(today.getTime() + 86400000) };
  }
  if (_tlPeriod === 'month') {
    var m  = (_tlMonth || now.toISOString().slice(0,7)).split('-');
    var yr = parseInt(m[0]), mo = parseInt(m[1]) - 1;
    return { from: new Date(yr, mo, 1), to: new Date(yr, mo + 1, 1) };
  }
  if (_tlPeriod === 'year') {
    var y = parseInt(_tlYear || now.getFullYear());
    return { from: new Date(y, 0, 1), to: new Date(y + 1, 0, 1) };
  }
  if (_tlPeriod === 'custom') {
    var fe = document.getElementById('txnLogFrom');
    var te = document.getElementById('txnLogTo');
    var fp = (fe && fe.value ? fe.value : '2000-01-01').split('-');
    var tp = (te && te.value ? te.value : '2099-12-31').split('-');
    return {
      from: new Date(+fp[0], +fp[1]-1, +fp[2]),
      to:   new Date(+tp[0], +tp[1]-1, +tp[2]+1)
    };
  }
  return { from: today, to: new Date(today.getTime() + 86400000) };
}

function _filteredTxns() {
  var b = _periodBounds();
  return transactions.filter(function (t) {
    if (t.status === 'failed') return false;
    var d = new Date(t.date);
    if (d < b.from || d >= b.to) return false;
    if (_tlCashier !== 'all' && t.cashier   !== _tlCashier) return false;
    if (_tlPay     !== 'all' && t.payMethod !== _tlPay)     return false;
    if (_tlSearch) {
      var q = _tlSearch.toLowerCase();
      if (!t.id.toLowerCase().includes(q) &&
          !t.customer.toLowerCase().includes(q) &&
          !(t.cashier||'').toLowerCase().includes(q) &&
          !t.items.some(function(i){ return i.name.toLowerCase().includes(q); }))
        return false;
    }
    return true;
  });
}

window.renderTxnLog = function () {
  var wrap = document.getElementById('txnLogWrap');
  if (!wrap) return;

  var list = _filteredTxns();
  var cur  = storeConfig.currency || 'KES';

  // Revenue = sum of all completed transactions (all payment methods)
  var cash=0, card=0, mpesa=0, grand=0, units=0, rets=0, voids=0;
  list.forEach(function (t) {
    if (t.status === 'voided')  { voids++; return; }
    if (t.status === 'pending') return;
    grand += t.total;                                    // ← all methods
    units += t.items.reduce(function(s,i){ return s+i.qty; }, 0);
    if (t.returns && t.returns.length) rets++;
    if (t.payMethod==='cash')  cash  += t.total;        // breakdown
    if (t.payMethod==='card')  card  += t.total;
    if (t.payMethod==='mpesa') mpesa += t.total;
  });
  var count = list.filter(function(t){ return t.status!=='voided'&&t.status!=='pending'; }).length;

  // Period label
  var b = _periodBounds();
  var fmt = function(d, opts){ return d.toLocaleDateString('en-KE', opts); };
  var periodLabel = '';
  if (_tlPeriod==='today')  periodLabel = fmt(b.from, {weekday:'long',day:'numeric',month:'long',year:'numeric'});
  else if (_tlPeriod==='week') {
    periodLabel = fmt(b.from,{day:'numeric',month:'short'}) + ' – ' +
                  fmt(new Date(b.to.getTime()-1),{day:'numeric',month:'short',year:'numeric'});
  }
  else if (_tlPeriod==='month') {
    var mp = (_tlMonth||new Date().toISOString().slice(0,7)).split('-');
    periodLabel = new Date(+mp[0],+mp[1]-1,1).toLocaleDateString('en-KE',{month:'long',year:'numeric'});
  }
  else if (_tlPeriod==='year')   periodLabel = _tlYear || String(new Date().getFullYear());
  else periodLabel = 'Custom range';

  // Cashier list
  var cnames = [];
  transactions.forEach(function(t){ if(t.cashier&&cnames.indexOf(t.cashier)<0) cnames.push(t.cashier); });
  cnames.sort();

  var curMonth = _tlMonth || new Date().toISOString().slice(0,7);
  var curYear  = _tlYear  || String(new Date().getFullYear());

  // Summary bar
  var extra = '';
  if (voids) extra += '<div class="txn-ss"><div class="txn-ss-lbl" style="color:var(--danger)">Voided</div><div class="txn-ss-val" style="color:var(--danger)">'+voids+'</div></div>';
  if (rets)  extra += '<div class="txn-ss"><div class="txn-ss-lbl">Returns</div><div class="txn-ss-val">'+rets+'</div></div>';

  var html =
    '<div style="font-size:11px;color:var(--text-faint);letter-spacing:.08em;margin-bottom:10px;text-transform:uppercase">'+periodLabel+'</div>'+
    '<div class="txn-summary-bar">'+
    '<div class="txn-ss"><div class="txn-ss-lbl">Total Revenue</div><div class="txn-ss-val gold">'+cur+' '+grand.toLocaleString()+'</div></div>'+
    '<div class="txn-ss"><div class="txn-ss-lbl">💵 Cash</div><div class="txn-ss-val">'+cur+' '+cash.toLocaleString()+'</div></div>'+
    '<div class="txn-ss"><div class="txn-ss-lbl">💳 Card</div><div class="txn-ss-val">'+cur+' '+card.toLocaleString()+'</div></div>'+
    '<div class="txn-ss"><div class="txn-ss-lbl">📱 M-Pesa</div><div class="txn-ss-val">'+cur+' '+mpesa.toLocaleString()+'</div></div>'+
    '<div class="txn-ss"><div class="txn-ss-lbl">Transactions</div><div class="txn-ss-val">'+count+'</div></div>'+
    '<div class="txn-ss"><div class="txn-ss-lbl">Units Sold</div><div class="txn-ss-val">'+units+'</div></div>'+
    extra+'</div>';

  // Filter controls
  var pills = ['today','week','month','year','custom'].map(function(p){
    return '<button class="txn-pill'+(_tlPeriod===p?' active':'')+'" onclick="setTxnPeriod(\''+p+'\')">'+p.charAt(0).toUpperCase()+p.slice(1)+'</button>';
  }).join('');

  html +=
    '<div class="txn-filters">'+
    '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">'+
    '<div class="txn-pills">'+pills+'</div>'+
    '<div style="display:'+(_tlPeriod==='month'?'flex':'none')+';align-items:center;gap:6px">'+
    '<input type="month" class="txn-date" value="'+curMonth+'" onchange="_tlMonth=this.value;renderTxnLog()"></div>'+
    '<div style="display:'+(_tlPeriod==='year'?'flex':'none')+';align-items:center;gap:6px">'+
    '<select class="txn-sel" onchange="_tlYear=this.value;renderTxnLog()">'+
    [2023,2024,2025,2026].map(function(y){ return '<option value="'+y+'"'+(curYear===String(y)?' selected':'')+'>'+y+'</option>'; }).join('')+
    '</select></div>'+
    '<div style="display:'+(_tlPeriod==='custom'?'flex':'none')+';align-items:center;gap:6px">'+
    '<input type="date" id="txnLogFrom" class="txn-date" onchange="renderTxnLog()">'+
    '<span style="color:var(--text-faint)">→</span>'+
    '<input type="date" id="txnLogTo" class="txn-date" onchange="renderTxnLog()">'+
    '</div></div>'+
    '<div class="txn-filter-row">'+
    '<select class="txn-sel" onchange="_tlCashier=this.value;renderTxnLog()">'+
    '<option value="all">All Cashiers</option>'+
    cnames.map(function(n){ return '<option value="'+n+'"'+(_tlCashier===n?' selected':'')+'>'+n+'</option>'; }).join('')+
    '</select>'+
    '<select class="txn-sel" onchange="_tlPay=this.value;renderTxnLog()">'+
    '<option value="all">All Payments</option>'+
    '<option value="cash"'+(_tlPay==='cash'?' selected':'')+'>💵 Cash</option>'+
    '<option value="card"'+(_tlPay==='card'?' selected':'')+'>💳 Card</option>'+
    '<option value="mpesa"'+(_tlPay==='mpesa'?' selected':'')+'>📱 M-Pesa</option>'+
    '</select>'+
    '<input type="text" class="txn-txt" placeholder="Search receipt, customer, item…" value="'+_tlSearch.replace(/"/g,'&quot;')+'" oninput="_tlSearch=this.value;renderTxnLog()" style="flex:1;min-width:160px">'+
    '<button onclick="exportTxnLogCSV()" class="btn-outline" style="font-size:11px;padding:5px 14px;white-space:nowrap">⬇ Export CSV</button>'+
    '</div></div>';

  // Table
  if (!list.length) {
    html += '<div style="text-align:center;padding:56px;color:var(--text-faint);font-size:12px;letter-spacing:.08em">'+
      'No transactions found for this period.<br>'+
      '<span style="font-size:11px;display:block;margin-top:6px">Try <strong>Week</strong> or <strong>Month</strong> to see more sales.</span></div>';
  } else {
    var sorted = list.slice().sort(function(a,b){ return new Date(b.date)-new Date(a.date); });
    var icn  = {cash:'💵',card:'💳',mpesa:'📱'};
    var bcls = {complete:'b-ok',voided:'b-void',pending:'b-pend',returned:'b-ret',exchanged:'b-exch'};
    var blbl = {complete:'✓ Paid',voided:'🚫 Voided',pending:'⏳ Pending',returned:'↩ Returned',exchanged:'🔄 Exchanged'};
    var mgr  = typeof isManager==='function' && isManager();

    html += '<div class="txn-tbl-wrap"><table class="txn-tbl"><thead><tr>'+
      '<th>Time</th><th>Receipt #</th><th>Customer</th><th>Cashier</th>'+
      '<th>Items</th><th>Payment</th><th style="text-align:right">Total</th><th>Status</th><th></th>'+
      '</tr></thead><tbody>';

    sorted.forEach(function(t){
      var d    = new Date(t.date);
      var time = d.toLocaleTimeString('en-KE',{hour:'2-digit',minute:'2-digit'});
      var date = d.toLocaleDateString('en-KE',{weekday:'short',day:'numeric',month:'short'});
      var pm   = t.payMethod||'cash';
      var sum  = t.items.slice(0,2).map(function(i){ return i.name+' \xd7'+i.qty; }).join(', ')+(t.items.length>2?' +'+(t.items.length-2)+' more':'');
      var full = t.items.map(function(i){ return i.name+' \xd7'+i.qty; }).join(', ');
      var vBtn = (t.status==='complete'&&mgr)?'<div class="icon-btn" onclick="openVoidModal(\''+t.id+'\')" title="Void">🚫</div>':'';
      var totClr = t.status==='voided'?'var(--text-faint)':'var(--gold)';
      html +=
        '<tr class="'+(t.status==='voided'?'txn-row-v':'')+'">'+
        '<td><div style="font-weight:600;font-size:12px;color:var(--text)">'+time+'</div>'+
             '<div style="font-size:10px;color:var(--text-faint)">'+date+'</div></td>'+
        '<td style="font-family:\'Courier New\',monospace;font-size:10px;color:var(--gold)">'+t.id+'</td>'+
        '<td style="font-size:12px">'+t.customer+'</td>'+
        '<td style="font-size:12px;color:var(--text-dim)">'+(t.cashier||'—')+'</td>'+
        '<td style="font-size:11px;color:var(--text-dim);max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="'+full+'">'+sum+'</td>'+
        '<td>'+(icn[pm]||'')+' <span style="text-transform:uppercase;font-size:10px;letter-spacing:.06em;color:var(--text-dim)">'+pm+'</span></td>'+
        '<td style="text-align:right;font-weight:700;font-size:14px;font-family:\'Cormorant Garamond\',serif;color:'+totClr+'">'+cur+' '+t.total.toLocaleString()+'</td>'+
        '<td><span class="txn-badge '+(bcls[t.status]||'b-ok')+'">'+(blbl[t.status]||t.status)+'</span></td>'+
        '<td><div style="display:flex;gap:4px">'+
          '<div class="icon-btn" onclick="showReceiptModal(\''+t.id+'\')" title="Receipt">🧾</div>'+vBtn+
        '</div></td></tr>';
    });
    html += '</tbody></table></div>';
  }

  wrap.innerHTML = html;
};

window.exportTxnLogCSV = function() {
  var list = _filteredTxns();
  var cur  = storeConfig.currency||'KES';
  var rows = [['Date','Time','Receipt ID','Customer','Cashier','Items','Payment','Subtotal','Discount','VAT','Total','Status']];
  list.forEach(function(t){
    var d = new Date(t.date);
    rows.push([d.toLocaleDateString('en-KE'),d.toLocaleTimeString('en-KE',{hour:'2-digit',minute:'2-digit'}),
      t.id,t.customer,t.cashier||'',
      t.items.map(function(i){ return i.name+' x'+i.qty; }).join(' | '),
      t.payMethod,t.subtotal||0,t.discount||0,t.vat||0,t.total,t.status]);
  });
  var csv = rows.map(function(r){ return r.map(function(c){ return '"'+String(c||'').replace(/"/g,'""')+'"'; }).join(','); }).join('\n');
  var blob = new Blob([csv],{type:'text/csv'});
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'tinah-sales-'+_tlPeriod+(_tlPeriod==='month'?'-'+_tlMonth:_tlPeriod==='year'?'-'+_tlYear:'')+'.csv';
  a.click();
  toast('✓ CSV downloaded');
};

// ── Online Orders: safe badge-only poller ─────────────────────────────
// IMPORTANT: we only update the badge count here.
// We do NOT call renderOnlineOrders() from the interval — that function
// manages its own DOM and calling it from a background timer caused
// conflicts with the existing view rendering. The Orders view re-renders
// correctly when you click the tab (switchView calls renderOnlineOrders).
(function () {
  // Clear any previous interval from earlier versions
  if (window._ordersInterval) clearInterval(window._ordersInterval);

  var _lastPending = 0;

  function updateBadge() {
    // Safely try to read orders — if getWebOrders isn't ready yet, skip
    if (typeof getWebOrders !== 'function') return;
    var orders  = [];
    try { orders = getWebOrders(); } catch(e) { return; }
    var pending = orders.filter(function(o){ return o.status === 'pending'; }).length;

    // Update the badge in the nav
    var badge = document.getElementById('onlineOrdersBadge');
    if (badge) {
      badge.textContent    = pending;
      badge.style.display  = pending > 0 ? 'inline-flex' : 'none';
    }
    // Highlight the tab label when there are pending orders
    var tab = document.getElementById('onlineOrdersTab');
    if (tab) tab.style.color = pending > 0 ? 'var(--gold)' : '';

    // Only re-render the orders list if the Orders view is currently visible
    // AND only if new orders have arrived (avoids unnecessary DOM churn)
    if (pending !== _lastPending) {
      var view = document.getElementById('ordersView');
      if (view && view.style.display !== 'none') {
        if (typeof renderOnlineOrders === 'function') renderOnlineOrders();
      }
      // Toast only when count goes up
      if (pending > _lastPending) {
        var diff = pending - _lastPending;
        if (typeof toast === 'function') {
          toast('🛍 ' + diff + ' new online order' + (diff > 1 ? 's' : '') + ' received!');
        }
      }
      _lastPending = pending;
    }
  }

  // Run immediately after a short delay to let script.js finish booting
  setTimeout(updateBadge, 2000);

  // Then poll every 15 seconds
  window._ordersInterval = setInterval(updateBadge, 15000);

  // Expose a manual refresh that calls the original renderOnlineOrders directly
  window.manualRefreshOrders = function() {
    updateBadge();
    if (typeof renderOnlineOrders === 'function') renderOnlineOrders();
    if (typeof toast === 'function') toast('✓ Orders refreshed');
  };

  // Safe override of checkOnlineOrdersBadge — original is called by
  // initOnlineOrdersPoller in script.js; we just re-point it to our version
  window.checkOnlineOrdersBadge = updateBadge;
})();