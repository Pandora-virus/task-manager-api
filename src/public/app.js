const authSection = document.getElementById('auth-section');
const appSection = document.getElementById('app-section');
const authMessage = document.getElementById('auth-message');
const appMessage = document.getElementById('app-message');
const tokenDisplay = document.getElementById('token-display');
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const createProjectForm = document.getElementById('create-project-form');
const createTaskForm = document.getElementById('create-task-form');
const projectsList = document.getElementById('projects-list');
const tasksList = document.getElementById('tasks-list');
const selectedProjectName = document.getElementById('selected-project-name');
const projectDetailsSection = document.getElementById('project-details');
const tabRegister = document.getElementById('tab-register');
const tabLogin = document.getElementById('tab-login');
const logoutButton = document.getElementById('logout-button');
const createProjectToggle = document.getElementById('create-project-toggle');
const createTaskToggle = document.getElementById('create-task-toggle');
const loadProjectsButton = document.getElementById('load-projects');

const state = {
  token: localStorage.getItem('authToken') || '',
  selectedProject: null
};

function setMessage(element, text, isError = true) {
  element.textContent = text;
  element.classList.toggle('error', isError);
  element.classList.toggle('success', !isError);
}

function setToken(token) {
  state.token = token;
  localStorage.setItem('authToken', token);
  tokenDisplay.textContent = token || '-';
}

function clearToken() {
  state.token = '';
  localStorage.removeItem('authToken');
  tokenDisplay.textContent = '-';
  state.selectedProject = null;
}

function showAppSection() {
  authSection.classList.add('hidden');
  appSection.classList.remove('hidden');
}

function showAuthSection() {
  authSection.classList.remove('hidden');
  appSection.classList.add('hidden');
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
  return response.json().then((body) => ({ status: response.status, body }));
}

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
    setMessage(authMessage, 'Cadastro realizado com sucesso.', false);
    setActiveTab('login');
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
    setMessage(authMessage, 'Login realizado com sucesso.', false);
    showAppSection();
  } else {
    setMessage(authMessage, body.error || 'Erro no login.');
  }
}

async function loadProjects() {
  const { status, body } = await request('/projects');
  if (status === 200) {
    projectsList.innerHTML = '';
    if (!body || body.length === 0) {
      projectsList.textContent = 'Nenhum projeto encontrado.';
      return;
    }

    body.forEach((project) => {
      const projectCard = document.createElement('div');
      projectCard.className = 'project-card';
      projectCard.innerHTML = `
        <div class="project-card-header">
          <div>
            <h3>${project.name}</h3>
            <p>${project.description || '-'}</p>
          </div>
          <button class="secondary" data-project-id="${project.id}">Ver tarefas</button>
        </div>
      `;

      projectCard.querySelector('button').addEventListener('click', () => selectProject(project));
      projectsList.appendChild(projectCard);
    });
    setMessage(appMessage, 'Projetos carregados com sucesso.', false);
  } else {
    setMessage(appMessage, body.error || 'Erro ao carregar projetos.');
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
    setMessage(appMessage, 'Projeto criado com sucesso.', false);
    loadProjects();
  } else {
    setMessage(appMessage, body.error || 'Erro ao criar projeto.');
  }
}

async function selectProject(project) {
  state.selectedProject = project;
  selectedProjectName.textContent = project.name;
  projectDetailsSection.classList.remove('hidden');
  loadTasks(project.id);
}

async function loadTasks(projectId) {
  const { status, body } = await request(`/projects/${projectId}/tasks`);
  if (status === 200) {
    tasksList.innerHTML = '';
    if (!body || body.length === 0) {
      tasksList.textContent = 'Nenhuma tarefa para este projeto.';
      return;
    }

    body.forEach((task) => {
      const taskCard = document.createElement('div');
      taskCard.className = 'project-card';
      taskCard.innerHTML = `
        <h4>${task.title} <span class="status">${task.status}</span></h4>
        <p>${task.description || '-'}</p>
      `;
      tasksList.appendChild(taskCard);
    });
    setMessage(appMessage, 'Tarefas carregadas com sucesso.', false);
  } else {
    setMessage(appMessage, body.error || 'Erro ao carregar tarefas.');
  }
}

async function createTask(event) {
  event.preventDefault();
  if (!state.selectedProject) {
    setMessage(appMessage, 'Selecione um projeto primeiro.');
    return;
  }

  const title = document.getElementById('task-title').value;
  const description = document.getElementById('task-description').value;

  const { status, body } = await request(`/projects/${state.selectedProject.id}/tasks`, {
    method: 'POST',
    body: JSON.stringify({ title, description })
  });

  if (status === 201) {
    setMessage(appMessage, 'Tarefa criada com sucesso.', false);
    loadTasks(state.selectedProject.id);
  } else {
    setMessage(appMessage, body.error || 'Erro ao criar tarefa.');
  }
}

function toggleProjectForm() {
  createProjectForm.classList.toggle('hidden');
}

function toggleTaskForm() {
  createTaskForm.classList.toggle('hidden');
}

function logout() {
  clearToken();
  showAuthSection();
  setMessage(authMessage, 'Desconectado.', false);
}

registerForm.addEventListener('submit', registerUser);
loginForm.addEventListener('submit', loginUser);
createProjectForm.addEventListener('submit', createProject);
createTaskForm.addEventListener('submit', createTask);
loadProjectsButton.addEventListener('click', loadProjects);
createProjectToggle.addEventListener('click', toggleProjectForm);
createTaskToggle.addEventListener('click', toggleTaskForm);
tabRegister.addEventListener('click', () => setActiveTab('register'));
tabLogin.addEventListener('click', () => setActiveTab('login'));
logoutButton.addEventListener('click', logout);

if (state.token) {
  showAppSection();
  setMessage(authMessage, 'Token carregado. Você pode testar as rotas protegidas.', false);
} else {
  showAuthSection();
  setActiveTab('register');
}
