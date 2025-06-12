import React, { useEffect, useState } from 'react';
import styles from './modalAddProd.module.css';
import { getTipos } from '../../../../http/typeRequest';
import { getCategorias } from '../../../../http/categoryRequest';
import { createProducto } from '../../../../http/productRequest';
import { ITipo } from '../../../../types/IType';
import { ICategory } from '../../../../types/ICategory';
import { uploadToCloudinary } from '../../../../utils/UploadToCloudinary';

interface ModalAddProdProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalAddProd: React.FC<ModalAddProdProps> = ({ isOpen, onClose }) => {
  const [tipos, setTipos] = useState<ITipo[]>([]);
  const [categorias, setCategorias] = useState<ICategory[]>([]);
  const [selectedTipoId, setSelectedTipoId] = useState<number | "">("");
  const [filteredCategorias, setFilteredCategorias] = useState<ICategory[]>([]);
  const [form, setForm] = useState({
    nombre: '',
    precio: '',
    cantidad: '',
    descripcion: '',
    color: '',
    marca: '',
    categoria: '',
    genero: '',
    talle: '',
    image: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const coloresDisponibles = ['Negro', 'Blanco', 'Rojo', 'Azul', 'Verde', 'Gris', 'Otros'];
  const marcasDisponibles = ['Nike', 'Adidas', 'Puma', 'Reebok', 'Vans', 'Fila', 'Otros'];

  useEffect(() => {
    if (isOpen) {
      getTipos().then(setTipos).catch(() => setTipos([]));
      getCategorias().then(setCategorias).catch(() => setCategorias([]));
      setSelectedTipoId("");
      setForm({
        nombre: '',
        precio: '',
        cantidad: '',
        descripcion: '',
        color: '',
        marca: '',
        categoria: '',
        genero: '',
        talle: '',
        image: '',
      });
      setImageFile(null);
      setImagePreview('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedTipoId === "") {
      setFilteredCategorias([]);
    } else {
      setFilteredCategorias(
        categorias.filter(
          cat => cat.tipo && cat.tipo.id !== undefined && cat.tipo.id === Number(selectedTipoId)
        )
      );
    }
    setForm(prev => ({ ...prev, categoria: '' }));
  }, [selectedTipoId, categorias]);

  if (!isOpen) return null;

  const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedTipoId(value ? Number(value) : "");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setForm({ ...form, image: e.target.files[0].name });
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = '';
    if (imageFile) {
      try {
        imageUrl = await uploadToCloudinary(imageFile);
      } catch (err) {
        alert('Error al subir la imagen');
        setLoading(false);
        return;
      }
    }

    const categoriaObj = categorias.find(cat => cat.id === Number(form.categoria));
    if (!categoriaObj) {
      alert('Selecciona una categoría válida');
      setLoading(false);
      return;
    }

    const producto = {
      nombre: form.nombre,
      cantidad: Number(form.cantidad),
      precio: Number(form.precio),
      descripcion: form.descripcion,
      color: form.color,
      marca: form.marca,
      eliminado: false,
      categoria: categoriaObj,
      imagenUrl: imageUrl,
      talles: [],
    };

    try {
      await createProducto(producto);
      alert('Producto agregado!');
      onClose();
    } catch (err) {
      alert('Error al agregar producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>✖</button>
        <h2>Agregar Producto</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGrid}>
            <div className={styles.inputColumn}>
              <label>Nombre del producto:</label>
              <input type="text" name="nombre" value={form.nombre} onChange={handleInputChange} required />

              <label>Precio:</label>
              <input type="number" name="precio" value={form.precio} onChange={handleInputChange} required />

              <label>Stock:</label>
              <input type="number" name="cantidad" value={form.cantidad} onChange={handleInputChange} required />

              <label>Descripción:</label>
              <input type="text" name="descripcion" value={form.descripcion} onChange={handleInputChange} />

              <label>Subir imagen:</label>
              <input type="file" name="imagen" accept="image/*" onChange={handleImageChange} />
              {imagePreview && (
                <img src={imagePreview} alt="preview" style={{ marginTop: 8, maxWidth: 120, borderRadius: 8 }} />
              )}
            </div>

            <div className={styles.inputColumn}>
              <label>Tipo:</label>
              <select
                name="tipo"
                required
                value={selectedTipoId}
                onChange={handleTipoChange}
              >
                <option value="">Seleccionar</option>
                {tipos.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>

              <label>Categoría:</label>
              <select
                name="categoria"
                required
                value={form.categoria}
                onChange={handleInputChange}
                disabled={selectedTipoId === ""}
              >
                <option value="">Seleccionar</option>
                {filteredCategorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>

              <label>Marca:</label>
              <select name="marca" value={form.marca} onChange={handleInputChange} required>
                <option value="">Seleccionar</option>
                {marcasDisponibles.map((marca) => (
                  <option key={marca} value={marca}>{marca}</option>
                ))}
              </select>

              <label>Color:</label>
              <select name="color" value={form.color} onChange={handleInputChange} required>
                <option value="">Seleccionar</option>
                {coloresDisponibles.map((color) => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>
          </div>

          <p className={styles.confirmText}>¿Guardar?</p>
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.yesButton} disabled={loading}>
              {loading ? 'Guardando...' : 'Sí'}
            </button>
            <button type="button" className={styles.noButton} onClick={onClose}>No</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAddProd;