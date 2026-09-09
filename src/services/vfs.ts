import { VFSNode } from '../types/os';

const STORAGE_KEY = 'investigator_os_vfs_v1';

// Initial SVG image contents for realistic evidence files
const BADGE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
  <rect width="600" height="400" rx="20" fill="#1e293b"/>
  <rect x="20" y="20" width="560" height="360" rx="15" fill="#0f172a" stroke="#334155" stroke-width="2"/>
  <rect x="20" y="20" width="560" height="70" fill="#1e3a8a"/>
  <text x="300" y="62" font-family="monospace" font-size="22" font-weight="bold" fill="#ffffff" text-anchor="middle" letter-spacing="3">METROPOLITAN POLICE DEPARTMENT</text>
  <text x="300" y="110" font-family="sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">CRIMINAL INVESTIGATION DIVISION</text>
  
  <!-- Photo placeholder -->
  <rect x="60" y="140" width="140" height="170" rx="8" fill="#334155" stroke="#475569" stroke-width="2"/>
  <circle cx="130" cy="200" r="35" fill="#64748b"/>
  <path d="M 80 290 Q 130 240 180 290 Z" fill="#64748b"/>
  
  <!-- ID Details -->
  <text x="230" y="165" font-family="sans-serif" font-size="14" font-weight="bold" fill="#64748b">AGENT TITLE:</text>
  <text x="230" y="190" font-family="sans-serif" font-size="20" font-weight="bold" fill="#f8fafc">LEAD INVESTIGATOR</text>
  
  <text x="230" y="225" font-family="sans-serif" font-size="14" font-weight="bold" fill="#64748b">BADGE NO:</text>
  <text x="320" y="225" font-family="monospace" font-size="18" font-weight="bold" fill="#38bdf8">#8842-A</text>
  
  <text x="230" y="255" font-family="sans-serif" font-size="14" font-weight="bold" fill="#64748b">CLEARANCE:</text>
  <text x="330" y="255" font-family="sans-serif" font-size="14" font-weight="bold" fill="#10b981">LEVEL 4 - RESTRICTED</text>
  
  <text x="230" y="285" font-family="sans-serif" font-size="14" font-weight="bold" fill="#64748b">ISSUED:</text>
  <text x="300" y="285" font-family="sans-serif" font-size="14" fill="#cbd5e1">2026-01-15</text>
  
  <line x1="60" y1="335" x2="540" y2="335" stroke="#334155" stroke-width="1"/>
  <text x="300" y="360" font-family="monospace" font-size="11" fill="#64748b" text-anchor="middle">OFFICIAL GOVERNMENT PROPERTY - FOR LAW ENFORCEMENT USE ONLY</text>
</svg>`;

const FLOORPLAN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 500" width="700" height="500">
  <rect width="700" height="500" fill="#090d16"/>
  <defs>
    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" stroke-width="0.8"/>
    </pattern>
  </defs>
  <rect width="700" height="500" fill="url(#grid)"/>
  
  <text x="350" y="35" font-family="monospace" font-size="16" fill="#38bdf8" text-anchor="middle" font-weight="bold">PRECINCT 4 - DETECTIVE SQUAD ROOM ARCHITECTURAL BLUEPRINT</text>
  
  <!-- Outer Walls -->
  <rect x="50" y="60" width="600" height="380" fill="none" stroke="#38bdf8" stroke-width="3"/>
  
  <!-- Room 1: Captain Office -->
  <rect x="50" y="60" width="180" height="160" fill="#0f172a" fill-opacity="0.6" stroke="#38bdf8" stroke-width="2"/>
  <text x="140" y="145" font-family="monospace" font-size="12" fill="#94a3b8" text-anchor="middle">CAPTAIN'S OFFICE</text>
  
  <!-- Room 2: Interrogation A -->
  <rect x="50" y="220" width="180" height="110" fill="#0f172a" fill-opacity="0.6" stroke="#38bdf8" stroke-width="2"/>
  <text x="140" y="280" font-family="monospace" font-size="12" fill="#94a3b8" text-anchor="middle">INTERROGATION A</text>
  
  <!-- Room 3: Evidence Locker -->
  <rect x="50" y="330" width="180" height="110" fill="#1e1b4b" fill-opacity="0.6" stroke="#ef4444" stroke-width="2"/>
  <text x="140" y="390" font-family="monospace" font-size="12" fill="#f87171" text-anchor="middle">SECURE EVIDENCE LOCKER</text>
  
  <!-- Central Bullpen -->
  <rect x="230" y="60" width="280" height="380" fill="#0f172a" fill-opacity="0.3" stroke="#38bdf8" stroke-width="2"/>
  <text x="370" y="250" font-family="monospace" font-size="14" fill="#60a5fa" text-anchor="middle">MAIN INVESTIGATION BULLPEN</text>
  <!-- Workstations -->
  <rect x="260" y="100" width="80" height="50" fill="#1e293b" stroke="#64748b"/>
  <rect x="260" y="180" width="80" height="50" fill="#1e293b" stroke="#64748b"/>
  <rect x="260" y="290" width="80" height="50" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <text x="300" y="320" font-family="monospace" font-size="9" fill="#38bdf8" text-anchor="middle">WS-07 (CURRENT)</text>
  <rect x="400" y="100" width="80" height="50" fill="#1e293b" stroke="#64748b"/>
  <rect x="400" y="180" width="80" height="50" fill="#1e293b" stroke="#64748b"/>
  
  <!-- Server / Telecom Room -->
  <rect x="510" y="60" width="140" height="180" fill="#0f172a" fill-opacity="0.6" stroke="#38bdf8" stroke-width="2"/>
  <text x="580" y="155" font-family="monospace" font-size="12" fill="#94a3b8" text-anchor="middle">SERVER ROOM</text>
  
  <!-- Briefing Area -->
  <rect x="510" y="240" width="140" height="200" fill="#0f172a" fill-opacity="0.6" stroke="#38bdf8" stroke-width="2"/>
  <text x="580" y="345" font-family="monospace" font-size="12" fill="#94a3b8" text-anchor="middle">BRIEFING ROOM</text>
</svg>`;

