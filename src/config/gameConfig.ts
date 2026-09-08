export interface GameTitleConfig {
  title: string;
  subtitle: string;
  caseNumber: string;
  department: string;
  classification: string;
  systemName: string;
  version: string;
}

export const GAME_CONFIG: GameTitleConfig = {
  title: 'CASE 27',
  subtitle: 'AN UNRESOLVED INVESTIGATION',
  caseNumber: 'METRO-CR-2024-0027',
  department: 'METRO POLICE DEPARTMENT — FORENSIC ARCHIVE DIVISION',
  classification: 'OFFICIAL USE ONLY / EVIDENCE REPOSITORY',
  systemName: 'SECURIX DIGITAL FORENSIC WORKSTATION',
  version: 'build 24.04.1-LTS'
};

export interface CreditSection {
  role: string;
  members: string[];
}

export const CREDITS_DATA: CreditSection[] = [
  {
    role: 'Created & Directed By',
    members: ['Lead Investigator & Design Team']
  },
  {
    role: 'Game Design & Narrative Architecture',
    members: ['Case File Planning Group', 'Forensic Fiction Division']
  },
  {
    role: 'Systems Programming & Virtual OS Engine',
    members: ['Core Systems Architecture', 'Workstation Simulation Group']
  },
  {
    role: 'User Interface & Archival Aesthetics',
    members: ['Evidence Terminal Design', 'Typography & Visual Standards']
  },
  {
    role: 'Sound Design & Acoustic Synthesis',
    members: ['Procedural Audio Laboratory']
  },
  {
    role: 'Special Thanks',
    members: [
      'Digital Forensics Investigators',
      'Open Source Linux & Unix Communities',
      'Players & Case Explorers'
    ]
  }
];
