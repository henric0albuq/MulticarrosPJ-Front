
/* v3 app JS: enhanced interactions, pagination, modal, toast */
(function(){
  // Login
  const loginForm = document.getElementById('loginForm');
  if(loginForm){
    loginForm.addEventListener('submit', function(e){
      e.preventDefault();
      const u = document.getElementById('user').value.trim();
      const p = document.getElementById('pass').value.trim();
      if(u === 'admin' && p === '123456'){
        location.href = 'dashboard.html';
      } else {
        showToast('Usuário ou senha inválidos. Use admin / 123456');
      }
    });
    document.getElementById('demoFill')?.addEventListener('click', function(){
      document.getElementById('user').value = 'admin';
      document.getElementById('pass').value = '123456';
    });
  }

  // Sidebar collapse
  const collapseBtn = document.getElementById('collapseBtn');
  const sidebar = document.getElementById('sidebar');
  collapseBtn?.addEventListener('click', function(){ sidebar.classList.toggle('collapsed'); });

  // Simple navigation between sections

  item.addEventListener('click', function(e) {
  if (item.getAttribute('href') === '#') {
    e.preventDefault();
    // lógica de mostrar seção
  }
  // Se for um href real, deixa navegar normalmente
});

  document.querySelectorAll('.menu-item').forEach(mi => {
    mi.addEventListener('click', function(e){
      e.preventDefault();
      document.querySelectorAll('.menu-item').forEach(x=>x.classList.remove('active'));
      this.classList.add('active');
      const sec = this.getAttribute('data-section');
      showSection(sec);
    });
  });
  document.getElementById('menuToggle')?.addEventListener('click', ()=>sidebar.classList.toggle('collapsed'));

  function showSection(name){
    const map = {dashboard:'dashboardSection', cadastro:'cadastroSection', estoque:'estoqueSection', relatorios:'dashboardSection', config:'dashboardSection'};
    Object.values(map).forEach(id => document.getElementById(id).classList.add('hide'));
    const target = map[name] || 'dashboardSection';
    document.getElementById(target).classList.remove('hide');
  }

  // Storage key and helpers
  const STORAGE_KEY = 'multicarros_v3_items';
  function getVehicles(){ return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  function saveVehicles(arr){ localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); }

  // Pagination settings
  const PAGE_SIZE = 6;
  let currentPage = 1;

  // Render table with pagination and filtering
  const tbody = document.querySelector('#veiculosTable tbody');
  function renderTable(filter=''){
    const items = getVehicles();
    const filtered = !filter ? items : items.filter(it => (it.modelo + it.categoria + it.ano + (it.desc||'')).toLowerCase().includes(filter.toLowerCase()));
    const total = filtered.length;
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if(currentPage > pages) currentPage = pages;
    const start = (currentPage - 1) * PAGE_SIZE;
    const pageItems = filtered.slice(start, start + PAGE_SIZE);

    tbody.innerHTML = pageItems.map((it, idx) => {
      const globalIdx = start + idx;
      return `<tr data-idx="${globalIdx}">
        <td>${it.foto ? '<img src="'+it.foto+'" alt="foto">' : ''}</td>
        <td>${it.modelo}</td>
        <td>${it.ano}</td>
        <td>${formatMoney(it.preco)}</td>
        <td>${it.categoria}</td>
        <td><button class="btn edit" data-idx="${globalIdx}">Editar</button> <button class="btn ghost danger del" data-idx="${globalIdx}">Excluir</button></td>
      </tr>`;
    }).join('');

    renderPagination(pages);
    updateStats();
    attachRowEvents();
  }

  // Pagination render
  function renderPagination(pages){
    const pWrap = document.getElementById('pagination');
    if(!pWrap) return;
    pWrap.innerHTML = '';
    for(let i=1;i<=pages;i++){
      const btn = document.createElement('button');
      btn.className = 'page-btn' + (i===currentPage ? ' active' : '');
      btn.textContent = i;
      btn.onclick = ()=>{ currentPage = i; renderTable(document.getElementById('searchInput')?.value || ''); };
      pWrap.appendChild(btn);
    }
  }

  // Stats and chart
  function updateStats(){
    const items = getVehicles();
    document.getElementById('totalCount').textContent = items.length;
    const avg = items.length ? items.reduce((s,i)=>s+Number(i.preco),0)/items.length : 0;
    document.getElementById('avgPrice').textContent = formatMoney(avg);
    const recent = items.slice(-3).map(i=>i.modelo).join(', ') || '—';
    document.getElementById('recentCount').textContent = recent;
    drawChart();
    renderEstoque();
  }

  function drawChart(){
    const items = getVehicles();
    const counts = {};
    items.forEach(i => counts[i.categoria] = (counts[i.categoria]||0)+1);
    const labels = Object.keys(counts);
    const values = labels.map(l=>counts[l]);
    const canvas = document.getElementById('chartCanvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const w = canvas.width, h = canvas.height, padding = 36;
    const max = Math.max(...values,1);
    const barW = (w - padding*2) / Math.max(labels.length,1) * 0.6;
    labels.forEach((lab,i)=>{
      const x = padding + i * ((w - padding*2) / Math.max(labels.length,1)) + ((w - padding*2) / Math.max(labels.length,1) - barW)/2;
      const barH = (values[i]/max) * (h - padding*2);
      const y = h - padding - barH;
      ctx.fillStyle = '#28a745';
      roundRect(ctx, x, y, barW, barH, 6);
      ctx.fill();
      ctx.fillStyle = '#083f22';
      ctx.font = '12px Inter, Arial';
      ctx.fillText(lab, x, h - padding + 16);
      ctx.fillText(values[i], x + barW/2 - 6, y - 8);
    });
  }

  function roundRect(ctx, x, y, w, h, r){
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.arcTo(x+w, y, x+w, y+h, r);
    ctx.arcTo(x+w, y+h, x, y+h, r);
    ctx.arcTo(x, y+h, x, y, r);
    ctx.arcTo(x, y, x+w, y, r);
    ctx.closePath();
  }

  // Row events (edit/delete)
  function attachRowEvents(){
    document.querySelectorAll('.del').forEach(b => b.onclick = function(){
      const idx = Number(this.getAttribute('data-idx'));
      showConfirm('Excluir veículo', 'Deseja realmente excluir este veículo?', ()=>{ deleteVehicle(idx); });
    });
    document.querySelectorAll('.edit').forEach(b => b.onclick = function(){
      const idx = Number(this.getAttribute('data-idx'));
      openEditModal(idx);
    });
  }

  function deleteVehicle(idx){
    const arr = getVehicles();
    arr.splice(idx,1);
    saveVehicles(arr);
    showToast('Veículo excluído');
    renderTable(document.getElementById('searchInput')?.value || '');
  }

  // Edit modal
  function openEditModal(idx){
    const arr = getVehicles();
    const it = arr[idx];
    const body = document.getElementById('modalBody');
    body.innerHTML = `
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <div style="flex:1"><label>Modelo</label><input id="m_modelo" value="${it.modelo}"></div>
        <div style="flex:1"><label>Ano</label><input id="m_ano" type="number" value="${it.ano}"></div>
        <div style="flex:1"><label>Preço</label><input id="m_preco" type="number" value="${it.preco}"></div>
        <div style="flex:1"><label>Categoria</label><input id="m_cat" value="${it.categoria}"></div>
      </div>
      <div style="margin-top:8px"><label>Descrição</label><textarea id="m_desc" rows="3">${it.desc || ''}</textarea></div>
    `;
    const actions = document.getElementById('modalActions');
    actions.innerHTML = '<button class="btn ghost" id="modalCancel">Cancelar</button><button class="btn primary" id="modalSave">Salvar</button>';
    showModal('Editar Veículo');
    document.getElementById('modalCancel').addEventListener('click', closeModal);
    document.getElementById('modalSave').addEventListener('click', function(){
      const modelo = document.getElementById('m_modelo').value.trim();
      const ano = document.getElementById('m_ano').value;
      const preco = Number(document.getElementById('m_preco').value);
      const categoria = document.getElementById('m_cat').value.trim();
      const desc = document.getElementById('m_desc').value.trim();
      if(!modelo || !ano || !preco || !categoria){ showToast('Preencha todos os campos'); return; }
      arr[idx] = { modelo, ano, preco, categoria, desc, foto: it.foto || null };
      saveVehicles(arr);
      closeModal();
      showToast('Veículo atualizado');
      renderTable(document.getElementById('searchInput')?.value || '');
    });
  }

  // Modal helpers
  function showModal(title){
    const mb = document.getElementById('modalBackdrop');
    document.getElementById('modalTitle').textContent = title;
    mb.style.display = 'flex';
    setTimeout(()=> document.getElementById('modal').classList.add('show'), 20);
  }
  function closeModal(){
    document.getElementById('modal').classList.remove('show');
    setTimeout(()=> document.getElementById('modalBackdrop').style.display = 'none', 220);
  }
  document.getElementById('modalClose')?.addEventListener('click', closeModal);

  // Toast
  function showToast(msg, time=2200){
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.style.display = 'block';
    setTimeout(()=> t.style.display = 'none', time);
  }

  // render estoque list
  function renderEstoque(){
    const wrap = document.getElementById('estoqueLista');
    if(!wrap) return;
    const items = getVehicles();
    wrap.innerHTML = items.map((it, idx)=>`
      <div class="stock-item card" style="display:flex;gap:12px;align-items:center;margin-bottom:10px">
        ${it.foto?'<img src="'+it.foto+'" style="height:68px;border-radius:8px">':''}
        <div style="flex:1"><strong>${it.modelo}</strong><div class="muted">Ano ${it.ano} • ${it.categoria}</div></div>
        <div style="text-align:right"><div style="font-weight:800">${formatMoney(it.preco)}</div><div style="margin-top:8px"><button class="btn edit" data-idx="${idx}">Editar</button> <button class="btn ghost danger del" data-idx="${idx}">Excluir</button></div></div>
      </div>`).join('');
    attachRowEvents();
  }

  // Search input
  document.getElementById('searchInput')?.addEventListener('input', function(){ currentPage = 1; renderTable(this.value); });

  // Form save (new vehicle)
  document.getElementById('saveVehicle')?.addEventListener('click', function(e){
    e.preventDefault();
    const modelo = document.getElementById('v_modelo').value.trim();
    const ano = document.getElementById('v_ano').value;
    const preco = Number(document.getElementById('v_preco').value);
    const categoria = document.getElementById('v_categoria').value;
    const desc = document.getElementById('v_desc').value.trim();
    const fotoInput = document.getElementById('v_foto');
    if(!modelo || !ano || !preco || !categoria){ showToast('Preencha os campos obrigatórios'); return; }

    const reader = new FileReader();
    reader.onload = function(ev){
      const fotoData = ev.target.result;
      const arr = getVehicles();
      arr.push({ modelo, ano, preco, categoria, desc, foto: fotoData });
      saveVehicles(arr);
      showToast('Veículo adicionado');
      document.getElementById('vehicleForm').reset();
      showSection('dashboard');
      renderTable();
    };
    if(fotoInput && fotoInput.files && fotoInput.files[0]){
      reader.readAsDataURL(fotoInput.files[0]);
    } else {
      const arr = getVehicles();
      arr.push({ modelo, ano, preco, categoria, desc, foto: null });
      saveVehicles(arr);
      showToast('Veículo adicionado');
      document.getElementById('vehicleForm').reset();
      showSection('dashboard');
      renderTable();
    }
  });

  document.getElementById('cancelEdit')?.addEventListener('click', function(){ document.getElementById('vehicleForm').reset(); showSection('dashboard'); });

  // CSV export and clear
  document.getElementById('exportCsv')?.addEventListener('click', function(){
    const items = getVehicles();
    if(!items.length){ showToast('Nenhum veículo para exportar'); return; }
    const rows = [['Modelo','Ano','Preço','Categoria','Descrição']].concat(items.map(i=>[i.modelo,i.ano,i.preco,i.categoria,i.desc]));
    const csv = rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv],{type:'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'veiculos.csv'; a.click(); URL.revokeObjectURL(url);
    showToast('CSV gerado');
  });
  document.getElementById('clearData')?.addEventListener('click', function(){ if(confirm('Apagar TODOS os veículos?')){ localStorage.removeItem(STORAGE_KEY); renderTable(); showToast('Dados removidos'); } });

  function formatMoney(v){ return Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}); }

  // confirm modal helper
  function showConfirm(title, message, onOk){
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = '<p>'+message+'</p>';
    document.getElementById('modalActions').innerHTML = '<button class="btn ghost" id="modalCancel">Cancelar</button><button class="btn primary" id="modalOk">Confirmar</button>';
    showModal();
    document.getElementById('modalCancel').onclick = closeModal;
    document.getElementById('modalOk').onclick = function(){ onOk(); closeModal(); };
  }
  function showModal(){ const mb = document.getElementById('modalBackdrop'); mb.style.display='flex'; setTimeout(()=> document.getElementById('modal').classList.add('show'),20); }
  function closeModal(){ document.getElementById('modal').classList.remove('show'); setTimeout(()=> document.getElementById('modalBackdrop').style.display='none',240); }
  document.getElementById('modalClose')?.addEventListener('click', closeModal);

  // init render
  document.addEventListener('DOMContentLoaded', function(){ renderTable(); });
})();

