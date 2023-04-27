export default class TextArea {
  element;

  constructor() {
    this.#createElement();
    this.#resetDefaultBehavior();
  }

  #createElement() {
    const textArea = document.createElement('textarea');
    textArea.className = 'textarea';
    this.element = textArea;
  }

  #resetDefaultBehavior() {
    const preventDefault = (event) => event.preventDefault();
    this.element.onkeydown = preventDefault;
    this.element.onkeyup = preventDefault;
    this.element.onkeypress = preventDefault;
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
        textArea.setRangeText('\t', start, end);
        textArea.selectionStart = start + 1;
        textArea.selectionEnd = start + 1;
      }
    }
  }
}
