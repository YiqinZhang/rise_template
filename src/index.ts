import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ICommandPalette } from '@jupyterlab/apputils';
import { INotebookTracker, NotebookActions } from '@jupyterlab/notebook';
import { IMainMenu } from '@jupyterlab/mainmenu';
import { Menu } from '@lumino/widgets';
// import { ICommandPalette, MainAreaWidget } from '@jupyterlab/apputils';
// import { Widget } from '@lumino/widgets';
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
        NotebookActions.changeCellType(notebook, 'markdown');
        let activeCell = notebook.activeCell;
        activeCell!.model.value.text = '<hr>';
        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        activeCell = notebook.activeCell;
        activeCell!.model.value.text = '**BODY**';
        NotebookActions.insertBelow(notebook);

        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        activeCell = notebook.activeCell;
        activeCell!.model.value.text = '**NOTE**';

        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        activeCell = notebook.activeCell;
        activeCell!.model.value.text = '<hr>';
      }
    });

    commands.addCommand('imageOnlySlide', {
      label: 'Image only',
      caption: 'Image only',
      execute: () => {
        const current = tracker.currentWidget;
        console.log(current!.context.model);

        const notebook = current!.content;
        NotebookActions.insertBelow(notebook);
        const activeCell = notebook.activeCell;
        activeCell!.model.value.text = '# Image only';
        
        NotebookActions.insertBelow(notebook);
        const img = document.createElement('img');
        activeCell!.node.appendChild(img);
        img.src = '<img src="../images/default.png" width = "100%">';
        img.title = 'default title';
        // const summary = document.createElement('p');
        // activeCell!.node.appendChild(summary);
        // summary.innerText += '<img src="../images/default.png" width = "100%">';

        NotebookActions.insertBelow(notebook);
        const activeCell5 = notebook.activeCell;
        const image = document.createElement('img');
        activeCell5!.node.appendChild(image);
        img.src = '../images/default.png';
        img.title = 'default image';
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
