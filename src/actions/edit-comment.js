import { UI, Settings, getSelectedDocument } from 'sketch';
import { renderComments } from '../util.js';

export default function () {
  if (getSelectedDocument().selectedLayers.length > 1) {
    UI.message('Select one layer or group');
    return;
  }
  const selection = getSelectedDocument().selectedLayers.layers[0];
  let context = Settings.layerSettingForKey(selection.getParentArtboard(), 'context');
  let comment = context.commentList.find(comment => comment.subjectID === selection.layers[0].id);
  if (!comment) {
    UI.message('Layer does not have a comment');
    return;
  }
  UI.getInputFromUser(
    'Update comment:',
    {
      initialValue: comment.comment,
      numberOfLines: 3
    },
    (err, value) => (comment.comment = err ? comment.comment : value)
  );
  renderComments(
    context.commentList,
    getSelectedDocument().getLayerWithID(context.commentsContainerID)
  );
  Settings.setLayerSettingForKey(selection.getParentArtboard(), 'context', context);
}
