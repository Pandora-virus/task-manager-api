// DOM Elements
const authSection = document.getElementById('auth-section');
const projectsSection = document.getElementById('projects-section');
const boardSection = document.getElementById('board-section');
const authMessage = document.getElementById('auth-message');
const projectsMessage = document.getElementById('projects-message');
const boardMessage = document.getElementById('board-message');
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const createProjectForm = document.getElementById('create-project-form');
const addTaskForm = document.getElementById('add-task-form');
const modal = document.getElementById('add-task-modal');
const modalCancel = document.getElementById('modal-cancel');
const modalTitle = document.getElementById('modal-title');
const modalSubmit = document.getElementById('modal-submit');
const editingTaskId = document.getElementById('editing-task-id');
const backToProjects = document.getElementById('back-to-projects');
const logoutButton = document.getElementById('logout-button');
const createProjectToggle = document.getElementById('create-project-toggle');
const loadProjectsButton = document.getElementById('load-projects');
const boardProjectName = document.getElementById('board-project-name');
const boardProjectDescription = document.getElementById('board-project-description');
const tabRegister = document.getElementById('tab-register');
const tabLogin = document.getElementById('tab-login');

// State
const state = {
  token: localStorage.getItem('authToken') || '',
  selectedProject: null,
  selectedColumn: null
};

// Helper Functions
function setMessage(element, text, isError = true) {
  element.textContent = text;
  element.classList.toggle('error', isError);
  element.classList.toggle('success', !isError);
}

function setToken(token) {
  state.token = token;
  localStorage.setItem('authToken', token);
}

function clearToken() {
  state.token = '';
  localStorage.removeItem('authToken');
  state.selectedProject = null;
}

function showSection(section) {
  authSection.classList.add('hidden');
  projectsSection.classList.add('hidden');
  boardSection.classList.add('hidden');
  section.classList.remove('hidden');
}

function setActiveTab(tab) {
  tabRegister.classList.toggle('active', tab === 'register');
  tabLogin.classList.toggle('active', tab === 'login');
  registerForm.classList.toggle('active', tab === 'register');
  loginForm.classList.toggle('active', tab === 'login');
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (state.token) {
    headers.Authorization = `Bearer ${state.token}`;
  }
  const response = await fetch(path, { ...options, headers });
  const body = await response.json().catch(() => ({}));
  return { status: response.status, body };
}

// Auth Functions
async function registerUser(event) {
  event.preventDefault();
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  const { status, body } = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  });

  if (status === 201) {
    setMessage(authMessage, 'Cadastro realizado! Faça login agora.', false);
    setActiveTab('login');
    registerForm.reset();
  } else {
    setMessage(authMessage, body.error || 'Erro no cadastro.');
  }
}

async function loginUser(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const { status, body } = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });

  if (status === 200) {
    setToken(body.token);
    setMessage(authMessage, 'Login realizado com sucesso!', false);
    showSection(projectsSection);
    loginForm.reset();
  } else {
    setMessage(authMessage, body.error || 'Erro no login.');
  }
}

function logout() {
  clearToken();
  showSection(authSection);
  setMessage(authMessage, 'Desconectado.', false);
  setActiveTab('register');
  registerForm.reset();
  loginForm.reset();
}

// Projects Functions
async function loadProjects() {
  const { status, body } = await request('/projects');
  if (status === 200) {
    const grid = document.getElementById('projects-grid');
    grid.innerHTML = '';
    if (!body || body.length === 0) {
      grid.innerHTML = '<p>Nenhum projeto encontrado.</p>';
      return;
    }

    body.forEach((project) => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.innerHTML = `
        <h3>${project.name}</h3>
        <p>${project.description || 'Sem descrição'}</p>
        <button>Abrir</button>
      `;
      card.querySelector('button').addEventListener('click', () => openProject(project));
      grid.appendChild(card);
    });
    setMessage(projectsMessage, 'Projetos carregados com sucesso.', false);
  } else {
    setMessage(projectsMessage, body.error || 'Erro ao carregar projetos.');
  }
}

async function createProject(event) {
  event.preventDefault();
  const name = document.getElementById('project-name').value;
  const description = document.getElementById('project-description').value;

  const { status, body } = await request('/projects', {
    method: 'POST',
    body: JSON.stringify({ name, description })
  });

  if (status === 201) {
    setMessage(projectsMessage, 'Projeto criado com sucesso!', false);
    createProjectForm.reset();
    createProjectForm.classList.remove('active');
    createProjectForm.classList.add('hidden');
    loadProjects();
  } else {
    setMessage(projectsMessage, body.error || 'Erro ao criar projeto.');
  }
}

function toggleCreateProjectForm(event) {
  event.preventDefault();
  createProjectForm.classList.toggle('active');
  createProjectForm.classList.toggle('hidden');
}

