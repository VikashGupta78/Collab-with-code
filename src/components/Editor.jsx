import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../Actions';

const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const editorRef = useRef(null);
  useEffect(() => {
    if (!editorRef.current) { // Only initialize if not already initialized
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById('realtimeEditor'),
        {
          mode: { name: 'javascript', json: true },
          theme: 'dracula',
          lineNumbers: true,
          autoCloseBrackets: true,
          matchBrackets: true,
          styleActiveLine: true,
          tabSize: 2,
        }
      );

      editorRef.current.on('change', (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if (origin !== 'setValue') {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });
    }
  }, []); // Run only once when the component mounts


  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          const editor = editorRef.current;
          const currentCursor = editor.getCursor(); // Save the current cursor position
          editor.setValue(code); // Set the new value
          editor.setCursor(currentCursor); // Restore the cursor position

          // Ensure editor scrolls to top-left
          editor.scrollTo(0, 0);
        }
      });
    }

    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  return (
    <div className="editor-container">
      <textarea id="realtimeEditor"></textarea>
    </div>
  );
};

export default Editor;