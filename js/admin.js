const STORAGE_KEY = 'linkvault_data';
const ADMIN_KEY = 'linkvault_admin';

const defaultData = {
  folders: [
    {
      id: 'folder-1',
      name: 'Strohm Media Links',
      logo: 'strohmmedia.png',
      links: [
        { id: 'link-1', title: 'StrohmMedia.site', url: 'https://strohmmedia.site' }
      ]
    },
    {
      id: 'folder-2',
      name: 'Automate with Josh',
      logo: 'AutomatewithJosh.com.png',
      links: [
        { id: 'link-2', title: 'AutomatewithJosh.com', url: 'https://automatewithjosh.com' }
      ]
    },
    {
      id: 'folder-3',
      name: 'Josh Strohm Links',
      logo: 'joshstrohm.png',
      links: [
        { id: 'link-3', title: 'JoshStrohm.me', url: 'https://joshstrohm.me' }
      ]
    }
  ]
};

function loadData() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  saveData(defaultData);
  return defaultData;
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function generateId() {
  return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

document.addEventListener('DOMContentLoaded', () => {
  const loginScreen = document.getElementById('loginScreen');
  const dashboard = document.getElementById('dashboard');
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');
  const logoutBtn = document.getElementById('logoutBtn');
  
  const foldersList = document.getElementById('foldersList');
  const addFolderBtn = document.getElementById('addFolderBtn');
  
  const folderModal = document.getElementById('folderModal');
  const closeFolderModal = document.getElementById('closeFolderModal');
  const breadcrumbRoot = document.getElementById('breadcrumbRoot');
  const breadcrumbFolder = document.getElementById('breadcrumbFolder');
  const linksList = document.getElementById('linksList');
  const addLinkBtn = document.getElementById('addLinkBtn');
  const emptyLinks = document.getElementById('emptyLinks');
  
  const folderFormModal = document.getElementById('folderFormModal');
  const folderForm = document.getElementById('folderForm');
  const folderFormTitle = document.getElementById('folderFormTitle');
  const folderNameInput = document.getElementById('folderName');
  const folderLogoSelect = document.getElementById('folderLogo');
  const closeFolderFormModal = document.getElementById('closeFolderFormModal');
  const cancelFolderForm = document.getElementById('cancelFolderForm');
  
  const linkFormModal = document.getElementById('linkFormModal');
  const linkForm = document.getElementById('linkForm');
  const linkFormTitle = document.getElementById('linkFormTitle');
  const linkTitleInput = document.getElementById('linkTitle');
  const linkUrlInput = document.getElementById('linkUrl');
  const closeLinkFormModal = document.getElementById('closeLinkFormModal');
  const cancelLinkForm = document.getElementById('cancelLinkForm');
  
  const deleteModal = document.getElementById('deleteModal');
  const deleteTitle = document.getElementById('deleteTitle');
  const deleteMessage = document.getElementById('deleteMessage');
  const cancelDelete = document.getElementById('cancelDelete');
  const confirmDelete = document.getElementById('confirmDelete');

  let folders = [];
  let currentFolderId = null;
  let editingFolderId = null;
  let editingLinkId = null;
  let deleteType = null;
  let deleteId = null;
  let isLoggedIn = sessionStorage.getItem(ADMIN_KEY) === 'admin-session';

  if (isLoggedIn) {
    showDashboard();
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'admin' && password === 'password') {
      sessionStorage.setItem(ADMIN_KEY, 'admin-session');
      isLoggedIn = true;
      showDashboard();
    } else {
      loginError.style.display = 'block';
    }
  });

  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem(ADMIN_KEY);
    isLoggedIn = false;
    loginScreen.style.display = 'flex';
    dashboard.style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
  });

  function showDashboard() {
    loginScreen.style.display = 'none';
    dashboard.style.display = 'flex';
    loadFolders();
  }

  function loadFolders() {
    const data = loadData();
    folders = data.folders;
    renderFolders();
  }

  function renderFolders() {
    foldersList.innerHTML = '';
    
    folders.forEach(folder => {
      const row = document.createElement('div');
      row.className = 'folder-row';
      row.innerHTML = `
        <div class="folder-row-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <div class="folder-row-info">
          <div class="folder-row-name">${escapeHtml(folder.name)}</div>
          <div class="folder-row-count">${folder.links.length} link${folder.links.length !== 1 ? 's' : ''}</div>
        </div>
        <div class="folder-row-actions">
          <button class="action-btn edit-folder" data-id="${folder.id}" title="Edit">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button class="action-btn open-folder" data-id="${folder.id}" title="View">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
          <button class="action-btn delete delete-folder" data-id="${folder.id}" title="Delete">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3,6 5,6 21,6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
      `;
      
      row.querySelector('.edit-folder').addEventListener('click', () => openEditFolderModal(folder));
      row.querySelector('.open-folder').addEventListener('click', () => openFolderModal(folder));
      row.querySelector('.delete-folder').addEventListener('click', () => showDeleteConfirmation('folder', folder.id, folder.name));
      
      foldersList.appendChild(row);
    });
  }

  addFolderBtn.addEventListener('click', () => {
    editingFolderId = null;
    folderFormTitle.textContent = 'Add Folder';
    folderNameInput.value = '';
    folderLogoSelect.value = '';
    folderFormModal.classList.add('active');
  });

  function openEditFolderModal(folder) {
    editingFolderId = folder.id;
    folderFormTitle.textContent = 'Edit Folder';
    folderNameInput.value = folder.name;
    folderLogoSelect.value = folder.logo || '';
    folderFormModal.classList.add('active');
  }

  folderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = folderNameInput.value.trim();
    const logo = folderLogoSelect.value;
    
    if (!name) return;

    const data = loadData();
    
    if (editingFolderId) {
      const folder = data.folders.find(f => f.id === editingFolderId);
      if (folder) {
        folder.name = name;
        folder.logo = logo;
      }
    } else {
      data.folders.push({
        id: generateId(),
        name: name,
        logo: logo,
        links: []
      });
    }
    
    saveData(data);
    folderFormModal.classList.remove('active');
    loadFolders();
  });

  closeFolderFormModal.addEventListener('click', () => folderFormModal.classList.remove('active'));
  cancelFolderForm.addEventListener('click', () => folderFormModal.classList.remove('active'));

  function openFolderModal(folder) {
    currentFolderId = folder.id;
    breadcrumbFolder.textContent = folder.name;
    folderModal.classList.add('active');
    renderLinks(folder.links);
  }

  function renderLinks(links) {
    linksList.innerHTML = '';
    
    if (links.length === 0) {
      linksList.style.display = 'none';
      emptyLinks.style.display = 'block';
      return;
    }

    linksList.style.display = 'flex';
    emptyLinks.style.display = 'none';

    links.forEach(link => {
      const row = document.createElement('div');
      row.className = 'link-row';
      row.innerHTML = `
        <div class="link-row-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
          </svg>
        </div>
        <div class="link-row-info">
          <div class="link-row-title">${escapeHtml(link.title)}</div>
          <div class="link-row-url">${escapeHtml(link.url)}</div>
        </div>
        <div class="link-row-actions">
          <button class="action-btn edit-link" data-link-id="${link.id}" title="Edit">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button class="action-btn delete delete-link" data-link-id="${link.id}" title="Delete">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3,6 5,6 21,6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
      `;
      
      row.querySelector('.edit-link').addEventListener('click', () => openEditLinkModal(link));
      row.querySelector('.delete-link').addEventListener('click', () => showDeleteConfirmation('link', link.id, link.title));
      
      linksList.appendChild(row);
    });
  }

  closeFolderModal.addEventListener('click', () => {
    folderModal.classList.remove('active');
    currentFolderId = null;
  });

  breadcrumbRoot.addEventListener('click', () => {
    folderModal.classList.remove('active');
    currentFolderId = null;
  });

  addLinkBtn.addEventListener('click', () => {
    editingLinkId = null;
    linkFormTitle.textContent = 'Add Link';
    linkTitleInput.value = '';
    linkUrlInput.value = '';
    linkFormModal.classList.add('active');
  });

  function openEditLinkModal(link) {
    editingLinkId = link.id;
    linkFormTitle.textContent = 'Edit Link';
    linkTitleInput.value = link.title;
    linkUrlInput.value = link.url;
    linkFormModal.classList.add('active');
  }

  linkForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = linkTitleInput.value.trim();
    const url = linkUrlInput.value.trim();
    
    if (!title || !url) return;

    const data = loadData();
    const folder = data.folders.find(f => f.id === currentFolderId);
    
    if (!folder) return;

    if (editingLinkId) {
      const link = folder.links.find(l => l.id === editingLinkId);
      if (link) {
        link.title = title;
        link.url = url;
      }
    } else {
      folder.links.push({
        id: generateId(),
        title: title,
        url: url
      });
    }
    
    saveData(data);
    linkFormModal.classList.remove('active');
    renderLinks(folder.links);
    loadFolders();
  });

  closeLinkFormModal.addEventListener('click', () => linkFormModal.classList.remove('active'));
  cancelLinkForm.addEventListener('click', () => linkFormModal.classList.remove('active'));

  function showDeleteConfirmation(type, id, name) {
    deleteType = type;
    deleteId = id;
    
    if (type === 'folder') {
      deleteTitle.textContent = 'Delete Folder?';
      deleteMessage.textContent = `Are you sure you want to delete "${name}"? All links inside will be lost.`;
    } else {
      deleteTitle.textContent = 'Delete Link?';
      deleteMessage.textContent = `Are you sure you want to delete "${name}"?`;
    }
    
    deleteModal.classList.add('active');
  }

  cancelDelete.addEventListener('click', () => {
    deleteModal.classList.remove('active');
    deleteType = null;
    deleteId = null;
  });

  confirmDelete.addEventListener('click', () => {
    const data = loadData();
    
    if (deleteType === 'folder') {
      data.folders = data.folders.filter(f => f.id !== deleteId);
      saveData(data);
      loadFolders();
    } else if (deleteType === 'link') {
      const folder = data.folders.find(f => f.id === currentFolderId);
      if (folder) {
        folder.links = folder.links.filter(l => l.id !== deleteId);
        saveData(data);
        renderLinks(folder.links);
        loadFolders();
      }
    }
    
    deleteModal.classList.remove('active');
    deleteType = null;
    deleteId = null;
  });

  [folderModal, folderFormModal, linkFormModal, deleteModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      [folderModal, folderFormModal, linkFormModal, deleteModal].forEach(modal => {
        modal.classList.remove('active');
      });
    }
  });

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
});