const TRAFFIC_CAM_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="640" height="360">
  <rect width="640" height="360" fill="#050811"/>
  
  <!-- Night street landscape -->
  <polygon points="120,360 280,180 360,180 520,360" fill="#1e293b"/>
  <line x1="320" y1="180" x2="320" y2="360" stroke="#facc15" stroke-dasharray="16,12" stroke-width="3"/>
  
  <!-- Buildings silhouettes -->
  <rect x="40" y="80" width="180" height="220" fill="#0a0f1d"/>
  <rect x="80" y="110" width="15" height="20" fill="#fbbf24" fill-opacity="0.7"/>
  <rect x="130" y="150" width="15" height="20" fill="#fbbf24" fill-opacity="0.4"/>
  <rect x="420" y="60" width="160" height="240" fill="#0a0f1d"/>
  <rect x="460" y="120" width="15" height="20" fill="#fbbf24" fill-opacity="0.8"/>
  
  <!-- Streetlamp glow -->
  <circle cx="270" cy="170" r="40" fill="#fef08a" fill-opacity="0.15"/>
  <circle cx="370" cy="170" r="40" fill="#fef08a" fill-opacity="0.15"/>
  
  <!-- Surveillance HUD -->
  <rect x="20" y="20" width="600" height="320" fill="none" stroke="#22c55e" stroke-width="1.2" stroke-dasharray="8,6"/>
  <circle cx="320" cy="180" r="12" fill="none" stroke="#ef4444" stroke-width="1.5"/>
  <line x1="320" y1="160" x2="320" y2="200" stroke="#ef4444" stroke-width="1.5"/>
  <line x1="300" y1="180" x2="340" y2="180" stroke="#ef4444" stroke-width="1.5"/>
  
  <text x="35" y="48" font-family="monospace" font-size="14" fill="#22c55e" font-weight="bold">CAM-04 [7th &amp; BROADWAY] - LIVE FEED ARCHIVE</text>
  <text x="35" y="70" font-family="monospace" font-size="12" fill="#22c55e">TIMESTAMP: 2026-09-07 23:44:19 EST</text>
  <text x="590" y="48" font-family="monospace" font-size="12" fill="#ef4444" text-anchor="end" font-weight="bold">● REC</text>
  <text x="35" y="325" font-family="monospace" font-size="11" fill="#94a3b8">FRAME: 14892 // SENSOR: IR-NIGHT // RESOLUTION: 1080P</text>
</svg>`;

const INITIAL_NODES: VFSNode[] = [
  // Root & System dirs
  { id: 'root', name: '', path: '/', type: 'dir', size: 4096, mimeType: 'inode/directory', createdAt: '2026-01-01 00:00:00', updatedAt: '2026-09-08 02:00:00', accessedAt: '2026-09-08 02:00:00', permissions: 'drwxr-xr-x', owner: 'root', group: 'root' },
  { id: 'home', name: 'home', path: '/home', type: 'dir', size: 4096, mimeType: 'inode/directory', createdAt: '2026-01-01 00:00:00', updatedAt: '2026-09-08 02:00:00', accessedAt: '2026-09-08 02:00:00', permissions: 'drwxr-xr-x', owner: 'root', group: 'root' },
  { id: 'investigator', name: 'investigator', path: '/home/investigator', type: 'dir', size: 4096, mimeType: 'inode/directory', createdAt: '2026-01-01 00:00:00', updatedAt: '2026-09-08 02:00:00', accessedAt: '2026-09-08 02:00:00', permissions: 'drwxr-xr-x', owner: 'investigator', group: 'investigator' },
  
  // User home standard dirs
  { id: 'desktop', name: 'Desktop', path: '/home/investigator/Desktop', type: 'dir', size: 4096, mimeType: 'inode/directory', createdAt: '2026-01-01 00:00:00', updatedAt: '2026-09-08 02:00:00', accessedAt: '2026-09-08 02:00:00', permissions: 'drwxr-xr-x', owner: 'investigator', group: 'investigator' },
  { id: 'documents', name: 'Documents', path: '/home/investigator/Documents', type: 'dir', size: 4096, mimeType: 'inode/directory', createdAt: '2026-01-01 00:00:00', updatedAt: '2026-09-08 02:00:00', accessedAt: '2026-09-08 02:00:00', permissions: 'drwxr-xr-x', owner: 'investigator', group: 'investigator' },
  { id: 'downloads', name: 'Downloads', path: '/home/investigator/Downloads', type: 'dir', size: 4096, mimeType: 'inode/directory', createdAt: '2026-01-01 00:00:00', updatedAt: '2026-09-08 02:00:00', accessedAt: '2026-09-08 02:00:00', permissions: 'drwxr-xr-x', owner: 'investigator', group: 'investigator' },
  { id: 'pictures', name: 'Pictures', path: '/home/investigator/Pictures', type: 'dir', size: 4096, mimeType: 'inode/directory', createdAt: '2026-01-01 00:00:00', updatedAt: '2026-09-08 02:00:00', accessedAt: '2026-09-08 02:00:00', permissions: 'drwxr-xr-x', owner: 'investigator', group: 'investigator' },
  { id: 'videos', name: 'Videos', path: '/home/investigator/Videos', type: 'dir', size: 4096, mimeType: 'inode/directory', createdAt: '2026-01-01 00:00:00', updatedAt: '2026-09-08 02:00:00', accessedAt: '2026-09-08 02:00:00', permissions: 'drwxr-xr-x', owner: 'investigator', group: 'investigator' },
  { id: 'music', name: 'Music', path: '/home/investigator/Music', type: 'dir', size: 4096, mimeType: 'inode/directory', createdAt: '2026-01-01 00:00:00', updatedAt: '2026-09-08 02:00:00', accessedAt: '2026-09-08 02:00:00', permissions: 'drwxr-xr-x', owner: 'investigator', group: 'investigator' },
  { id: 'config', name: '.config', path: '/home/investigator/.config', type: 'dir', size: 4096, mimeType: 'inode/directory', createdAt: '2026-01-01 00:00:00', updatedAt: '2026-09-08 02:00:00', accessedAt: '2026-09-08 02:00:00', permissions: 'drwx------', owner: 'investigator', group: 'investigator', isHidden: true },
  { id: 'local', name: '.local', path: '/home/investigator/.local', type: 'dir', size: 4096, mimeType: 'inode/directory', createdAt: '2026-01-01 00:00:00', updatedAt: '2026-09-08 02:00:00', accessedAt: '2026-09-08 02:00:00', permissions: 'drwx------', owner: 'investigator', group: 'investigator', isHidden: true },
  { id: 'trash', name: '.trash', path: '/home/investigator/.trash', type: 'dir', size: 4096, mimeType: 'inode/directory', createdAt: '2026-01-01 00:00:00', updatedAt: '2026-09-08 02:00:00', accessedAt: '2026-09-08 02:00:00', permissions: 'drwx------', owner: 'investigator', group: 'investigator', isHidden: true },

  // System dirs
  { id: 'tmp', name: 'tmp', path: '/tmp', type: 'dir', size: 4096, mimeType: 'inode/directory', createdAt: '2026-01-01 00:00:00', updatedAt: '2026-09-08 02:00:00', accessedAt: '2026-09-08 02:00:00', permissions: 'drwxrwxrwt', owner: 'root', group: 'root' },
  { id: 'var', name: 'var', path: '/var', type: 'dir', size: 4096, mimeType: 'inode/directory', createdAt: '2026-01-01 00:00:00', updatedAt: '2026-09-08 02:00:00', accessedAt: '2026-09-08 02:00:00', permissions: 'drwxr-xr-x', owner: 'root', group: 'root' },
  { id: 'var_log', name: 'log', path: '/var/log', type: 'dir', size: 4096, mimeType: 'inode/directory', createdAt: '2026-01-01 00:00:00', updatedAt: '2026-09-08 02:00:00', accessedAt: '2026-09-08 02:00:00', permissions: 'drwxr-xr-x', owner: 'root', group: 'root' },
  { id: 'etc', name: 'etc', path: '/etc', type: 'dir', size: 4096, mimeType: 'inode/directory', createdAt: '2026-01-01 00:00:00', updatedAt: '2026-09-08 02:00:00', accessedAt: '2026-09-08 02:00:00', permissions: 'drwxr-xr-x', owner: 'root', group: 'root' },

  // Desktop files
  {
    id: 'f_case_27_brief',
    name: 'CASE_27_REOPENING_MEMO.txt',
    path: '/home/investigator/Desktop/CASE_27_REOPENING_MEMO.txt',
    type: 'file',
    size: 1120,
    mimeType: 'text/plain',
    createdAt: '2026-09-08 08:00:00',
    updatedAt: '2026-09-08 08:00:00',
    accessedAt: '2026-09-08 08:05:00',
    permissions: '-rw-r--r--',
    owner: 'investigator',
    group: 'investigator',
    content: `NORTHBRIDGE POLICE DEPARTMENT
