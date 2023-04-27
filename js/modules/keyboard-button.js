export default class KeyboardButton {
  code;

  element;

  isValuable;

  value;

  shiftValue;

  #key;

  #option;

  #lang;

  keys;

  constructor(keyCode, key, lang) {
    this.code = keyCode.code;
    this.#option = keyCode.option ?? null;
    this.#key = key;
    this.#createElement();
    this.#lang = lang;
    this.#setText();
  }

  #createElement() {
    this.element = document.createElement('button');
    let className = 'key';

    if (this.#option?.includes('stretch')) {
      className += ' key_stretch';
    }

    if (this.#option?.includes('double')) {
      className += ' key_double';
    }

    if (!this.#key.isValuable) {
      className += ' key_command';
    }

    this.element.className = className;
  }

  #setText(isCaps) {
    this.isValuable = this.#key.isValuable;
    if (this.isValuable) {
      const val = this.#key[this.#lang]?.value ?? this.#key.en.value;
      this.value = val;
      const shiftVal = this.#key[this.#lang]?.shiftValue ?? this.#key.en.shiftValue;
      this.shiftValue = shiftVal;

      if (this.code.startsWith('Key') || (val >= 'a' && val <= 'я') || val === 'ё') {
        this.element.classList.add('key_letter');

        if (isCaps) {
          this.element.innerHTML = `<span class="key__val">${shiftVal}</span><span class="key__shift-val">${val}</span>`;
        } else {
          this.element.innerHTML = `<span class="key__val">${val}</span><span class="key__shift-val">${shiftVal}</span>`;
        }
      } else {
        this.element.classList.remove('key_letter');
        this.element.innerHTML = `<span class="key__val">${val}</span><span class="key__shift-val">${shiftVal}</span>`;
      }
    } else {
      this.element.innerText = this.#key.name;
    }
  }

  changeLanguage(lang) {
    this.#lang = lang;
    this.#setText();
  }

  keyDown() {
    this.element.classList.add('key_pressed');
  }

  keyUp() {
    this.element.classList.remove('key_pressed');
  }

  capsLock(isCaps) {
    this.#setText(isCaps);
  }
}
