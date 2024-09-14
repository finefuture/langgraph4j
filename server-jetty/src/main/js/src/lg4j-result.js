import TWStyles from './twlit';

import { html, css, LitElement } from 'lit';
import '@alenaksu/json-viewer';

/**
 * @typedef {Object} ResultData
 * @property {string} node - The node identifier.
 * @property {Record<string, any>} state - The state associated with the node.
 */


export class LG4JResultElement extends LitElement {

  static styles = [TWStyles, css`
  json-viewer {
    --font-size: .8rem;
  }`]

  static properties = {
  }

  /**
   * @type {any[]}
   */
  results = []
  /**
   * @type {string[]}
   */
  threads = []
  /**
   * @type {string}
   */
  selectedThread = "thread-0"

  constructor() {
    super()
  }
  
  connectedCallback() {
    super.connectedCallback();

    this.addEventListener( 'result', this.#onResult )
    this.addEventListener( 'result-threads', this.#onInitThreads )
  }

  disconnectedCallback() {
    super.disconnectedCallback()

    this.removeEventListener( 'result',  this.#onResult )
    this.removeEventListener( 'result-threads',  this.#onInitThreads )
  }

  #onInitThreads = (e) => {
    const { detail: threads } = e 

  }


  /**
   * Event handler for the 'result' event.
   * 
   * @param {CustomEvent} e - The event object containing the result data.
   * @private
   */
  #onResult = (e) => {

    const { detail: result } = e 
    console.debug( "onResult", e )
    
    // TODO: validate e.detail
    const index = this.results.push( result )

    this.dispatchEvent( new CustomEvent( 'graph-active', { 
      detail: result.node,
      bubbles: true,
      composed: true,
      cancelable: true
    }));
    
    this.requestUpdate()
    
    this.updateComplete.then(() => {
      const id = `#json${index-1}`
      const elems = this.shadowRoot.querySelectorAll(id);
      console.debug( id, elems );
      for (const elem of elems) {
        elem.expandAll()
      }
    });
  }

  /**
   * Event handler select tab.
   * 
   * @param {Event} event - The event object.
   * @private
   */

  #onSelectTab( event ) {
    this.selectedThread = event.target.id
    this.requestUpdate();
  }

  #onNewTab(event) {
    console.log( "NEW TAB", event)
    this.threads.push( `Thread-${this.threads.length+1}`);
    this.requestUpdate();

    this.dispatchEvent( new CustomEvent( 'update-threads', { 
      detail: this.threads,
      bubbles: true,
      composed: true,
      cancelable: true
    }));
  }


  /** 
   * Renders a result.
   * @param {ResultData} result - The result data to render.
   * @returns {import('lit').TemplateResult} The template for the result.
   */
  #renderResult(result, index) {
    return html`
    <div class="collapse collapse-arrow bg-base-200">
      <input type="radio" name="item-1" checked="checked" />
      <div class="collapse-title text-ml font-bold">${result.node}</div>
      <div class="collapse-content">
      ${Object.entries(result.state).map(([key, value]) => html`
          <div>
              <h4 class="italic">${key}</h4>
              <p class="my-3">
                <json-viewer id="json${index}">
                ${JSON.stringify(value)}
                </json-viewer>
              </p>
            </div>
        `)}
      </div>
    </div>
    `
  }

  #renderTabs() {
    return html`
    <a id="thread-0" @click="${this.#onSelectTab}" role="tab" class="tab ${this.selectedThread==='thread-0' ? 'tab-active' : ''}">No Thread</a>
    ${this.threads.map( t => html`<a id="${t}" @click="${this.#onSelectTab}" role="tab" class="tab ${this.selectedThread===t ? 'tab-active' : ''}" >${t}</a>`)}
    `
  }
  
  render() {
  
    return html`
      
      <div class="h-full">
        <div role="tablist" class="tabs tabs-bordered">
            ${this.#renderTabs()}
            <a role="tab" class="tab" @click="${this.#onNewTab}">
              <svg  xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="9" fill="none" stroke="white" stroke-width="1.5"/>
                <line x1="5" y1="10" x2="15" y2="10" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="10" y1="5" x2="10" y2="15" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </a>
          </div>
            <div class="max-h-[95%] overflow-x-auto bg-slate-500">
              <table class="table table-pin-rows">
                <tbody>
                    ${this.results.map( (result, index) => html`<tr><td>${this.#renderResult(result, index)}</td></tr>`) }
                </tbody>
              </table>
            </div>
        </div> 
       
    `;
  }

  // @deprecated
  #renderResultWithCard(result, index) {
    return html`
    <div class="card bg-neutral text-neutral-content">
    <div class="card-body">
      <h2 class="card-title">${result.node}</h2>
      <div class="collapse collapse-arrow bg-base-200">
        <input type="radio" name="item-1" checked="checked" />
        <div class="collapse-content">
        ${Object.entries(result.state).map(([key, value]) => html`
          <div>
              <h4 class="italic">${key}</h4>
              <p class="my-3">
                <json-viewer id="json${index}">
                ${JSON.stringify(value)}
                </json-viewer>
              </p>
            </div>
        `)}
        </div>
        </div>
    </div>
  </div>   `
  }

}

window.customElements.define('lg4j-result', LG4JResultElement);
