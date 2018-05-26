/**
`kwc-file-picker-list`
Display a list of items from a tree as a file picker would.

Simple customisable list view for a file explorer. Uses the KwcFileManagerBehavior to provide
a file explorer model and displays breadcrumbs and the contents of the current folder.

You must provide a template in the slot with at least one element inside for the rendering of items.
The available properties will be the `item` selected and its `index`

You can provide a custom breadcrumbs instance by giving it to the matching slot.

Example:

    <kwc-file-picker-list>
        <template>
            <span>[[item.name]]</span>
        </template>
    </kwc-file-picker-list>

@group Kano Elements
@hero hero.svg
@demo demo/index.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-list/iron-list.js';
import { KwcFileManagerBehavior } from './kwc-file-manager-behavior.js';
import './kwc-file-breadcrumbs.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
        <style>
            :host {
                display: block;
            }
        </style>
        <kwc-file-breadcrumbs parts="[[breadcrumbs]]">
            <slot name="breadcrumbs"></slot>
        </kwc-file-breadcrumbs>
        <iron-list items="[[fileList]]" as="item">
            <slot></slot>
        </iron-list>
`,

  is: 'kwc-file-picker-list',

  behaviors: [
      KwcFileManagerBehavior,
  ]
});
