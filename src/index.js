const ceClass = (base) => class extends base {
  get properties() {
    return customElements.get(this.localname).properties;
  }

  get template() {
    return customElements.get(this.localname).template;
  }

  static get observedAttributes() {
    return Object.keys(this.properties).reduce((p, c) => {
      if (this.properties[c].reflect) p.push(c);
    }, []);
  }

  constructor() {
    super();
    if (this.template && this.render && !this.properties) this.render({});
    if (this.properties) this.setupProperties()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) this[name] = newValue;
  }

  setupProperties() {
    for (const key of Object.keys(this.properties)) {
      Object.defineProperty(this, property, {
        get: () => this.__[property] ? this.__[property] : this.getAttribute(property),
        set: value => {
	  if (this.properties[property].reflect) this.setAttribute(property, value);
          this.__[property] = value;
        },
	value: () => this[property] ? this[property] : this.properties[property].value
      })
    }
    if (this.template && this.render) this.render();
  }
}

export default target => {
  if (target.prototype instanceof HTMLElement) return ceClass(target);
}
