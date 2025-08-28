document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("myForm");
  const errorDiv = document.getElementById("errors");

  const fields = {
    nome: document.getElementById("nome"),
    cpf: document.getElementById("cpf"),
    login: document.getElementById("login"),
    email: document.getElementById("email"),
    password: document.getElementById("password"),
    confirmPassword: document.getElementById("confirmPassword"),
    salario: document.getElementById("salario"),
    numeroDependentes: document.getElementById("numeroDependentes"),
    impostoRenda: document.getElementById("impostoRenda"),
  };

  const validators = {
    required: (val) => val && val.trim() !== "",
    email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    password: (val) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(val),
    cpf: (val) => val.replace(/\D/g, "").length === 11,
    numberPositive: (val) => !isNaN(val) && parseFloat(val) > 0,
    numberNonNegative: (val) => !isNaN(val) && parseInt(val) >= 0,
  };

  const rules = {
    nome: [{ check: "required", message: "Campo obrigatório" }],
    cpf: [
      { check: "required", message: "Campo obrigatório" },
      { check: "cpf", message: "CPF deve ter 11 dígitos." },
    ],
    login: [{ check: "required", message: "Campo obrigatório" }],
    email: [
      { check: "required", message: "Campo obrigatório" },
      { check: "email", message: "Email inválido" },
    ],
    password: [
      { check: "required", message: "Campo obrigatório" },
      { check: "password", message: "A senha deve ter pelo menos 8 caracteres, incluindo letras e números." },
    ],
    confirmPassword: [
      { check: "required", message: "Campo obrigatório" },
      { check: (val, all) => val === all.password, message: "As senhas não coincidem." },
    ],
    salario: [
      { check: "required", message: "Campo obrigatório" },
      { check: "numberPositive", message: "Salário deve ser um número válido maior que zero." },
    ],
    numeroDependentes: [
      { check: "required", message: "Campo obrigatório" },
      { check: "numberNonNegative", message: "Número de dependentes deve ser >= 0." },
    ],
  };

  function showFieldError(id, message) {
    const input = fields[id];
    input.style.border = "2px solid red";

    let errorDiv = input.parentNode.querySelector(".error-message");
    if (!errorDiv) {
      errorDiv = document.createElement("div");
      errorDiv.className = "error-message";
      input.parentNode.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
  }

  function clearFieldError(id) {
    const input = fields[id];
    input.style.border = "";
    const errorDiv = input.parentNode.querySelector(".error-message");
    if (errorDiv) errorDiv.remove();
  }

  function validateAll() {
    let hasError = false;
    errorDiv.innerHTML = "";
    errorDiv.style.display = "none";

    Object.keys(rules).forEach((id) => clearFieldError(id));

    const values = Object.fromEntries(
      Object.entries(fields).map(([id, el]) => [id, el.value])
    );

    for (const [id, validations] of Object.entries(rules)) {
      for (const { check, message } of validations) {
        let isValid = typeof check === "string"
          ? validators[check](values[id])
          : check(values[id], values);

        if (!isValid) {
          showFieldError(id, message);
          hasError = true;
          break; 
        }
      }
    }

    if (hasError) {
      errorDiv.innerHTML = "Existem campos inválidos. Corrija-os e tente novamente.";
      errorDiv.style.display = "block";
    }

    return !hasError;
  }

  function calculateIR() {
    const salarioRaw = fields.salario.value;
    const salario = parseFloat(String(salarioRaw).replace(',', '.')) || 0;
    const dependentes = parseInt(fields.numeroDependentes.value, 10);
    const dep = isNaN(dependentes) ? 0 : dependentes;
    let base = salario - (200 * dep);
    if (isNaN(base) || base < 0) base = 0;
    const aliquota = 0.15; // alíquota fixa
    const ir = Math.round(base * aliquota * 100) / 100;
    fields.impostoRenda.value = ir.toFixed(2).replace('.', ',');
  }

  // calcular ao sair do campo numeroDependentes
  if (fields.numeroDependentes) {
    fields.numeroDependentes.addEventListener('blur', calculateIR);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

  // Garantir cálculo do IR antes da validação (caso o campo não tenha perdido o foco)
  try { calculateIR(); console.log('IR calculado:', fields.impostoRenda.value); } catch (err) { console.warn('Erro ao calcular IR:', err); }

  if (!validateAll()) return;

    Toastify({
      text: "Cadastro realizado com sucesso!",
      duration: 3000,
      gravity: "top",
      position: "right",
      style: {
        background: "#4CAF50",
        fontSize: "16px",
        padding: "20px",
        minWidth: "300px",
        borderRadius: "8px",
      },
    }).showToast();

    form.reset();
  });
});

const togglePassword = document.getElementById('togglePassword');
const password = document.getElementById('password');

togglePassword.addEventListener('click', () => {
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    // opcional: trocar a imagem do olho
    togglePassword.src = type === 'password' ? 'olho.png' : 'olho-aberto.png';
});
