import {
  JupyterFrontEnd, 
  JupyterFrontEndPlugin 
} from '@jupyterlab/application';

import { ICommandPalette } from '@jupyterlab/apputils';
import { INotebookTracker, NotebookActions } from '@jupyterlab/notebook';
import { IMainMenu } from '@jupyterlab/mainmenu';
import { Menu } from '@lumino/widgets';
import { Cell } from '@jupyterlab/cells';

/**
 * Initialization data for the slide_layout extension.
 */

const slideTypes = ['slide', 'subslide', 'fragment', 'skip', 'notes'];

function setCellSlide(cell: Cell | null, value: string | null): void {
  if (cell) {
    let data = cell.model.metadata.get('slideshow') || Object.create(null);
    if (value === null || !slideTypes.includes(value)) {
      // Make a shallow copy so we aren't modifying the original metadata.
      data = { ...data };
      delete data.slide_type;
    } else {
      data = { ...data, slide_type: value };
    }
    cell.model.metadata.set('slideshow', data);
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

        // add a dividing line
        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        let activeCell = notebook.activeCell;
        activeCell!.model.value.text = '<hr>';
        setCellSlide(activeCell, 'skip');  

        // add a body label
        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        activeCell = notebook.activeCell;
        activeCell!.model.value.text = '**BODY**';
        //set cell slidetype to skip
        setCellSlide(activeCell, 'skip');

        // add a BODY cell
        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        activeCell = notebook.activeCell;
        //set cell slidetype to slide to display as a new slide
        setCellSlide(activeCell, 'slide');
        
        // add a NOTE label
        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        activeCell = notebook.activeCell;
        activeCell!.model.value.text = '**NOTE**';
        setCellSlide(activeCell, 'skip');

        // add a NOTE cell
        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        activeCell = notebook.activeCell;
        activeCell!.model.value.text = '- a Note that will display in the notes view';
        setCellSlide(activeCell, 'notes');
      }
    });

    commands.addCommand('imageOnlySlide', {
      label: 'Image only',
      caption: 'Image only',
      execute: () => {
        const current = tracker.currentWidget;
        const notebook = current!.content;

        // add a dividing line
        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        let activeCell = notebook.activeCell;
        activeCell!.model.value.text = '<hr>';
        setCellSlide(activeCell, 'skip');  

        // add a body label
        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        activeCell = notebook.activeCell;
        activeCell!.model.value.text = '**Image Only**';
        //set cell slidetype to skip
        setCellSlide(activeCell, 'skip');
        
        // add a IMAGE cell
        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        activeCell = notebook.activeCell;
        activeCell!.model.value.text = '<img src="../images/default.png" width = "100%">';
        //set cell slidetype to slide to display as a new slide
        setCellSlide(activeCell, 'slide');

        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        activeCell = notebook.activeCell;
        activeCell!.model.value.text = '**NOTE**';
        setCellSlide(activeCell, 'skip');

        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        activeCell = notebook.activeCell;
        activeCell!.model.value.text =
          '- Using % of slide to scale the image';
        setCellSlide(activeCell, 'notes');
       
      }
    });

    commands.addCommand('leftBulletsRightImageSlide', {
      label: 'Left Bullets Right Image',
      caption: 'Left Bullets Right Image',
      execute: () => {
        const current = tracker.currentWidget;
        const notebook = current!.content;

        // add a dividing line
        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        let activeCell = notebook.activeCell;
        activeCell!.model.value.text = '<hr>';
        setCellSlide(activeCell, 'skip');  

        // add a body label
        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        activeCell = notebook.activeCell;
        activeCell!.model.value.text = '# Title';
        //set cell slidetype to slide to display as a new slide
        setCellSlide(activeCell, 'slide'); 
        
        // add a BODY cell
        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        activeCell = notebook.activeCell;
        activeCell!.model.value.text = '<table>\n \
        <tr>\n \
          <td> <ul> <li> Bullet 1 : Something keypoints, and a long description </li> \n \
                    <li> Bullet 2 : Something keypoints, and a long description </li> </ul> </td>\n \
          <td> <img src="../images/default.png" width = "100%">\n \
        </tr>\n \
        </table>';        
        
        // add a BODY cell
        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        activeCell = notebook.activeCell;
        activeCell!.model.value.text = 'Closing Comment';
         
        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        activeCell = notebook.activeCell;
        activeCell!.model.value.text = '**NOTE**';
        setCellSlide(activeCell, 'skip');

        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        activeCell = notebook.activeCell;
        activeCell!.model.value.text =
          '- Using % of slide to scale the image';
        setCellSlide(activeCell, 'notes');
      }
    });

    commands.addCommand('leftImageRightBulletsSlide', {
      label: 'Left Image Right Bullets ',
      caption: 'Left Image Right Bullets',
      execute: () => {
        const current = tracker.currentWidget;
        const notebook = current!.content;

        // add a dividing line
        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        let activeCell = notebook.activeCell;
        activeCell!.model.value.text = '<hr>';
        setCellSlide(activeCell, 'skip');  

        // add a body label
        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        activeCell = notebook.activeCell;
        activeCell!.model.value.text = '# Title';
        //set cell slidetype to slide to display as a new slide
        setCellSlide(activeCell, 'slide'); 
        
        // add a BODY cell
        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        activeCell = notebook.activeCell;
        activeCell!.model.value.text = '<table>\n \
        <tr>\n \
          <td> <img src="../images/default.png" width = "100%">\n \
          <td> <ul> <li> Bullet 1 : Something keypoints, and a long description </li> \n \
                    <li> Bullet 2 : Something keypoints, and a long description </li> </ul> </td>\n \
        </tr>\n \
        </table>';        
        
        // add a BODY cell
        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        activeCell = notebook.activeCell;
        activeCell!.model.value.text = 'Closing Comment';      
         
        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        activeCell = notebook.activeCell;
        activeCell!.model.value.text = '**NOTE**';
        setCellSlide(activeCell, 'skip');

        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        activeCell = notebook.activeCell;
        activeCell!.model.value.text =
          '- Using % of slide to scale the image';
        setCellSlide(activeCell, 'notes');
      }
    }); 
    
    commands.addCommand('twoColumnImagesSlide', {
      label: 'Two Column Images',
      caption: 'Two Column Images',
      execute: () => {
        const current = tracker.currentWidget;
        const notebook = current!.content;

        // add a dividing line
        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        let activeCell = notebook.activeCell;
        activeCell!.model.value.text = '<hr>';
        setCellSlide(activeCell, 'skip');  

        // add a TITLE label
        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        activeCell = notebook.activeCell;
        activeCell!.model.value.text = '# Title';
        //set cell slidetype to slide to display as a new slide
        setCellSlide(activeCell, 'slide'); 
        
        // add a two-column table cell for images
        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        activeCell = notebook.activeCell;
        activeCell!.model.value.text = '<table>\n \
        <tr>\n \
          <td> <img src="../images/default.png" width = "100%">\n \
          <td> <img src="../images/default.png" width = "100%">\n \
        </tr>\n \
        </table>';        
        
        // add a BODY cell
        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        activeCell = notebook.activeCell;
        activeCell!.model.value.text = 'Closing Comment';      
         
        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        activeCell = notebook.activeCell;
        activeCell!.model.value.text = '**NOTE**';
        setCellSlide(activeCell, 'skip');

        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        activeCell = notebook.activeCell;
        activeCell!.model.value.text =
          '- Using % of slide to scale the image';
        setCellSlide(activeCell, 'notes');
      }
    });    


    commands.addCommand('createBulletsSlide', {
      label: 'Bullets Slide',
      caption: 'Bullets Slide',
      execute: () => {
        const current = tracker.currentWidget;
        const notebook = current!.content;

        // add a dividing line
        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        let activeCell = notebook.activeCell;
        activeCell!.model.value.text = '<hr>';
        setCellSlide(activeCell, 'skip');  

        // add a body label
        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        activeCell = notebook.activeCell;
        activeCell!.model.value.text = '# Title';
        //set cell slidetype to slide to display as a new slide
        setCellSlide(activeCell, 'slide'); 
        
        // add a BODY cell
        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        activeCell = notebook.activeCell;
        activeCell!.model.value.text = '- **Bullet 1:** Something keypoints, and a long description \n - **Bullet 2:** Something keypoints, and a long description \n - **Bullet 3:** Something keypoints, and a long description \n  - **Bullet 4:** Something keypoints, and a long description';

        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        activeCell = notebook.activeCell;
        activeCell!.model.value.text = '**NOTE**';
        setCellSlide(activeCell, 'skip');

        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        activeCell = notebook.activeCell;
        activeCell!.model.value.text =
          '- a Note that will display in the notes view';
        setCellSlide(activeCell, 'notes');
      }
    });

    commands.addCommand('twoColumnBulletsSlide', {
      label: 'Two Column Bullets',
      caption: 'Two Column Bullets',
      execute: () => {
        const current = tracker.currentWidget;
        const notebook = current!.content;

        // add a dividing line
        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        let activeCell = notebook.activeCell;
        activeCell!.model.value.text = '<hr>';
        setCellSlide(activeCell, 'skip');  

        // add a body label
        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        activeCell = notebook.activeCell;
        activeCell!.model.value.text = '# Title';
        //set cell slidetype to slide to display as a new slide
        setCellSlide(activeCell, 'slide'); 
        
        // add a BODY cell
        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        activeCell = notebook.activeCell;
        activeCell!.model.value.text = '<table>\n \
        <tr>\n \
          <td> <ul> <li> Bullet 1.1 : Something keypoints, and a long description </li> \n \
                    <li> Bullet 1.2 : Something keypoints, and a long description </li> </ul> </td>\n \
          <td> <ul> <li> Bullet 2.1 : Something keypoints, and a long description </li> \n \
                    <li> Bullet 2.2 : Something keypoints, and a long description </li> </ul></td>\n \
        </tr>\n \
        </table>';        
         
        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        activeCell = notebook.activeCell;
        activeCell!.model.value.text = '**NOTE**';
        setCellSlide(activeCell, 'skip');

        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        activeCell = notebook.activeCell;
        activeCell!.model.value.text =
          '- a Note that will display in the notes view';
        setCellSlide(activeCell, 'notes');
      }
    });

    commands.addCommand('createTitleSlide', {
      label: 'Title Slide',
      caption: 'Title Slide',
      execute: () => {
        const current = tracker.currentWidget;
        const notebook = current!.content;

        // add a dividing line
        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        let activeCell = notebook.activeCell;
        activeCell!.model.value.text = '<hr>';
        setCellSlide(activeCell, 'skip');  

        // add a body label
        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        activeCell = notebook.activeCell;
        activeCell!.model.value.text = '# Title';
        //set cell slidetype to slide to display as a new slide
        setCellSlide(activeCell, 'slide');    
         
        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        activeCell = notebook.activeCell;
        activeCell!.model.value.text = '**NOTE**';
        setCellSlide(activeCell, 'skip');

        NotebookActions.insertBelow(notebook);
        NotebookActions.changeCellType(notebook, 'markdown');
        activeCell = notebook.activeCell;
        activeCell!.model.value.text =
          '- a Note that will display in the notes view';
        setCellSlide(activeCell, 'notes');
      }
    });

    const snippetMenu = new Menu({ commands });
    snippetMenu.title.label = 'Slides';
    snippetMenu.addItem({ command: 'openLink' });

    const layoutSubMenu = new Menu({ commands });
    layoutSubMenu.title.label = 'Layout';
    layoutSubMenu.addItem({ command: 'createBlankSlide' });
    layoutSubMenu.addItem({ command: 'imageOnlySlide' });
    layoutSubMenu.addItem({ command: 'leftBulletsRightImageSlide' });
    layoutSubMenu.addItem({ command: 'leftImageRightBulletsSlide' });
    layoutSubMenu.addItem({ command: 'twoColumnImagesSlide' });    
    layoutSubMenu.addItem({ command: 'createBulletsSlide' });
    layoutSubMenu.addItem({ command: 'twoColumnBulletsSlide' });
    layoutSubMenu.addItem({ command: 'createTitleSlide' });

    snippetMenu.addItem({ type: 'submenu', submenu: layoutSubMenu });
    mainMenu.addMenu(snippetMenu, { rank: 300 });
  }
};

export default plugin;
