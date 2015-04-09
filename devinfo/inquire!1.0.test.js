var nodeUnit = require('nodeunit');
var sinon = require('sinon');
var script = require('path').resolve('./inquire!1.0.js');
var moat = require('moat');

module.exports = nodeUnit.testCase({
  setUp: function(callback) {
	require.cache[script] = null;
	callback();
  },
  tearDown: function(callback) {
  	callback();
  },

  'Device Information Inquiry, successful case (ASYNC)' : function(assert) {
	// record state
    var context = moat.init(sinon);
    var arguments = {
    };
    context.setDevice('uid', 'deviceId', 'name', 'status', 'clientVersion', 0);
    context.setDmjob('uid', 'deviceId', 'name', 'status', 'jobServiceId',
			'sessionId', arguments, 'createdAt', 'activatedAt', 'startedAt',
			'expiredAt', 'http', 'http://localhost');

    var session = context.session;
    var monitoringPolicyMapper = session.newModelMapperStub('DeviceInfo');
	var monitoringPolicy = monitoringPolicyMapper.newModelStub();
	context.addCommand(monitoringPolicy, 'collect',
		context.newSuccessfulCommandEvent(true, null)
	);

    // Run the script (replay state)
    require(script);

    // Assertion
    assert.equal(true, session.commit.called);
    assert.equal(true, session.setWaitingForResultNotification.withArgs(true).called);
	assert.equal(false, monitoringPolicyMapper.update.withArgs(monitoringPolicy).called);
    assert.done();
  },

  'Device Information Inquiry, error case.' : function(assert) {
	// record state
    var context = moat.init(sinon);
    var arguments = {
    };
    context.setDevice('uid', 'deviceId', 'name', 'status', 'clientVersion', 0);
    context.setDmjob('uid', 'deviceId', 'name', 'status', 'jobServiceId',
			'sessionId', arguments, 'createdAt', 'activatedAt', 'startedAt',
			'expiredAt', 'http', 'http://localhost');

    var session = context.session;
    var monitoringPolicyMapper = session.newModelMapperStub('DeviceInfo');
	var monitoringPolicy = monitoringPolicyMapper.newModelStub();
	context.addCommand(monitoringPolicy, 'collect',
		context.newErrorCommandEvent('fatal_error', '12345'));

    // Run the script (replay state)
    require(script);

    // Assertion
    assert.equal(true, session.commit.called);
    assert.equal(false, session.setWaitingForResultNotification.withArgs(true).called);
	assert.equal(false, monitoringPolicyMapper.update.withArgs(monitoringPolicy).called);
	assert.equal(true, session.notifyAsync.withArgs({ success: false, type: 'fatal_error', code: '12345' }).called);
    assert.done();
  }

});
