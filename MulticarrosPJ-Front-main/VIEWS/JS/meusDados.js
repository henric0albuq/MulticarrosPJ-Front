const btnEditar = document.getElementById("btnEditar");
const popup = document.getElementById("popupEditar");
const fecharPopup = document.getElementById("fecharPopup");
const salvarEdicao = document.getElementById("salvarEdicao");

// Abre popup
btnEditar.addEventListener("click", () => {
  popup.style.display = "flex";
});

// Fecha popup
fecharPopup.addEventListener("click", () => {
  popup.style.display = "none";
});

// Salvar alterações simuladas (sem backend ainda)
salvarEdicao.addEventListener("click", () => {
  const novoEmail = document.getElementById("editEmail").value;
  const novoTelefone = document.getElementById("editTelefone").value;
  const novaSenha = document.getElementById("editSenha").value;

  if (novoEmail) document.getElementById("emailCliente").textContent = novoEmail;
  if (novoTelefone) document.getElementById("telefoneCliente").textContent = novoTelefone;
  if (novaSenha) document.getElementById("senhaCliente").textContent = "********";

  popup.style.display = "none";
});
