import { UI, Settings, getSelectedDocument } from 'sketch';
import { renderComments } from '../util.js';

export default function () {
  const document = getSelectedDocument();
  if (document.selectedLayers.length > 1) {
    UI.message('Select one layer or group');
    return;
  }
  const selection = document.selectedLayers.layers[0];
  const context = Settings.layerSettingForKey(selection.getParentArtboard(), 'context');
  const comment = context.commentList.find(comment => comment.subjectID === selection.layers[0].id);
  if (!comment) {
    UI.message('Layer does not have a comment');
    return;
  }
  UI.getInputFromUser(
    'Update comment:',
    { initialValue: comment.comment, numberOfLines: 3 },
    (err, value) => (comment.comment = err ? comment.comment : value)
  );
  renderComments(context.commentList, document.getLayerWithID(context.commentsContainerID));
  Settings.setLayerSettingForKey(selection.getParentArtboard(), 'context', context);
}
