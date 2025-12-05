import React, { useEffect, useState } from 'react'

type Log = { timestamp: string; temperature_c: number; humidity: number }

export default function Dashboard() {
  const [logs, setLogs] = useState<Log[]>([])
  useEffect(() => {
    fetch('/api/weather/logs?limit=20', { headers: { Authorization: 'Bearer demo-token' }})
      .then(r => r.json()).then(setLogs).catch(console.error)
  }, [])

  return (
    <div className="p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div>
          <button onClick={()=>window.open('/api/weather/export.csv')} className="px-4 py-2 bg-green-600 text-white rounded">Export CSV</button>
        </div>
      </header>

      <div className="bg-white p-4 rounded shadow">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="text-left p-2">Timestamp</th>
              <th className="text-left p-2">Temp (°C)</th>
              <th className="text-left p-2">Humidity (%)</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{new Date(l.timestamp).toLocaleString()}</td>
                <td className="p-2">{l.temperature_c}</td>
                <td className="p-2">{l.humidity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
