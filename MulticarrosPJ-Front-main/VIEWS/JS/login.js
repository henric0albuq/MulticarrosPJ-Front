const form = document.getElementById("loginForm");
const btn = form.querySelector(".btn");

// ANIMAÇÃO de entrada do card
window.addEventListener("DOMContentLoaded", () => {
  const card = document.querySelector(".auth-card");
  card.style.opacity = "0";
  card.style.transform = "translateY(-30px)";
  setTimeout(() => {
    card.style.transition = "all 0.8s ease";
    card.style.opacity = "1";
    card.style.transform = "translateY(0)";
  }, 150);
});

// LOGIN COM MINI LOADER + SPINNER
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const user = document.getElementById("user").value.trim().toLowerCase();
  const pass = document.getElementById("pass").value.trim();

  // Adiciona spinner e desativa botão
  btn.classList.add("loading");
  btn.innerHTML = "Verificando...";
  btn.disabled = true;

  setTimeout(() => {
    const adminUser = { email: "admin", senha: "123456" };
    const clienteUser = { email: "cliente", senha: "654321" };

    // === LOGIN ADMIN ===
    if (user === adminUser.email && pass === adminUser.senha) {
      btn.innerHTML = "✅ Acesso Liberado!";
      btn.style.background = "#24aa4c";
      btn.classList.remove("loading");

      // Dá um tempo pra animação aparecer antes do redirecionamento
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1200);

    // === LOGIN CLIENTE ===
    } else if (user === clienteUser.email && pass === clienteUser.senha) {
      btn.innerHTML = "✅ Acesso Liberado!";
      btn.style.background = "#24aa4c";
      btn.classList.remove("loading");

      setTimeout(() => {
        window.location.href = "dashboardCliente.html";
      }, 1200);

// Função de transição suave
function fadeOutAndRedirect(url) {
  const card = document.querySelector(".auth-card");
  card.style.transition = "opacity 0.6s ease";
  card.style.opacity = "0";
  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 600);
}


    // === LOGIN INVÁLIDO ===
    } else {
      btn.innerHTML = "❌ Dados Inválidos";
      btn.style.background = "#a72626";
      btn.classList.remove("loading");
      setTimeout(() => {
        btn.innerHTML = "Entrar";
        btn.disabled = false;
        btn.style.background = "";
      }, 1500);
    }
  }, 1000);
});

const toggleSenha = document.querySelector(".toggle-senha");
const inputSenha = document.getElementById("pass");

toggleSenha.addEventListener("click", () => {
  const tipo = inputSenha.getAttribute("type") === "password" ? "text" : "password";
  inputSenha.setAttribute("type", tipo);

  toggleSenha.classList.toggle("fa-eye");
  toggleSenha.classList.toggle("fa-eye-slash");
});

// EFEITO DE FOCO NOS INPUTS
const inputs = document.querySelectorAll(".input-group input");

inputs.forEach(input => {
  input.addEventListener("focus", () => {
    input.parentElement.classList.add("focused");
  });
  input.addEventListener("blur", () => {
    if (input.value === "") {
      input.parentElement.classList.remove("focused");
    }
  });
});