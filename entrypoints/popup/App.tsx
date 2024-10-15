import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import MessageIcon from './components/Icon';

const App = () => {
  const [inputBox, setInputBox] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const findInputBox = () => {
      const inputBox = document.querySelector('.msg-form__contenteditable');
      console.log(inputBox);
      if (inputBox) {
        setInputBox(inputBox as HTMLElement);
      } else {
        setTimeout(findInputBox, 1000); // Retry after 1 second
      }
    };

    findInputBox();
  }, [inputBox]);

  useEffect(() => {
    if (inputBox) {
      const iconContainer = document.createElement('div');
      iconContainer.className = 'custom-icon-container';
      inputBox.parentElement?.appendChild(iconContainer);

      ReactDOM.render(<MessageIcon />, iconContainer);
    }
  }, [inputBox]);

  return (
    <div>
      LinkedIn
    </div>
  );
};

export default App