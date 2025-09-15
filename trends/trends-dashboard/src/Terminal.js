
import React, { useLayoutEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from '@xterm/addon-fit';
import 'xterm/css/xterm.css';

const XtermTerminal = () => {
  const terminalRef = useRef(null);
  const term = useRef(null);

  useLayoutEffect(() => {
    if (!term.current) {
      term.current = new Terminal({
        theme: {
          background: '#000',
          foreground: '#0F0',
        },
        cursorBlink: true,
      });

      const fitAddon = new FitAddon();
      term.current.loadAddon(fitAddon);

      term.current.open(terminalRef.current);

      fitAddon.fit();

      term.current.writeln('Welcome to the Trends Dashboard!');
      term.current.writeln('Type \'trends [keyword]\' to see the latest trends.');
      term.current.prompt = () => {
        term.current.write('\r\n$ ');
      };
      term.current.prompt();

      let currentLine = '';

      const processCommand = (command) => {
        const [cmd, ...args] = command.split(' ');
        if (cmd === 'trends') {
          const keyword = args.join(' ');
          fetch(`/api/trends?keyword=${keyword}`)
            .then(res => res.json())
            .then(data => {
              const trends = JSON.parse(data).default.timelineData;
              term.current.writeln('\r\n');
              trends.forEach(trend => {
                term.current.writeln(`${trend.formattedTime}: ${trend.value[0]}`);
              });
            })
            .catch(err => {
              term.current.writeln(`\r\nError: ${err.message}`);
            });
        } else {
          term.current.writeln(`\r\nCommand not found: ${command}`);
        }
      };

      term.current.onKey(({ key, domEvent }) => {
        if (domEvent.keyCode === 13) { // Enter
          if (currentLine) {
            processCommand(currentLine);
            currentLine = '';
          }
          term.current.prompt();
        } else if (domEvent.keyCode === 8) { // Backspace
          if (currentLine) {
            currentLine = currentLine.slice(0, -1);
            term.current.write('\b \b');
          }
        } else {
          currentLine += key;
          term.current.write(key);
        }
      });
    }

    return () => {
      if (term.current) {
        term.current.dispose();
        term.current = null;
      }
    };
  }, []);

  return <div ref={terminalRef} style={{ width: '100%', height: '100%' }} />;
};

export default XtermTerminal;
