#!/usr/bin/env node

const request = require('request');
const ProxyAgent = require('proxy-agent');


let proxy = process.argv[2];
if (/.+:\/\/.+/.test(proxy)) proxy=proxy.replace(/\/\/:/, '//127.0.0.1:');
else if (/^:?(\d{2,5})$/.test(proxy)) proxy='socks5h://127.0.0.1:'+RegExp.$1;
else if (/...:\d{2,5}$/.test(proxy)) proxy='socks5h://'+proxy;
else proxy = null;

const opts = {
	timeout: 5e3,
	agent: proxy? new ProxyAgent(proxy): undefined,
	headers: {'user-agent': 'curl/7.55.1'},
};
if (/^http:/.test(proxy)) opts.rejectUnauthorized = false;
const rd = request.defaults(opts);

const via = proxy? 'via PROXY '+proxy: 'DIRECT';
console.log(`Your Public IP Address: (${via})\n`);
fetch('https://checkip.amazonaws.com');
fetch('https://httpbin.org/ip');
fetch('http://myip.ipip.net');
fetch('http://4.icanhazip.com');
fetch('http://6.icanhazip.com');
fetch('http://cip.cc');
fetch('http://ifconfig.me');
fetch('http://ipinfo.io');

function fetch(url, agent) {
	rd(url, (err, resp, body) => {
		let msg;
		if (err) msg = `Error: ${err.message}`;
		else if (resp.statusCode!=200) msg = `Error: response status code ${resp.statusCode}`;
		else msg = body.replace(/\n\n/g, '\n');
		console.log(`${'='.repeat(50)} ${url.replace(/https?:\/\//,'')}\n${msg.trim()}\n`);
	});
}
