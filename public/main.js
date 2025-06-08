// Verificación de login
if (localStorage.getItem("loggedIn") !== "true") {
  window.location.href = "login.html";
}

// Logout
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";
});

let reminders = []; // global para poder usarla en edición

// Obtener y mostrar los recordatorios
async function fetchReminders() {
  const res = await fetch("/api/reminders");
  reminders = await res.json();
  renderReminders(reminders);
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
function renderReminders(data) {
  const container = document.getElementById("remindersContainer");
  container.innerHTML = "";

  data.sort((a, b) => new Date(a.date) - new Date(b.date));

  data.forEach(reminder => {
    const card = document.createElement("div");
    card.className = "card mb-3 expanded";

    card.innerHTML = `
      <div class="card-body">
      
        
        <h5 class="card-title">${reminder.title}</h5>
        <p class="card-text description">${reminder.description}</p>
        <p class="card-text date"><small class="text-muted">📅 ${reminder.date}</small></p>
        <div class="botones-accion">
          <button class="edit-btn btn btn-warning btn-sm mt-2" onclick="openEditForm('${reminder._id}')">Editar</button>
          <button class="toggle-btn btn btn-sm btn-outline-secondary" title="Expandir/Contraer">🔽</button>
          <button class="boton-borrar" title="Eliminar">🗑️</button>
         </div>
      </div>
    `;

    // Eventos individuales
    card.querySelector('.toggle-btn').addEventListener('click', () => {
      card.classList.toggle('collapsed');
      card.classList.toggle('expanded');
    });

    card.querySelector('.boton-borrar').addEventListener('click', () => {
      deleteReminder(reminder._id);
    });

    container.appendChild(card);
  });
}

// Abrir modal de edición
function openEditForm(id) {
  const reminder = reminders.find(r => r._id === id);
  if (reminder) {
    document.getElementById("editId").value = reminder._id;
    document.getElementById("editTitulo").value = reminder.title;
    document.getElementById("editDescripcion").value = reminder.description;
    document.getElementById("editFecha").value = reminder.date.substring(0, 10);
    document.getElementById("editModal").style.display = "block";
  }
}

// Cerrar modal
function closeEditForm() {
  document.getElementById("editModal").style.display = "none";
}

// Enviar cambios
async function submitEdit(e) {
  e.preventDefault();

  const id = document.getElementById("editId").value;
  const data = {
    title: document.getElementById("editTitulo").value,
    description: document.getElementById("editDescripcion").value,
    date: document.getElementById("editFecha").value
  };

  try {
    const res = await fetch(`/api/reminders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      closeEditForm();
      fetchReminders(); // actualizar lista
    } else {
      const err = await res.json();
      alert("Error al actualizar: " + err.message);
    }
  } catch (err) {
    console.error(err);
    alert("Error al actualizar");
  }
}

// Iniciar app
fetchReminders();
