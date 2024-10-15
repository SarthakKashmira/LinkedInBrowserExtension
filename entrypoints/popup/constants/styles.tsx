export const MODAL_STYLES = {
  CONTAINER: `
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
  `,
  CONTENT: `
    flex flex-col gap-3
  `,
  CHAT_CONTAINER: `
    hidden max-h-[200px] overflow-y-auto
  `,
  TEXTAREA: `
    w-full h-10 p-2 rounded border border-gray-300 resize-none
  `,
  BUTTON_CONTAINER: `
    flex justify-end gap-2
  `,
  INSERT_BUTTON: `
    px-4 py-2 rounded bg-gray-200 cursor-pointer hidden
  `,
  GENERATE_BUTTON: `
   px-4 py-2 rounded bg-blue-600 text-white cursor-pointer
  `,
  MESSAGE: (sender: 'user' | 'assistant') => `
    p-2 rounded mb-2 max-w-[80%] text-sm
    ${sender === 'user' 
      ? 'bg-gray-200 ml-auto text-left' 
      : 'bg-blue-100 mr-auto text-left'}
  `,
};

export const ICON_STYLES = `
  absolute bottom-1 right-1 cursor-pointer z-[10000] block bg-transparent p-1
`;