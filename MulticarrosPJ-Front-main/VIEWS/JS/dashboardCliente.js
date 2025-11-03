(function(){
  // Sidebar navigation
  document.querySelectorAll('.menu-item').forEach(mi => {
    mi.addEventListener('click', function(){
      document.querySelectorAll('.menu-item').forEach(x=>x.classList.remove('active'));
      this.classList.add('active');
      showSection(this.getAttribute('data-section'));
    });
  });
  function showSection(name){
    document.getElementById('veiculosSection').classList.add('hide');
    document.getElementById('dadosSection').classList.add('hide');
    document.getElementById('financeiroSection').classList.add('hide');
    if(name==='veiculos') document.getElementById('veiculosSection').classList.remove('hide');
    if(name==='dados') document.getElementById('dadosSection').classList.remove('hide');
    if(name==='financeiro') document.getElementById('financeiroSection').classList.remove('hide');
  }

  // Dados do cliente (simulação)
  const CLIENTE_KEY = 'cliente_dados';
  function getCliente(){ return JSON.parse(localStorage.getItem(CLIENTE_KEY) || '{"nome":"","email":"","telefone":"","cpf":"","nasc":""}'); }
  function saveCliente(obj){ localStorage.setItem(CLIENTE_KEY, JSON.stringify(obj)); }

  // Preencher dados do cliente
  function renderDados(){
    const c = getCliente();
    document.getElementById('d_nome').value = c.nome || '';
    document.getElementById('d_email').value = c.email || '';
    document.getElementById('d_telefone').value = c.telefone || '';
    document.getElementById('d_cpf').value = c.cpf || '';
    document.getElementById('d_nasc').value = c.nasc || '';
    document.getElementById('clienteNome').textContent = c.nome ? c.nome.split(' ')[0] : 'Cliente';
  }
  document.getElementById('salvarDados').addEventListener('click', function(e){
    e.preventDefault();
    const nome = document.getElementById('d_nome').value.trim();
    const email = document.getElementById('d_email').value.trim();
    const telefone = document.getElementById('d_telefone').value.trim();
    const cpf = document.getElementById('d_cpf').value.trim();
    const nasc = document.getElementById('d_nasc').value;
    if(!nome || !email || !telefone || !cpf || !nasc){ showToast('Preencha todos os campos!'); return; }
    saveCliente({nome,email,telefone,cpf,nasc});
    showToast('Dados salvos!');
    renderDados();
  });

  // Meus Veículos (simulação)
  const VEICULOS_KEY = 'cliente_veiculos';
  function getVeiculos(){ return JSON.parse(localStorage.getItem(VEICULOS_KEY) || '[]'); }
  function renderVeiculos(){
    const wrap = document.getElementById('meusVeiculosLista');
    const arr = getVeiculos();
    if(!arr.length){
      wrap.innerHTML = '<div class="muted">Nenhum veículo comprado ainda.</div>';
      return;
    }
    wrap.innerHTML = arr.map(v=>`
      <div class="card" style="margin-bottom:10px;display:flex;align-items:center;gap:16px">
        ${v.foto?'<img src="'+v.foto+'" style="height:60px;border-radius:8px">':''}
        <div style="flex:1">
          <strong>${v.modelo}</strong> <span class="muted">Ano ${v.ano}</span><br>
          <span class="muted">${v.categoria}</span>
        </div>
        <div style="font-weight:700">${formatMoney(v.preco)}</div>
      </div>
    `).join('');
  }

  // Financeiro (simulação de boletos)
  const BOLETOS_KEY = 'cliente_boletos';
  function getBoletos(){ return JSON.parse(localStorage.getItem(BOLETOS_KEY) || '[]'); }
  function saveBoletos(arr){ localStorage.setItem(BOLETOS_KEY, JSON.stringify(arr)); }
  function renderBoletos(){
    const wrap = document.getElementById('boletosLista');
    const arr = getBoletos();
    if(!arr.length){
      wrap.innerHTML = '<div class="muted">Nenhum boleto gerado.</div>';
      return;
    }
    wrap.innerHTML = arr.map((b,idx)=>`
      <div class="card" style="margin-bottom:10px;display:flex;align-items:center;gap:16px;justify-content:space-between">
        <div>
          <strong>Boleto #${b.id}</strong><br>
          <span class="muted">Vencimento: ${b.vencimento}</span>
        </div>
        <div>
          <span style="font-weight:700">${formatMoney(b.valor)}</span>
          <span class="muted" style="margin-left:10px">${b.pago?'Pago':'Em aberto'}</span>
        </div>
        ${!b.pago?`<button class="btn primary" data-idx="${idx}">Marcar como pago</button>`:''}
      </div>
    `).join('');
    // Botão pagar
    wrap.querySelectorAll('.btn.primary').forEach(btn=>{
      btn.onclick = function(){
        const idx = Number(this.getAttribute('data-idx'));
        const arr = getBoletos();
        arr[idx].pago = true;
        saveBoletos(arr);
        showToast('Boleto marcado como pago!');
        renderBoletos();
      };
    });
  }

  // Util
  function formatMoney(v){ return Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}); }

  // Toast/modal
  function showToast(msg, time=2200){
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.style.display = 'block';
    setTimeout(()=> t.style.display = 'none', time);
  }
  function showModal(title, body){
    const mb = document.getElementById('modalBackdrop');
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = body;
    mb.style.display = 'flex';
    setTimeout(()=> document.getElementById('modal').classList.add('show'), 20);
  }
  function closeModal(){
    document.getElementById('modal').classList.remove('show');
    setTimeout(()=> document.getElementById('modalBackdrop').style.display = 'none', 220);
  }
  document.getElementById('modalClose')?.addEventListener('click', closeModal);

  // Inicialização
  document.addEventListener('DOMContentLoaded', function(){
    renderDados();
    renderVeiculos();
    renderBoletos();
  });
})();
