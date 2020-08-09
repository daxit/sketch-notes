import { Rectangle, Settings, UI, getSelectedDocument } from 'sketch';

// Global Constants
const PANEL_WIDTH = 300;

export default function () {
  const board = getSelectedDocument().selectedLayers.layers[0];
  // Check if selection is a valid Artboard
  if (board === undefined) {
    UI.message('No Artboard selected');
    return;
  }
  if (board.type !== 'Artboard') {
    UI.message('Selection is not an Artboard');
    return;
  }
  let context = Settings.layerSettingForKey(board, 'context');
  // Update hidden in context
  context.hidden = !context.hidden;
  // Shrink the Artboard
  board.frame = new Rectangle(
    board.frame.x,
    board.frame.y,
    board.frame.width + (context.hidden ? PANEL_WIDTH * -1 : PANEL_WIDTH),
    board.frame.height
  );
  // Hide notes panel
  getSelectedDocument().getLayerWithID(context.notesPanelID).hidden = context.hidden;
  // Hide every notes marker
  context.commentList.forEach(comment => {
    getSelectedDocument().getLayerWithID(comment.markerID).hidden = context.hidden;
  });
  // Update the context
  Settings.setLayerSettingForKey(board, 'context', context);
}
