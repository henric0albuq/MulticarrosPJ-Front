// Abre/fecha filtros
    document.addEventListener("DOMContentLoaded", function() {
      document.querySelectorAll('.filtro-titulo').forEach(function(titulo){
        titulo.addEventListener('click', function(){
          titulo.parentElement.classList.toggle('active');
        });
      });
      // Abre todos por padrão
      document.querySelectorAll('.filtro-box').forEach(function(box){
        box.classList.add('active');
      });
    });

//redes socias flutuantes
    document.querySelector('.social-float').addEventListener('click', function(e) {
    this.classList.toggle('active');
    e.stopPropagation();
  });
  document.addEventListener('click', function() {
    document.querySelector('.social-float').classList.remove('active');
  });