ARCHIVE DIVISION // COLD CASE REVIEW SQUAD
INTERNAL ASSIGNMENT MEMORANDUM

DATE: September 8, 2026
TO: Lead Investigator, Workstation #07
FROM: Captain Arthur Vance, Supervising Investigator
SUBJECT: CASE 27 — ARCHIVE REVIEW

Investigator,

Case 27 is an old unresolved disappearance from September 1998. The subject, Anna Claire Bell (age 17), disappeared following her evening work shift at Bell Electronics. The docket has remained dormant in the archives for decades.

This morning, a routine archive audit detected an unexplained post-closure modification on the primary case file (Report R-1998-112), dated June 3, 2004—years after the docket was officially archived. An attachment index was altered, but the referenced attachment was logged as NOT FOUND.

You are assigned to review the original investigation.
No assumptions should be made about what happened.
Your initial task is to determine whether the archive discrepancy is meaningful.

Begin with the original case file: CASE-1998-027 in the PRIS database.

Capt. A. Vance
Commanding Officer, Archive Division`
  },
  {
    id: 'f_archive_audit_discrepancy',
    name: 'ARCHIVE_AUDIT_DISCREPANCY.txt',
    path: '/home/investigator/Desktop/ARCHIVE_AUDIT_DISCREPANCY.txt',
    type: 'file',
    size: 980,
    mimeType: 'text/plain',
    createdAt: '2026-09-08 08:00:00',
    updatedAt: '2026-09-08 08:00:00',
    accessedAt: '2026-09-08 08:05:00',
    permissions: '-rw-r--r--',
    owner: 'investigator',
    group: 'investigator',
    content: `NORTHBRIDGE POLICE DEPARTMENT - ARCHIVE REPOSITORY
==================================================
ARCHIVE AUDIT DISCREPANCY NOTICE
AUDIT ID: AUD-2026-09-08-0042
DATE: September 8, 2026

ARCHIVE AUDIT
CASE: CASE-1998-027
DOCUMENT: R-1998-112
LAST MODIFIED: June 3, 2004 — 14:22:08
MODIFIED BY: RECORDS ADMINISTRATION [TERMINAL ADM-04]
CHANGE: ATTACHMENT INDEX UPDATED
ATTACHMENT: NOT FOUND

SUBJECT CASE SUMMARY:
Victim: Anna Bell (Age: 17)
Disappearance Date: September 14, 1998
Last Known Sighting: Willow Street
Original Status: Inactive Cold Case (Archived Jan 14, 1999)

DISCREPANCY SUMMARY:
A routine automated records audit identified that Report R-1998-112 was accessed
and altered years after case closure. The attachment index was rewritten to purge
the original exhibit reference. No judicial subpoena or reopening order was filed.

TASK:
Determine why an archived case was modified years after it was closed.
Reconstruct the chain of evidence and identify any compromised findings.
Begin with the original case file: CASE-1998-027.
==================================================`
  },
  {
    id: 'f_case_notes',
    name: 'Case_Notes.txt',
    path: '/home/investigator/Desktop/Case_Notes.txt',
    type: 'file',
    size: 420,
    mimeType: 'text/plain',
    createdAt: '2026-09-08 01:10:00',
    updatedAt: '2026-09-08 02:24:18',
    accessedAt: '2026-09-08 02:30:00',
    permissions: '-rw-r--r--',
    owner: 'investigator',
    group: 'investigator',
    content: `=====================================================
METROPOLITAN INVESTIGATION UNIT - CASE LOG TEMPLATE
=====================================================
Officer: Lead Investigator
Terminal: Workstation #07
Classification: RESTRICTED SENSITIVE LAW ENFORCEMENT

[STATUS: STANDBY]
Awaiting new case file assignment. Digital evidence repository
and local databases are active.

All files and logs on this terminal remain synchronized with
the central squad room archive.`
  },
  {
    id: 'f_quick_guide',
    name: 'Terminal_CheatSheet.txt',
    path: '/home/investigator/Desktop/Terminal_CheatSheet.txt',
    type: 'file',
    size: 680,
    mimeType: 'text/plain',
    createdAt: '2026-09-08 01:00:00',
    updatedAt: '2026-09-08 01:00:00',
    accessedAt: '2026-09-08 02:30:00',
    permissions: '-rw-r--r--',
    owner: 'investigator',
    group: 'investigator',
    content: `Securix Linux Terminal Reference for Investigators
----------------------------------------------------
Navigation & Exploration:
  pwd               Show current directory path
  ls -la            List all files with details & hidden files
  cd <dir>          Navigate to directory (e.g. cd Documents)
  cd ..             Go up one directory level

File Operations:
  cat <file>        Print file content
  touch <file>      Create an empty file
  mkdir <dir>       Create a directory
  cp <src> <dest>   Copy a file
  mv <src> <dest>   Move or rename a file
  rm <file>         Delete a file (or rm -r for folders)
  nano <file>       Open in-terminal text editor

Search & Inspection:
  grep "text" file  Search text within a file
  find /path -name  Find files by name
  head -n 5 file    View first 5 lines
  tail -n 5 file    View last 5 lines

Utility & System:
  whoami            Show logged-in user
  date              Show current date & time
  python            Launch Python interactive shell
  clear             Clear screen`
  },
  {
    id: 'f_precinct_memo',
    name: 'Department_Directive_09.pdf',
    path: '/home/investigator/Desktop/Department_Directive_09.pdf',
    type: 'file',
    size: 2048,
    mimeType: 'application/pdf',
    createdAt: '2026-09-07 09:00:00',
    updatedAt: '2026-09-07 09:00:00',
    accessedAt: '2026-09-08 02:10:00',
    permissions: '-rw-r--r--',
    owner: 'investigator',
    group: 'investigator',
    content: `MEMORANDUM // DIVISION OF INVESTIGATION
TO: All Detective Personnel
FROM: Chief of Detectives J. Vance
DATE: September 7, 2026
SUBJECT: Deployment of Securix Workstation OS v24.04

