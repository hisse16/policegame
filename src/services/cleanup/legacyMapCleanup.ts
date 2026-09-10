import { vfs } from '../vfs';

/** Remove obsolete GIS/map artifacts from persisted workstation state. */
export const cleanupLegacyMapArtifacts = () => {
  try {
    const obsolete = vfs.getAllNodes().filter((node) => {
      const value = `${node.name} ${node.path} ${node.content || ''}`.toLowerCase();
      return value.includes('investigation_map.desktop') ||
        value.includes('northbridge_gis_sector_report') ||
        value.includes('workstation map system') ||
        value.includes('investigation map desktop tool');
    });

    obsolete.forEach((node) => {
      try { vfs.deleteNode(node.path, true); } catch { /* best effort cleanup */ }
    });
  } catch {
    // Local storage may be unavailable in restricted browser contexts.
  }
};
