import Keyboard from './modules/keyboard.js';
import TextArea from './modules/text-area.js';
import loadJson from './modules/load-json.js';
import PageBuilder from './modules/page-builder.js';

const keys = await loadJson('./assets/json/keys.json');
const keyboardLayouts = await loadJson('./assets/json/keyboard-layout.json');

const keyboard = new Keyboard(keyboardLayouts.windows, keys);
const textArea = new TextArea();

keyboard.element.addEventListener('key', (event) => textArea.handelEvent(event));

const pageBuilder = new PageBuilder('RSS Virtual Keyboard');
pageBuilder.add(textArea);
pageBuilder.add(keyboard);
pageBuilder.createPage();
