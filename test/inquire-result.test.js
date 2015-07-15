var nodeUnit = require('nodeunit');
var sinon = require('sinon');
var script = require('path').resolve('./src/inquire-result.js');
var moat = require('moat');

module.exports = nodeUnit.testCase({
  setUp: function(callback) {
	require.cache[script] = null;
	callback();
  },
  tearDown: function(callback) {
  	callback();
  },
  'Device Information Inquiry Result, successful case.' : function(assert) {
	// record state
    var context = moat.init(sinon);
    var dmjob_arguments = {
    };
    context.setDevice('uid', 'deviceId', 'name', 'status', 'clientVersion', 0);
    context.setDmjob('uid', 'deviceId', 'name', 'status', 'jobServiceId',
			'sessionId', dmjob_arguments, 'createdAt', 'activatedAt', 'startedAt',
			'expiredAt', 'http', 'http://localhost');
	var deviceInfo = {
		serialNumber : 'SN:1234567890',
		eth0MacAddr : '11:10:9f:d4:59:99',
		eth1MacAddr : '11:10:9f:d4:59:00',
		hardwareVersion : '1.0',
		firmwareVersion : '1.1',
		modemModuleType : '3gpp',
		modemModuleRevision : '1',
		modemModuleFwVersion : '1.0',
		iccid : '89 91 10 1200 00 320451 0',
		imsi : '404685505601234',
		msisdn : '1234567890'
    };
	context.setObjects([deviceInfo]);
    var session = context.session;

    // Run the script (replay state)
    require(script);

    // Assertion
    assert.equal(false, session.commit.called);
    assert.equal(false, session.setWaitingForResultNotification.withArgs(true).called);
	assert.equal(true, session.notifyAsync.withArgs(deviceInfo).called);
    assert.done();
  },
});

