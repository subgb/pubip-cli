#!/usr/bin/env node

const request = require('request');
const SocksProxyAgent = require('socks-proxy-agent');


let proxy = process.argv[2];
if (/^\d{2,5}$/.test(proxy)) proxy='socks://127.0.0.1:'+proxy;
else if (/...:\d{2,5}$/.test(proxy)) proxy='socks://'+proxy;

const rd = request.defaults({
	timeout: 8e3,
	agent: proxy? new SocksProxyAgent(proxy): undefined,
	headers: {'user-agent': 'curl/7.55.1'},
});

const via = proxy? 'via PROXY '+proxy: 'DIRECT';
console.log(`Your Public IP Address: (${via})\n`);
fetch('http://ipv4.icanhazip.com');
fetch('http://ifconfig.me');
fetch('http://myip.ipip.net');
fetch('http://cip.cc');
fetch('https://ipinfo.io');

function fetch(url, agent) {
	rd(url, (err, resp, body) => {
		let msg;
		if (err) msg = `Error: ${err.message}`;
		else if (resp.statusCode!=200) msg = `Error: response status code ${resp.statusCode}`;
		else msg = body.replace(/\n\n/g, '\n');
		console.log(`${'='.repeat(50)} ${url.replace(/https?:\/\//,'')}\n${msg.trim()}\n`);
	});
}
