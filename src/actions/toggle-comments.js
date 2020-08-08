import sketch from 'sketch';

// Object definitions
var Rectangle = require('sketch/dom').Rectangle;
var Settings = require('sketch/settings');

// Global Constants
const PANEL_WIDTH = 300;

export default function () {
  const board = sketch.getSelectedDocument().selectedLayers.layers[0];
  // Check to see if selection is a valid artboard
  if (board === undefined || board.type !== 'Artboard') {
    sketch.UI.message('Selection is not an artboard.');
    return;
  }
  var context = Settings.layerSettingForKey(board, 'context');
  context.hidden = !context.hidden;

  board.frame = new Rectangle(
    board.frame.x,
    board.frame.y,
    board.frame.width + (context.hidden ? PANEL_WIDTH * -1 : PANEL_WIDTH),
    board.frame.height
  );
  sketch.getSelectedDocument().getLayerWithID(context.notesPanelID).hidden = context.hidden;
  for (let i = 0; i < context.commentList.length; i++) {
    sketch.getSelectedDocument().getLayerWithID(context.commentList[i].markerID).hidden =
      context.hidden;
  }

  Settings.setLayerSettingForKey(board, 'context', context);
}
