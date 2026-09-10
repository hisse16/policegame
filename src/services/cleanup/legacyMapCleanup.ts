import { vfs } from '../vfs';

const LEGACY_MAP_MARKERS = [
  'investigation_map.desktop',
  'northbridge_gis_sector_report',
  'workstation map system',
  'investigation map desktop tool',
  'northbridge gis map'
];

/** Removes only old persisted GIS shortcuts/files from previous builds. */
export const cleanupLegacyMapArtifacts = () => {
  try {
    for (const node of vfs.getAllNodes()) {
      const haystack = `${node.name} ${node.path} ${node.content || ''}`.toLowerCase();
      if (LEGACY_MAP_MARKERS.some((marker) => haystack.includes(marker))) {
        vfs.deleteNode(node.path, true);
      }
    }
    localStorage.removeItem('investigation_map_view_v2');
    localStorage.removeItem('npd_investigation_map_state_v1');
  } catch {
    // Cleanup is best-effort; a storage failure must never block boot.
  }
};
