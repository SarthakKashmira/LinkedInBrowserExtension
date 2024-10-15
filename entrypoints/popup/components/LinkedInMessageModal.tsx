import { MODAL_STYLES } from '../constants/styles';

let modalElement: HTMLElement | null = null;

export function createModal(currentInputBox: Element | null) {
  if (modalElement) return modalElement;

  modalElement = document.createElement('div');
  modalElement.id = 'linkedin-message-modal';
  modalElement.style.cssText = MODAL_STYLES.CONTAINER;
  modalElement.innerHTML = `
    <div style="${MODAL_STYLES.CONTENT}">
      <div id="chat-container" style="${MODAL_STYLES.CHAT_CONTAINER}"></div>
      <textarea id="modal-prompt" placeholder="Your prompt" style="${MODAL_STYLES.TEXTAREA}"></textarea>
      <div style="${MODAL_STYLES.BUTTON_CONTAINER}">
        <button id="modal-insert" style="${MODAL_STYLES.INSERT_BUTTON}">Insert</button>
        <button id="modal-generate" style="${MODAL_STYLES.GENERATE_BUTTON}">Generate</button>
      </div>
    </div>
  `;
  document.body.appendChild(modalElement);

  setupModalEventListeners(modalElement, currentInputBox);

  return modalElement;
}

function setupModalEventListeners(modalElement: HTMLElement, currentInputBox: Element | null) {
  const insertBtn = modalElement.querySelector('#modal-insert') as HTMLButtonElement;
  const generateBtn = modalElement.querySelector('#modal-generate') as HTMLButtonElement;
  const promptTextarea = modalElement.querySelector('#modal-prompt') as HTMLTextAreaElement;
  const chatContainer = modalElement.querySelector('#chat-container') as HTMLDivElement;

  insertBtn?.addEventListener('click', () => handleInsert(chatContainer, currentInputBox));
  generateBtn?.addEventListener('click', () => handleGenerate(promptTextarea, chatContainer, insertBtn, generateBtn));
  modalElement.addEventListener('click', (event) => event.stopPropagation());
}

function handleInsert(chatContainer: HTMLDivElement, currentInputBox: Element | null) {
  const lastMessage = chatContainer.lastElementChild;
  if (currentInputBox && lastMessage && lastMessage.textContent) {
    insertTextIntoInputBox(currentInputBox, lastMessage.textContent.trim());
    modalElement!.style.display = 'none';
  }
}

function insertTextIntoInputBox(inputBox: Element, text: string) {
  (inputBox as HTMLElement).innerHTML = '';
  inputBox.removeAttribute('data-placeholder');
  inputBox.removeAttribute('aria-placeholder');
  
  const pElement = document.createElement('p');
  pElement.textContent = text;
  
  if (inputBox.getAttribute('contenteditable') === 'true') {
    inputBox.appendChild(pElement);
  } else {
    (inputBox as HTMLInputElement).appendChild(pElement);
  }
  
  const inputEvent = new Event('input', { bubbles: true, cancelable: true });
  inputBox.dispatchEvent(inputEvent);
}

function handleGenerate(promptTextarea: HTMLTextAreaElement, chatContainer: HTMLDivElement, insertBtn: HTMLButtonElement, generateBtn: HTMLButtonElement) {
  const prompt = promptTextarea.value.trim();
  if (prompt) {
    chatContainer.style.display = 'block';
    addMessage(prompt, 'user', chatContainer);
    const response = "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.";
    addMessage(response, 'assistant', chatContainer);
    promptTextarea.value = '';
    insertBtn.style.display = 'inline-block';
    generateBtn.textContent = 'Regenerate';
  }
}

function addMessage(text: string, sender: 'user' | 'assistant', chatContainer: HTMLDivElement) {
  const messageDiv = document.createElement('div');
  messageDiv.style.cssText = MODAL_STYLES.MESSAGE(sender);
  messageDiv.textContent = text;
  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

export function toggleModal() {
  if (modalElement) {
    if (modalElement.style.display === 'none') {
      modalElement.style.display = 'block';
      resetModal(modalElement);
    } else {
      modalElement.style.display = 'none';
    }
  }
}

function resetModal(modal: HTMLElement) {
  const chatContainer = modal.querySelector('#chat-container') as HTMLDivElement;
  chatContainer.innerHTML = '';
  chatContainer.style.display = 'none';
  const promptTextarea = modal.querySelector('#modal-prompt') as HTMLTextAreaElement;
  promptTextarea.value = '';
  const insertBtn = modal.querySelector('#modal-insert') as HTMLButtonElement;
  insertBtn.style.display = 'none';
  const generateBtn = modal.querySelector('#modal-generate') as HTMLButtonElement;
  generateBtn.textContent = 'Generate';
}