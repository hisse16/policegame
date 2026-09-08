import React from 'react';
import { useOS } from '../../context/OSContext';
import { WindowComponent } from './Window';
import { FileManagerApp } from '../apps/FileManagerApp';
import { TerminalApp } from '../apps/TerminalApp';
import { BrowserApp } from '../apps/BrowserApp';
import { TextEditorApp } from '../apps/TextEditorApp';
import { ImageViewerApp } from '../apps/ImageViewerApp';
import { SystemMonitorApp } from '../apps/SystemMonitorApp';
import { SettingsApp } from '../apps/SettingsApp';
import { CalculatorApp } from '../apps/CalculatorApp';
import { PoliceApp } from '../apps/police/PoliceApp';
import { EvidenceLabApp } from '../apps/evidence/EvidenceLabApp';
import { InvestigationBoardApp } from '../apps/board/InvestigationBoardApp';
import { InvestigationNotebookApp } from '../apps/notebook/InvestigationNotebookApp';
import { FinalDeductionApp } from '../apps/deduction/FinalDeductionApp';

export const WindowManager: React.FC = () => {
  const { windows, openApp, closeWindow } = useOS();

  const renderAppContent = (appId: string, windowId: string, params?: Record<string, any>) => {
    switch (appId) {
      case 'police-records':
        return <PoliceApp initialCaseId={params?.caseId || params?.recordId} />;
      case 'evidence-lab':
        return <EvidenceLabApp windowId={windowId} params={params} />;
      case 'investigation-board':
        return <InvestigationBoardApp windowId={windowId} params={params} />;
      case 'investigation-notebook':
        return (
          <InvestigationNotebookApp
            onOpenRecord={(recId) => openApp('police-records', { recordId: recId })}
            onOpenApp={openApp}
          />
        );
      case 'final-deduction':
        return (
          <FinalDeductionApp
            onClose={() => closeWindow(windowId)}
            onOpenRecord={(recId) => openApp('police-records', { recordId: recId })}
          />
        );
      case 'file-manager':
        return <FileManagerApp windowId={windowId} params={params} />;
      case 'terminal':
        return <TerminalApp windowId={windowId} params={params} />;
      case 'browser':
        return <BrowserApp windowId={windowId} params={params} />;
      case 'text-editor':
        return <TextEditorApp windowId={windowId} params={params} />;
      case 'image-viewer':
        return <ImageViewerApp windowId={windowId} params={params} />;
      case 'system-monitor':
        return <SystemMonitorApp windowId={windowId} />;
      case 'settings':
        return <SettingsApp windowId={windowId} />;
      case 'calculator':
        return <CalculatorApp windowId={windowId} />;
      default:
        return (
          <div className="p-6 text-center text-slate-400">
            Unknown application: {appId}
          </div>
        );
    }
  };

  return (
    <>
      {windows.map((win) => (
        <WindowComponent key={win.id} window={win}>
          {renderAppContent(win.appId, win.id, win.params)}
        </WindowComponent>
      ))}
    </>
  );
};
