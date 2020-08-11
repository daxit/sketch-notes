import { Rectangle, Settings, getSelectedDocument } from 'sketch';

// Global Constants
const PANEL_WIDTH = 300;

export default function () {
  const document = getSelectedDocument();
  const page = document.selectedPage;
  const board = document.selectedLayers.layers[0];

  // Check to see if board is a valid Artboard
  if (board === undefined) {
    UI.message('No Artboard selected');
    return;
  }
  if (board.type !== 'Artboard') {
    UI.message('Selection is not an Artboard');
    return;
  }

  let context = Settings.layerSettingForKey(board, 'context');
  // Go through and delete every comment group
  context.commentList.forEach(comment => {
    // Get subject associated with comment
    const subject = document.getLayerWithID(comment.subjectID);
    // Get parent group of subject, containing marker and subject
    const commentGroup = subject.parent;
    // Reframe and reparent commented subject
    subject.frame = new Rectangle(
      commentGroup.frame.x + 10,
      commentGroup.frame.y + 10,
      commentGroup.frame.width - 10,
      commentGroup.frame.height - 10
    );
    subject.parent = commentGroup.parent;
    subject.index = commentGroup.index;
    // Delete parent group
    commentGroup.remove();
  });

  // Remove notes panel
  document.getLayerWithID(context.notesPanelID).remove();
  // Reset Artboard size
  board.frame = new Rectangle(
    board.frame.x,
    board.frame.y,
    board.frame.width - PANEL_WIDTH,
    board.frame.height
  );

  // Move Artboards back to the left
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
