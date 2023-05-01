export default class PageBuilder {
  #element;

  #title;

  #footer;

  constructor(title) {
    this.#element = document.createElement('main');
    this.#createTitle(title);
    this.#createFooter();
  }

  add(obj) {
    this.#element.append(obj.element);
  }

  #createTitle(text) {
    const title = document.createElement('h1');
    title.className = 'title';
    title.innerText = text;
    this.#title = title;
  }

  #createFooter() {
    const footer = document.createElement('footer');
    footer.className = 'footer';

    const footerLang = document.createElement('div');
    footerLang.innerHTML = 'Left <code class="footer__key">Ctrl</code> + Left <code class="footer__key">Alt</code> - change language';
    footer.append(footerLang);

    const footerLogo = document.createElement('div');
    footerLogo.className = 'footer__logo';
    footer.append(footerLogo);

    const footerInfo = document.createElement('div');
    footerInfo.innerText = 'The keyboard was created in the Windows';
    footer.append(footerInfo);
    this.#footer = footer;
  }

  createPage() {
    this.#element.prepend(this.#title);
    document.body.prepend(this.#footer);
    document.body.prepend(this.#element);
  }
}
