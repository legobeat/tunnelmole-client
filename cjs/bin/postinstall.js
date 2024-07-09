#!/usr/bin/env node

const installTelemetry = async () => {
  const telemetryEndpoint = `https://service.tunnelmole.com/tunnelmole-log-telemetry`;

  if (process.env.TUNNELMOLE_TELEMETRY === "0") {
    return;
  }

  // Send platform version information
  try {
    await fetch({
      method: 'POST',
      url: telemetryEndpoint,
      body: JSON.stringify({
        type: "post-install",
        data: {
            nodeVersion: process.version ? process.version : "Unknown",
            platform: process.platform ? process.platform : "Unknown"
        },
      })
    });
  } catch(_err) {
    // ignore telemetry request errors
  }
};

installTelemetry();

console.log(`
━━━━╮╱╱╱╱╱╱╱╱╱╱╭╮╱╱╱╱╱╱╭╮
┃╭╮╭╮┃╱╱╱╱╱╱╱╱╱╱┃┃╱╱╱╱╱╱┃┃
╰╯┃┃┣┫╭┳━╮╭━╮╭━━┫┃╭╮╭┳━━┫┃╭━━╮
╱╱┃┃┃┃┃┃╭╮┫╭╮┫┃━┫┃┃╰╯┃╭╮┃┃┃┃━┫
╱╱┃┃┃╰╯┃┃┃┃┃┃┃┃━┫╰┫┃┃┃╰╯┃╰┫┃━┫
╱╱╰╯╰━━┻╯╰┻╯╰┻━━┻━┻┻┻┻━━┻━┻━━╯
Congrats! Tunnelmole is now installed 😃
Now what?
- Get a random public URL for a local server: "tmole <port>" e.g. "tmole 80" if your server is running on port 80
- Get a customized public URL for a local server: "tmole 80 as mysite.tunnelmole.net"
- Read the docs for more detailed instructions https://tunnelmole.com/docs
`);
