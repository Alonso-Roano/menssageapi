const endpoints = {
  auth: {
    signup: { method: 'POST', url: '/api/register' },
    login: { method: 'POST', url: '/api/login' },
    refresh: { method: 'POST', url: '/auth/v1/token?grant_type=refresh_token' },
    logout: { method: 'POST', url: '/auth/v1/logout' },
    user: { method: 'GET', url: '/auth/v1/user' },
  },
  mensaje: {
    listar: { method: 'GET', url: '/functions/v1/rapid-responder' },
    obtener: { method: 'GET', url: '/functions/v1/rapid-responder/{id}' },
    crear: { method: 'POST', url: '/functions/v1/rapid-responder' },
    actualizar: { method: 'PUT', url: '/functions/v1/rapid-responder/{id}' },
    eliminar: { method: 'DELETE', url: '/functions/v1/rapid-responder/{id}' },
  }
}

export default endpoints