import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import MessageIcon from './components/MessageIcon.tsx';

const App = () => {
  const [inputBox, setInputBox] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const findInputBox = () => {
      const inputBox = document.querySelector('.msg-form__contenteditable');
      console.log(inputBox);
      if (inputBox) {
        setInputBox(inputBox as HTMLElement);
      } else {
        setTimeout(findInputBox, 1000); // Retry after 1 second  sarthakkashmira123@gmail.com   ttlshiwwya
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
    <div className="text-center text-xl font-bold bg-blue-600 text-white p-4 rounded-lg shadow-lg">
      LinkedIn AI Assistant For Messaging
    </div>

  );
};

export default App