import { useState, useEffect } from 'react'

interface Empresa {
  id: string
  nombre: string
  rut: string
  activo: boolean
  createdAt: string
  updatedAt: string
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

function App() {
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [inactivas, setInactivas] = useState<Empresa[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [nombre, setNombre] = useState('')
  const [rut, setRut] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showInactive, setShowInactive] = useState(false)

  const fetchEmpresas = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/api/empresas`)
      const data = await res.json()
      setEmpresas(data)
    } catch (e) {
      setError('Error al conectar con el servidor')
    }
    setLoading(false)
  }

  const fetchInactivas = async () => {
    try {
      const res = await fetch(`${API_URL}/api/empresas/inactivas`)
      const data = await res.json()
      setInactivas(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchEmpresas()
    fetchInactivas()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const body = { nombre, rut }

    try {
      const res = await fetch(`${API_URL}/api/empresas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.status === 409) {
        setError('El RUT ya existe')
        setLoading(false)
        return
      }
      setNombre('')
      setRut('')
      setEditingId(null)
      fetchEmpresas()
      fetchInactivas()
    } catch (e) {
      setError('Error al conectar con el servidor')
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Inactivar empresa?')) return
    setLoading(true)
    try {
      await fetch(`${API_URL}/api/empresas/${id}`, { method: 'DELETE' })
      fetchEmpresas()
      fetchInactivas()
    } catch (e) {
      setError('Error al eliminar empresa')
    }
    setLoading(false)
  }

  const handleActivate = async (id: string) => {
    setLoading(true)
    try {
      await fetch(`${API_URL}/api/empresas/${id}/activar`, { method: 'PATCH' })
      fetchEmpresas()
      fetchInactivas()
    } catch (e) {
      setError('Error al activar empresa')
    }
    setLoading(false)
  }

  const handleEdit = (empresa: Empresa) => {
    setNombre(empresa.nombre)
    setRut(empresa.rut)
    setEditingId(empresa.id)
  }

  return (
    <div className="container">
      <h1>GPS - Empresas</h1>
      
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="RUT"
          value={rut}
          onChange={(e) => setRut(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {editingId ? 'Actualizar' : 'Crear'}
        </button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setNombre(''); setRut(''); }}>
            Cancelar
          </button>
        )}
      </form>

      {error && <p className="error">{error}</p>}

      {loading && <p>Cargando...</p>}

      <div className="tabs">
        <button 
          className={!showInactive ? 'active' : ''} 
          onClick={() => setShowInactive(false)}
        >
          Activas ({empresas.length})
        </button>
        <button 
          className={showInactive ? 'active' : ''} 
          onClick={() => setShowInactive(true)}
        >
          Inactivas ({inactivas.length})
        </button>
      </div>

      {!showInactive ? (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>RUT</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empresas.map((empresa) => (
              <tr key={empresa.id}>
                <td>{empresa.nombre}</td>
                <td>{empresa.rut}</td>
                <td>
                  <button onClick={() => handleEdit(empresa)}>Editar</button>
                  <button onClick={() => handleDelete(empresa.id)} className="delete">
                    Inactivar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>RUT</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {inactivas.map((empresa) => (
              <tr key={empresa.id} className="inactive">
                <td>{empresa.nombre}</td>
                <td>{empresa.rut}</td>
                <td>
                  <button onClick={() => handleActivate(empresa.id)} className="activate">
                    Activar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {empresas.length === 0 && !loading && !showInactive && (
        <p>No hay empresas activas</p>
      )}
      {inactivas.length === 0 && !loading && showInactive && (
        <p>No hay empresas inactivas</p>
      )}
    </div>
  )
}

export default App