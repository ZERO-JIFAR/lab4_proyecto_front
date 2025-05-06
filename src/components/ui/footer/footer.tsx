import React, { useState } from 'react';
import styles from './footer.module.css';
import { FaXTwitter, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa6';
import ModalFooter from './modalsFooter/modalFooter'; 

const infoMap: Record<string, { title: string; content: string }> = {
  Envíos: {
    title: 'Información sobre Envíos',
    content: 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.',
  },
  Devoluciones: {
    title: 'Política de Devoluciones',
    content: 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.',
  },
  Cambios: {
    title: 'Cambios de Productos',
    content: 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.',
  },
  Contacto: {
    title: 'Contacto',
    content: 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.',
  },
  Tips: {
    title: 'Consejos y Tips',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Pellentesque habitant morbi tristique senectus et netus.',
  },
  Salud: {
    title: 'Salud y Bienestar',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut perspiciatis unde omnis iste natus error sit voluptatem.',
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
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.column}>
            <div className={styles.socialIcons}>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaXTwitter /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
            </div>
          </div>

          <div className={styles.column}>
            <h4>AYUDA</h4>
            <ul>
              {Object.keys(infoMap).filter(key =>
                ['Envíos', 'Devoluciones', 'Cambios', 'Contacto'].includes(key)
              ).map((key) => (
                <li key={key} onClick={() => handleOpenModal(key)}>{key}</li>
              ))}
            </ul>
          </div>

          <div className={styles.column}>
            <h4>ACERCA DE</h4>
            <ul>
              <li>¿Quiénes somos?</li>
              <li>Noticias</li>
            </ul>
          </div>

          <div className={styles.column}>
            <h4>Novedades</h4>
            <ul>
              <li>Promociones</li>
              <li>Encontrá tus artículos</li>
              {['Tips', 'Salud'].map((key) => (
                <li key={key} onClick={() => handleOpenModal(key)}>{key}</li>
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
