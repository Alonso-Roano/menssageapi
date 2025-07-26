import { useEffect, useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { apiRequest } from '../functions/auth';

interface RegistroDetalle {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
  edad: number;
  asunto: string;
  descripcion: string;
}

interface FormErrors {
  nombre?: string;
  correo?: string;
  telefono?: string;
  edad?: string;
  asunto?: string;
  descripcion?: string;
}

const validateForm = (data: Partial<RegistroDetalle>): { isValid: boolean; errors: FormErrors } => {
  const errors: FormErrors = {};
  
  if (!data.nombre?.trim()) errors.nombre = 'El nombre es requerido';
  
  if (!data.correo?.trim()) {
    errors.correo = 'El correo es requerido';
  } else if (!/\S+@\S+\.\S+/.test(data.correo)) {
    errors.correo = 'Correo electrónico inválido';
  }
  
  if (!data.telefono?.trim()) errors.telefono = 'El teléfono es requerido';
  
  if (!data.edad) {
    errors.edad = 'La edad es requerida';
  } else if (isNaN(Number(data.edad))) {
    errors.edad = 'La edad debe ser un número';
  } else if (Number(data.edad) <= 0) {
    errors.edad = 'La edad debe ser positiva';
  } else if (!Number.isInteger(Number(data.edad))) {
    errors.edad = 'La edad debe ser un número entero';
  }
  
  if (!data.asunto?.trim()) errors.asunto = 'El asunto es requerido';
  if (!data.descripcion?.trim()) errors.descripcion = 'La descripción es requerida';
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

const ModalDetalle = ({ registro, onClose }: { registro: RegistroDetalle | null, onClose: () => void }) => {
  if (!registro) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl border border-gray-700">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h3 className="text-xl font-semibold text-white">Detalles del Registro</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">ID</p>
              <p className="text-white">{registro.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Nombre</p>
              <p className="text-white">{registro.nombre}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Correo</p>
              <a href={`mailto:${registro.correo}`} className="text-blue-400 hover:underline">
                {registro.correo}
              </a>
            </div>
            <div>
              <p className="text-sm text-gray-400">Teléfono</p>
              <a href={`tel:${registro.telefono}`} className="text-white">
                {registro.telefono}
              </a>
            </div>
            <div>
              <p className="text-sm text-gray-400">Edad</p>
              <p className="text-white">{registro.edad} años</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Asunto</p>
              <p className="text-white font-medium">{registro.asunto}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-400">Descripción</p>
            <p className="text-white mt-1 bg-gray-700 p-3 rounded-lg">
              {registro.descripcion}
            </p>
          </div>
        </div>
        <div className="px-6 py-3 bg-gray-800/50 border-t border-gray-700 rounded-b-xl flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

const ModalEditar = ({ registro, onClose, onSave }: { registro: RegistroDetalle | null, onClose: () => void, onSave: (data: RegistroDetalle) => Promise<void> }) => {
  const [formData, setFormData] = useState<Partial<RegistroDetalle>>(registro || {});
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (registro) {
      setFormData(registro);
      setErrors({});
    }
  }, [registro]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'edad' ? parseInt(value) || '' : value
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateForm(formData);
    
    if (isValid && formData.id) {
      onSave(formData as RegistroDetalle);
    } else {
      setErrors(validationErrors);
    }
  };

  if (!registro) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl border border-gray-700">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h3 className="text-xl font-semibold text-white">Editar Registro</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-700 border ${errors.nombre ? 'border-red-500' : 'border-gray-600'} rounded-md text-white`}
              />
              {errors.nombre && <p className="mt-1 text-sm text-red-400">{errors.nombre}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Correo</label>
              <input
                type="email"
                name="correo"
                value={formData.correo || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-700 border ${errors.correo ? 'border-red-500' : 'border-gray-600'} rounded-md text-white`}
              />
              {errors.correo && <p className="mt-1 text-sm text-red-400">{errors.correo}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-700 border ${errors.telefono ? 'border-red-500' : 'border-gray-600'} rounded-md text-white`}
              />
              {errors.telefono && <p className="mt-1 text-sm text-red-400">{errors.telefono}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Edad</label>
              <input
                type="number"
                name="edad"
                value={formData.edad || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-700 border ${errors.edad ? 'border-red-500' : 'border-gray-600'} rounded-md text-white`}
              />
              {errors.edad && <p className="mt-1 text-sm text-red-400">{errors.edad}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">Asunto</label>
              <input
                type="text"
                name="asunto"
                value={formData.asunto || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-700 border ${errors.asunto ? 'border-red-500' : 'border-gray-600'} rounded-md text-white`}
              />
              {errors.asunto && <p className="mt-1 text-sm text-red-400">{errors.asunto}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">Descripción</label>
              <textarea
                rows={4}
                name="descripcion"
                value={formData.descripcion || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-700 border ${errors.descripcion ? 'border-red-500' : 'border-gray-600'} rounded-md text-white`}
              />
              {errors.descripcion && <p className="mt-1 text-sm text-red-400">{errors.descripcion}</p>}
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const LDETable = () => {
  const [datos, setDatos] = useState<RegistroDetalle[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [registroAEliminar, setRegistroAEliminar] = useState<number | null>(null);
  const [detalleRegistro, setDetalleRegistro] = useState<RegistroDetalle | null>(null);
  const [editarRegistro, setEditarRegistro] = useState<RegistroDetalle | null>(null);

  //paginacion
  const [paginaActual, setPaginaActual] = useState(1);
const elementosPorPagina = 5; // Puedes ajustar este valor


  const handleView = (id: number) => {
    const registro = datos.find((item) => item.id === id);
    if (registro) {
      setDetalleRegistro(registro);
    }
  };

  const handleEdit = (id: number) => {
    const registro = datos.find((item) => item.id === id);
    if (registro) {
      setEditarRegistro(registro);
    }
  };

  const handleSave = async (data: RegistroDetalle) => {
    console.log(data);
    try {
      // Aquí iría la llamada a la API para actualizar
       await apiRequest(`mensaje.actualizar`,{id:data.id},data);
      
      // Actualizar el estado local
      setDatos(datos.map((item) => 
        item.id === data.id ? { ...item, ...data } : item
      ));
      
      setEditarRegistro(null);
    } catch (err) {
      console.error('Error al actualizar:', err);
      setError('No se pudo actualizar el registro');
    }
  };

  const handleDeleteClick = (id: number) => {
    setRegistroAEliminar(id);
  };

  const handleConfirmDelete = async () => {
    if (registroAEliminar === null) return;
    try {
      await apiRequest(`mensaje.eliminar`,{id:registroAEliminar});
      // Actualizar el estado local
      setDatos(datos.filter((item) => item.id !== registroAEliminar));
      setRegistroAEliminar(null);
    } catch (err) {
      console.error('Error al eliminar:', err);
      setError('No se pudo eliminar el registro');
      setRegistroAEliminar(null);
    }
  };

  const handleCancelDelete = () => {
    setRegistroAEliminar(null);
  };

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const res:any = await apiRequest("mensaje.listar");
        setDatos(res.data);
      } catch (err) {
        console.error("Error:", err);
        setError("Error al cargar los datos");
      } finally {
        setIsLoading(false);
      }
    };

    obtenerDatos();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-gradient-to-br from-zinc-900 via-gray-900 to-zinc-900 rounded-xl">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const totalPaginas = Math.ceil(datos.length / elementosPorPagina);
const indiceInicio = (paginaActual - 1) * elementosPorPagina;
const indiceFin = indiceInicio + elementosPorPagina;
const datosPaginados = datos.slice(indiceInicio, indiceFin);


  return (
    <>
      {detalleRegistro && (
        <ModalDetalle 
          registro={detalleRegistro} 
          onClose={() => setDetalleRegistro(null)} 
        />
      )}
      {editarRegistro && (
        <ModalEditar
          registro={editarRegistro}
          onClose={() => setEditarRegistro(null)}
          onSave={handleSave}
        />
      )}
      <div className="bg-gradient-to-br from-zinc-900 via-gray-900 to-zinc-900 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-800">
        <div className="px-6 py-4 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <svg className="w-6 h-6 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 inline-block text-transparent bg-clip-text">
              Lista de LDEs
            </span>
          </h2>
        </div>
        
        {error ? (
          <div className="p-6">
            <div className="bg-red-900/30 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-800/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nombre</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Correo</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Asunto</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {datosPaginados.length > 0 ? (
                  datosPaginados.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">{item.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.nombre}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-400 hover:underline">
                        <a href={`mailto:${item.correo}`}>{item.correo}</a>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate" title={item.asunto}>
                        {item.asunto}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleView(item.id)}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            title="Ver detalles"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleEdit(item.id)}
                            className="text-yellow-400 hover:text-yellow-300 transition-colors"
                            title="Editar"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            title="Eliminar"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-400">
                      No hay datos disponibles
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            
            {datosPaginados.length > 0 && (
              <div className="px-6 py-3 flex items-center justify-between border-t border-gray-800 bg-gray-800/50 text-xs text-gray-400">
                <div>
                Mostrando <span className="font-medium text-white">{indiceInicio + 1}</span> a <span className="font-medium text-white">{Math.min(indiceFin, datos.length)}</span> de <span className="font-medium text-white">{datos.length}</span> resultados

                </div>
                <div className="flex items-center space-x-2">
  <button
    onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
    disabled={paginaActual === 1}
    className={`px-3 py-1 rounded border ${
      paginaActual === 1
        ? 'bg-gray-800 text-gray-500 cursor-not-allowed border-gray-700'
        : 'bg-gray-700 hover:bg-gray-600 text-white border-gray-600'
    }`}
  >
    Anterior
  </button>

  {[...Array(totalPaginas)].map((_, i) => (
    <button
      key={i}
      onClick={() => setPaginaActual(i + 1)}
      className={`px-3 py-1 rounded border ${
        paginaActual === i + 1
          ? 'bg-purple-600 text-white border-purple-500'
          : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700'
      }`}
    >
      {i + 1}
    </button>
  ))}

  <button
    onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
    disabled={paginaActual === totalPaginas}
    className={`px-3 py-1 rounded border ${
      paginaActual === totalPaginas
        ? 'bg-gray-800 text-gray-500 cursor-not-allowed border-gray-700'
        : 'bg-gray-700 hover:bg-gray-600 text-white border-gray-600'
    }`}
  >
    Siguiente
  </button>
</div>

              </div>
            )}
          </div>
        )}
      </div>
      {/* Modal de confirmación de eliminación */}
      {registroAEliminar !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full border border-gray-700">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white text-center mb-2">¿Estás seguro?</h3>
              <p className="text-gray-300 text-center mb-6">
                Esta acción no se puede deshacer. ¿Deseas eliminar este registro permanentemente?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleCancelDelete}
                  className="px-4 py-2 rounded-md border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
                >
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LDETable;
