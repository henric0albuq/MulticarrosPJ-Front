const form = document.getElementById("loginForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const user = document.getElementById("user").value.trim().toLowerCase();
    const pass = document.getElementById("pass").value.trim();

    // Simulação de usuários
    const adminUser = { email: "admin", senha: "123456" };
    const clienteUser = { email: "cliente", senha: "654321" };

    if (user === adminUser.email && pass === adminUser.senha) {
      alert("Login de administrador realizado com sucesso!");
      window.location.href = "dashboard.html";
    } else if (user === clienteUser.email && pass === clienteUser.senha) {
      alert("Login de cliente realizado com sucesso!");
      window.location.href = "dashboardCliente.html";
    } else {
      alert("Usuário ou senha incorretos. Tente novamente.");
    }
  });