// Board Functions
async function openProject(project) {
  state.selectedProject = project;
  boardProjectName.textContent = project.name;
  boardProjectDescription.textContent = project.description || 'Sem descrição';
  showSection(boardSection);
  loadBoard();
}

async function loadBoard() {
  if (!state.selectedProject) return;

  const { status, body } = await request(`/projects/${state.selectedProject.id}/tasks`);
  if (status !== 200) {
    setMessage(boardMessage, body.error || 'Erro ao carregar tarefas.');
    return;
  }

  const tasks = body || [];
  
  // Clear columns
  document.getElementById('tasks-pending').innerHTML = '';
  document.getElementById('tasks-in_progress').innerHTML = '';
  document.getElementById('tasks-done').innerHTML = '';

  // Populate columns
  tasks.forEach(task => {
    const container = document.getElementById(`tasks-${task.status}`);
    if (container) {
      const card = createTaskCard(task);
      container.appendChild(card);
    }
  });

  updateTaskCounts();
  setupDragAndDrop();
}



function createTaskCard(task) {
  const card = document.createElement('div');
  card.className = 'task-card';
  card.draggable = true;
  card.dataset.taskId = task.id;
  card.dataset.status = task.status;
  card.innerHTML = `
    <p class="task-title">${task.title}</p>
    <p class="task-description">${task.description || '-'}</p>
    <div class="task-actions">
      <button class="edit-task">Editar</button>
      <button class="delete-task">Excluir</button>
    </div>
  `;

  const editBtn = card.querySelector('.edit-task');
  const deleteBtn = card.querySelector('.delete-task');

  editBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openEditTaskModal(task);
  });

  deleteBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    const ok = confirm('Confirma exclusão desta tarefa?');
    if (!ok) return;
    const { status, body } = await request(
      `/projects/${state.selectedProject.id}/tasks/${task.id}`,
      { method: 'DELETE' }
    );
    if (status === 200 || status === 204) {
      card.remove();
      updateTaskCounts();
      setMessage(boardMessage, 'Tarefa excluída com sucesso!', false);
    } else {
      setMessage(boardMessage, body.error || 'Erro ao excluir tarefa.');
      loadBoard();
    }
  });

  card.addEventListener('dragstart', handleDragStart);
  card.addEventListener('dragend', handleDragEnd);

  return card;
}

function updateTaskCounts() {
  document.querySelectorAll('.kanban-column').forEach(column => {
    const count = column.querySelector('.tasks-container').children.length;
    column.querySelector('.task-count').textContent = count;
  });
}

// Drag and Drop
let draggedCard = null;

function handleDragStart(e) {
  draggedCard = this;
  this.classList.add('dragging');
  try {
    if (e.dataTransfer) {
      e.dataTransfer.setData('text/plain', this.dataset.taskId || '');
      e.dataTransfer.effectAllowed = 'move';
    }
  } catch (err) {
    // ignore if dataTransfer is not available
  }
}

function handleDragEnd(e) {
  this.classList.remove('dragging');
  document.querySelectorAll('.tasks-container').forEach(c => c.classList.remove('drag-over'));
  draggedCard = null;
  try {
    if (e.dataTransfer) e.dataTransfer.clearData();
  } catch (err) {}
}

function setupDragAndDrop() {
  document.querySelectorAll('.kanban-column').forEach(column => {
    const container = column.querySelector('.tasks-container');

    // Ensure both the column and its inner container accept drag events
    const handleOver = (e) => {
      e.preventDefault();
      container.classList.add('drag-over');
    };
    const handleLeave = () => container.classList.remove('drag-over');

    column.addEventListener('dragover', handleOver);
    column.addEventListener('dragleave', handleLeave);

    if (container) {
      container.addEventListener('dragover', handleOver);
      container.addEventListener('dragleave', handleLeave);

      container.addEventListener('drop', async (e) => {
        e.preventDefault();
        container.classList.remove('drag-over');

        // Try to determine the dragged card: prefer the live reference, fallback to dataTransfer
        let taskId = null;
        let oldStatus = null;
        if (draggedCard) {
          taskId = draggedCard.dataset.taskId;
          oldStatus = draggedCard.dataset.status;
        } else if (e.dataTransfer) {
          try {
            taskId = e.dataTransfer.getData('text/plain');
          } catch (err) {
            taskId = null;
          }
          if (taskId) {
            draggedCard = document.querySelector(`[data-task-id="${taskId}"]`);
            if (draggedCard) oldStatus = draggedCard.dataset.status;
          }
        }

        if (!taskId) return;

        const newStatus = column.dataset.status;

        if (newStatus === oldStatus) {
          if (draggedCard) container.appendChild(draggedCard);
          updateTaskCounts();
          return;
        }

        const { status, body } = await request(
          `/projects/${state.selectedProject.id}/tasks/${taskId}`,
          { method: 'PUT', body: JSON.stringify({ status: newStatus }) }
        );

        if (status === 200) {
          if (draggedCard) draggedCard.dataset.status = newStatus;
          container.appendChild(draggedCard || document.querySelector(`[data-task-id="${taskId}"]`));
          updateTaskCounts();
          setMessage(boardMessage, 'Tarefa movida!', false);
        } else {
          setMessage(boardMessage, body.error || 'Erro ao mover tarefa.');
          loadBoard();
        }
      });
    }
  });
}

