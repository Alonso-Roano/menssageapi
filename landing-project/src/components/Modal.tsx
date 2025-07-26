import React from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-gray-900 text-gray-100 w-full max-w-3xl rounded-lg shadow-xl p-6 md:p-10 relative">
        <h1 className="text-3xl font-bold border-b border-gray-700 pb-4">
          Aviso de Privacidad
        </h1>

        <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scroll">
          <p>
            En cumplimiento con lo establecido por la legislación vigente en
            materia de protección de datos personales, se informa a los usuarios
            que los datos recabados a través de este formulario de contacto
            serán tratados con la finalidad de dar seguimiento a su solicitud y
            brindar una respuesta adecuada.
          </p>

          <h2 className="text-2xl font-semibold">Datos personales recabados</h2>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Nombre</li>
            <li>Correo electrónico</li>
            <li>Asunto</li>
            <li>Teléfono</li>
            <li>Descripción del mensaje</li>
            <li>Edad</li>
          </ul>

          <h2 className="text-2xl font-semibold">Finalidad del tratamiento</h2>
          <p>Los datos proporcionados serán utilizados exclusivamente para:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>
              Atender y responder solicitudes recibidas a través del formulario.
            </li>
            <li>
              Establecer comunicación con el usuario en caso de ser necesario.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold">Conservación y protección</h2>
          <p>
            Los datos serán conservados únicamente durante el tiempo necesario
            para cumplir con las finalidades mencionadas y serán protegidos
            mediante medidas de seguridad técnicas, administrativas y físicas
            para evitar su pérdida, uso indebido, acceso no autorizado o
            alteración.
          </p>

          <h2 className="text-2xl font-semibold">Derechos del titular</h2>
          <p>
            Usted tiene derecho a acceder, rectificar, cancelar u oponerse al
            tratamiento de sus datos personales (Derechos ARCO). Para ejercer
            estos derechos, puede enviar una solicitud mediante el mismo
            formulario de contacto o al correo designado.
          </p>

          <p className="text-sm text-gray-400">
            Este aviso puede actualizarse en cualquier momento. Le recomendamos
            revisarlo periódicamente.
          </p>
        </div>

        <div className="mt-6 text-right">
          <button
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
