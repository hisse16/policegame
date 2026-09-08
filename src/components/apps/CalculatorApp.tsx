import React, { useState, useEffect } from 'react';

export const CalculatorApp: React.FC<{ windowId: string }> = () => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clearAll = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const toggleSign = () => {
    const val = parseFloat(display);
    if (val !== 0) {
      setDisplay(String(-val));
    }
  };

  const inputPercent = () => {
    const val = parseFloat(display);
    setDisplay(String(val / 100));
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operator) {
      const current = prevValue || 0;
      let newValue = current;

      if (operator === '+') newValue = current + inputValue;
      else if (operator === '-') newValue = current - inputValue;
      else if (operator === '×' || operator === '*') newValue = current * inputValue;
      else if (operator === '÷' || operator === '/') {
        newValue = inputValue === 0 ? 0 : current / inputValue;
      }

      setPrevValue(newValue);
      setDisplay(String(parseFloat(newValue.toFixed(8))));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator === '=' ? null : nextOperator);
  };

  // Keyboard input support
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        inputDigit(e.key);
      } else if (e.key === '.') {
        inputDot();
      } else if (e.key === '+' || e.key === '-') {
        performOperation(e.key);
      } else if (e.key === '*') {
        performOperation('×');
      } else if (e.key === '/') {
        performOperation('÷');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        performOperation('=');
      } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        clearAll();
      } else if (e.key === '%') {
        inputPercent();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  const buttons = [
    { label: 'AC', action: clearAll, style: 'bg-slate-800 text-amber-400 hover:bg-slate-700' },
    { label: '+/-', action: toggleSign, style: 'bg-slate-800 text-slate-300 hover:bg-slate-700' },
    { label: '%', action: inputPercent, style: 'bg-slate-800 text-slate-300 hover:bg-slate-700' },
    { label: '÷', action: () => performOperation('÷'), style: 'bg-blue-600 text-white hover:bg-blue-500' },

    { label: '7', action: () => inputDigit('7'), style: 'bg-slate-900 text-slate-100 hover:bg-slate-800' },
    { label: '8', action: () => inputDigit('8'), style: 'bg-slate-900 text-slate-100 hover:bg-slate-800' },
    { label: '9', action: () => inputDigit('9'), style: 'bg-slate-900 text-slate-100 hover:bg-slate-800' },
    { label: '×', action: () => performOperation('×'), style: 'bg-blue-600 text-white hover:bg-blue-500' },

    { label: '4', action: () => inputDigit('4'), style: 'bg-slate-900 text-slate-100 hover:bg-slate-800' },
    { label: '5', action: () => inputDigit('5'), style: 'bg-slate-900 text-slate-100 hover:bg-slate-800' },
    { label: '6', action: () => inputDigit('6'), style: 'bg-slate-900 text-slate-100 hover:bg-slate-800' },
    { label: '-', action: () => performOperation('-'), style: 'bg-blue-600 text-white hover:bg-blue-500' },

    { label: '1', action: () => inputDigit('1'), style: 'bg-slate-900 text-slate-100 hover:bg-slate-800' },
    { label: '2', action: () => inputDigit('2'), style: 'bg-slate-900 text-slate-100 hover:bg-slate-800' },
    { label: '3', action: () => inputDigit('3'), style: 'bg-slate-900 text-slate-100 hover:bg-slate-800' },
    { label: '+', action: () => performOperation('+'), style: 'bg-blue-600 text-white hover:bg-blue-500' },

    { label: '0', action: () => inputDigit('0'), style: 'bg-slate-900 text-slate-100 hover:bg-slate-800 col-span-2' },
    { label: '.', action: inputDot, style: 'bg-slate-900 text-slate-100 hover:bg-slate-800' },
    { label: '=', action: () => performOperation('='), style: 'bg-emerald-600 text-white hover:bg-emerald-500' }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 select-none p-3 justify-between">
      {/* LCD Display */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-right shadow-inner flex flex-col justify-end h-20">
        <div className="text-[11px] font-mono text-slate-500 h-4">
          {prevValue !== null ? `${prevValue} ${operator || ''}` : ''}
        </div>
        <div className="text-2xl font-mono font-bold tracking-tight text-slate-100 truncate">
          {display}
        </div>
      </div>

      {/* Button Grid */}
      <div className="grid grid-cols-4 gap-1.5 mt-3 flex-1">
        {buttons.map((b, i) => (
          <button
            key={i}
            onClick={b.action}
            className={`flex items-center justify-center rounded-lg font-semibold text-sm transition-colors active:scale-95 shadow-xs ${b.style} ${
              b.label === '0' ? 'col-span-2' : ''
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>
    </div>
  );
};
