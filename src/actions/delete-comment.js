import sketch from 'sketch';
import { renderComments } from '../util.js';

// Object definitions
var Rectangle = require('sketch/dom').Rectangle;
var Settings = require('sketch/settings');

export default function () {
  // Static Values
  var selectedObject = sketch.getSelectedDocument().selectedLayers.layers[0];
  const board = selectedObject.getParentArtboard();
  var context = Settings.layerSettingForKey(board, 'context');

  // Remove comment from list
  context.commentList.splice(
    context.commentList.findIndex(comment => {
      if (comment.subjectID === selectedObject.layers[0].id) {
        return true;
      }
      if (comment.commentID === selectedObject.id) {
        selectedObject = sketch.getSelectedDocument().getLayerWithID(comment.subjectID).parent;
        return true;
      }
      return false;
    }),
    1
  );

  let subject = selectedObject.layers[0];
  // Reparent commented object
  subject.frame = new Rectangle(selectedObject.frame.x + 10, selectedObject.frame.y + 10, 0, 0);
  subject.parent = selectedObject.parent;
  subject.index = selectedObject.index;
  // Delete comment
  selectedObject.remove();

  // Rerender comments and save context
  renderComments(
    context.commentList,
    sketch.getSelectedDocument().getLayerWithID(context.commentsContainerID)
  );
  Settings.setLayerSettingForKey(board, 'context', context);
}
