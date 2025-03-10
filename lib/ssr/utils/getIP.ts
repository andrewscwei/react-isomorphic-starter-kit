import os from 'node:os'

export function getIP() {
  const interfaces = os.networkInterfaces()

  for (const iface of Object.values(interfaces)) {
    if (!iface) continue

    for (const config of iface) {
      if (config.family === 'IPv4' && !config.internal) {
        return config.address
      }
    }
  }

  return '127.0.0.1'
}
