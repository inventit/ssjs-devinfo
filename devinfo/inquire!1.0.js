/*
 * JobServiceID:
 * urn:moat:${APPID}:devinfo:inquiry:1.0
 * 
 * Description: Device Information Inquiry Function.
 * Reference: https://docs.google.com/a/yourinventit.com/document/d/1kdHxMp2VcZWcDnJ4YZqmW_aEYQt94ySrlityZQK2g6w/edit#heading=h.ql5gc3idrq72
 */
var moat = require('moat');
var context = moat.init();
var session = context.session;
var clientRequest = context.clientRequest;

session.log('inquire-devinfo', 'Start Device Information Inquiry!');

// Get dmjob arguments.
var args = clientRequest.dmjob.arguments;
session.log('inquire-devinfo', 'args => ' + JSON.stringify(args));

var deviceInfoMapper = session.newModelMapperStub('DeviceInfo');
var deviceInfo = deviceInfoMapper.newModelStub();

deviceInfo.collect(session, null, {
	success: function(result) {
		session.log('inquire-devinfo', 'waiting for result...');
		session.setWaitingForResultNotification(true);
	},
	error: function(type, code) {
		session.log('inquire-devinfo', 'error: type:' + type + ', code:' + code);
		session.notifyAsync({
			success: false,
			type: type,
			code: code
		});
	}
}); // including commit()