function handleDragOver(e) {
  e.preventDefault();
  this.classList.add('drag-over');
}

function handleDragLeave(e) {
  this.classList.remove('drag-over');
}

async function handleDrop(e) {
  e.preventDefault();
  this.classList.remove('drag-over');

  if (!draggedCard) return;

  const column = this.closest('.kanban-column');
  if (!column) return;

  const newStatus = column.dataset.status;
  const taskId = draggedCard.dataset.taskId;
  const oldStatus = draggedCard.dataset.status;

  if (newStatus === oldStatus) {
    this.appendChild(draggedCard);
    updateTaskCounts();
    return;
  }

  const { status, body } = await request(
    `/projects/${state.selectedProject.id}/tasks/${taskId}`,
    {
      method: 'PUT',
      body: JSON.stringify({ status: newStatus })
    }
  );

  if (status === 200) {
    draggedCard.dataset.status = newStatus;
    this.appendChild(draggedCard);
    updateTaskCounts();
    setMessage(boardMessage, 'Tarefa movida com sucesso!', false);
  } else {
    setMessage(boardMessage, body.error || 'Erro ao atualizar tarefa.');
    loadBoard(); // Reload to sync
  }
}

// Modal and Task Creation
function openAddTaskModal(status) {
  state.selectedColumn = status;
  modal.dataset.mode = 'create';
  editingTaskId.value = '';
  modalTitle.textContent = 'Nova Tarefa';
  modalSubmit.textContent = 'Criar';
  addTaskForm.reset();
  modal.classList.remove('hidden');
}

function closeAddTaskModal() {
  modal.classList.add('hidden');
  addTaskForm.reset();
  editingTaskId.value = '';
}

function openEditTaskModal(task) {
  state.selectedColumn = task.status;
  modal.dataset.mode = 'edit';
  editingTaskId.value = task.id;
  modalTitle.textContent = 'Editar Tarefa';
  modalSubmit.textContent = 'Salvar';
  document.getElementById('task-title').value = task.title;
  document.getElementById('task-description').value = task.description || '';
  modal.classList.remove('hidden');
}

async function addTask(event) {
  event.preventDefault();
  if (!state.selectedProject || !state.selectedColumn) return;

  const title = document.getElementById('task-title').value;
  const description = document.getElementById('task-description').value;
  const editingId = editingTaskId.value;

  if (editingId) {
    // Edit existing task
    const { status, body } = await request(
      `/projects/${state.selectedProject.id}/tasks/${editingId}`,
      { method: 'PUT', body: JSON.stringify({ title, description, status: state.selectedColumn }) }
    );

    if (status === 200) {
      setMessage(boardMessage, 'Tarefa atualizada com sucesso!', false);
      closeAddTaskModal();
      loadBoard();
    } else {
      setMessage(boardMessage, body.error || 'Erro ao atualizar tarefa.');
    }
    return;
  }

  // Create new task
  const { status, body } = await request(
    `/projects/${state.selectedProject.id}/tasks`,
    {
      method: 'POST',
      body: JSON.stringify({ title, description, status: state.selectedColumn })
    }
  );

  if (status === 201) {
    setMessage(boardMessage, 'Tarefa criada com sucesso!', false);
    closeAddTaskModal();
    loadBoard();
  } else {
    setMessage(boardMessage, body.error || 'Erro ao criar tarefa.');
  }
}

// Event Listeners
registerForm.addEventListener('submit', registerUser);
loginForm.addEventListener('submit', loginUser);
logoutButton.addEventListener('click', logout);
backToProjects.addEventListener('click', () => showSection(projectsSection));

if (createProjectToggle) {
  createProjectToggle.addEventListener('click', toggleCreateProjectForm);
} else {
  console.error('Botão + Novo projeto não encontrado no DOM.');
}

createProjectForm.addEventListener('submit', createProject);
loadProjectsButton.addEventListener('click', (event) => {
  event.preventDefault();
  loadProjects();
});
addTaskForm.addEventListener('submit', addTask);
modalCancel.addEventListener('click', closeAddTaskModal);
tabRegister.addEventListener('click', () => setActiveTab('register'));
tabLogin.addEventListener('click', () => setActiveTab('login'));

// Add-task button listeners
document.querySelectorAll('.add-task-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const status = e.target.closest('.kanban-column').dataset.status;
    openAddTaskModal(status);
  });
});

// Initialize
if (state.token) {
  showSection(projectsSection);
  loadProjects();
} else {
  showSection(authSection);
  setActiveTab('register');
}
