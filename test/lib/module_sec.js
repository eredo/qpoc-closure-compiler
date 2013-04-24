/**
 * Created with JetBrains WebStorm.
 * User: Eric
 * Date: 24.04.13
 * Time: 11:02
 * To change this template use File | Settings | File Templates.
 */
goog.provide('test.Mod');

goog.require('goog.ui.Component');
goog.require('goog.ui.Button');

/**
 * @constructor
 */
test.Mod = function() {
  goog.base(this);

  var button = this.button_ = new goog.ui.Button('Test');
};
goog.inherits(test.Mod, goog.ui.Component);

test.Mod.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.addChild(this.button_, true);
}
