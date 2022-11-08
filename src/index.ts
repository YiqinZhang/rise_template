import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ICommandPalette } from '@jupyterlab/apputils';
import { INotebookTracker, NotebookActions } from '@jupyterlab/notebook';
import { IMainMenu } from '@jupyterlab/mainmenu';
import { Menu } from '@lumino/widgets';

/**
 * Initialization data for the slide_layout extension.
 */

const plugin: JupyterFrontEndPlugin<void> = {
  id: 'slide_layout:plugin',
  autoStart: true,
  requires: [ICommandPalette, INotebookTracker, IMainMenu],
  activate: (
    app: JupyterFrontEnd,
    palette: ICommandPalette,
    tracker: INotebookTracker,
    mainMenu: IMainMenu
  ) => {
    console.log('JupyterLab extension slide_layout is activated!');

    const { commands } = app;

    commands.addCommand('openLink', {
      label: 'Documentation',
      caption: 'Documentation',
      execute: () => {
        const win = window.open(
          'https://jupyterlab.readthedocs.io/en/stable/',
          '_blank'
        );
        win?.focus();
      }
    });

    commands.addCommand('createBlankSlide', {
      label: 'Blank Slide',
      caption: 'Blank Slide',
      execute: () => {
        const current = tracker.currentWidget;
        const notebook = current!.content;
        NotebookActions.insertBelow(notebook);
        const activeCell = notebook.activeCell;
        activeCell!.model.value.text = '<hr>';
        NotebookActions.insertBelow(notebook);
        activeCell!.model.value.text = '** Body **';
        NotebookActions.insertBelow(notebook);
      }
    });

    commands.addCommand('imageOnlySlide', {
      label: 'Image only',
      caption: 'Image only',
      execute: () => {
        const current = tracker.currentWidget;
        const notebook = current!.content;
        NotebookActions.insertBelow(notebook);
        const activeCell = notebook.activeCell;
        activeCell!.model.value.text = 'print(Image only)';
        NotebookActions.insertBelow(notebook);
        const img = document.createElement('img');
        activeCell!.node.appendChild(img);
        img.src = '<img src="../images/default.png" width = "100%">';
        img.title = 'default title';
        const summary = document.createElement('p');
        activeCell!.node.appendChild(summary);
        summary.innerText += '<img src="../images/default.png" width = "100%">';
      }
    });

    commands.addCommand('createTitleSlide', {
      label: 'Title Slide',
      caption: 'Title Slide',
      execute: () => {
        const current = tracker.currentWidget;
        const notebook = current!.content;
        NotebookActions.insertBelow(notebook);
        const activeCell = notebook.activeCell;
        activeCell!.model.value.text = '%%html';
        activeCell!.model.value.text += '<hr>';
        NotebookActions.insertBelow(notebook);
        activeCell!.model.value.text = '# Title';
        NotebookActions.insertBelow(notebook);
      }
    });

    const snippetMenu = new Menu({ commands });
    snippetMenu.title.label = 'Slides';
    snippetMenu.addItem({ command: 'openLink' });

    const layoutSubMenu = new Menu({ commands });
    layoutSubMenu.title.label = 'Layout';
    layoutSubMenu.addItem({ command: 'createBlankSlide' });
    layoutSubMenu.addItem({ command: 'imageOnlySlide' });
    layoutSubMenu.addItem({ command: 'createTitleSlide' });

    snippetMenu.addItem({ type: 'submenu', submenu: layoutSubMenu });
    mainMenu.addMenu(snippetMenu, { rank: 300 });
  }
};

export default plugin;
