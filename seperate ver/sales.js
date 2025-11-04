// Sales page logic

// Record sale handler
document.getElementById('record-sale').addEventListener('click', ()=>{
  const pid = document.getElementById('sale-product').value;
  const qty = parseInt(document.getElementById('sale-qty').value) || 1;
  
  if(!pid){ 
    renderMessage('Select a product', true); 
    return;
  }
  
  const p = findProduct(pid); 
  if(!p){ 
    renderMessage('Product not found', true); 
    return;
  }
  
  if(p.stock < qty){ 
    renderMessage('Not enough stock', true); 
    return;
  }
  
  p.stock -= qty;
  state.sales.push({
    id: 's'+Date.now(), 
    productId: pid, 
    qty, 
    price: p.price, 
    when: new Date().toISOString()
  });
  
  save(); 
  renderSaleForm();
  renderRecentSales();
  renderMessage('Sale recorded');
  
  // Reset quantity
  document.getElementById('sale-qty').value = 1;
});

function renderSaleForm(){
  const sel = document.getElementById('sale-product'); 
  sel.innerHTML = '<option value="">-- choose --</option>';
  
  state.products.forEach(p=>{ 
    const opt = document.createElement('option'); 
    opt.value = p.id; 
    opt.textContent = p.name + ' (' + p.stock + ')'; 
    sel.appendChild(opt); 
  });
}

function renderRecentSales(){
  const list = document.getElementById('recent-sales-list');
  list.innerHTML = '';
  
  if(state.sales.length === 0){
    list.innerHTML = '<div class="muted">No sales recorded yet</div>';
    return;
  }
  
  // Show last 10 sales
  const recentSales = state.sales.slice(-10).reverse();
  
  recentSales.forEach(s => {
    const p = findProduct(s.productId) || {name:'(deleted)', price: s.price};
    const div = document.createElement('div');
    div.className = 'item';
    
    const meta = document.createElement('div');
    meta.className = 'meta';
    const name = document.createElement('div');
    const total = (s.qty * s.price).toFixed(2);
    name.textContent = `${p.name} × ${s.qty} = ${state.setup.currency||'RM'} ${total}`;
    const sub = document.createElement('div');
    sub.className = 'small muted';
    const date = new Date(s.when);
    sub.textContent = date.toLocaleString();
    meta.appendChild(name);
    meta.appendChild(sub);
    
    div.appendChild(meta);
    list.appendChild(div);
  });
}

// Initialize
renderSaleForm();
renderRecentSales();
