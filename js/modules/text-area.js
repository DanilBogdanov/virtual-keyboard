export default class TextArea {
  element;

  #buffer = '';

  #soundSrc = './assets/sound/key.mp3';

  constructor() {
    this.#createElement();
    this.#resetDefaultBehavior();
    this.element.focus();
  }

  #createElement() {
    const textArea = document.createElement('textarea');
    textArea.className = 'textarea';
    textArea.cols = 68;
    textArea.rows = 8;
    textArea.placeholder = 'ctrl + a: select all\nctrl + c: copy\nctrl + v: paste\nctrl + x: cut';
    this.element = textArea;
  }

  #resetDefaultBehavior() {
    const preventDefault = (event) => event.preventDefault();
    this.element.onkeydown = preventDefault;
    this.element.onkeyup = preventDefault;
    this.element.onkeypress = preventDefault;
  }

  #playAudio() {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.src = this.#soundSrc;
    audio.autoplay = false;
    const prom = audio.play();
    if (prom !== undefined) {
      prom.then(() => {
        audio.autoplay = true;
      }).catch(() => {
        audio.muted = true;
      });
    }
  }

  handelEvent(event) {
    const textArea = this.element;
    textArea.focus();
    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    const value = event.detail.val;

    if (event.detail.isValuable) {
      textArea.setRangeText(value, start, end);
      textArea.selectionStart = start + 1;
      textArea.selectionEnd = start + 1;
    } else {
      if (value === 'ArrowLeft') {
        if (start > 0) {
          textArea.selectionStart -= 1;
        }
        textArea.selectionEnd = textArea.selectionStart;
      }

      if (value === 'ArrowRight') {
        if (start < textArea.textLength) {
          textArea.selectionStart += 1;
        }
        textArea.selectionEnd = textArea.selectionStart;
      }

      if (value === 'ArrowUp') {
        const rowLength = Math.floor(textArea.clientWidth / 11.5);
        let position = start - rowLength;
        if (position < 0) {
          position = 0;
        }
        textArea.selectionStart = position;
        textArea.selectionEnd = position;
      }

      if (value === 'ArrowDown') {
        const rowLength = Math.floor(textArea.clientWidth / 11.5);
        let position = start + rowLength;
        if (position > textArea.textLength) {
          position = textArea.textLength;
        }
        textArea.selectionStart = position;
        textArea.selectionEnd = position;
      }

      if (value === 'Backspace') {
        if (start === end) {
          if (start > 0) {
            textArea.setRangeText('', start - 1, end);
          }
        } else {
          textArea.setRangeText('', start, end);
        }
      }

      if (value === 'Delete') {
        if (start === end) {
          if (start < textArea.textLength) {
            textArea.setRangeText('', start, end + 1);
          }
        } else {
          textArea.setRangeText('', start, end);
        }
      }

      if (value === 'Enter') {
        textArea.setRangeText('\n', start, end);
        textArea.selectionStart = start + 1;
        textArea.selectionEnd = start + 1;
      }

      if (value === 'Tab') {
        textArea.setRangeText(' ', start, end);
        textArea.setRangeText(' ', start, end);
        textArea.setRangeText(' ', start, end);
        textArea.setRangeText(' ', start, end);
        textArea.selectionStart = start + 4;
        textArea.selectionEnd = start + 4;
      }

      if (value === 'SelectAll') {
        textArea.selectionStart = 0;
        textArea.selectionEnd = textArea.textLength;
      }

      if (value === 'Copy') {
        this.#buffer = textArea.value.substring(start, end);
      }

      if (value === 'Paste') {
        textArea.setRangeText(this.#buffer, start, end);
        textArea.selectionStart = start + this.#buffer.length;
        textArea.selectionEnd = textArea.selectionStart;
      }

      if (value === 'Cut') {
        this.#buffer = textArea.value.substring(start, end);
        textArea.setRangeText('', start, end);
        textArea.selectionStart = start;
        textArea.selectionEnd = start;
      }
    }

    const noRepeatSound = ['CapsLock', 'MetaLeft', 'MetaRight', 'ShiftLeft', 'ShiftRight',
      'AltLeft', 'AltRight', 'ControlLeft', 'ControlRight'];
    if (!event.detail.isRepeat) {
      this.#playAudio();
    } else if (!noRepeatSound.includes(value)) {
      this.#playAudio();
    }
  }
}
