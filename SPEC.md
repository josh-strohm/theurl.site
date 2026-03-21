# LinkVault - Linktr.ee Clone Specification

## Project Overview
- **Project name**: LinkVault
- **Type**: Full-stack web application (Node.js + vanilla frontend)
- **Core functionality**: A link management platform with folder-based organization, featuring a stunning visual interface
- **Target users**: Content creators, businesses, influencers who want to organize their many links

## UI/UX Specification

### Layout Structure

**Main Page (Public)**
- Full viewport height design
- Hero section with user profile/avatar at top
- 3-column grid of folders (responsive: 3 cols desktop, 2 tablet, 1 mobile)
- Folder modal overlay when folder is clicked (Windows Explorer style)

**Admin Panel**
- Accessible at /admin
- Login screen first
- Dashboard with folder management
- Add/Edit/Delete folders and links

### Visual Design

**Color Palette**
- Background: `#0a0a0f` (deep dark)
- Surface: `#14141f` (card background)
- Surface Elevated: `#1e1e2e` (hover states)
- Primary: `#6366f1` (indigo accent)
- Primary Glow: `#818cf8` (lighter indigo)
- Secondary: `#22d3ee` (cyan accent)
- Text Primary: `#f8fafc` (white-ish)
- Text Secondary: `#94a3b8` (muted)
- Border: `#2e2e3e`
- Success: `#10b981`
- Warning: `#f59e0b`
- Danger: `#ef4444`

**Typography**
- Headings: 'Outfit', sans-serif (Google Fonts)
- Body: 'DM Sans', sans-serif (Google Fonts)
- Monospace (for .site files): 'JetBrains Mono', monospace

**Spacing System**
- Base unit: 8px
- Container padding: 24px
- Card padding: 24px
- Gap between folders: 24px

**Visual Effects**
- Glassmorphism on modals (backdrop-filter: blur)
- Subtle gradient backgrounds with radial gradients
- Glow effects on hover (box-shadow with primary color)
- Smooth transitions (0.3s ease)
- Folder icons with floating animation on hover
- Staggered entrance animations on page load

### Components

**Folder Card**
- Size: ~180px x 200px
- Icon: Large folder SVG with gradient
- Name below icon
- Hover: scale(1.05), glow effect, slight lift
- Click: Opens modal

**Link Item (.site file)**
- Icon: Document icon with .site extension visual
- Name of the link
- URL display (truncated)
- Hover: background highlight
- Click: Opens URL in new tab

**Modal (Folder View)**
- Windows Explorer aesthetic
- Breadcrumb navigation at top
- Grid of .site files
- Close button (X)
- Backdrop blur

**Admin Login**
- Centered card
- Username/Password fields
- Login button with loading state

**Admin Dashboard**
- Sidebar navigation
- Main content area
- Folder list with CRUD actions
- Link management within folders

## Functionality Specification

### Core Features

**Public View**
1. Display all folders in grid layout
2. Click folder to view contents in modal
3. Click .site file to open URL in new tab
4. Responsive design for all devices
5. Beautiful entrance animations

**Admin Panel**
1. Login authentication (admin/password)
2. View all folders
3. Create new folder (name, icon optional)
4. Edit folder name
5. Delete folder
6. View links within folder
7. Add new link (title, URL)
8. Edit link
9. Delete link
10. Logout

### Data Structure

```json
{
  "folders": [
    {
      "id": "uuid",
      "name": "Strohm Media Links",
      "links": [
        {
          "id": "uuid",
          "title": "StrohmMedia.site",
          "url": "https://strohmmedia.site"
        }
      ]
    }
  ]
}
```

### User Interactions
- Folder click → Open modal with folder contents
- Link click → Navigate to URL (target="_blank")
- Admin login → Session-based auth
- CRUD operations on folders and links

### Edge Cases
- Empty folders display message
- Long folder/link names truncate with ellipsis
- Invalid URLs handled gracefully
- Admin session timeout after inactivity

## Acceptance Criteria

1. ✅ Main page displays 3 folders across on desktop
2. ✅ Folders are clickable and open a modal
3. ✅ Modal shows .site files inside folder
4. ✅ Clicking .site file opens URL in new tab
5. ✅ Admin panel accessible at /admin
6. ✅ Login works with admin/password
7. ✅ Can create, edit, delete folders
8. ✅ Can create, edit, delete links within folders
9. ✅ Beautiful, modern, stunning UI
10. ✅ Responsive on mobile/tablet
11. ✅ Smooth animations throughout

## Technical Stack
- **Backend**: Node.js + Express
- **Frontend**: Vanilla HTML/CSS/JS
- **Data Storage**: JSON file (data.json)
- **Port**: 3000
