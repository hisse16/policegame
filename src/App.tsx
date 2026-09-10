/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { GameProvider } from './context/GameContext';
import { DetectiveGame } from './components/detective/DetectiveGame';

/**
 * Detective Game 2.0
 *
 * The old workstation/police-computer layer is deliberately no longer part
 * of the player-facing game. The player is a private detective running a
 * newly opened agency.
 */
export const App: React.FC = () => (
  <GameProvider>
    <DetectiveGame />
  </GameProvider>
);
