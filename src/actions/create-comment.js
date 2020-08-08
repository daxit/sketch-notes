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

  var valid = true;
  UI.getInputFromUser(
    'Enter comment:',
    {
      initialValue: 'Type a comment...',
      numberOfLines: 3
    },
    (err, value) => {
      if (err) valid = false; //most likely canceled, set to not valid
      context.commentList.push(new Comment(value, selectedObject.id));
    }
  );
  if (!valid) {
    return;
  }

  // Encapsulate selected object in a group and create a marker for it
  var note = new Group({
    name: selectedObject.name + '_note',
    parent: selectedObject.parent,
    index: selectedObject.index,
    frame: new Rectangle(
      selectedObject.frame.x - 10,
      selectedObject.frame.y - 10,
      selectedObject.frame.width + 10,
      selectedObject.frame.height + 10
    )
  });
  // Reparent selected object and reframe it relative to its new parent
  selectedObject.parent = note;
  selectedObject.frame = new Rectangle(
    10,
    10,
    selectedObject.frame.width,
    selectedObject.frame.height
  );
  context.commentList[context.commentList.length - 1].markerID = createMarker(
    context.commentList.length,
    note
  );

  renderComments(
    context.commentList,
    sketch.getSelectedDocument().getLayerWithID(context.commentsContainerID)
  );
  Settings.setLayerSettingForKey(selectedObject.getParentArtboard(), 'context', context);
}
