
  const form = document.getElementById("boletoForm");
  const msg = document.getElementById("msgSucesso");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = document.getElementById("pagador").value.trim();
    const parcela = document.getElementById("parcela").value.trim();
    const vencimento = document.getElementById("vencimento").value;
    const descricao = document.getElementById("descricao").value.trim();
    const arquivo = document.getElementById("arquivo").files[0];

    if (!arquivo) {
      alert("Por favor, anexe o arquivo PDF do boleto.");
      return;
    }

    // Simulação de cadastro (sem servidor ainda)
    console.log("📄 Boleto cadastrado:", {
      nome,
      parcela,
      vencimento,
      descricao,
      arquivoNome: arquivo.name
    });

    form.reset();
    msg.style.display = "block";

    // Oculta mensagem após 3 segundos
    setTimeout(() => {
      msg.style.display = "none";
    }, 3000);
  });


