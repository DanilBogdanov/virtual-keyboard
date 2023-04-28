import KeyboardButton from './keyboard-button.js';

export default class Keyboard {
  element;

  #keys;

  #buttons = [];

  #capsBtn;

  #isCaps = false;

  #isShift = false;

  #lang;

  constructor(layout, keys) {
    this.#keys = keys;
    this.#lang = localStorage.getItem('lang');
    if (!this.#lang) {
      localStorage.setItem('lang', 'en');
      this.#lang = 'en';
    }

    this.element = document.createElement('div');
    this.element.className = 'keyboard';

    layout.forEach((keyCodes) => {
      const row = document.createElement('div');
      row.className = 'row';

      keyCodes.forEach((keyCode) => {
        const key = this.#keys[keyCode.code];
        const button = new KeyboardButton(keyCode, key, this.#lang);
        this.#buttons.push(button);
        button.element.onclick = () => {
          this.#keyClick(button);
        };
        row.append(button.element);
      });

      this.element.append(row);
    });

    this.#capsBtn = this.#buttons.find((x) => x.code === 'CapsLock');
    this.#capsBtn.element.onclick = () => {
      this.#capsPress();
    };

    const shiftButtons = this.#buttons.filter((x) => x.code.includes('Shift'));
    shiftButtons.forEach((shiftBtn) => {
      const btn = shiftBtn;
      btn.clicked = false;
      btn.element.onmousedown = () => {
        btn.clicked = true;
        this.#isShift = true;
        this.element.classList.add('keyboard_shift');
      };
      btn.element.onmouseup = () => {
        btn.clicked = false;
        this.#isShift = false;
        this.element.classList.remove('keyboard_shift');
      };
      btn.element.onmouseout = () => {
        if (btn.clicked) {
          this.#isShift = false;
          this.element.classList.remove('keyboard_shift');
        }
      };
    });

    document.body.onkeydown = (event) => this.#keyDown(event);
    document.body.onkeyup = (event) => this.#keyUp(event);
  }

  #keyClick(btn, isRepeat) {
    if (btn.isValuable) {
      if (this.#isCaps && (btn.code.startsWith('Key') || (btn.value >= 'a' && btn.value <= 'я') || btn.value === 'ё')) {
        if (this.#isShift) {
          this.#customEvent(btn.isValuable, btn.value);
        } else {
          this.#customEvent(btn.isValuable, btn.shiftValue);
        }
      } else if (this.#isShift) {
        this.#customEvent(btn.isValuable, btn.shiftValue);
      } else {
        this.#customEvent(btn.isValuable, btn.value);
      }
    } else {
      this.#customEvent(false, btn.code, isRepeat);
    }
  }

  #keyDown(event) {
    const btn = this.#buttons.find((x) => x.code === event.code);
    if (btn) {
      btn.keyDown();

      if (event.key === 'Shift') {
        this.#isShift = true;
        this.element.classList.add('keyboard_shift');
      }

      if (event.code === 'CapsLock' && !event.repeat) {
        this.#capsPress();
      }

      if (event.ctrlKey && event.altKey && (event.code === 'ControlLeft' || event.code === 'AltLeft')) {
        if (this.#lang === 'en') {
          this.#lang = 'ru';
        } else {
          this.#lang = 'en';
        }
        localStorage.setItem('lang', this.#lang);
        this.#changeLanguage();
      }

      this.#keyClick(btn, event.repeat);
    }
  }

  #capsPress() {
    this.#isCaps = !this.#isCaps;
    this.#buttons.forEach((btn) => btn.capsLock(this.#isCaps));
    if (this.#isCaps) {
      this.#capsBtn.element.classList.add('key_caps');
    } else {
      this.#capsBtn.element.classList.remove('key_caps');
    }
  }

  #keyUp(event) {
    this.#buttons.find((x) => x.code === event.code)?.keyUp();

    if (event.key === 'Shift') {
      this.#isShift = false;
      this.element.classList.remove('keyboard_shift');
    }
  }

  #changeLanguage() {
    this.#buttons.forEach((btn) => btn.changeLanguage(this.#lang, this.#isCaps));
  }

  #customEvent(isValuable, val, isRepeat = false) {
    const event = new CustomEvent('key', {
      detail: { isValuable, val, isRepeat },
    });

    this.element.dispatchEvent(event);
  }
}
