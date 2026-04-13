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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [nombre, setNombre] = useState('')
  const [rut, setRut] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

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

  useEffect(() => {
    fetchEmpresas()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const body = { nombre, rut }

    try {
      if (editingId) {
        await fetch(`${API_URL}/api/empresas/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      } else {
        await fetch(`${API_URL}/api/empresas`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      }
      setNombre('')
      setRut('')
      setEditingId(null)
      fetchEmpresas()
    } catch (e) {
      setError('Error al guardar empresa')
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Inactivar empresa?')) return
    setLoading(true)
    try {
      await fetch(`${API_URL}/api/empresas/${id}`, { method: 'DELETE' })
      fetchEmpresas()
    } catch (e) {
      setError('Error al eliminar empresa')
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

      {empresas.length === 0 && !loading && (
        <p>No hay empresas registradas</p>
      )}
    </div>
  )
}

export default App