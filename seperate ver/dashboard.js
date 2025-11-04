// Dashboard page logic

// Setup handlers
document.getElementById('save-setup').addEventListener('click', ()=>{
  const name = document.getElementById('biz-name').value.trim();
  const currency = document.getElementById('currency').value.trim() || 'RM';
  state.setup.business = name || 'My Business';
  state.setup.currency = currency;
  save();
  renderMessage('Setup saved');
  renderStats();
});

// Render functions
function renderSetup(){
  document.getElementById('biz-name').value = state.setup.business || '';
  document.getElementById('currency').value = state.setup.currency || 'RM';
}

function renderStats(){
  document.getElementById('stat-products').textContent = state.products.length;
  document.getElementById('stat-sales').textContent = state.sales.length;
  
  const lowStock = state.products.filter(p => p.stock <= 5).length;
  document.getElementById('stat-low-stock').textContent = lowStock;
}

// Initialize
renderSetup();
renderStats();
