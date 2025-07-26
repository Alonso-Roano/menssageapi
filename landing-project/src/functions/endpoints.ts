const endpoints = {
  auth: {
    signup: { method: 'POST', url: '/api/register' },
    login: { method: 'POST', url: '/api/login' },
    refresh: { method: 'POST', url: '/auth/v1/token?grant_type=refresh_token' },
    logout: { method: 'POST', url: '/auth/v1/logout' },
    user: { method: 'GET', url: '/auth/v1/user' },
  },
  mensaje: {
    listar: { method: 'GET', url: '/api/mensajes' },
    obtener: { method: 'GET', url: '/api/mensajes/{id}' },
    crear: { method: 'POST', url: '/api/mensajes' },
    actualizar: { method: 'PUT', url: '/api/mensajes/{id}' },
    eliminar: { method: 'DELETE', url: '/api/mensajes/{id}' },
  }
}

export default endpoints