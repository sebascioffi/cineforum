import React, { useState } from 'react';
import './../index.css';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailError, setEmailError] = useState('');
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
    if (!formData.firstName) {
      newErrors.firstName = 'El nombre es obligatorio';
    }
    if (!formData.lastName) {
      newErrors.lastName = 'El apellido es obligatorio';
    }
    if (!formData.email) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 7 || !/\d/.test(formData.password)) {
      newErrors.password = 'La contraseña debe tener al menos 7 caracteres y contener al menos un número';
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
        const response = await fetch(`${port}/api/crearUsuario`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        if (response.status === 200) {
          setIsSubmitted(true);
          setEstaCargando(false);
        } else if (response.status === 400) {
          console.log("email ya creado");
          setEmailError('Este email ya se encuentra registrado');
          setEstaCargando(false);
        }else{
          console.log("error en la rta");
          setEstaCargando(false);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  
  return (
    <section id='sec_crearcuenta'>
    <div className="signup-form">
      <h2>Crear Cuenta</h2>
      {isSubmitted ? (
        <p>¡Cuenta creada con exito!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">Nombre:</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
            />
            {errors.firstName && <p className="error">{errors.firstName}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Apellido:</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
            />
            {errors.lastName && <p className="error">{errors.lastName}</p>}
          </div>
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
            {emailError && <p className="error">{emailError}</p>}
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
          </div>
          {estaCargando ? (
            <p>cargando...</p>
          ):(
            <></>
          )}
          <button id='crear_cuenta' type="submit">Crear Cuenta</button>
        </form>
      )}
    </div>
    </section>
  );
};

export default SignupForm;
