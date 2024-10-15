import { iconForMessageBox } from './icons.tsx';
import { ICON_STYLES } from './styles';

export function createIcon(toggleModal: () => void): HTMLElement {
  const icon = document.createElement('div');
  icon.id = 'linkedin-message-icon';
  icon.innerHTML = iconForMessageBox;
  icon.style.cssText = ICON_STYLES;

  icon.addEventListener('click', (event) => {
    console.log("Icon clicked");
    event.stopPropagation();
    toggleModal();
  });

  console.log('Icon created:', icon);
  return icon;
}