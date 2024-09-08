const dialog_template = document.createElement("template");
dialog_template.innerHTML = `
  <style>
    .container {
      display: block;
      width: 90%;
      max-width: 900px;
      margin: 0 auto;
      height: auto;
      position: fixed;
      top: 20px;
      bottom: 20px;
      z-index: 1;
      overflow: hidden;
      background-color: #FFF;
      border: 1px solid rgb(255,249,231);
      border-radius: 12px;
      box-shadow: 2px 27px 55px -3px rgba(0,0,0,0.1);
      padding: 20px 0;
      transition: opacity .5s;
      animation: in 0.3s 1;
      animation-fill-mode: forwards;
    }
    .container::backdrop {
      background-color: #0000004f;
      backdrop-filter: blur(0.25rem);
    }
    .container:not([open]) {
      animation: out 0.3s 1;
      animation-direction: forwards;
      pointer-events: none;
      opacity: 0;
    }
    @keyframes in {
      from {
        opacity: 0;
        transform: scale(0.5);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    @keyframes out {
      from {
        opacity: 1;
        transform: scale(1);
      }
      to {
        opacity: 0;
        transform: scale(0);
      }
    }
    .image {
      width: 100%;
      border-radius: 1%;
    }
    .header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 0 20px 0;
    }
    .close {
      border: none;
      background-color: #000924;
      color: #FFF;
      padding: 10px 20px;
      font-family: "Ubuntu", sans-serif;
      border-radius: 30px;
      cursor: pointer;
    }
    .title {
      font-size: 22px;
      font-weight: 500;
      display: block;
      margin-bottom: 6px;
    }
    .paragraph {
      line-height: 200%;
      margin-top: 20px;
      display: block;
    }
    .content-container {
      height: 100%;
      width: 100%;
      overflow: scroll;
      padding: 20px;
      box-sizing: border-box;
    }
  </style>
  <dialog data-dialog class="container">
    <div class="content-container">
      <div class="header">
        <div>
          <slot name="title" class="title"></slot>
          <slot name="date" class="date"></slot>
        </div>
        <button class="close" data-close-modal>Close</button>
      </div>
      <a class="image-link" href="" target="_blank">
        <img class="image" />
      </a>
      <slot name="explanation" class="paragraph"></slot>
    </div>
  </dialog>
`;

class DetailsDialog extends HTMLElement {
  static observedAttributes = ["src"];
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.append(dialog_template.content.cloneNode(true));
  }

  connectedCallback() {
    this.shadowRoot.querySelector(".image").setAttribute("src", this.getAttribute("src"));
    const dialog = this.shadowRoot.querySelector("[data-dialog]");
    this.shadowRoot.querySelector("[data-close-modal]").addEventListener("click", function () {
      dialog.close();
    })
  }

  attributeChangedCallback(name, _, newValue) {
    if (name === "src" && newValue) {
      this.shadowRoot.querySelector(".image").setAttribute("src", newValue);
      this.shadowRoot.querySelector(".image-link").setAttribute("href", newValue);
    }
  }
}

customElements.define("details-dialog", DetailsDialog);
