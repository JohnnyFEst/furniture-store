import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import imagen1 from '../assets/images/Sala1.jpeg';
import imagen2 from '../assets/images/Alcoba1.jpg';
import imagen3 from '../assets/images/Comedor1.jpg';
import imagen4 from '../assets/images/Cocina1.jpeg';
import './HomePage.css';

const HomePage = () => {
  return (
    <div>
      <h1>Bienvenido a FURNITURE STORE</h1>
      <p>Encuentra los mejores muebles para tu hogar, con calidad y estilo.</p>

      <Carousel autoPlay infiniteLoop showThumbs={false} className="image-carousel">
        <div>
          <img src={imagen1} alt="Muebles para sala de estar" className="carousel-container" />
          <p className="legend">Muebles para Sala</p>
        </div>
        <div>
          <img src={imagen2} alt="Muebles para dormitorio" className="carousel-container" />
          <p className="legend">Muebles para Dormitorio</p>
        </div>
        <div>
          <img src={imagen3} alt="Muebles para comedor" className="carousel-container" />
          <p className="legend">Muebles para Comedor</p>
        </div>
        <div>
          <img src={imagen4} alt="Muebles para cocina" className="carousel-container" />
          <p className="legend">Muebles para Cocina</p>
        </div>
      </Carousel>

    </div>
  );
};

export default HomePage;