1. PURPOSE
This workstation upgrade standardizes our forensic investigation platform. All detectives are required to maintain evidence integrity by verifying hash signatures on any external media connected to the system.

2. LOCAL NETWORK INTRANET
Internal search services (http://search.local) and police intranet portals (http://intranet.local) are routed strictly through the departmental network adapter (POLICE-NET). Any unauthorized off-network tethering is logged.

3. DISPATCH & FORENSIC ARCHIVE
CCTV captures and dispatch recordings must be stored in the dedicated user folders (/home/investigator/Videos and /home/investigator/Music) before final transfer to cold storage.

CONFIDENTIAL - POLICE USE ONLY`
  },
  {
    id: 'f_desktop_mail',
    name: 'Police_Mail.desktop',
    path: '/home/investigator/Desktop/Police_Mail.desktop',
    type: 'file',
    size: 240,
    mimeType: 'application/x-desktop',
    createdAt: '2026-09-08 08:00:00',
    updatedAt: '2026-09-08 08:00:00',
    accessedAt: '2026-09-08 08:00:00',
    permissions: '-rwxr-xr-x',
    owner: 'investigator',
    group: 'investigator',
    content: `[Desktop Entry]
Name=Police Mail
Exec=police-mail
Icon=Mail
Type=Application
Categories=Office;Communication;`
  },
  {
    id: 'f_desktop_map',
    name: 'Investigation_Map.desktop',
    path: '/home/investigator/Desktop/Investigation_Map.desktop',
    type: 'file',
    size: 260,
    mimeType: 'application/x-desktop',
    createdAt: '2026-09-08 08:00:00',
    updatedAt: '2026-09-08 08:00:00',
    accessedAt: '2026-09-08 08:00:00',
    permissions: '-rwxr-xr-x',
    owner: 'investigator',
    group: 'investigator',
    content: `[Desktop Entry]
Name=Investigation Map
Exec=investigation-map
Icon=Map
Type=Application
Categories=System;Investigation;`
  },
  {
    id: 'f_gis_sector_report',
    name: 'Northbridge_GIS_Sector_Report.txt',
    path: '/home/investigator/Desktop/Northbridge_GIS_Sector_Report.txt',
    type: 'file',
    size: 1420,
    mimeType: 'text/plain',
    createdAt: '2026-09-08 08:15:00',
    updatedAt: '2026-09-08 08:15:00',
    accessedAt: '2026-09-08 08:15:00',
    permissions: '-rw-r--r--',
    owner: 'investigator',
    group: 'investigator',
    content: `NORTHBRIDGE DEPARTMENT OF PUBLIC WORKS & GIS SURVEY DIVISION
============================================================
MEMORANDUM: WARD BOUNDARIES & CANAL ROAD JURISDICTION
DATED: SEPTEMBER 8, 2026

1. SECTOR 4 WETLANDS & CANAL ROAD CULVERT
The section of Canal Road adjoining Drainage Culvert #9 (GIS Coord: X:750, Y:520) borders the boundary between Northbridge Municipal jurisdiction and the Crownline Logistics private siding easement.

HISTORICAL INCIDENT CROSS-REFERENCE (CASE-1998-027):
- 1998-09-14: 911 report CAD-98-8820 indicated a vehicle stopped with hazard lights flashing at 22:45.
- 1998-09-14: Unit 304 logged dispatch at 22:48. Log shows arrival at 23:02.
- CONTRADICTION NOTED: Dispatch log shows a manual supervisor override timestamped 23:15 by Terminal OPR-01 claiming 'Gone on arrival'. Unit 304 mileage report showed no odometer advancement.
- 1998-10-02: Abandoned 1994 Ford Taurus (TXR-481) recovered 60 meters east of culvert, partially submerged in marsh weeds.

2. CROWNLINE DEPOT GATE LOGS
Security gate logs from Crownline Depot (Gate 3, GIS Coord: X:880, Y:430) on Sept 14, 1998, logged entry of White Chevrolet Caprice (Plate: KLY-902) at 23:30. Driver listed: V. Caine. Vehicle was authorized under recurring subcontractor badge SEC-VANCE-89.

3. WORKSTATION MAP SYSTEM
Use the 'Investigation Map' desktop tool to overlay CAD dispatch points and toggle historical eras (1998, 2003, 2004, 2026).`
  },

  // Documents files
  {
    id: 'f_sop',
    name: 'Standard_Operating_Procedures.txt',
    path: '/home/investigator/Documents/Standard_Operating_Procedures.txt',
    type: 'file',
    size: 512,
    mimeType: 'text/plain',
    createdAt: '2026-08-14 10:00:00',
    updatedAt: '2026-08-14 10:00:00',
    accessedAt: '2026-09-08 02:00:00',
    permissions: '-rw-r--r--',
    owner: 'investigator',
    group: 'investigator',
    content: `CRIME SCENE DIGITAL FORENSICS - S.O.P.
======================================
1. Chain of custody must remain unbroken from scene seizure to courtroom admission.
2. Direct terminal manipulation of raw evidence drives is strictly prohibited without write-blockers.
3. Every file alteration timestamp (mtime/ctime) must be cross-referenced with precinct NTP servers.
4. Report suspicious encrypted volumes directly to the Cyber Crime Unit.`
  },
  {
    id: 'f_contacts',
    name: 'department_directory.json',
    path: '/home/investigator/Documents/department_directory.json',
    type: 'file',
    size: 430,
    mimeType: 'application/json',
    createdAt: '2026-08-20 14:30:00',
    updatedAt: '2026-08-20 14:30:00',
    accessedAt: '2026-09-08 02:00:00',
    permissions: '-rw-r--r--',
    owner: 'investigator',
    group: 'investigator',
    content: `{
  "precinct": "Metropolitan 4th District",
  "departments": {
    "dispatch_control": "EXT-4011",
    "forensics_ballistics": "EXT-4089",
    "coroner_office": "EXT-4102",
    "evidence_locker": "EXT-4050",
    "it_sysadmin": "EXT-4000"
  },
  "emergency_hotline": "555-0199"
}`
  },
  {
    id: 'f_evidence_log',
    name: 'evidence_ledger_template.csv',
    path: '/home/investigator/Documents/evidence_ledger_template.csv',
    type: 'file',
    size: 340,
    mimeType: 'text/csv',
    createdAt: '2026-08-22 11:15:00',
    updatedAt: '2026-08-22 11:15:00',
    accessedAt: '2026-09-08 02:00:00',
    permissions: '-rw-r--r--',
    owner: 'investigator',
    group: 'investigator',
    content: `Item_ID,Description,Seized_Date,Custodian,Storage_Bin,Hash_SHA256
EVD-2026-001,Encrypted USB Drive,2026-09-01,Miller J.,Locker-2A,e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
EVD-2026-002,Spiral Notebook,2026-09-02,Miller J.,Bin-08,N/A
EVD-2026-003,CCTV DVR Cassette,2026-09-04,Forensics Unit,Rack-01,9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08`
  },

  // Pictures files
  {
    id: 'f_pic_badge',
    name: 'investigator_id_badge.svg',
    path: '/home/investigator/Pictures/investigator_id_badge.svg',
    type: 'file',
    size: BADGE_SVG.length,
    mimeType: 'image/svg+xml',
    createdAt: '2026-09-01 08:00:00',
    updatedAt: '2026-09-01 08:00:00',
    accessedAt: '2026-09-08 02:00:00',
    permissions: '-rw-r--r--',
    owner: 'investigator',
    group: 'investigator',
    content: BADGE_SVG
  },
  {
    id: 'f_pic_floorplan',
    name: 'precinct_layout_floorplan.svg',
    path: '/home/investigator/Pictures/precinct_layout_floorplan.svg',
    type: 'file',
    size: FLOORPLAN_SVG.length,
    mimeType: 'image/svg+xml',
    createdAt: '2026-09-03 10:20:00',
    updatedAt: '2026-09-03 10:20:00',
    accessedAt: '2026-09-08 02:00:00',
    permissions: '-rw-r--r--',
    owner: 'investigator',
    group: 'investigator',
    content: FLOORPLAN_SVG
  },
  {
    id: 'f_pic_traffic',
    name: 'surveillance_intersection_cam04.svg',
    path: '/home/investigator/Pictures/surveillance_intersection_cam04.svg',
    type: 'file',
    size: TRAFFIC_CAM_SVG.length,
    mimeType: 'image/svg+xml',
    createdAt: '2026-09-07 23:50:00',
    updatedAt: '2026-09-07 23:50:00',
    accessedAt: '2026-09-08 02:00:00',
    permissions: '-rw-r--r--',
    owner: 'investigator',
    group: 'investigator',
    content: TRAFFIC_CAM_SVG
  },

  // Videos
  {
    id: 'f_video_cctv',
    name: 'cctv_entrance_sample.mp4',
    path: '/home/investigator/Videos/cctv_entrance_sample.mp4',
    type: 'file',
    size: 15482900,
    mimeType: 'video/mp4',
    createdAt: '2026-09-06 21:15:00',
    updatedAt: '2026-09-06 21:15:00',
    accessedAt: '2026-09-08 02:00:00',
    permissions: '-rw-r--r--',
    owner: 'investigator',
    group: 'investigator',
    metadata: {
      duration: 38,
      resolution: '1920x1080',
      cameraName: 'GATEWAY_SOUTH_FEED'
    }
  },

  // Music / Audio
  {
    id: 'f_audio_dispatch',
    name: 'dispatch_radio_traffic_01.wav',
    path: '/home/investigator/Music/dispatch_radio_traffic_01.wav',
    type: 'file',
    size: 2451000,
    mimeType: 'audio/wav',
    createdAt: '2026-09-06 22:40:00',
    updatedAt: '2026-09-06 22:40:00',
    accessedAt: '2026-09-08 02:00:00',
    permissions: '-rw-r--r--',
    owner: 'investigator',
    group: 'investigator',
    metadata: {
      duration: 24,
      bitrate: '320kbps',
      sampleRate: '44100Hz'
    }
  },

  // /etc files
  {
    id: 'f_etc_hostname',
    name: 'hostname',
    path: '/etc/hostname',
    type: 'file',
    size: 24,
    mimeType: 'text/plain',
    createdAt: '2026-01-01 00:00:00',
    updatedAt: '2026-01-01 00:00:00',
    accessedAt: '2026-09-08 02:00:00',
    permissions: '-rw-r--r--',
    owner: 'root',
    group: 'root',
    content: 'police-workstation-07\n'
  },
  {
    id: 'f_etc_os_release',
    name: 'os-release',
    path: '/etc/os-release',
    type: 'file',
    size: 210,
    mimeType: 'text/plain',
    createdAt: '2026-01-01 00:00:00',
    updatedAt: '2026-01-01 00:00:00',
    accessedAt: '2026-09-08 02:00:00',
    permissions: '-rw-r--r--',
    owner: 'root',
    group: 'root',
    content: `NAME="Securix Linux"
VERSION="24.04 LTS (Investigator Edition)"
ID=securix
ID_LIKE=debian
PRETTY_NAME="Securix Linux 24.04 LTS"
VERSION_ID="24.04"
HOME_URL="http://intranet.local"
`
  },
  {
    id: 'f_etc_hosts',
    name: 'hosts',
    path: '/etc/hosts',
    type: 'file',
    size: 140,
    mimeType: 'text/plain',
    createdAt: '2026-01-01 00:00:00',
    updatedAt: '2026-01-01 00:00:00',
    accessedAt: '2026-09-08 02:00:00',
    permissions: '-rw-r--r--',
    owner: 'root',
    group: 'root',
    content: `127.0.0.1\tlocalhost
127.0.1.1\tpolice-workstation-07
10.24.110.1\tintranet.local
10.24.110.2\tsearch.local
10.24.110.3\tmanuals.local
`
  },

  // /var/log files
  {
    id: 'f_var_syslog',
    name: 'syslog',
    path: '/var/log/syslog',
    type: 'file',
    size: 940,
    mimeType: 'text/plain',
    createdAt: '2026-09-08 02:00:00',
    updatedAt: '2026-09-08 02:45:00',
    accessedAt: '2026-09-08 02:45:00',
    permissions: '-rw-r-----',
    owner: 'syslog',
    group: 'adm',
    content: `Sep 08 02:15:00 workstation kernel: [    0.000000] Securix Linux kernel 6.8.0-31-generic (buildd@build-server) #31-Ubuntu
Sep 08 02:15:01 workstation systemd[1]: Mounting /home/investigator...
Sep 08 02:15:02 workstation systemd[1]: Mounted /home/investigator.
Sep 08 02:15:03 workstation NetworkManager[612]: <info> [1725761703] device (wlan0): state change: unmanaged -> unavailable
Sep 08 02:15:04 workstation NetworkManager[612]: <info> [1725761704] device (wlan0): state change: disconnected -> activated
Sep 08 02:15:05 workstation NetworkManager[612]: <info> [1725761705] NetworkManager state is now CONNECTED_GLOBAL
Sep 08 02:15:06 workstation audit[1]: SERVICE_START pid=1 uid=0 auid=4294967295 ses=4294967295 msg='unit=systemd-logind comm="systemd" exe="/lib/systemd/systemd" hostname=? addr=? terminal=? res=success'
Sep 08 02:15:07 workstation systemd[1]: Started User Manager for UID 1000 (investigator).`
  },
  {
    id: 'f_var_auth',
    name: 'auth.log',
    path: '/var/log/auth.log',
    type: 'file',
    size: 420,
    mimeType: 'text/plain',
    createdAt: '2026-09-08 02:00:00',
    updatedAt: '2026-09-08 02:45:00',
    accessedAt: '2026-09-08 02:45:00',
    permissions: '-rw-r-----',
    owner: 'syslog',
    group: 'adm',
    content: `Sep 08 02:14:59 workstation login[720]: pam_unix(login:session): session opened for user investigator by (uid=0)
Sep 08 02:15:00 workstation systemd-logind[640]: New session 1 of user investigator.
Sep 08 02:15:01 workstation sudo: investigator : TTY=pts/0 ; PWD=/home/investigator ; USER=root ; COMMAND=/bin/dmesg`
  },

  // Archive & Audit Directory Structures
  { id: 'dir_doc_archive', name: 'Archive', path: '/home/investigator/Documents/Archive', type: 'dir', size: 4096, mimeType: 'inode/directory', createdAt: '2026-09-08 00:00:00', updatedAt: '2026-09-08 02:00:00', accessedAt: '2026-09-08 02:00:00', permissions: 'drwxr-xr-x', owner: 'investigator', group: 'investigator' },
  {
    id: 'f_unindexed_depositions',
    name: 'Unindexed_Depositions.txt',
    path: '/home/investigator/Documents/Archive/Unindexed_Depositions.txt',
    type: 'file',
    size: 1640,
    mimeType: 'text/plain',
    createdAt: '2026-09-08 01:00:00',
    updatedAt: '2026-09-08 01:00:00',
    accessedAt: '2026-09-08 02:00:00',
    permissions: '-rw-r--r--',
    owner: 'investigator',
    group: 'investigator',
    content: `NORTHBRIDGE POLICE DEPARTMENT - ARCHIVE TRANSCRIPTION UNIT
DEPOSITION EXCERPTS // RECOVERED FROM UNINDEXED PRE-TRIAL FOLDERS
CASE CONTEXT: BELL ELECTRONICS / CROWNLINE LOGISTICS / CASE 27
========================================================================
DEPOSITION OF: Michael Bell (Brother of Victim / Warehouse Clerk)
DATE OF RECORD: October 12, 1998
INTERVIEWING OFFICER: Det. Daniel Hayes (#3014)

Q: When was the last time Anna spoke to you about company paperwork?
A: Three days before she disappeared. September 11. She was white as a sheet. She told me she found duplicate ledgers in the night dispatch office. Crownline Logistics was billing Bell Electronics for container movements that never appeared on the official shipping manifests.

Q: Did she name anyone?
A: She said Daniel Mercer was driving the night runs, and that whenever a Crownline truck arrived after 22:00, an unmarked police cruiser sat outside the loading gate. She wrote down the vehicle numbers in her personal ledger.

Q: Where is that personal ledger now?
A: She kept it in her locker at Canal Self-Storage, or in her briefcase. When her car was found abandoned on Canal Road, her briefcase was gone. And the storage locker key on her keychain was missing.

Q: Did you mention this to anyone else?
A: Only to Detective Hayes here. He told me he would personally secure the storage locker and that I shouldn't talk to the press or file an affidavit until he verified the logs.
========================================================================`
  },
  {
    id: 'f_redaction_diff',
    name: 'Redaction_Diff_1998_112.txt',
    path: '/home/investigator/Documents/Archive/Redaction_Diff_1998_112.txt',
    type: 'file',
    size: 1420,
    mimeType: 'text/plain',
    createdAt: '2026-09-08 01:00:00',
    updatedAt: '2026-09-08 01:00:00',
    accessedAt: '2026-09-08 02:00:00',
    permissions: '-rw-r--r--',
    owner: 'investigator',
    group: 'investigator',
    content: `ARCHIVE COMPARISON ANALYSIS: REPORT R-1998-112
ORIGINAL MICROFILM DRAFT (1998) vs. DIGITIZED AUDIT RECORD (2004)
========================================================================
[-] 1998 ORIGINAL ARCHIVE DRAFT:
    "ATTACHED EXHIBIT: ATT-1989-114A.
     Reference: Internal Affairs Case IA-1989-114 (Allegations of off-duty
     officers providing escort services for Crownline Logistics).
     Investigator note: Victim was actively compiling audit of Crownline
     waybills. Potential witness intimidation motive."

[+] 2004 DIGITIZED RECORD (ALTERED):
    "ATTACHED EXHIBIT: NOT FOUND.
     [ENTRY EXPUNGED BY ADMINISTRATIVE ORDER // REF: REDACTED: IA_REFERENCE]
     Investigator note: No further leads established. Victim presumed to have
     walked away voluntarily."

FORENSIC AUDIT NOTE:
The 2004 modification deliberately stripped the reference to Internal Affairs
inquiry IA-1989-114 and suppressed the Crownline Logistics connection.
Authorized by: Captain Arthur Vance / Executed under administrative login ADM-04.
========================================================================`
  },

  // /var/log/audit
  { id: 'var_log_audit', name: 'audit', path: '/var/log/audit', type: 'dir', size: 4096, mimeType: 'inode/directory', createdAt: '2026-09-08 00:00:00', updatedAt: '2026-09-08 02:00:00', accessedAt: '2026-09-08 02:00:00', permissions: 'drwxr-xr-x', owner: 'root', group: 'root' },
  {
    id: 'f_audit_dispatch_log',
    name: 'dispatch_19980914.log',
    path: '/var/log/audit/dispatch_19980914.log',
    type: 'file',
    size: 1980,
    mimeType: 'text/plain',
    createdAt: '2026-09-08 01:00:00',
    updatedAt: '2026-09-08 01:00:00',
    accessedAt: '2026-09-08 02:00:00',
    permissions: '-rw-r--r--',
    owner: 'root',
    group: 'adm',
    content: `CAD INCIDENT LOG // NORTHBRIDGE POLICE DEPT // 1998-09-14
========================================================================
[21:10:04] UNIT 102 (Patrol West): Clear from 14th Ave traffic stop.
[21:44:18] CAD-DISP: 911 line active. Caller: Michael Bell. Reports sister Anna Bell overdue from Bell Electronics. Advised to verify residential address first.
[22:15:02] UNIT 304 (Det. Daniel Hayes): Logged en route to 4th District patrol division.
[22:17:30] CAD-DISP: 911 Call #98-4412 logged. Reporting party Martha Gable (40 Willow St): heard engine revving and sharp braking in alley between 40 and 42 Willow St.
[22:20:11] DISPATCH TO UNIT 304: Unit 304, advise if in vicinity of Willow St.
[22:21:40] UNIT 304: Copy dispatch, in transit on Commercial Way, 5 minutes out.
[22:31:05] [TRANSMISSION INTERRUPTED // FREQUENCY HOP // UNINDEXED CAD BURST]
[22:40:15] UNIT 304 (Hayes): On scene at 42 Willow St. Driveway clear. Front door locked. Canvassing perimeter.
[22:41:22] CAD-DISP [INC-1998-0915]: Radio transmission from Unit 304: Dark mid-sized sedan observed turning onto Canal Road frontage. Plate unverified in rain. Unit 304 clearing scene to file preliminary report.
[22:52:10] STATION GATE LOG: Vehicle 304 (Hayes unmarked Caprice) clocked at Central Station security barrier.
[23:04:15] SGT. MERCER: Observed Unit 304 vehicle depart rear garage bay unattended.
========================================================================`
  },
  {
    id: 'f_audit_trail_2004',
    name: 'audit_trail_2004.log',
    path: '/var/log/audit/audit_trail_2004.log',
    type: 'file',
    size: 1540,
    mimeType: 'text/plain',
    createdAt: '2026-09-08 01:00:00',
    updatedAt: '2026-09-08 01:00:00',
    accessedAt: '2026-09-08 02:00:00',
    permissions: '-rw-r--r--',
    owner: 'root',
    group: 'adm',
    content: `ARCHIVE SYSTEM AUDIT LOG // YEAR 2004
SYSTEM: VAX/VMS MUNICIPAL ARCHIVE NODE 04
========================================================================
[2004-06-03 14:15:22] USER: ADM-04 [RECORDS ADMINISTRATION] LOGGED IN
[2004-06-03 14:17:01] QUERY: SELECT DOCKET WHERE CASE_ID='CASE-1998-027'
[2004-06-03 14:18:44] DOCKET FETCHED: 14 RECORDS, 3 ATTACHMENTS
[2004-06-03 14:20:12] OPEN DOCUMENT: R-1998-112 (AUTHOR: DET. D. HAYES)
[2004-06-03 14:21:55] OVERRIDE AUTH: SUPERVISORY BYPASS (TOKEN: SEC-VANCE-89)
[2004-06-03 14:22:08] ACTION: MODIFY ATTACHMENT INDEX
                     TARGET: ATT-1989-114A (INTERNAL AFFAIRS CROSS-REFERENCE)
                     NEW STATUS: NOT FOUND / PURGED FROM ACTIVE INDICES
[2004-06-03 14:23:30] AUDIT HASH GENERATED: #C27-MOD-20040603-918
[2004-06-03 14:25:00] USER ADM-04 LOGGED OUT.
========================================================================`
  },
  {
    id: 'f_vault_access_log',
    name: 'evidence_vault_access.log',
    path: '/var/log/audit/evidence_vault_access.log',
    type: 'file',
    size: 1680,
    mimeType: 'text/plain',
    createdAt: '2026-09-08 01:00:00',
    updatedAt: '2026-09-08 01:00:00',
    accessedAt: '2026-09-08 02:00:00',
    permissions: '-rw-r--r--',
    owner: 'root',
    group: 'adm',
    content: `NORTHBRIDGE POLICE DEPARTMENT // CENTRAL EVIDENCE VAULT B ACCESS LOG
CASE DOCKET REF: CASE-1998-027 (ANNA CLAIRE BELL)
LOCKER ASSIGNED: VAULT-B-LOCKER-44
========================================================================
1998-10-04 11:20:00 | CHECK-IN | Det. D. Hayes (#3014) | Items E-004821 through E-004823 entered into evidence. Signed: D. Hayes.
1998-11-19 15:40:00 | REVIEW   | Det. D. Hayes (#3014) | Casework review. No items removed. Signed: D. Hayes.
2004-06-03 14:45:10 | OVERRIDE | Capt. A. Vance (#1012) | Vault inspection pursuant to departmental archive reorganization.
2008-04-12 16:10:00 | ACCESS   | Det. D. Hayes (#3014) | Locker 44 opened. Item logged: Personal effects review. Co-signer: NONE (FLAGGED).
2008-04-14 09:00:00 | NOTICE   | Internal Audit: Physical cassette tape from E-004821 flagged missing from container. Hayes tendered resignation 48h later.
========================================================================`
  }
];

class VirtualFileSystem {
  private nodes: Map<string, VFSNode> = new Map();
  private listeners: Array<() => void> = [];

  constructor() {
    this.init();
  }

  private init() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: VFSNode[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed.forEach((n) => this.nodes.set(n.path, n));
          // Always ensure INITIAL_NODES exist if missing from stored
          INITIAL_NODES.forEach((n) => {
            if (!this.nodes.has(n.path)) {
              this.nodes.set(n.path, { ...n });
            }
          });
          return;
        }
      }
    } catch {
      // fallback to initial
    }
    this.resetToDefaults();
  }

  public resetToDefaults() {
    this.nodes.clear();
    INITIAL_NODES.forEach((node) => {
      this.nodes.set(node.path, { ...node });
    });
    this.save();
    this.notify();
  }

  private save() {
    try {
      const array = Array.from(this.nodes.values());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(array));
    } catch (e) {
      console.warn('Failed to save VFS to localStorage:', e);
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => {
      try {
        l();
      } catch (err) {
        console.error('VFS listener error:', err);
      }
    });
  }

  public normalizePath(rawPath: string): string {
    if (!rawPath) return '/';
    let path = rawPath.trim();
    if (path.startsWith('~')) {
      path = '/home/investigator' + path.slice(1);
    }
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    const parts = path.split('/').filter(Boolean);
    const resolved: string[] = [];

    for (const part of parts) {
      if (part === '.') continue;
      if (part === '..') {
        resolved.pop();
      } else {
        resolved.push(part);
      }
    }
    return '/' + resolved.join('/');
  }

  public getNode(path: string): VFSNode | null {
    const norm = this.normalizePath(path);
    return this.nodes.get(norm) || null;
  }

  public getAllNodes(): VFSNode[] {
    return Array.from(this.nodes.values());
  }

  public listDir(dirPath: string, includeHidden = false): VFSNode[] {
    const norm = this.normalizePath(dirPath);
    const prefix = norm === '/' ? '/' : norm + '/';
    const results: VFSNode[] = [];

    for (const node of this.nodes.values()) {
      if (node.path === norm) continue;
      if (node.path.startsWith(prefix)) {
        const sub = node.path.slice(prefix.length);
        if (!sub.includes('/')) {
          if (!includeHidden && node.name.startsWith('.')) {
            continue;
          }
          results.push(node);
        }
      }
    }

    // Sort folders first, then alphabetical
    return results.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'dir' ? -1 : 1;
      }
      return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
    });
  }

  public createDir(rawPath: string): VFSNode {
    const norm = this.normalizePath(rawPath);
    if (this.nodes.has(norm)) {
      throw new Error(`Directory already exists: ${norm}`);
    }
    const name = norm.split('/').pop() || '';
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newNode: VFSNode = {
      id: 'dir_' + Math.random().toString(36).substring(2, 9),
      name,
      path: norm,
      type: 'dir',
      size: 4096,
      mimeType: 'inode/directory',
      createdAt: now,
      updatedAt: now,
      accessedAt: now,
      permissions: 'drwxr-xr-x',
      owner: 'investigator',
      group: 'investigator',
      isHidden: name.startsWith('.')
    };

    this.nodes.set(norm, newNode);
    this.save();
    this.notify();
    return newNode;
  }

  public createFile(
    rawPath: string,
    content = '',
    mimeType = 'text/plain',
    metadata?: Record<string, any>
  ): VFSNode {
    const norm = this.normalizePath(rawPath);
    const name = norm.split('/').pop() || '';
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const existing = this.nodes.get(norm);
    if (existing) {
      existing.content = content;
      existing.size = new Blob([content]).size;
      existing.updatedAt = now;
      existing.accessedAt = now;
      if (metadata) existing.metadata = { ...existing.metadata, ...metadata };
      this.save();
      this.notify();
      return existing;
    }

    const newNode: VFSNode = {
      id: 'file_' + Math.random().toString(36).substring(2, 9),
      name,
      path: norm,
      type: 'file',
      size: new Blob([content]).size,
      content,
      mimeType,
      createdAt: now,
      updatedAt: now,
      accessedAt: now,
      permissions: '-rw-r--r--',
      owner: 'investigator',
      group: 'investigator',
      isHidden: name.startsWith('.'),
      metadata
    };

    this.nodes.set(norm, newNode);
    this.save();
    this.notify();
    return newNode;
  }

  public deleteNode(rawPath: string, permanent = false): boolean {
    const norm = this.normalizePath(rawPath);
    const node = this.nodes.get(norm);
    if (!node) return false;

    // Prevent deleting root or essential system bases
    if (norm === '/' || norm === '/home' || norm === '/home/investigator') {
      throw new Error('Permission denied: cannot delete root or home directory');
    }

    if (!permanent && !norm.startsWith('/home/investigator/.trash')) {
      // Move to trash
      const trashBase = '/home/investigator/.trash';
      const trashPath = `${trashBase}/${node.name}_${Date.now()}`;
      
      // If it's a directory, move all its descendants too
      const oldPrefix = norm + '/';
      const toMove = Array.from(this.nodes.values()).filter(
        (n) => n.path === norm || n.path.startsWith(oldPrefix)
      );

      toMove.forEach((n) => {
        this.nodes.delete(n.path);
        const relative = n.path.slice(norm.length);
        const newPath = trashPath + relative;
        this.nodes.set(newPath, {
          ...n,
          path: newPath,
          originalPath: n.path,
          isTrash: true
        });
      });

      this.save();
      this.notify();
      return true;
    }

    // Permanent delete
    const prefix = norm + '/';
    const toDelete = Array.from(this.nodes.keys()).filter(
      (p) => p === norm || p.startsWith(prefix)
    );
    toDelete.forEach((p) => this.nodes.delete(p));

    this.save();
    this.notify();
    return true;
  }

  public restoreFromTrash(trashPath: string): boolean {
    const norm = this.normalizePath(trashPath);
    const node = this.nodes.get(norm);
    if (!node || !node.originalPath) return false;

    let targetPath = node.originalPath;
    // ensure unique destination
    if (this.nodes.has(targetPath)) {
      const parts = targetPath.split('.');
      if (parts.length > 1) {
        const ext = parts.pop();
        targetPath = `${parts.join('.')}_restored.${ext}`;
      } else {
        targetPath = `${targetPath}_restored`;
      }
    }

    const prefix = norm + '/';
    const toRestore = Array.from(this.nodes.values()).filter(
      (n) => n.path === norm || n.path.startsWith(prefix)
    );

    toRestore.forEach((n) => {
      this.nodes.delete(n.path);
      const relative = n.path.slice(norm.length);
      const newPath = targetPath + relative;
      const name = newPath.split('/').pop() || n.name;
      this.nodes.set(newPath, {
        ...n,
        path: newPath,
        name,
        originalPath: undefined,
        isTrash: false
      });
    });

    this.save();
    this.notify();
    return true;
  }

  public emptyTrash(): void {
    const trashPrefix = '/home/investigator/.trash/';
    const toDelete = Array.from(this.nodes.keys()).filter((p) =>
      p.startsWith(trashPrefix)
    );
    toDelete.forEach((p) => this.nodes.delete(p));
    this.save();
    this.notify();
  }

  public getTrashItems(): VFSNode[] {
    return this.listDir('/home/investigator/.trash', true);
  }

  public renameNode(rawPath: string, newName: string): VFSNode | null {
    const norm = this.normalizePath(rawPath);
    const node = this.nodes.get(norm);
    if (!node) return null;

    const parent = norm.substring(0, norm.lastIndexOf('/')) || '/';
    const targetPath = parent === '/' ? `/${newName}` : `${parent}/${newName}`;

    if (this.nodes.has(targetPath)) {
      throw new Error(`A file or directory named "${newName}" already exists here.`);
    }

    return this.moveNode(norm, targetPath);
  }

  public moveNode(srcPath: string, destPath: string): VFSNode | null {
    const src = this.normalizePath(srcPath);
    let dest = this.normalizePath(destPath);
    const node = this.nodes.get(src);
    if (!node) return null;

    // If dest is an existing directory, move inside it
    const destNode = this.nodes.get(dest);
    if (destNode && destNode.type === 'dir') {
      dest = dest === '/' ? `/${node.name}` : `${dest}/${node.name}`;
    }

    if (src === dest) return node;

    const prefix = src + '/';
    const toMove = Array.from(this.nodes.values()).filter(
      (n) => n.path === src || n.path.startsWith(prefix)
    );

    toMove.forEach((n) => {
      this.nodes.delete(n.path);
      const relative = n.path.slice(src.length);
      const newPath = dest + relative;
      const name = newPath.split('/').pop() || n.name;
      this.nodes.set(newPath, {
        ...n,
        path: newPath,
        name,
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
      });
    });

    this.save();
    this.notify();
    return this.nodes.get(dest) || null;
  }

  public copyNode(srcPath: string, destPath: string): VFSNode | null {
    const src = this.normalizePath(srcPath);
    let dest = this.normalizePath(destPath);
    const node = this.nodes.get(src);
    if (!node) return null;

    const destNode = this.nodes.get(dest);
    if (destNode && destNode.type === 'dir') {
      dest = dest === '/' ? `/${node.name}` : `${dest}/${node.name}`;
    }

    // Auto rename if already exists at dest
    if (this.nodes.has(dest)) {
      const parts = dest.split('.');
      if (parts.length > 1 && node.type === 'file') {
        const ext = parts.pop();
        dest = `${parts.join('.')}_copy.${ext}`;
      } else {
        dest = `${dest}_copy`;
      }
    }

    const prefix = src + '/';
    const toCopy = Array.from(this.nodes.values()).filter(
      (n) => n.path === src || n.path.startsWith(prefix)
    );

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    toCopy.forEach((n) => {
      const relative = n.path.slice(src.length);
      const newPath = dest + relative;
      const name = newPath.split('/').pop() || n.name;
      this.nodes.set(newPath, {
        ...n,
        id: 'node_' + Math.random().toString(36).substring(2, 9),
        path: newPath,
        name,
        createdAt: now,
        updatedAt: now,
        accessedAt: now
      });
    });

    this.save();
    this.notify();
    return this.nodes.get(dest) || null;
  }

  public search(query: string, basePath = '/home/investigator'): VFSNode[] {
    if (!query) return [];
    const q = query.toLowerCase();
    const base = this.normalizePath(basePath);

    return Array.from(this.nodes.values()).filter((n) => {
      if (!n.path.startsWith(base)) return false;
      if (n.name.toLowerCase().includes(q)) return true;
      if (n.content && n.content.toLowerCase().includes(q)) return true;
      return false;
    });
  }
}

export const vfs = new VirtualFileSystem();
