import React, { useState } from 'react';
import './../index.css';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ isAuthenticated, setIsAuthenticated, valorEmail, setValorEmail }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [usuarioValido, setUsuarioValido] = useState('');
  const [estaCargando, setEstaCargando] = useState(false);

  const port = process.env.REACT_APP_ORIGIN;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const isValid = validateForm();
    if (isValid) {

      setEstaCargando(true);
      try {
        const response = await fetch(`${port}/api/iniciarSesion`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        if (response.status === 200) {
          setIsSubmitted(true);
          console.log("inicio de sesion exitoso");
          setIsAuthenticated(true);
          localStorage.setItem('isAuthenticated', 'true');
          navigate('/');
          const inputEmail = document.getElementById('email');
          const email = inputEmail.value;
          setValorEmail(email); 
          localStorage.setItem('userEmail', email);
          setEstaCargando(false);
        }else{
          setIsSubmitted(false);
          setUsuarioValido("Los datos ingresados son incorrectos");
          console.log("error al iniciar sesion");
          setEstaCargando(false);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <section id='sec_crearcuenta'>
    <div className="login-form">
      <h2>Iniciar Sesión</h2>
      {isSubmitted ? (
        <p>Sesión iniciada con éxito.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
            {errors.password && <p className="error">{errors.password}</p>}
            {usuarioValido && <p className="error">{usuarioValido}</p>}
          </div>
           {estaCargando ? (
            <p>cargando...</p>
           ):(
            <></>
           )}
          <button type="submit" id='crear_cuenta'>Iniciar Sesión</button>
        </form>
      )}
    </div>
    </section>
  );
};

export default LoginForm;
