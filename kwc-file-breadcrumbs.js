/**
`kwc-file-breadcrumbs`

Displays a horizontal breadcrumb view of a path in a file tree

A custom template can be provided in its light dom to override the rendering.
The properties `item` and `index are then available`

Example:

    <kwc-file-breadcrumbs></kwc-file-breadcrumbs>

@group Kano Elements
@hero hero.svg
@demo demo/kwc-file-breadcrumbs.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { Templatizer } from '@polymer/polymer/lib/legacy/templatizer-behavior.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
Polymer({
  _template: html`
        <style>
            :host {
                display: flex;
                align-items: center;
            }
            #container {
                @apply --kwc-file-breadcrumbs;
            }
            [hidden] {
                display: none !important;
            }
        </style>
        <template id="default-template">
            <span class="separator" hidden\$="[[!index]]">/</span>
            <a class="name" path-index\$="[[index]]">[[item]]</a>
        </template>
        <slot id="custom-template"></slot>
`,

  is: 'kwc-file-breadcrumbs',
  behaviors: [Templatizer],

  properties: {
      /**
       * Array of the nodes in the file tree
       */
      parts: {
          type: Array,
          value: () => {
              return [];
          }
      }
  },

  observers: [
      '_changed(parts.*)'
  ],

  listeners: {
      'tap': '_onTap'
  },

  attached () {
      const nodes = dom(this.$['custom-template']).getDistributedNodes();
      this._listTemplate = this.$['default-template'];
      for (let i = 0; i < nodes.length; i++) {
          if (nodes[i] instanceof HTMLTemplateElement) {
              this._listTemplate = nodes[i];
              break;
          }
      }
      this.templatize(this._listTemplate);
  },

  _changed (e) {
      this.debounce('render', () => {
          this.render();
      });
  },

  /**
   * Forces a render of the elements. By default the rendering is asynchronous to batch fast operations
   * If you need to have access to the elements rendered immediately, call this method
   */
  render () {
      if (!this.parts) {
          return;
      }
      let instance;
      while (this.lastChild && !(this.lastChild instanceof HTMLTemplateElement)) {
          this.removeChild(this.lastChild);
      }
      this.parts.forEach((item, index) => {
          instance = this.stamp({ item, index });
          this.appendChild(instance.root);
      });
  },

  _onTap (e) {
      const target = e.path ? e.path[0] : e.target;
      const index = target.getAttribute('path-index');
      if (index === null) {
          return;
      }
      const pathParts = this.parts.slice(0, parseInt(index, 10) + 1);
      this.fire('path-link-tapped', '/' + pathParts.join('/'));
  }
});
