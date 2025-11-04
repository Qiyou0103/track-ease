// Add/Edit Product page logic

// Add product handler
document.getElementById('add-product').addEventListener('click', ()=>{
  const name = document.getElementById('product-name').value.trim();
  const price = parseFloat(document.getElementById('product-price').value) || 0;
  const stock = parseInt(document.getElementById('product-stock').value) || 0;
  
  if(!name){
    renderMessage('Product name required', true); 
    return;
  }
  
  // check if exists
  const existing = state.products.find(p => p.name.toLowerCase()===name.toLowerCase());
  if(existing){ 
    existing.price = price; 
    existing.stock = stock; 
    renderMessage('Product updated'); 
  } else{ 
    state.products.push({id:uid(), name, price, stock}); 
    renderMessage('Product added'); 
  }
  
  save(); 
  renderProductList();
  
  // Clear form
  document.getElementById('product-name').value = '';
  document.getElementById('product-price').value = '';
  document.getElementById('product-stock').value = '';
});

function renderProductList(){
  const list = document.getElementById('product-list');
  list.innerHTML = '';
  
  if(state.products.length === 0){
    list.innerHTML = '<div class="muted">No products yet</div>';
    return;
  }
  
  state.products.forEach(p => {
    const div = document.createElement('div');
    div.className = 'item';
    
    const meta = document.createElement('div');
    meta.className = 'meta';
    const name = document.createElement('div');
    name.textContent = `${p.name} — ${state.setup.currency||'RM'} ${(p.price||0).toFixed(2)}`;
    const sub = document.createElement('div');
    sub.className = 'small muted';
    sub.textContent = `Stock: ${p.stock}`;
    meta.appendChild(name);
    meta.appendChild(sub);
    
    const actions = document.createElement('div');
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', ()=>{
      document.getElementById('product-name').value = p.name;
      document.getElementById('product-price').value = p.price;
      document.getElementById('product-stock').value = p.stock;
      window.scrollTo(0, 0);
    });
    
    actions.appendChild(editBtn);
    div.appendChild(meta);
    div.appendChild(actions);
    list.appendChild(div);
    
    if(p.stock <= 5){ sub.classList.add('danger'); }
  });
}

// Initialize
renderProductList();
