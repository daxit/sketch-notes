import { Rectangle, Settings, UI, getSelectedDocument } from 'sketch';
import { renderComments } from '../util.js';

export default function () {
  const document = getSelectedDocument();
  if (document.selectedLayers.length > 1) {
    UI.message('Select one layer or group');
    return;
  }
  const selection = document.selectedLayers.layers[0];
  const board = selection.getParentArtboard();
  const context = Settings.layerSettingForKey(board, 'context');

  // Find index of comment if it exists
  const commentIdx = context.commentList.findIndex(comment => {
    return comment.subjectID === selection.id || comment.commentID === selection.id;
  });

  if (commentIdx === -1) {
    UI.message('Comment not found');
    return;
  }

  // Remove comment and store its value
  const comment = context.commentList.splice(commentIdx, 1)[0];
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

  // Rerender comments and save context
  renderComments(context.commentList, document.getLayerWithID(context.commentsContainerID));
  Settings.setLayerSettingForKey(board, 'context', context);
}
