import { createModal, toggleModal } from './popup/components/LinkedInMessageModal.tsx';
import { createIcon } from './popup/constants/iconUtils';
import { SELECTORS } from './popup/constants/selectors';

export default defineContentScript({
  matches: ['*://*.linkedin.com/*'],
  main() {
    console.log('LinkedIn Message Assistant activated.');
    let currentInputBox: Element | null = null;
    let currentObserver: MutationObserver | null = null;
    let iconElement: HTMLElement | null = null;

    function removeIcon() {
      if (iconElement && iconElement.parentElement) {
        iconElement.parentElement.removeChild(iconElement);
        iconElement = null;
      }
    }

    function addIconToInputBox(inputBox: Element) {
      removeIcon();
      iconElement = createIcon(toggleModal);
      if (inputBox.parentElement) {
        inputBox.parentElement.appendChild(iconElement);
        console.log('Icon appended to parent:', inputBox.parentElement);
      } else {
        console.log('No parent element found for input box');
      }
    }

    function observeInputBox(inputBox: Element) {
      if (currentObserver) {
        currentObserver.disconnect();
      }

      currentInputBox = inputBox;
      addIconToInputBox(inputBox);
      createModal(currentInputBox);
      
      inputBox.addEventListener('click', (event) => {
        event.stopPropagation();
        if (!iconElement) {
          addIconToInputBox(inputBox);
        }
      });
      
      currentObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' || mutation.type === 'characterData') {
            const content = inputBox.textContent?.trim() ||
              (inputBox.getAttribute('contenteditable') === 'true' ? inputBox.textContent : (inputBox as HTMLInputElement).value);
          
            if (content && content.trim().length > 0 && content !== "Write a message...") {
              // You can update modal content here based on message box changes
            }
          }
        });
      });

      currentObserver.observe(inputBox, { childList: true, characterData: true, subtree: true });
      console.log('Input box observer set up successfully.');
    }

    function findAndObserveInputBox() {
      console.log('Searching for input box');
      const inputBox = document.querySelector(SELECTORS.MESSAGE_INPUT);
      if (inputBox && inputBox !== currentInputBox) {
        console.log('New input box found:', inputBox);
        observeInputBox(inputBox);
      } else {
        console.log('No new input box found, retrying in 1 second');
        setTimeout(findAndObserveInputBox, 1000);
      }
    }

    const bodyObserver = new MutationObserver(() => {
      findAndObserveInputBox();
    });

    bodyObserver.observe(document.body, { childList: true, subtree: true });

    findAndObserveInputBox();
    console.log('Body observer set up successfully.');

    document.addEventListener('click', (event) => {
      if (event.target instanceof Node) {
        if (currentInputBox && iconElement && !currentInputBox.contains(event.target) && !iconElement.contains(event.target)) {
          removeIcon();
        }
      }
    });
  },
});