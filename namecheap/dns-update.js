import { domains } from "/projects/secrets/configs/dns.js";

main();

async function main() {
	// Get IP
	console.log("Grabbing public IP...");
	const ip = await getPublicIp();
	console.log("Got public IP:", ip);

	// Set IP for every record
	for (const domain of domains) {
		console.log("Setting", domain.domain);
		const success = await setDnsRecord(domain.domain, domain.password, ip);
		if (success) {
			console.log("Successfully set.");
		} else {
			console.error("Error while setting.");
		}
	}
}

async function getPublicIp() {
	const ipify = "https://api.ipify.org/";
	const result = await fetch(ipify);
	return await result.text();
}

async function setDnsRecord(domain, password, ip) {
	const namecheapOrigin = "https://dynamicdns.park-your-domain.com";
	const namecheapParams = {
		domain,
		password,
		ip,
		host: "@"
	};
	const namecheapUrl = namecheapOrigin + "/update?" + new URLSearchParams(namecheapParams).toString();
	const result = await fetch(namecheapUrl);
	const text = await result.text();

	if (result.status === 200) {
		if (text.includes("<ErrCount>0</ErrCount>")) {
			return true;
		} else {
			console.error(text);
			return false;
		}
	} else {
		console.error(text);
		return false;
	}
}

