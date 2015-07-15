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
    var expected = {
      "hardware": {
        "platform": {
          "vendor": "NO DATA",
          "product": "NO DATA",
          "model": "NO DATA",
          "serial": "08:00:27:a9:d6:84",
          "fwVersion": "NO DATA",
          "deviceId": "EMU:shasegawa:0715",
          "category": "Gateway"
        },
        "network": {
          "interface": [
            {
              "name": "lo",
              "hwAddress": "00:00:00:00:00:00",
              "ipv4Address": "127.0.0.1",
              "netmask": "255.0.0.0",
              "ipv6Address": "::1"
            },
            {
              "name": "eth0",
              "hwAddress": "08:00:27:a9:d6:84",
              "ipv4Address": "10.0.2.15",
              "netmask": "255.255.255.0",
              "ipv6Address": "fe80::a00:27ff:fea9:d684%eth0"
            }
          ],
          "nameserver": [
            "172.31.6.194",
            "172.31.17.24"
          ]
        }
      },
      "software": {
        "os": {
          "type": "Linux",
          "version": "3.2.0-4-amd64"
        },
        "sscl": {
          "type": "SSEGW",
          "version": "1.0.8",
          "sdkVersion": "1.0.5"
        }
      }
    };
    // Workaround GW doesn't encode with base64
    // var deviceInfo = {"deviceInfo":"eyJoYXJkd2FyZSI6eyJwbGF0Zm9ybSI6eyJ2ZW5kb3IiOiJOTyBEQVRBIiwicHJvZHVjdCI6Ik5PIERBVEEiLCJtb2RlbCI6Ik5PIERBVEEiLCJzZXJpYWwiOiIwODowMDoyNzphOTpkNjo4NCIsImZ3VmVyc2lvbiI6Ik5PIERBVEEiLCJkZXZpY2VJZCI6IkVNVTpzaGFzZWdhd2E6MDcxNSIsImNhdGVnb3J5IjoiR2F0ZXdheSJ9LCJuZXR3b3JrIjp7ImludGVyZmFjZSI6W3sibmFtZSI6ImxvIiwiaHdBZGRyZXNzIjoiMDA6MDA6MDA6MDA6MDA6MDAiLCJpcHY0QWRkcmVzcyI6IjEyNy4wLjAuMSIsIm5ldG1hc2siOiIyNTUuMC4wLjAiLCJpcHY2QWRkcmVzcyI6Ijo6MSJ9LHsibmFtZSI6ImV0aDAiLCJod0FkZHJlc3MiOiIwODowMDoyNzphOTpkNjo4NCIsImlwdjRBZGRyZXNzIjoiMTAuMC4yLjE1IiwibmV0bWFzayI6IjI1NS4yNTUuMjU1LjAiLCJpcHY2QWRkcmVzcyI6ImZlODA6OmEwMDoyN2ZmOmZlYTk6ZDY4NCVldGgwIn1dLCJuYW1lc2VydmVyIjpbIjE3Mi4zMS42LjE5NCIsIjE3Mi4zMS4xNy4yNCJdfX0sInNvZnR3YXJlIjp7Im9zIjp7InR5cGUiOiJMaW51eCIsInZlcnNpb24iOiIzLjIuMC00LWFtZDY0In0sInNzY2wiOnsidHlwZSI6IlNTRUdXIiwidmVyc2lvbiI6IjEuMC44Iiwic2RrVmVyc2lvbiI6IjEuMC41In19fQ=="
    var deviceInfo = {};
    deviceInfo.deviceInfo = expected;
    context.setObjects([deviceInfo]);
    var session = context.session;

    // Run the script (replay state)
    require(script);

    // Assertion
    assert.equal(false, session.commit.called);
    assert.equal(false, session.setWaitingForResultNotification.withArgs(true).called);
    assert.equal(true, session.notifyAsync.withArgs(expected).called);
    assert.done();
  },
});

