 const btnNovoVeiculo = document.getElementById('btnNovoVeiculo');
 btnNovoVeiculo.addEventListener('click', () => {
  window.location.href = "cadastrar.html";
});
    const modal = document.getElementById('modalVeiculo');
    const btnCancelar = document.getElementById('btnCancelar');
    const btnSalvar = document.getElementById('btnSalvar');
    const tabela = document.getElementById('tabelaVeiculo').querySelector('tbody');
    const searchInput = document.getElementById('searchInput');

    btnNovoVeiculo.addEventListener('click', () => {
      modal.style.display = 'flex';
    });

    btnCancelar.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    btnSalvar.addEventListener('click', () => {
      const modelo = document.getElementById('modelo').value;
      const cor = document.getElementById('cor').value;
      const Placa = document.getElementById('placa').value;
      const Marca = document.getElementById('marca').value;
      const AnoFabricacao = document.getElementById('ano fabricação').value;
      const AnoModelo = document.getElementById('ano modelo').value;


      if (!modelo || !cor || !placa || !marca || !anofabricação || !anoModelo) {
        alert('Preencha todos os campos!');
        return;
      }

      const novaLinha = document.createElement('tr');
      novaLinha.innerHTML = `
        <td>${modelo}</td>
        <td>${Cor}</td>
        <td>${Placa}</td>
        <td>${Marca}</td>
        <td>${AnoFabricacao}</td>
        <td>${AnoModelo}</td>
        <td><button class="btn-detalhes">Ver Detalhes</button></td>
      `;
      tabela.appendChild(novaLinha);

      document.querySelectorAll('#modalVeiculo input').forEach(i => i.value = '');
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

