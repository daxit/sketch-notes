import sketch from 'sketch';

// Object definitions
var Rectangle = require('sketch/dom').Rectangle;
var ShapePath = require('sketch/dom').ShapePath;
var Group = require('sketch/dom').Group;
var Text = require('sketch/dom').Text;
var Settings = require('sketch/settings');

// Global Constants
const PANEL_WIDTH = 300;
const COMMENTS_CONTAINER_WIDTH_OFFSET = 40;
const COMMENTS_CONTAINER_HEIGHT_OFFSET = 200;

export default function () {
  const page = sketch.getSelectedDocument().selectedPage;
  const board = sketch.getSelectedDocument().selectedLayers.layers[0];
  // Check to see if board is a valid artboard
  if (board === undefined || board.type !== 'Artboard') {
    sketch.UI.message('Invalid selection or selection is not an artboard.');
    return;
  }

  // Create and initialize a global var to store notes context
  var context = {
    commentList: [],
    hidden: false
  };

  // Resize artboard to make room for notes panel
  board.frame = new Rectangle(
    board.frame.x,
    board.frame.y,
    board.frame.width + PANEL_WIDTH,
    board.frame.height
  );
  // Move artboard to the right over
  for (let i = 0; i < page.layers.length; i++) {
    if (page.layers[i].type === 'Artboard' && page.layers[i].frame.x > board.frame.x) {
      if (
        (page.layers[i].frame.y <= board.frame.y &&
          page.layers[i].frame.y + page.layers[i].frame.height >= board.frame.y) ||
        (page.layers[i].frame.y <= board.frame.y + board.frame.height &&
          page.layers[i].frame.y + page.layers[i].frame.height >=
            board.frame.y + board.frame.height)
      ) {
        // move it over
        page.layers[i].frame = new Rectangle(
          page.layers[i].frame.x + PANEL_WIDTH + PANEL_WIDTH,
          page.layers[i].frame.y,
          page.layers[i].frame.width,
          page.layers[i].frame.height
        );
      }
    }
  }
  // Create the notes panel
  var notes = new Group({
    id: 'sketch-notes',
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
      fills: ['#282828']
    }
  });
  // Add the title to the notes panel
  new Text({
    text: 'Notes',
    parent: notes,
    frame: new Rectangle(20, 20, 0, 0),
    style: {
      alignment: Text.Alignment.left,
      textColor: '#f3f3f3ff',
      fontSize: 21,
      borders: []
    }
  });
  // Save notes panel id reference
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

  // Save context to the artboard
  Settings.setLayerSettingForKey(board, 'context', context);
  // Save background to the comments container for easier reference
  Settings.setLayerSettingForKey(container, 'backgroundID', background.id);
}
