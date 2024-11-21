import React from 'react';
import TableProducts from '../components/Table'; // Importar el componente de la tabla

const Home = () => {
  return (
    <div className="home-container container">
      <div className='container'>
      <h1>Bienvenido</h1>
      <p>Gestiona tus tareas desde aquí.</p>
      {/* Componente de la tabla */}
      <TableProducts />
      </div>
    </div>
  );
};

export default Home;
