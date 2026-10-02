import { API_BASE_URL } from '../config/confURL.js';
import { useState } from 'react';
import { Lock, User as UserIcon } from 'lucide-react';


const API_LOGIN_URL = `${ API_BASE_URL }/usuarios/login`; 


export function LoginScreen({ onLogin }) {
  const [identificador, setIdentificador] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(API_LOGIN_URL, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        // Enviamos 'identificador' 
        body: JSON.stringify({
          identificador: identificador,
          password: password,
        }),
      });

      if (response.ok) {
        const usuario = await response.json();
        console.log("Objeto usuario recibido:", usuario);
        onLogin(usuario.rol, usuario);
      } else {
        const mensajeServidor = await response.text();
        setError(mensajeServidor || 'Error al autenticar.');
      }
    } catch (err) {
      console.error('Error al intentar conectar:', err);
      setError('No se pudo conectar con el servidor backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#F0F8F4' }}
    >
      <div 
        className="w-full max-w-md rounded-xl p-8 border shadow-lg"
        style={{ 
          backgroundColor: '#FFFFFF',
          borderColor: '#C8E6C9'
        }}
      >
        <div className="text-center mb-8">
          <div 
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ backgroundColor: '#E8F5E9' }}
          >
            <Lock size={32} style={{ color: '#4CAF50' }} />
          </div>
          <h1 className="text-3xl mb-2 font-bold" style={{ color: '#388E3C' }}>NexKon</h1>
          <p style={{ color: '#666666' }}>Sistema de Gestión Empresarial</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium" style={{ color: '#333333' }}>
              Email o DNI
            </label>
            <div className="relative">
              <UserIcon 
                className="absolute left-3 top-1/2 transform -translate-y-1/2" 
                size={20} 
                style={{ color: '#666666' }} 
              />
              <input
                type="text"
                value={identificador}
                onChange={(e) => setIdentificador(e.target.value)}
                placeholder="Ingrese su Email o DNI"
                className="w-full pl-10 pr-4 py-3 rounded-lg border outline-none transition-colors"
                style={{ 
                  borderColor: '#C8E6C9',
                  backgroundColor: '#FFFFFF',
                  color: '#333333'
                }}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium" style={{ color: '#333333' }}>
              Contraseña
            </label>
            <div className="relative">
              <Lock 
                className="absolute left-3 top-1/2 transform -translate-y-1/2" 
                size={20} 
                style={{ color: '#666666' }} 
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingrese su contraseña"
                className="w-full pl-10 pr-4 py-3 rounded-lg border outline-none transition-colors"
                style={{ 
                  borderColor: '#C8E6C9',
                  backgroundColor: '#FFFFFF',
                  color: '#333333'
                }}
                required
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div 
              className="p-3 rounded-lg border text-sm"
              style={{ 
                backgroundColor: '#FFEBEE',
                borderColor: '#EF5350',
                color: '#C62828'
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg transition-colors text-center font-medium ${
              loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
            }`}
            style={{ 
              backgroundColor: '#4CAF50',
              color: '#FFFFFF'
            }}
          >
            {loading ? 'Verificando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}