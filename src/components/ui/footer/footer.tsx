import React, { useState } from 'react';
import styles from './footer.module.css';
import { FaTwitter, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';
import ModalFooter from './modalsFooter/modalFooter';

const infoMap: Record<string, { title: string; content: string }> = {
  Envíos: {
    title: 'Información sobre Envíos',
    content: 'Realizamos envíos a todo el país. Una vez confirmado tu pedido, el tiempo de entrega estimado es de 3 a 7 días hábiles, dependiendo de tu ubicación. Recibirás un correo con el seguimiento para que puedas ver el estado de tu compra en todo momento.'
  },
  Devoluciones: {
    title: 'Política de Devoluciones',
    content: 'Si no estás conforme con tu compra, podés solicitar una devolución dentro de los 10 días posteriores a la recepción del producto. Los artículos deben estar sin uso, en su empaque original y con etiquetas. Consultá nuestras condiciones para más detalles.'
  },
  Cambios: {
    title: 'Cambios de Productos',
    content: '¿Necesitás cambiar un talle o modelo? Tenés hasta 15 días desde que recibís tu compra para hacerlo. El producto debe estar en perfecto estado, con sus etiquetas y sin uso. Contactanos para coordinar el cambio.'
  },
  Contacto: {
    title: 'Contacto',
    content: '¿Tenés dudas o necesitás ayuda? Escribinos por Twitter o Instagram. Nuestro equipo está disponible de lunes a viernes de 9 a 18 hs.'
  },
  Tips: {
    title: 'Consejos y Tips',
    content: 'Te compartimos ideas para combinar tus prendas, cuidar tus textiles y estar al día con las últimas tendencias. ¡Sacale el máximo provecho a tu estilo!'
  },
  Salud: {
    title: 'Salud y Bienestar',
    content: 'Creemos que la moda también es sentirse bien. Por eso, te acercamos contenidos sobre hábitos saludables, autocuidado y bienestar emocional.'
  },
    Promociones: {
    title: 'Promociones',
    content: 'Aprovechá nuestras ofertas especiales y descuentos exclusivos. Suscribite a nuestro newsletter para enterarte antes que nadie de las próximas promos.'
  },
    Explorá: {
    title: 'Encontrá tus artículos',
    content: 'Explorá nuestras categorías y descubrí la prenda perfecta para vos. Usá los filtros para buscar por talle, color o tipo de producto y hacé tu compra en minutos.'
  },
    Nosotros: {
    title: '¿Quiénes somos?',
    content: 'Somos una marca argentina dedicada a la moda urbana y actual. Trabajamos con pasión para ofrecerte calidad, estilo y comodidad en cada prenda.'
  },
    Noticias: {
    title: 'Noticias',
    content: 'Enterate de nuestras novedades, lanzamientos, colaboraciones y eventos. Seguinos en redes para estar siempre actualizado con lo último de nuestra marca.'
  },
};

const Footer = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });

  const handleOpenModal = (key: string) => {
    const selected = infoMap[key];
    if (selected) {
      setModalContent(selected);
      setModalOpen(true);
    }
  };

  return (
    <>
      <footer className={styles.footerContainer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerColumn}>
            <div className={styles.footerSocialIcons}>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
            </div>
          </div>

          <div className={styles.footerColumn}>
            <h4 className={styles.footerTitle}>AYUDA</h4>
            <ul className={styles.footerList}>
              {Object.keys(infoMap).filter(key =>
                ['Envíos', 'Devoluciones', 'Cambios', 'Contacto'].includes(key)
              ).map((key) => (
                <li key={key} className={styles.footerListItem} onClick={() => handleOpenModal(key)}>{key}</li>
              ))}
            </ul>
          </div>

          <div className={styles.footerColumn}>
            <h4 className={styles.footerTitle}>ACERCA DE</h4>
            <ul className={styles.footerList}>
              {['Nosotros','Noticias'].map((key) => (
                <li key={key} className={styles.footerListItem} onClick={() => handleOpenModal(key)}>{key}</li>
              ))}
            </ul>
          </div>

          <div className={styles.footerColumn}>
            <h4 className={styles.footerTitle}>Novedades</h4>
            <ul className={styles.footerList}>
              {['Promociones','Explorá','Tips', 'Salud'].map((key) => (
                <li key={key} className={styles.footerListItem} onClick={() => handleOpenModal(key)}>{key}</li>
              ))}
            </ul>
          </div>
        </div>
      </footer>

      <ModalFooter
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalContent.title}
        content={modalContent.content}
      />
    </>
  );
};

export default Footer;
