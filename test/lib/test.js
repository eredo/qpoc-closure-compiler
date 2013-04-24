goog.provide('test.Blub')

goog.require('test.Mark');
goog.require('goog.ui.Component');

/**
 * @extends {goog.ui.Component}
 * @constructor
 */
test.Blub = function() {
  goog.base(this);

  this.mark = new test.Mark();
  this.mark.blub_ = 'Muha';
};
goog.inherits(test.Blub, goog.ui.Component);

test.Blub.prototype.blub_ = [];

goog.exportSymbol('blub', test.Blub);
