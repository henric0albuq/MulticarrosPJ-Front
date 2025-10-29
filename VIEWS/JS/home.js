
  const btnMarcas = document.getElementById('btnMarcas');
  const listaMarcas = document.getElementById('listaMarcas');

  btnMarcas.addEventListener('click', () => {
    listaMarcas.classList.toggle('ativa');

    // Rotacionar seta
    const seta = btnMarcas.querySelector('.seta');
    seta.style.transform = listaMarcas.classList.contains('ativa')
      ? 'rotate(180deg)'
      : 'rotate(0deg)';

    // Animação em cascata nos itens
    const itens = listaMarcas.querySelectorAll('li');
    itens.forEach((item, i) => {
      item.style.transitionDelay = listaMarcas.classList.contains('ativa')
        ? `${i * 0.05}s`
        : '0s';
    });
  });

  // Fecha a lista se clicar fora
  document.addEventListener('click', (e) => {
    if (!btnMarcas.contains(e.target) && !listaMarcas.contains(e.target)) {
      listaMarcas.classList.remove('ativa');
      btnMarcas.querySelector('.seta').style.transform = 'rotate(0deg)';
    }
  });