window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

    // If there's no #sidebarToggle element in the markup, inject a simple
    // hamburger button into the `.topbar` so mobile users can open the drawer.
    function ensureHamburger() {
        const topbar = document.body.querySelector('.topbar');
        if (!topbar) return;

        let btn = document.getElementById('sidebarToggle');
        if (btn) return; // already exists

        btn = document.createElement('button');
        btn.id = 'sidebarToggle';
        btn.className = 'hamburger-btn';
        btn.type = 'button';
        btn.setAttribute('aria-label', 'Abrir menu');
        btn.innerHTML = '<span class="bar"></span><span class="bar"></span><span class="bar"></span>';

        // Prefer to place the hamburger next to the search input if present
        const search = topbar.querySelector('.search');
        if (search && search.parentNode) {
            // insert before the search element so it appears left of the search box
            search.parentNode.insertBefore(btn, search);
        } else {
            topbar.insertBefore(btn, topbar.firstChild);
        }

        // Add backdrop element
        if (!document.getElementById('sidebarBackdrop')) {
            const backdrop = document.createElement('div');
            backdrop.id = 'sidebarBackdrop';
            document.body.appendChild(backdrop);
            backdrop.addEventListener('click', () => {
                document.body.classList.remove('sb-sidenav-toggled');
            });
        }

        // Wire the button to toggle the body class used by CSS
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
        });

        // Close sidebar when a menu link is clicked (better UX on mobile)
        const menu = document.getElementById('menu');
        if (menu) {
            menu.addEventListener('click', (ev) => {
                const target = ev.target.closest('a');
                if (target) {
                    // small delay so navigation feels natural (if link navigates)
                    document.body.classList.remove('sb-sidenav-toggled');
                }
            });
        }

        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') document.body.classList.remove('sb-sidenav-toggled');
        });
    }

    ensureHamburger();

});


     