
/**
 * Represents a Quality Item
 * @param {Object} _id Identifier of the item.
 * @param {Object} label Item label
 * @constructor
 * @property {String} id Identifier of the item.
 * @property {String} label Label
 */
function QualityItem(_id, _label, _description="") {
  this.id = _id;
  this.label = _label;
  this.description = _description;
}

QualityItem.prototype.getId = function() {
  return this.id;
};

QualityItem.prototype.getLabel = function() {
  return this.label;
};

QualityItem.prototype.getDescription = function() {
  return this.description;
};
