import React, { useState } from 'react';
import { Icon } from '../../common/Icon';
import { EvidenceRecord } from '../../../types/police';
import { storyEngine } from '../../../services/story/storyEngine';

interface AddEvidenceModalProps {
  onClose: () => void;
  onCreated: (evidence: EvidenceRecord) => void;
}

export const AddEvidenceModal: React.FC<AddEvidenceModalProps> = ({ onClose, onCreated }) => {
  const [title, setTitle] = useState('');
  const [evidenceType, setEvidenceType] = useState<EvidenceRecord['evidenceType']>('Physical');
  const [description, setDescription] = useState('');
  const [collectionLocation, setCollectionLocation] = useState('');
  const [storageLocation, setStorageLocation] = useState('Vault B - Cold Case Section');
  const [collectedBy, setCollectedBy] = useState('OFF-4081 (Det. S. Miller)');
  const [tagsInput, setTagsInput] = useState('CASE-27, NEW_INTAKE');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toUpperCase())
      .filter(Boolean);

    const newRec = storyEngine.createEvidence({
      title: title.trim().toUpperCase(),
      evidenceType,
      description: description.trim() || 'No detailed description recorded.',
      collectionLocation: collectionLocation.trim() || 'Precinct Archival Intake',
      storageLocation: storageLocation.trim(),
      collectedByOfficerId: collectedBy.trim(),
      tags: tags.length > 0 ? tags : ['EVIDENCE_INTAKE']
    });

    onCreated(newRec);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Icon name="PlusCircle" className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider font-mono">
                Log New Evidence Docket
              </h3>
              <p className="text-xs text-slate-400">Intake Logging & Chain-of-Custody Generation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <Icon name="X" className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1 font-mono">Item Designation / Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. LATENT FINGERPRINT CARD - 42 WILLOW"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1 font-mono">Evidence Type</label>
              <select
                value={evidenceType}
                onChange={(e) => setEvidenceType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
              >
                <option value="Physical">Physical</option>
                <option value="Document">Document</option>
                <option value="Digital">Digital / Media</option>
                <option value="Biological">Biological</option>
                <option value="Trace">Trace / Forensics</option>
                <option value="Vehicle">Vehicle</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1 font-mono">Storage Location</label>
              <input
                type="text"
                value={storageLocation}
                onChange={(e) => setStorageLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1 font-mono">Recovery Location / Source</label>
            <input
              type="text"
              value={collectionLocation}
              onChange={(e) => setCollectionLocation(e.target.value)}
              placeholder="e.g. 42 Willow Street, Exterior Porch"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1 font-mono">Collecting Officer / Badge</label>
            <input
              type="text"
              value={collectedBy}
              onChange={(e) => setCollectedBy(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1 font-mono">Detailed Physical Description & Circumstances</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter packaging, serial numbers, initial condition, packaging seal integrity..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1 font-mono">Tags (comma separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center gap-1.5 font-mono"
            >
              <Icon name="Check" className="w-3.5 h-3.5" />
              Generate Docket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
