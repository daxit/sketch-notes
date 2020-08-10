import sketch from 'sketch';
import { notDeepStrictEqual } from 'assert';

// Global Objects
var Rectangle = require('sketch/dom').Rectangle;
var ShapePath = require('sketch/dom').ShapePath;
var Group = require('sketch/dom').Group;
var Text = require('sketch/dom').Text;
var Settings = require('sketch/settings');

// Constants
const COMMENT_WIDTH = 220;
const PANEL_WIDTH = 300;
const fillOptions = ['#da1e28', '#d12765', '#8a3ffc', '#0062ff', '#0072c3', '#007d79', '#198038'];

export function renderComments(commentList, container) {
  // reset the size of the container if necessary
  if (container.frame.width > PANEL_WIDTH) {
    toggleContainerSize(container);
  }
  _renderComments(commentList, container, -1);
}

function _renderComments(commentList, container, overflowIdx) {
  // remove all comments in the container from bottom to top
  for (let i = container.layers.length - 1; i >= 0; i--) {
    container.layers[i].remove();
  }
  for (let comIdx = 0; comIdx < commentList.length; comIdx++) {
    var lastCom = container.layers[container.layers.length - 1];
    var comment = new Group({
      name: 'comment_' + (comIdx + 1),
      parent: container,
      frame: new Rectangle(
        lastCom === undefined ? 0 : lastCom.frame.x,
        lastCom === undefined ? 0 : lastCom.frame.y + lastCom.frame.height + 20,
        container.frame.width,
        0
      )
    });
    if (comIdx === overflowIdx) {
      comment.frame = new Rectangle(
        comment.frame.x + PANEL_WIDTH,
        0,
        comment.frame.width,
        comment.frame.height
      );
    }
    createMarker(comIdx + 1, comment);
    commentList[comIdx].commentID = comment.id;
    new Text({
      text: commentList[comIdx].comment,
      parent: comment,
      frame: new Rectangle(40, 0, COMMENT_WIDTH, 0),
      fixedWidth: true,
      style: {
        alignment: Text.Alignment.left,
        textColor: '#f3f3f3ff',
        fontSize: 10,
        borders: []
      }
    });
    // update marker number for comment
    let marker = sketch.getSelectedDocument().getLayerWithID(commentList[comIdx].markerID);
    marker.layers[1].text = '' + (comIdx + 1);
    marker.layers[0].style.fills = [fillOptions[(comIdx + 1) % fillOptions.length]];

    // Check if the container overflows off the artboard
    if (container.frame.y + container.frame.height >= container.getParentArtboard().frame.height) {
      // If it does, extend the container to two columns
      toggleContainerSize(container);
      // specify the index of the comment which overflows
      overflowIdx = comIdx;
      // and rerender
      _renderComments(commentList, container, overflowIdx);
      return; //quit the loop so we dont render comments after this twice
    }
  }
}

/**
 * Creates a circle marker with the given value inside the given parent
 *
 * @param {*} value the text placed in the marker
 * @param {*} parent where to put the marker
 * @returns the id of the newly created marker
 */
export function createMarker(value, parent) {
  var marker = new Group({
    name: 'marker_' + value,
    parent: parent
  });
  new ShapePath({
    name: 'marker_shape',
    parent: marker,
    frame: new Rectangle(0, 0, 15, 15),
    shapeType: ShapePath.ShapeType.Oval,
    style: {
      fills: [fillOptions[value % fillOptions.length]],
      borders: []
    }
  });
  new Text({
    text: '' + value,
    parent: marker,
    frame: new Rectangle(0, 0, 15, 15),
    style: {
      alignment: Text.Alignment.center,
      lineHeight: 14,
      verticalAlignment: Text.VerticalAlignment.center,
      textColor: '#f4f4f4',
      fontSize: 8,
      fontWeight: 10,
      borders: []
    }
  });
  return marker.id;
}

// Extends or shrinks the comments container
function toggleContainerSize(container) {
  let background = sketch
    .getSelectedDocument()
    .getLayerWithID(Settings.layerSettingForKey(container, 'backgroundID'));
  let board = container.getParentArtboard();
  let changeAmount = background.frame.width > PANEL_WIDTH ? -1 * PANEL_WIDTH : PANEL_WIDTH;
  board.frame = new Rectangle(
    board.frame.x,
    board.frame.y,
    board.frame.width + changeAmount,
    board.frame.height
  );
  background.frame = new Rectangle(
    background.frame.x,
    background.frame.y,
    background.frame.width + changeAmount,
    background.frame.height
  );
  container.frame = new Rectangle(
    container.frame.x,
    container.frame.y,
    container.frame.width + changeAmount,
    container.frame.height
  );
}
