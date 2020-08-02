module.exports = {
  // http server ip, port, and peer timeout constant
  //
  //httpIp: '192.168.1.145',
  // httpIp: '66.97.47.117',
  //httpIp: '127.0.0.1',
  // httpIp: '142.93.6.195',
  httpIp: '192.168.0.22',
  httpPort: 443,
  httpPeerStale: 15000,

  // ssl certs. we'll start as http instead of https if we don't have
  // these
  sslCrt: 'certs/pferder.ddns.net/fullchain1.pem',
  sslKey: 'certs/pferder.ddns.net/privkey1.pem',
  // sslCrt: 'certs/server.crt',
  // sslKey: 'certs/server.key',

  mediasoup: {
    worker: {
      rtcMinPort: 40000,
      rtcMaxPort: 49999,
      logLevel: 'debug',
      logTags: [
        'info',
        'ice',
        'dtls',
        'rtp',
        'srtp',
        'rtcp',
        // 'rtx',
        // 'bwe',
        // 'score',
        // 'simulcast',
        // 'svc'
      ],
    },
    router: {
      mediaCodecs:
        [
          {
            kind: 'audio',
            mimeType: 'audio/opus',
            clockRate: 48000,
            channels: 2
          },
          {
            kind: 'video',
            mimeType: 'video/VP8',
            clockRate: 90000,
            parameters:
              {
//                'x-google-start-bitrate': 1000
              }
          },
          {
					  kind       : 'video',
					  mimeType   : 'video/h264',
					  clockRate  : 90000,
					  parameters :
					  {
						  'packetization-mode'      : 1,
						  'profile-level-id'        : '4d0032',
						  'level-asymmetry-allowed' : 1,
//						  'x-google-start-bitrate'  : 1000
					  }
				  },
				  {
					  kind       : 'video',
					  mimeType   : 'video/h264',
					  clockRate  : 90000,
					  parameters :
					  {
						  'packetization-mode'      : 1,
						  'profile-level-id'        : '42e01f',
						  'level-asymmetry-allowed' : 1,
//						  'x-google-start-bitrate'  : 1000
					  }
				  }
        ]
    },

    // rtp listenIps are the most important thing, below. you'll need
    // to set these appropriately for your network for the demo to
    // run anywhere but on localhost
    webRtcTransport: {
      listenIps: [
       { ip: '127.0.0.1:8080', announcedIp: null },
       //{ ip: '192.168.1.145', announcedIp: null },
       // { ip: '66.97.47.117', announcedIp: null },
       { ip: '192.168.0.22', announcedIp: null },
      //  { ip: '142.93.6.195', announcedIp: null },
      ],
      initialAvailableOutgoingBitrate: 800000,
    }
  }
};
