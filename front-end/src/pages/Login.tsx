import React, { useState } from 'react'

export default function Login() {
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('123456')

  const handle = async (e: any) => {
    e.preventDefault()
    // naive: for now store demo token (backend auth not fully persisted)
    localStorage.setItem('token', 'demo-token')
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handle} className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-xl mb-4">Login</h2>
        <label className="block mb-2">Email
          <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-2 border rounded" />
        </label>
        <label className="block mb-4">Senha
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-2 border rounded" />
        </label>
        <button className="w-full bg-blue-600 text-white py-2 rounded">Entrar</button>
      </form>
    </div>
  )
}
