import sketch from 'sketch';
import { renderComments } from '../util.js';

// Object definitions
var Rectangle = require('sketch/dom').Rectangle;
var Settings = require('sketch/settings');

// Global Constants
const PANEL_WIDTH = 300;

export default function () {
  const page = sketch.getSelectedDocument().selectedPage;
  const board = sketch.getSelectedDocument().selectedLayers.layers[0];
  // Check to see if board is a valid artboard
  if (board === undefined || board.type !== 'Artboard') {
    sketch.UI.message('Invalid selection or selection is not an artboard.');
    return;
  }
  var context = Settings.layerSettingForKey(board, 'context');

  // Go through and delete every comment
  for (let i = 0; i < context.commentList.length; i++) {
    let subject = sketch.getSelectedDocument().getLayerWithID(context.commentList[i].subjectID);
    let parent = subject.parent;
    // Reparent commented object
    subject.frame = new Rectangle(parent.frame.x + 10, parent.frame.y + 10, 0, 0);
    subject.parent = parent.parent;
    subject.index = parent.index;
    // Delete comment
    parent.remove();
  }

  // Empty comment list
  context.commentList = [];
  // Rerender comments
  renderComments(
    context.commentList,
    sketch.getSelectedDocument().getLayerWithID(context.commentsContainerID)
  );
  // Remove the notes panel
  sketch.getSelectedDocument().getLayerWithID(context.notesPanelID).remove();
  // Reset the artboard's width
  board.frame = new Rectangle(
    board.frame.x,
    board.frame.y,
    board.frame.width - PANEL_WIDTH,
    board.frame.height
  );

  // Move artboards back to the left
  for (let i = 0; i < page.layers.length; i++) {
    if (page.layers[i].type === 'Artboard' && page.layers[i].frame.x > board.frame.x) {
      if (
        (page.layers[i].frame.y <= board.frame.y &&
          page.layers[i].frame.y + page.layers[i].frame.height >= board.frame.y) ||
        (page.layers[i].frame.y <= board.frame.y + board.frame.height &&
          page.layers[i].frame.y + page.layers[i].frame.height >=
            board.frame.y + board.frame.height)
      ) {
        // move it back to the left
        page.layers[i].frame = new Rectangle(
          page.layers[i].frame.x - PANEL_WIDTH - PANEL_WIDTH,
          page.layers[i].frame.y,
          page.layers[i].frame.width,
          page.layers[i].frame.height
        );
      }
    }
  }

  // Clear context
  Settings.setLayerSettingForKey(board, 'context', undefined);
}
