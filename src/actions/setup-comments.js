import { Rectangle, ShapePath, Group, Text, UI, Settings, getSelectedDocument } from 'sketch';

// Global Constants
const PANEL_WIDTH = 300;
const COMMENTS_CONTAINER_WIDTH_OFFSET = 40;
const COMMENTS_CONTAINER_HEIGHT_OFFSET = 200;

export default function () {
  const page = getSelectedDocument().selectedPage;
  const board = getSelectedDocument().selectedLayers.layers[0];
  // Check to see if board is a valid artboard
  if (board === undefined) {
    UI.message('No Artboard selected');
    return;
  }
  if (board.type !== 'Artboard') {
    UI.message('Selection is not an Artboard');
    return;
  }

  // Initialize a variable to store context
  var context = {
    commentList: [],
    hidden: false
  };

  // Resize Artboard to make room for notes panel
  board.frame = new Rectangle(
    board.frame.x,
    board.frame.y,
    board.frame.width + PANEL_WIDTH,
    board.frame.height
  );
  // Move overlapping Artboards to the right
  _repositionArtboards(page, board);

  // Create the notes panel
  var notes = new Group({
    name: 'Notes',
    parent: board,
    frame: new Rectangle(board.frame.width - PANEL_WIDTH, 0, PANEL_WIDTH, board.frame.height)
  });
  // Create the notes panel background
  var background = new ShapePath({
    name: 'background',
    parent: notes,
    frame: new Rectangle(0, 0, notes.frame.width, notes.frame.height),
    shapeType: ShapePath.ShapeType.Rectangle,
    style: {
      fills: ['#161616']
    }
  });
  // Add the title to the notes panel
  new Text({
    text: 'Notes',
    parent: notes,
    frame: new Rectangle(20, 20, 0, 0),
    style: {
      alignment: Text.Alignment.left,
      textColor: '#f4f4f4',
      fontSize: 21,
      borders: []
    }
  });
  // Save reference to notes panel
  context.notesPanelID = notes.id;

  // Create container for comments and store ID for reference
  var container = new Group({
    name: 'Comments',
    parent: notes,
    frame: new Rectangle(
      COMMENTS_CONTAINER_WIDTH_OFFSET / 2,
      COMMENTS_CONTAINER_HEIGHT_OFFSET / 2,
      notes.frame.width - COMMENTS_CONTAINER_WIDTH_OFFSET,
      notes.frame.height - COMMENTS_CONTAINER_HEIGHT_OFFSET
    )
  });
  context.commentsContainerID = container.id;

  // Save context to the Artboard
  Settings.setLayerSettingForKey(board, 'context', context);
  // Save background to the comments container for reference by util
  Settings.setLayerSettingForKey(container, 'backgroundID', background.id);
}

/**
 * Move overlapping Artboards to the right
 *
 * @param {*} page the page on which the artboards are located
 * @param {*} board the board for which comments are created
 */
function _repositionArtboards(page, board) {
  console.log(page.layers.length);
  for (let i = 0; i < page.layers.length; i++) {
    // Check if X edges overlap
    if (page.layers[i].type === 'Artboard' && page.layers[i].frame.x > board.frame.x) {
      if (
        // Check if Y edges overlap
        (page.layers[i].frame.y <= board.frame.y &&
          page.layers[i].frame.y + page.layers[i].frame.height >= board.frame.y) ||
        (page.layers[i].frame.y <= board.frame.y + board.frame.height &&
          page.layers[i].frame.y + page.layers[i].frame.height >=
            board.frame.y + board.frame.height)
      ) {
        // Move Artboard to the right
        page.layers[i].frame = new Rectangle(
          page.layers[i].frame.x + PANEL_WIDTH + PANEL_WIDTH,
          page.layers[i].frame.y,
          page.layers[i].frame.width,
          page.layers[i].frame.height
        );
      }
    }
  }
}
