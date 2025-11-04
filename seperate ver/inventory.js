// Inventory page logic

function renderInventory(){
  const inv = document.getElementById('inventory-list'); 
  inv.innerHTML = '';
  
  if(state.products.length===0){ 
    inv.innerHTML = '<div class="muted">No products yet. <a href="add-product.html">Add a product</a></div>'; 
    return;
  }
  
  state.products.forEach(p=>{
    const div = document.createElement('div'); 
    div.className = 'item';
    
    const meta = document.createElement('div'); 
    meta.className='meta';
    const name = document.createElement('div'); 
    name.textContent = p.name + ' — ' + (state.setup.currency||'RM') + ' ' + (p.price||0).toFixed(2);
    const sub = document.createElement('div'); 
    sub.className='small muted'; 
    sub.textContent = `Stock: ${p.stock}`;
    meta.appendChild(name); 
    meta.appendChild(sub);
    
    const actions = document.createElement('div');
    const sellBtn = document.createElement('button'); 
    sellBtn.textContent = 'Quick Sell'; 
    sellBtn.style.marginRight='6px';
    sellBtn.addEventListener('click', ()=>{ 
      if(p.stock < 1){
        renderMessage('Not enough stock', true);
        return;
      }
      p.stock -= 1;
      state.sales.push({
        id: 's'+Date.now(), 
        productId: p.id, 
        qty: 1, 
        price: p.price, 
        when: new Date().toISOString()
      });
      save(); 
      renderInventory();
      renderMessage('Sale recorded');
    });
    
    const delBtn = document.createElement('button'); 
    delBtn.textContent = 'Delete'; 
    delBtn.style.background='#ff6b6b';
    delBtn.addEventListener('click', ()=>{ 
      if(confirm(`Delete ${p.name}?`)){
        state.products = state.products.filter(x=>x.id!==p.id); 
        save(); 
        renderInventory(); 
        renderMessage('Product deleted');
      }
    });
    
    actions.appendChild(sellBtn); 
    actions.appendChild(delBtn);
    div.appendChild(meta); 
    div.appendChild(actions);
    inv.appendChild(div);

    // low stock highlight
    if(p.stock <= 5){ sub.classList.add('danger'); }
  });
}

// Initialize
renderInventory();
