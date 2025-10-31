// Troca da imagem principal ao clicar nas miniaturas
function mudarImagem(imagem) {
  const fotoPrincipal = document.getElementById("fotoPrincipal");
  fotoPrincipal.src = imagem.src;
}

