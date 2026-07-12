import { useState } from 'react';
import { Lock, User as UserIcon } from 'lucide-react';

export function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (username.toLowerCase() === 'admin' && password === '1234') {
      onLogin('admin', 'admin');
    } else if (username.toLowerCase() === 'user' && password === '1111') {
      onLogin('user', 'user');
    } else {
      setError('Usuario o contraseña incorrectos. Intente nuevamente.');
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
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div 
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ backgroundColor: '#E8F5E9' }}
          >
            <Lock size={32} style={{ color: '#4CAF50' }} />
          </div>
          <h1 className="text-3xl mb-2" style={{ color: '#388E3C' }}>NexKon</h1>
          <p style={{ color: '#666666' }}>Sistema de Gestión Empresarial</p>
        </div>

        {/* Formulario de login */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium" style={{ color: '#333333' }}>
              Usuario
            </label>
            <div className="relative">
              <UserIcon 
                className="absolute left-3 top-1/2 transform -translate-y-1/2" 
                size={20} 
                style={{ color: '#666666' }} 
              />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingrese su usuario"
                className="w-full pl-10 pr-4 py-3 rounded-lg border outline-none transition-colors"
                style={{ 
                  borderColor: '#C8E6C9',
                  backgroundColor: '#FFFFFF',
                  color: '#333333'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#4CAF50';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#C8E6C9';
                }}
                required
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
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#4CAF50';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#C8E6C9';
                }}
                required
              />
            </div>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div 
              className="p-3 rounded-lg border"
              style={{ 
                backgroundColor: '#FFEBEE',
                borderColor: '#EF5350',
                color: '#C62828'
              }}
            >
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Botón de login */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg transition-colors text-center font-medium"
            style={{ 
              backgroundColor: '#4CAF50',
              color: '#FFFFFF'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#388E3C';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#4CAF50';
            }}
          >
            Iniciar Sesión
          </button>
        </form>

        {/* Información de usuarios de prueba 
        <div className="mt-6 pt-4 border-t text-center text-xs text-gray-400" style={{ borderColor: '#E8F5E9' }}>
          <p>Admin: <span className="font-mono text-gray-500 bg-gray-50 px-1 rounded">admin / 1234</span></p>
          <p className="mt-1">User: <span className="font-mono text-gray-500 bg-gray-50 px-1 rounded">user / 1111</span></p>
        </div>*/}
        
      </div>
    </div>
  );
}