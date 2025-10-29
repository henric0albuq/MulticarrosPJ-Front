 const btnNovoCliente = document.getElementById('btnNovoCliente');
 btnNovoCliente.addEventListener('click', () => {
  window.location.href = "cadastrarCliente.html";
});
    const modal = document.getElementById('modalCliente');
    const btnCancelar = document.getElementById('btnCancelar');
    const btnSalvar = document.getElementById('btnSalvar');
    const tabela = document.getElementById('tabelaClientes').querySelector('tbody');
    const searchInput = document.getElementById('searchInput');

    btnNovoCliente.addEventListener('click', () => {
      modal.style.display = 'flex';
    });

    btnCancelar.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    btnSalvar.addEventListener('click', () => {
      const nome = document.getElementById('nome').value;
      const email = document.getElementById('email').value;
      const telefone = document.getElementById('telefone').value;
      const cpf = document.getElementById('cpf').value;
      const carro = document.getElementById('carro').value;

      if (!nome || !email || !telefone || !cpf || !carro) {
        alert('Preencha todos os campos!');
        return;
      }

      const novaLinha = document.createElement('tr');
      novaLinha.innerHTML = `
        <td>${nome}</td>
        <td>${email}</td>
        <td>${telefone}</td>
        <td>${cpf}</td>
        <td>${carro}</td>
        <td><button class="btn-detalhes">Ver Detalhes</button></td>
      `;
      tabela.appendChild(novaLinha);

      document.querySelectorAll('#modalCliente input').forEach(i => i.value = '');
      modal.style.display = 'none';
    });

    // Filtrar tabela
    searchInput.addEventListener('keyup', function() {
      const filter = searchInput.value.toLowerCase();
      const rows = tabela.getElementsByTagName('tr');
      for (let row of rows) {
        const cells = row.getElementsByTagName('td');
        const match = Array.from(cells).some(cell => 
          cell.textContent.toLowerCase().includes(filter)
        );
        row.style.display = match ? '' : 'none';
      }
    });

    // Fechar modal ao clicar fora
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });

    const btnVoltar = document.getElementById('btnVoltar');
btnVoltar.addEventListener('click', () => {
  window.location.href = "dashboard.html";
});
