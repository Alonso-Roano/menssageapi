import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import Modal from "./Modal";

const FormWithCaptcha = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    edad: "",
    asunto: "",
    descripcion: "",
  });

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!captchaToken) {
      setError("Por favor completa el reCAPTCHA.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        "https://qftkplcxrwkqbapiibxn.supabase.co/functions/v1/rapid-responder",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ captchaToken, ...formData }),
        }
      );

      if (res.ok) {
        // resetear tu form, captcha, etc.
        setFormData({
          nombre: "",
          correo: "",
          telefono: "",
          edad: "",
          asunto: "",
          descripcion: "",
        });
        recaptchaRef.current?.reset();
        setSuccess(true);
        await fetch(import.meta.env.PUBLIC_DISCORD, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: `**Nuevo mensaje recibido**\n
            **Nombre:** ${formData.nombre}
            **Correo:** ${formData.correo}
            **Teléfono:** ${formData.telefono}
            **Edad:** ${formData.edad}
            **Asunto:** ${formData.asunto}
            **Mensaje:** ${formData.descripcion}`
          }),
        });
      } else {
        setError("Hubo un error al enviar el formulario.");
      }
    } catch {
      setError("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-transparent p-6 rounded-lg shadow-lg"
      >
        {/* campos de entrada */}
        {["nombre", "correo", "telefono", "edad", "asunto"].map((field) => (
          <div key={field} className="mb-2">
            <label
              htmlFor={field}
              className="block text-white mb-2 font-medium capitalize"
            >
              {field} <span className="text-red-500">*</span>
            </label>
            <input
              type={
                field === "correo"
                  ? "email"
                  : field === "edad" || field === "telefono"
                    ? "number"
                    : "text"
              }
              id={field}
              name={field}
              value={formData[field as keyof typeof formData]}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
        ))}

        {/* textarea */}
        <div className="mb-4">
          <label
            htmlFor="descripcion"
            className="block text-white font-medium mb-2"
          >
            Mensaje <span className="text-red-500">*</span>
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            rows={4}
            value={formData.descripcion}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white resize-vertical"
          />
        </div>

        {/* reCAPTCHA */}
        <div className="mb-4">
          <ReCAPTCHA
            sitekey="6Leok2wrAAAAAAr1RepTMxjm4bcq8pP_va7dkJg5"
            onChange={handleCaptchaChange}
            ref={recaptchaRef}
          />
        </div>

        <div className="mb-4">
          <button
            type="button"
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => setModalOpen(true)}
          >
            Mostrar aviso de privacidad
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-500 text-white font-semibold py-2 px-6 rounded-md hover:bg-indigo-600 transition-colors duration-300"
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && (
          <p className="text-green-500 mt-2">
            ¡Formulario enviado correctamente!
          </p>
        )}
      </form>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default FormWithCaptcha;
