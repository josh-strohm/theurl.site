const STORAGE_KEY = 'linkvault_data';

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
  const foldersGrid = document.getElementById('foldersGrid');
  const folderModal = document.getElementById('folderModal');
  const closeModal = document.getElementById('closeModal');
  const breadcrumbRoot = document.getElementById('breadcrumbRoot');
  const breadcrumbFolder = document.getElementById('breadcrumbFolder');
  const linksGrid = document.getElementById('linksGrid');
  const emptyFolder = document.getElementById('emptyFolder');

  let currentFolderId = null;
  let folders = [];

  function loadFolders() {
    const data = loadData();
    folders = data.folders;
    renderFolders();
  }

  function getFolderLogo(folder) {
    if (folder.logo) return folder.logo;
    const name = folder.name.toLowerCase();
    if (name.includes('strohm media')) return 'strohmmedia.jpg';
    if (name.includes('automate with josh')) return 'AutomatewithJosh.com.png';
    if (name.includes('josh strohm')) return 'joshstrohm.png';
    return null;
  }

  function renderFolders() {
    foldersGrid.innerHTML = '';
    
    folders.forEach((folder, index) => {
      const folderCard = document.createElement('div');
      folderCard.className = 'folder-card';
      folderCard.style.animationDelay = `${index * 0.1}s`;
      const logo = getFolderLogo(folder);
      folderCard.innerHTML = `
        <div class="window-glass"></div>
        <div class="window-reflection"></div>
        <div class="window-mullion-v"></div>
        <div class="window-mullion-h"></div>
        <div class="folder-content-wrapper">
          <div class="folder-icon">
            ${logo 
              ? `<img src="${logo}" alt="${escapeHtml(folder.name)}" class="folder-logo-img" />`
              : `<svg viewBox="0 0 80 80" fill="none">
                  <defs>
                    <linearGradient id="folderGrad${index}" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#f97316"/>
                      <stop offset="100%" stop-color="#22d3ee"/>
                    </linearGradient>
                  </defs>
                  <path d="M10 20C10 16.6863 12.6863 14 16 14H30L38 22H64C67.3137 22 70 24.6863 70 28V60C70 63.3137 67.3137 66 64 66H16C12.6863 66 10 63.3137 10 60V20Z" 
                        fill="url(#folderGrad${index})" opacity="0.2" stroke="url(#folderGrad${index})" stroke-width="2"/>
                  <path d="M32 14V10C32 7.79086 33.7909 6 36 6H60C62.2091 6 64 7.79086 64 10V14" 
                        stroke="url(#folderGrad${index})" stroke-width="2" stroke-linecap="round"/>
                 </svg>`
            }
          </div>
          <div class="folder-name">${escapeHtml(folder.name)}</div>
          <div class="folder-count">${folder.links.length} link${folder.links.length !== 1 ? 's' : ''}</div>
        </div>
      `;
      folderCard.addEventListener('click', () => openFolder(folder));
      foldersGrid.appendChild(folderCard);
    });
  }

  function openFolder(folder) {
    currentFolderId = folder.id;
    breadcrumbFolder.textContent = folder.name;
    folderModal.classList.add('active');
    renderLinks(folder.links);
  }

  function renderLinks(links) {
    linksGrid.innerHTML = '';
    
    if (links.length === 0) {
      linksGrid.style.display = 'none';
      emptyFolder.style.display = 'block';
      return;
    }

    linksGrid.style.display = 'grid';
    emptyFolder.style.display = 'none';

    links.forEach((link, index) => {
      const linkItem = document.createElement('div');
      linkItem.className = 'link-item';
      linkItem.style.animationDelay = `${index * 0.05}s`;
      linkItem.innerHTML = `
        <div class="link-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10,9 9,9 8,9"/>
          </svg>
        </div>
        <div class="link-info">
          <div class="link-title">${escapeHtml(link.title)}</div>
          <div class="link-url">${escapeHtml(link.url)}</div>
        </div>
      `;
      linkItem.addEventListener('click', () => window.open(link.url, '_blank'));
      linksGrid.appendChild(linkItem);
    });
  }

  function closeFolderModal() {
    folderModal.classList.remove('active');
    currentFolderId = null;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  closeModal.addEventListener('click', closeFolderModal);
  breadcrumbRoot.addEventListener('click', closeFolderModal);
  folderModal.addEventListener('click', (e) => {
    if (e.target === folderModal) closeFolderModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && folderModal.classList.contains('active')) {
      closeFolderModal();
    }
  });

  loadFolders();
});
