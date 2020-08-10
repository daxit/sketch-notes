import { Rectangle, Group, UI, Settings, getSelectedDocument } from 'sketch';
import { Comment } from '../model/Comment.js';
import { renderComments, createMarker } from '../util.js';

export default function () {
  const document = getSelectedDocument();
  if (document.selectedLayers.length > 1) {
    UI.message('Select one layer or group');
    return;
  }
  const selection = document.selectedLayers.layers[0];
  const board = selection.getParentArtboard();
  // Get comment from user
  let comment = null;
  UI.getInputFromUser(
    'Enter comment:',
    { initialValue: 'Type a comment here...', numberOfLines: 3 },
    (err, value) => (comment = err ? null : value)
  );
  if (comment === null) return;

  let context = Settings.layerSettingForKey(board, 'context');
  // Create a new comment linked to the selection
  let length = context.commentList.push(new Comment(comment, selection.id));

  // Encapsulate selected object in a group and create a marker for it
  let note = new Group({
    name: selection.name + '_note',
    parent: selection.parent,
    index: selection.index,
    frame: new Rectangle(
      selection.frame.x - 10,
      selection.frame.y - 10,
      selection.frame.width + 10,
      selection.frame.height + 10
    )
  });
  // Reparent selected object and reframe it relative to its new parent
  selection.parent = note;
  selection.frame = new Rectangle(10, 10, selection.frame.width, selection.frame.height);
  // Create a marker and store its ID
  context.commentList[length - 1].markerID = createMarker(length, note);
  // Render the comments on the notes panel
  renderComments(context.commentList, document.getLayerWithID(context.commentsContainerID));
  Settings.setLayerSettingForKey(board, 'context', context);
}
