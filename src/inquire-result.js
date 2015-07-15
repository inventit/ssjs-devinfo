/*
 * JobServiceID:
 * urn:moat:${APPID}:devinfo:inquiry-result:1.0
 * 
 * Description: Device Information Inquiry Function.
 * Reference: https://docs.google.com/a/yourinventit.com/document/d/1kdHxMp2VcZWcDnJ4YZqmW_aEYQt94ySrlityZQK2g6w/edit#heading=h.ql5gc3idrq72
 */
var moat = require('moat');
var context = moat.init();
var session = context.session;
var clientRequest = context.clientRequest;

session.log('inquire-device-info-result', 'Start Device Information Inquiry Result!');

// Result should be returned
var objects = clientRequest.objects;
if (objects.length === 0) {
  session.log('Device sends wrong information.');
  throw "No Result object!";
}
var result = objects[0];
session.log('inquire-device-info-result', 'Arrived:' + JSON.stringify(result));
if (!result.deviceInfo) {
  session.log('Device sends wrong information.');
  throw "No Result object!";
}

var devinfo = result.deviceInfo;
session.log('inquire-device-info-result', 'notifyAsync(devinfo):' + JSON.stringify(devinfo));
session.notifyAsync(devinfo);
