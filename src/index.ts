import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ICommandPalette } from '@jupyterlab/apputils';
import { INotebookTracker, NotebookActions } from '@jupyterlab/notebook';
import { IMainMenu } from '@jupyterlab/mainmenu';
import { Menu } from '@lumino/widgets';
import { Cell } from '@jupyterlab/cells';
// import { ICommandPalette, MainAreaWidget } from '@jupyterlab/apputils';
// import { Widget } from '@lumino/widgets';
/**
 * Initialization data for the slide_layout extension.
 */

function setCellSlide(cell: Cell | null, value: string | null): void {
  if (cell) {
    let data = cell.model.metadata.get('slideshow') || Object.create(null);
    if (value === null) {
      // Make a shallow copy so we aren't modifying the original metadata.
      data = { ...data };
      delete data.slide_type;
    } else {
      data = { ...data, slide_type: value };
    }
    if (Object.keys(data).length > 0) {
      cell.model.metadata.set('slideshow', data);
    } else {
      cell.model.metadata.delete('slideshow');
    }
  }
}

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
        // add a body label
        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        let activeCell = notebook.activeCell;
        activeCell!.model.value.text = '**BODY**';
        //set cell slidetype to skip
        setCellSlide(activeCell, 'skip');
        // add a BODY cell
        NotebookActions.insertBelow(notebook);
        // add a NOTE cell
        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        activeCell = notebook.activeCell;
        activeCell!.model.value.text = '**NOTE**';
        setCellSlide(activeCell, 'notes');
        // add a dividing line
        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        activeCell = notebook.activeCell;
        activeCell!.model.value.text = '<hr>';
        setCellSlide(activeCell, 'skip');
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
        NotebookActions.changeCellType(notebook, 'markdown');
        let activeCell = notebook.activeCell;
        activeCell!.model.value.text = '# Image only';
        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');

        const img = document.createElement('img');
        activeCell!.node.appendChild(img);
        img.src = '<img src="../images/default.png" width = "100%">';
        img.title = 'default title';

        const summary = document.createElement('p');
        activeCell = notebook.activeCell;
        activeCell!.node.appendChild(summary);
        summary.innerText += '<img src="../images/default.png" width = "100%">';

        NotebookActions.insertBelow(notebook);
        const activeCell5 = notebook.activeCell;
        const image = document.createElement('img');
        activeCell5!.node.appendChild(image);
        image.src = '../images/default.png';
        image.title = 'default image';

        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        activeCell = notebook.activeCell;
        activeCell!.model.value.text = '<hr>';
      }
    });

    commands.addCommand('createTitleSlide', {
      label: 'Title Slide',
      caption: 'Title Slide',
      execute: () => {
        const current = tracker.currentWidget;
        const notebook = current!.content;
        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        let activeCell = notebook.activeCell;
        activeCell!.model.value.text = '# Title';

        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        activeCell = notebook.activeCell;
        activeCell!.model.value.text = '**NOTE**';

        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        activeCell = notebook.activeCell;
        activeCell!.model.value.text =
          '-a Note that will display in the notes view';

        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        activeCell = notebook.activeCell;
        activeCell!.model.value.text = '<hr>';
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
