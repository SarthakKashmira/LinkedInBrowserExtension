import { iconForMessageBox } from "./popup/components/Icon.tsx";

export default defineContentScript({
  matches: ['*://*.linkedin.com/*'],
  main() {
    console.log('LinkedIn Message Assistant activated.');
    let currentInputBox: Element | null = null;
    let currentObserver: MutationObserver | null = null;
    let iconElement: HTMLElement | null = null;
    let modalElement: HTMLElement | null = null;

    // Function to create the modal
    function createModal() {
      if (modalElement) return modalElement;

      modalElement = document.createElement('div');
      modalElement.id = 'linkedin-message-modal';
      modalElement.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 600px;
        background-color:#F9FAFB;
        padding: 26px;
        border-radius: 15px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        z-index: 10001;
        gap:26px;
        display: none;
      `;
      modalElement.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div id="chat-container" style="display: none; max-height: 200px; overflow-y: auto;"></div>
          <textarea id="modal-prompt" placeholder="Your prompt" style="width: 100%; height: 40px; padding: 8px; border-radius: 4px; border: 1px solid #ccc; resize: none;"></textarea>
          <div style="display: flex; justify-content: flex-end; gap: 8px;">
            <button id="modal-insert" style="padding: 8px 16px; border-radius: 4px; border: none; background-color: #f3f3f3; cursor: pointer; display: none;">Insert</button>
            <button id="modal-generate" style="padding: 8px 16px; border-radius: 4px; border: none; background-color: #0a66c2; color: white; cursor: pointer;">Generate</button>
          </div>
        </div>
      `;
      document.body.appendChild(modalElement);

      const insertBtn = modalElement.querySelector('#modal-insert') as HTMLButtonElement;
      const generateBtn = modalElement.querySelector('#modal-generate') as HTMLButtonElement;
      const promptTextarea = modalElement.querySelector('#modal-prompt') as HTMLTextAreaElement;
      const chatContainer = modalElement.querySelector('#chat-container') as HTMLDivElement;

      insertBtn?.addEventListener('click', () => {
        const lastMessage = chatContainer.lastElementChild;
        if (currentInputBox && lastMessage && lastMessage.textContent) {
          // Clear existing content
          (currentInputBox as HTMLElement).innerHTML = '';
          
          // Remove placeholder attributes if they exist
          if (currentInputBox instanceof HTMLElement) {
            currentInputBox.removeAttribute('data-placeholder');
            currentInputBox.removeAttribute('aria-placeholder');
            
            // Create a new <p> element and append the text
            const pElement = document.createElement('p');
            pElement.textContent = lastMessage.textContent.trim();
            
            // If it's using contenteditable, we need to handle it differently
            if (currentInputBox.getAttribute('contenteditable') === 'true') {
              currentInputBox.appendChild(pElement);
            } else {
              (currentInputBox as HTMLInputElement).appendChild(pElement);
            }
          }
          
          // Trigger input event to notify LinkedIn that the content has changed
          const inputEvent = new Event('input', { bubbles: true, cancelable: true });
          currentInputBox.dispatchEvent(inputEvent);
          
          modalElement!.style.display = 'none';
        }
      });

      generateBtn?.addEventListener('click', () => {
        const prompt = promptTextarea.value.trim();
        if (prompt) {
          // Show the chat container
          chatContainer.style.display = 'block';
          
          // Add user's prompt to chat
          addMessage(prompt, 'user');
          
          // Generate response (replace this with actual API call in the future)
          const response = "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.";
          addMessage(response, 'assistant');
          
          promptTextarea.value = '';
          
          // Show the insert button after generating text
          insertBtn.style.display = 'inline-block';
          
          // Change Generate button to Regenerate
          generateBtn.textContent = 'Regenerate';
        }
      });

      function addMessage(text: string, sender: 'user' | 'assistant') {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
          padding: 8px;
          border-radius: 4px;
          margin-bottom: 8px;
          max-width: 80%;
          font-size: 14px;
          ${sender === 'user' 
            ? 'background-color: #f0f0f0; margin-left: auto; text-align: left;' 
            : 'background-color: #e3f2fd; margin-right: auto; text-align: left;'}
        `;
        messageDiv.textContent = text;
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }

      modalElement.addEventListener('click', (event) => {
        event.stopPropagation();
      });

      return modalElement;
    }

    function toggleModal() {
      const modal = createModal();
      if (modal.style.display === 'none') {
        modal.style.display = 'block';
        // Reset containers when opening the modal
        const chatContainer = modal.querySelector('#chat-container') as HTMLDivElement;
        chatContainer.innerHTML = ''; // Clear previous chat messages
        chatContainer.style.display = 'none'; // Hide chat container
        const promptTextarea = modal.querySelector('#modal-prompt') as HTMLTextAreaElement;
        promptTextarea.value = ''; // Clear the prompt textarea
        
        // Hide the insert button when opening the modal
        const insertBtn = modal.querySelector('#modal-insert') as HTMLButtonElement;
        insertBtn.style.display = 'none';
        
        // Reset Generate button text
        const generateBtn = modal.querySelector('#modal-generate') as HTMLButtonElement;
        generateBtn.textContent = 'Generate';
      } else {
        modal.style.display = 'none';
      }
    }
    // Function to create the icon
    function createIcon() {
      console.log('Creating icon');
      const icon = document.createElement('div');
      icon.id = 'linkedin-message-icon';
      icon.innerHTML = iconForMessageBox;
      icon.style.cssText = `
        position: absolute;
        bottom: 5px;
        right: 5px;
        cursor: pointer;
        z-index: 10000;
        display: block !important;
        background-color: transparent;
        padding: 5px;
        
      `;

      icon.addEventListener('click', (event) => {
        console.log("Icon clicked");
        event.stopPropagation();
        toggleModal();
      });

      console.log('Icon created:', icon);
      return icon;
    }

    document.addEventListener('click', (event) => {
      if (modalElement && modalElement.style.display === 'block') {
        modalElement.style.display = 'none';
      }
      if (currentInputBox && iconElement && event.target instanceof Node) {
        if (!currentInputBox.contains(event.target) && !iconElement.contains(event.target)) {
          removeIcon();
        }
      }
    });

    function removeIcon() {
      if (iconElement && iconElement.parentElement) {
        iconElement.parentElement.removeChild(iconElement);
        iconElement = null;
      }
    }

    function addIconToInputBox(inputBox: Element) {
      removeIcon(); // Remove any existing icon
      iconElement = createIcon();
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
      createModal();
      inputBox.addEventListener('click', (event) => {
        event.stopPropagation();
        if (!iconElement) {
          addIconToInputBox(inputBox);
        }
      });
      
      currentObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' || mutation.type === 'characterData') {
            const content = inputBox.textContent?.trim();
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
      const inputBox = document.querySelector('.msg-form__contenteditable');
      if (inputBox && inputBox !== currentInputBox) {
        console.log('New input box found:', inputBox);
        observeInputBox(inputBox);
      } else {
        console.log('No new input box found, retrying in 1 second');
        setTimeout(findAndObserveInputBox, 1000);
      }
    }

    const bodyObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          findAndObserveInputBox();
        }
      });
    });

    bodyObserver.observe(document.body, { childList: true, subtree: true });

    findAndObserveInputBox();
    console.log('Body observer set up successfully.');
  },
});