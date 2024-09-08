const item_template = document.createElement("template");
item_template.innerHTML = `
  <style>
    .container {
      width: 100%;
      height: 100%;
      overflow: hidden;
      animation: in .5s 1;
      opacity: 0;
      animation-fill-mode: forwards;
      background-color: #000;
      cursor: pointer;
      border-radius: 8px;
    }
    .container:hover .image {
      transform: scale(1.4) rotate(-6deg);
    }
    .image {
      width: 100%;
      height: 100%;
      transition-duration: 0.3s;
      object-fit: cover;
    }
    @keyframes in {
      from {
        opacity: 0;
        transform: scale(2);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    .content-container {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      padding: 12px 16px;
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 1;
      background: rgb(255,249,231);
      background: linear-gradient(180deg, rgba(255,249,231,1) -20%, rgba(0,20,167,0.2) 0%, rgba(0,8,52,1) 100%);
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-end;
      gap: 10px;
      color: #fff;
    }
    .content-container h3 {
      font-size: 18px;
      letter-spacing: 1.5px;
      font-weight: 500;
      line-height: 130%;
      margin: 0;
    }
    .content-container p {
      font-size: 10px;
      font-weight: 400;
    }
  </style>
  <div class="container animate">
    <img class="image" />
    <div class="content-container">
      <slot name="title"></slot>
      <slot name="date"></slot>
    </div>
  </div>
`;

class PostItem extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.append(item_template.content.cloneNode(true));
  }

  static get observableAttributes() {
    return ["src"];
  }

  connectedCallback() {
    this.shadowRoot.querySelector(".image").setAttribute("src", this.getAttribute("src"));
    const className = this.getAttribute("class");
    if (className) {
      this.shadowRoot.querySelector(".container").classList.add(this.getAttribute("class"))
    }
  }
}

customElements.define("post-item", PostItem);
