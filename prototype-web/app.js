// Simple prototype app using localStorage
const LS_KEY = 'trackease_prototype_v1';
let state = {setup:{}, products:[], sales:[]};

function save(){localStorage.setItem(LS_KEY, JSON.stringify(state));}
function load(){const s = localStorage.getItem(LS_KEY); if(s) state = JSON.parse(s); render();}

// Utilities
function findProduct(id){return state.products.find(p=>p.id===id)}
function uid(){return 'p'+Date.now()+Math.floor(Math.random()*1000)}

// Setup handlers
document.getElementById('save-setup').addEventListener('click', ()=>{
  const name = document.getElementById('biz-name').value.trim();
  const currency = document.getElementById('currency').value.trim() || 'RM';
  state.setup.business = name || 'My Business';
  state.setup.currency = currency;
  save();
  renderMessage('Setup saved');
});

// Add product
document.getElementById('add-product').addEventListener('click', ()=>{
  const name = document.getElementById('product-name').value.trim();
  const price = parseFloat(document.getElementById('product-price').value) || 0;
  const stock = parseInt(document.getElementById('product-stock').value) || 0;
  if(!name){renderMessage('Product name required', true); return}
  // check if exists
  const existing = state.products.find(p => p.name.toLowerCase()===name.toLowerCase());
  if(existing){ existing.price = price; existing.stock = stock; renderMessage('Product updated'); }
  else{ state.products.push({id:uid(), name, price, stock}); renderMessage('Product added'); }
  save(); render();
});

// Record sale
document.getElementById('record-sale').addEventListener('click', ()=>{
  const pid = document.getElementById('sale-product').value;
  const qty = parseInt(document.getElementById('sale-qty').value) || 1;
  if(!pid){ renderMessage('Select a product', true); return }
  const p = findProduct(pid); if(!p){ renderMessage('Product not found', true); return }
  if(p.stock < qty){ renderMessage('Not enough stock', true); return }
  p.stock -= qty;
  state.sales.push({id: 's'+Date.now(), productId: pid, qty, price: p.price, when: new Date().toISOString()});
  save(); render(); renderMessage('Sale recorded');
});

// Export simple CSV
document.getElementById('export-report').addEventListener('click', ()=>{
  const lines = ['type,product,qty,price,when'];
  state.sales.forEach(s=>{const p = findProduct(s.productId) || {name:'(deleted)'}; lines.push(['sale', p.name, s.qty, s.price, s.when].join(','));});
  const csv = lines.join('\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'trackease_report.csv'; a.click();
  URL.revokeObjectURL(url);
  document.getElementById('report-output').textContent = `Exported ${state.sales.length} sales rows`;
});

// Render UI
function render(){
  document.getElementById('biz-name').value = state.setup.business || '';
  document.getElementById('currency').value = state.setup.currency || 'RM';

  // inventory list
  const inv = document.getElementById('inventory-list'); inv.innerHTML = '';
  if(state.products.length===0){ inv.innerHTML = '<div class="muted">No products yet</div>'; }
  state.products.forEach(p=>{
    const div = document.createElement('div'); div.className = 'item';
    const meta = document.createElement('div'); meta.className='meta';
    const name = document.createElement('div'); name.textContent = p.name + ' — ' + (state.setup.currency||'RM') + ' ' + (p.price||0).toFixed(2);
    const sub = document.createElement('div'); sub.className='small muted'; sub.textContent = `Stock: ${p.stock}`;
    meta.appendChild(name); meta.appendChild(sub);
    const actions = document.createElement('div');
    const sellBtn = document.createElement('button'); sellBtn.textContent = 'Sell 1'; sellBtn.style.marginRight='6px';
    sellBtn.addEventListener('click', ()=>{ document.getElementById('sale-product').value = p.id; document.getElementById('sale-qty').value = 1; document.getElementById('record-sale').click(); });
    const delBtn = document.createElement('button'); delBtn.textContent = 'Delete'; delBtn.style.background='#ff6b6b';
    delBtn.addEventListener('click', ()=>{ state.products = state.products.filter(x=>x.id!==p.id); save(); render(); });
    actions.appendChild(sellBtn); actions.appendChild(delBtn);
    div.appendChild(meta); div.appendChild(actions);
    inv.appendChild(div);

    // low stock highlight
    if(p.stock <= 5){ sub.classList.add('danger'); }
  });

  // populate sale product select
  const sel = document.getElementById('sale-product'); sel.innerHTML = '<option value="">-- choose --</option>';
  state.products.forEach(p=>{ const opt = document.createElement('option'); opt.value = p.id; opt.textContent = p.name + ' (' + p.stock + ')'; sel.appendChild(opt); });
}

function renderMessage(msg, isError){ const out = document.getElementById('report-output'); out.textContent = msg; out.className = isError? 'small danger' : 'small muted'; setTimeout(()=>{ out.textContent=''; out.className='small muted'; }, 3000); }

// init
load();

// For first-run demo data (only if empty)
if(state.products.length===0 && state.sales.length===0 && !state.setup.business){
  state.setup = {business:'Demo Stall', currency:'RM'};
  state.products.push({id:uid(), name:'Bun', price:2.5, stock:50});
  state.products.push({id:uid(), name:'Patty', price:4.0, stock:30});
  save(); render();
}
