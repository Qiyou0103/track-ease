// Reports page logic

// Export CSV handler
document.getElementById('export-report').addEventListener('click', ()=>{
  const lines = ['type,product,qty,price,total,when'];
  
  state.sales.forEach(s=>{
    const p = findProduct(s.productId) || {name:'(deleted)'};
    const total = (s.qty * s.price).toFixed(2);
    lines.push(['sale', p.name, s.qty, s.price, total, s.when].join(','));
  });
  
  const csv = lines.join('\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); 
  a.href = url; 
  a.download = 'trackease_report.csv'; 
  a.click();
  URL.revokeObjectURL(url);
  
  document.getElementById('report-output').textContent = `Exported ${state.sales.length} sales rows`;
});

function renderSalesSummary(){
  const summary = document.getElementById('sales-summary');
  summary.innerHTML = '';
  
  if(state.sales.length === 0){
    summary.innerHTML = '<div class="muted">No sales data yet</div>';
    return;
  }
  
  // Calculate summary by product
  const productSummary = {};
  let totalRevenue = 0;
  
  state.sales.forEach(s => {
    const p = findProduct(s.productId) || {name:'(deleted)'};
    const saleTotal = s.qty * s.price;
    totalRevenue += saleTotal;
    
    if(!productSummary[p.name]){
      productSummary[p.name] = {qty: 0, revenue: 0};
    }
    productSummary[p.name].qty += s.qty;
    productSummary[p.name].revenue += saleTotal;
  });
  
  // Total revenue card
  const totalCard = document.createElement('div');
  totalCard.className = 'stat-card';
  totalCard.innerHTML = `
    <div class="stat-label">Total Revenue</div>
    <div class="stat-value">${state.setup.currency||'RM'} ${totalRevenue.toFixed(2)}</div>
  `;
  summary.appendChild(totalCard);
  
  // Product breakdown
  Object.entries(productSummary).forEach(([name, data]) => {
    const card = document.createElement('div');
    card.className = 'stat-card';
    card.innerHTML = `
      <div class="stat-label">${name}</div>
      <div class="stat-value small">${data.qty} sold</div>
      <div class="small muted">${state.setup.currency||'RM'} ${data.revenue.toFixed(2)}</div>
    `;
    summary.appendChild(card);
  });
}

// Initialize
renderSalesSummary();
