import sketch from 'sketch';
import { Comment } from '../model/Comment.js';
import { renderComments, createMarker } from '../util.js';

// Object definitions
var Rectangle = require('sketch/dom').Rectangle;
var Group = require('sketch/dom').Group;
var UI = require('sketch/ui');
var Settings = require('sketch/settings');

export default function () {
  const selectedObject = sketch.getSelectedDocument().selectedLayers.layers[0];
  var context = Settings.layerSettingForKey(selectedObject.getParentArtboard(), 'context');

  var comment = context.commentList.find(comment => {
    return comment.subjectID === selectedObject.layers[0].id;
  });

  var valid = true;
  UI.getInputFromUser(
    'Update comment:',
    {
      initialValue: comment.comment,
      numberOfLines: 3
    },
    (err, value) => {
      if (err) valid = false; //most likely canceled, set to not valid
      comment.comment = value;
    }
  );
  if (!valid) {
    return;
  }

  renderComments(
    context.commentList,
    sketch.getSelectedDocument().getLayerWithID(context.commentsContainerID)
  );
  Settings.setLayerSettingForKey(selectedObject.getParentArtboard(), 'context', context);
}
