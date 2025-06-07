// Verificación de login
if (localStorage.getItem("loggedIn") !== "true") {
  window.location.href = "login.html";
}

// Logout
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";
});

// Obtener y mostrar los recordatorios
async function fetchReminders() {
  const res = await fetch("/api/reminders");
  const data = await res.json();
  renderReminders(data);
}

// Eliminar un recordatorio por ID
async function deleteReminder(id) {
  await fetch(`/api/reminders/${id}`, { method: "DELETE" });
  fetchReminders();
}

// Crear un nuevo recordatorio
document.getElementById("reminderForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const date = document.getElementById("date").value;

  if (!title || !description || !date) {
    alert("Por favor, completá todos los campos.");
    return;
  }

  await fetch("/api/reminders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, date })
  });

  fetchReminders();
  this.reset();

  const toast = new bootstrap.Toast(document.getElementById('liveToast'));
  toast.show();
});

// Renderizar recordatorios
function renderReminders(reminders) {
  reminders.sort((a, b) => new Date(a.date) - new Date(b.date));
  const container = document.getElementById("remindersContainer");
  container.innerHTML = "";

  reminders.forEach(reminder => {
    const card = document.createElement("div");
    card.className = "card mb-3 expanded";

    card.innerHTML = `
      <div class="card-body">
        <button class="toggle-btn btn btn-sm btn-outline-secondary" title="Expandir/Contraer">🔽</button>
        <button class="boton-borrar" title="Eliminar">🗑️</button>
        <h5 class="card-title">${reminder.title}</h5>
        <p class="card-text description">${reminder.description}</p>
        <p class="card-text date"><small class="text-muted">📅 ${reminder.date}</small></p>
      </div>
    `;

    container.appendChild(card);

    // Toggle
    const toggleBtn = card.querySelector('.toggle-btn');
    toggleBtn.addEventListener('click', () => {
      card.classList.toggle('collapsed');
      card.classList.toggle('expanded');
    });

    // Borrar
    const deleteBtn = card.querySelector('.boton-borrar');
    deleteBtn.addEventListener('click', () => {
      deleteReminder(reminder._id);
    });
  });
}

// Iniciar
fetchReminders();
