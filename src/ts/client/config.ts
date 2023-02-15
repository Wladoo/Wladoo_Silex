import blocksBasicPlugin from 'grapesjs-blocks-basic'
import styleFilterPlugin from 'grapesjs-style-filter'
import formPlugin from 'grapesjs-plugin-forms'
import codePlugin from 'grapesjs-custom-code'
import uiSuggestClasses from '@silexlabs/grapesjs-ui-suggest-classes'
import symbolsPlugin from '@silexlabs/grapesjs-symbols'
import { fontsDialogPlugin, cmdOpenFonts } from '@silexlabs/grapesjs-fonts'
import symbolDialogsPlugin, { cmdPromptAddSymbol } from './grapesjs/symbolDialogs'
import storagePlugin from './grapesjs/storage'

import { pagePanelPlugin, cmdTogglePages, cmdAddPage } from './grapesjs/page-panel'
import { newPageDialog, cmdOpenNewPageDialog } from './grapesjs/new-page-dialog'
import { projectBarPlugin } from './grapesjs/project-bar'
import { settingsDialog, cmdOpenSettings } from './grapesjs/settings'
import { blocksPlugin } from './grapesjs/blocks'
import { semanticPlugin } from './grapesjs/semantic'
import { richTextPlugin } from './grapesjs/rich-text'
import { internalLinksPlugin } from './grapesjs/internal-links'
import { publishPlugin } from './grapesjs/publish'
import { templatePlugin } from './grapesjs/template'
import { eleventyPlugin } from './grapesjs/eleventy'

const plugins = [
  {name: './grapesjs/storage', value: storagePlugin},
  {name: './grapesjs/project-bar', value: projectBarPlugin}, // has to be before panels and dialogs
  {name: './grapesjs/settings', value: settingsDialog},
  {name: '@silexlabs/grapesjs-fonts', value: fontsDialogPlugin},
  {name: './grapesjs/new-page-dialog', value: newPageDialog},
  {name: './grapesjs/page-panel', value: pagePanelPlugin},
  {name: 'grapesjs-blocks-basic', value: blocksBasicPlugin},
  {name: './grapesjs/blocks', value: blocksPlugin},
  {name: './grapesjs/semantic', value: semanticPlugin},
  {name: './grapesjs/rich-text', value: richTextPlugin},
  {name: 'grapesjs-style-filter', value: styleFilterPlugin},
  {name: 'grapesjs-plugin-forms', value: formPlugin},
  {name: 'grapesjs-custom-code', value: codePlugin},
  {name: './grapesjs/internal-links', value: internalLinksPlugin},
  {name: '@silexlabs/grapesjs-ui-suggest-classes', value: uiSuggestClasses},
  {name: './grapesjs/symbolDialogs', value: symbolDialogsPlugin},
  {name: '@silexlabs/grapesjs-symbols', value: symbolsPlugin},
  {name: './grapesjs/publish', value: publishPlugin},
  {name: './grapesjs/template', value: templatePlugin},
  {name: './grapesjs/eleventy', value: eleventyPlugin},
]

// Check that all plugins are loaded correctly
plugins
  .filter(p => !p.value)
  .forEach(p => {
    throw new Error(`Plugin ${p.name} could not be loaded correctly`)
  })

/**
 * @fileoverview Silex config overridable from index.pug
 */

const catBasic = 'Containers'
const catText = 'Texts'
const catMedia = 'Media'
const catComponents = 'Components'
export const projectId = new URL(location.href).searchParams.get('projectId') || 'default'
export const ROOT_URL = '.'
const loadEndpoint = `${ ROOT_URL }/website/?projectId=${projectId}`
const uploadEndpoint = `${ ROOT_URL }/assets/?projectId=${projectId}`

export const defaultConfig = {

  /**
   * debug mode
   */
  debug: false,

  /**
   * Grapesjs config
   */
  editor: {
    container: '#gjs',
    height: '100%',
    showOffsets: 1,
    showDevices: 1,

    pageManager: true,

    layerManager: {
      appendTo: '.layer-manager-container',
    },

    blockManager: {
      appendTo: '.block-manager-container',
    },

    assetManager: {
      upload: uploadEndpoint,
    },

    storageManager: {
      id: '', // do not add a prefix to the saved object
      type: 'remote',
      options: {
        remote: {
          urlStore: loadEndpoint,
          urlLoad: loadEndpoint,
        },
      },
    },

    plugins: plugins.map(p => p.value),
    importWebpage: {
      modalImportLabel: '',
      modalImportContent: 'Paste a web page HTML code here.',
      modalImportButton: 'Import',
      modalImportTitle: 'Import from website',
    },
    pluginsOpts: {
      [blocksBasicPlugin as any]: {
        blocks: ['text', 'image', 'video', 'map'],
        category: catBasic,
        //flexGrid: true,
      },
      [projectBarPlugin as any]: {
        panels: [
          {
            id: 'dash',
            className: 'logo',
            attributes: { title: 'Go to your dashboard' },
            link: '/',
            command: 'open-dash',
          }, {
            id: 'block-manager-btn',
            className: 'block-manager-btn fa fa-fw fa-plus',
            attributes: { title: 'Blocks', containerClassName: 'block-manager-container', },
            command: 'open-blocks',
          }, {
            id: 'symbols-btn',
            className: 'symbols-btn fa fa-fw fa-diamond',
            attributes: { title: 'Symbols', containerClassName: 'symbols-list-container', },
            command: 'open-symbols',
            buttons: [
              {
                id: 'symbol-create-button',
                className: 'pages__add-page fa fa-plus',
                label: 'Create symbol from selection',
                command: cmdPromptAddSymbol,
              },
            ],
          }, {
            id: 'page-panel-btn',
            className: 'page-panel-btn fa fa-fw fa-file',
            attributes: { title: 'Pages', containerClassName: 'page-panel-container', },
            command: cmdTogglePages,
            buttons: [{
              className: 'pages__add-page fa fa-file',
              command: cmdAddPage,
              text: '+',
            }],
          }, {
            id: 'layer-manager-btn',
            className: 'layer-manager-btn fa fa-fw fa-list',
            attributes: { title: 'Layers', containerClassName: 'layer-manager-container', },
            command: 'open-layers',
          }, {
            id: 'font-dialog-btn',
            className: 'font-manager-btn fa fa-fw fa-font',
            attributes: { title: 'Fonts' },
            command: cmdOpenFonts,
          }, {
            id: 'settings-dialog-btn',
            className: 'page-panel-btn fa fa-fw fa-cog',
            attributes: { title: 'Settings' },
            command: cmdOpenSettings,
          },
        ],
      },
      [publishPlugin as any]: {
        appendTo: 'options',
      },
      [pagePanelPlugin as any]: {
        cmdOpenNewPageDialog,
        cmdOpenSettings,
        appendTo: '.page-panel-container',
      },
      [internalLinksPlugin as any]: {
        // FIXME: warn the user about links in error
        onError: (errors) => console.log('Links errors:', errors),
      },
      [codePlugin as any]: {
        blockLabel: 'HTML',
        blockCustomCode: {
          category: catComponents,
        }
      },
      [symbolsPlugin as any]: {
        appendTo: '.symbols-list-container',
      },
      [fontsDialogPlugin as any]: {
        api_key: 'AIzaSyAdJTYSLPlKz4w5Iqyy-JAF2o8uQKd1FKc',
      },
    },
  },
}