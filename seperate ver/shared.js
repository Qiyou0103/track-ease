// Shared state and utilities for TrackEase prototype
const LS_KEY = 'trackease_prototype_v1';
let state = {setup:{}, products:[], sales:[]};

// Storage functions
function save(){localStorage.setItem(LS_KEY, JSON.stringify(state));}
function load(){
  const s = localStorage.getItem(LS_KEY); 
  if(s) state = JSON.parse(s);
  initDemoData();
}

// Utilities
function findProduct(id){return state.products.find(p=>p.id===id)}
function uid(){return 'p'+Date.now()+Math.floor(Math.random()*1000)}

// Message display utility
function renderMessage(msg, isError){ 
  const out = document.getElementById('message-output');
  if(!out) return;
  out.textContent = msg; 
  out.className = isError? 'small danger' : 'small muted'; 
  setTimeout(()=>{ 
    out.textContent=''; 
    out.className='small muted'; 
  }, 3000); 
}

// For first-run demo data (only if empty)
function initDemoData(){
  if(state.products.length===0 && state.sales.length===0 && !state.setup.business){
    state.setup = {business:'Demo Stall', currency:'RM'};
    state.products.push({id:uid(), name:'Bun', price:2.5, stock:50});
    state.products.push({id:uid(), name:'Patty', price:4.0, stock:30});
    save();
  }
}

// Initialize on load
load();
