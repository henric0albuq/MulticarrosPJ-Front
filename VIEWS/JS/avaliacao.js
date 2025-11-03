
const btnAvaliacao = document.getElementById("btnAvaliacao");
const popupAvaliacao = document.getElementById("popupAvaliacao");
const emojis = document.querySelectorAll(".emoji");
const mensagemAvaliacao = document.getElementById("mensagemAvaliacao");

btnAvaliacao.addEventListener("click", () => {
  popupAvaliacao.style.display =
    popupAvaliacao.style.display === "block" ? "none" : "block";
});

emojis.forEach(emoji => {
  emoji.addEventListener("click", () => {
    const feedback = emoji.getAttribute("data-feedback");
    mensagemAvaliacao.textContent = `Obrigado pelo seu feedback ${feedback}`;
    mensagemAvaliacao.style.color = "#24aa4c";
    setTimeout(() => {
      popupAvaliacao.style.display = "none";
      mensagemAvaliacao.textContent = "";
    }, 2000);
  });
});


