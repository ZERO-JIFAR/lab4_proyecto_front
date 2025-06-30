import React, { useEffect, useState } from 'react';
import styles from './modalAddProd.module.css';
import { getTipos } from '../../../../http/typeRequest';
import { getCategorias } from '../../../../http/categoryRequest';
import { getWaistTypes } from '../../../../http/waistTypeRequest';
import { getTallesByTipoId } from '../../../../http/talleRequest';
import { ITipo } from '../../../../types/IType';
import { ICategory } from '../../../../types/ICategory';
import { IWaistType } from '../../../../types/IWaistType';
import { ITalle } from '../../../../types/ITalle';
import { uploadToCloudinary } from '../../../../utils/UploadToCloudinary';
import { createProducto, IProductRequest } from '../../../../http/productRequest';
import { useAuth } from '../../../../context/AuthContext';

interface ModalAddProdProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TalleConStock {
  talle: ITalle;
  stock: number;
}

interface ColorForm {
  color: string;
  imagenUrl: string;
  imagenesAdicionales: string[];
  talles: TalleConStock[];
  imageFile: File | null;
  imagePreview: string;
  imageAdicionalFiles: File[];
  imageAdicionalPreviews: string[];
}

const coloresDisponibles = ['Negro', 'Blanco', 'Rojo', 'Azul', 'Verde', 'Gris', 'Otros'];
const marcasDisponibles = ['Nike', 'Adidas', 'Puma', 'Reebok', 'Vans', 'Fila', 'Otros'];

const ModalAddProd: React.FC<ModalAddProdProps> = ({ isOpen, onClose }) => {
  const { isAdmin, isLoggedIn } = useAuth();

  const [tipos, setTipos] = useState<ITipo[]>([]);
  const [categorias, setCategorias] = useState<ICategory[]>([]);
  const [selectedTipoId, setSelectedTipoId] = useState<number | "">("");
  const [filteredCategorias, setFilteredCategorias] = useState<ICategory[]>([]);
  const [waistTypes, setWaistTypes] = useState<IWaistType[]>([]);
  const [selectedWaistTypeId, setSelectedWaistTypeId] = useState<number | "">("");
  const [talles, setTalles] = useState<ITalle[]>([]);
  const [form, setForm] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    marca: '',
    categoria: '',
  });
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Colores
  const [colores, setColores] = useState<ColorForm[]>([]);
  const [colorForm, setColorForm] = useState<Omit<ColorForm, 'imageFile' | 'imagePreview' | 'imageAdicionalFiles' | 'imageAdicionalPreviews'> & {
    imageFile: File | null;
    imagePreview: string;
    imageAdicionalFiles: File[];
    imageAdicionalPreviews: string[];
  }>({
    color: '',
    imagenUrl: '',
    imagenesAdicionales: [],
    talles: [],
    imageFile: null,
    imagePreview: '',
    imageAdicionalFiles: [],
    imageAdicionalPreviews: [],
  });
  const [selectedTalleId, setSelectedTalleId] = useState<number | "">("");
  const [talleStock, setTalleStock] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      getTipos().then(setTipos).catch(() => setTipos([]));
      getCategorias().then(setCategorias).catch(() => setCategorias([]));
      getWaistTypes().then(setWaistTypes).catch(() => setWaistTypes([]));
      setSelectedTipoId("");
      setSelectedWaistTypeId("");
      setTalles([]);
      setForm({
        nombre: '',
        precio: '',
        descripcion: '',
        marca: '',
        categoria: '',
      });
      setMainImageFile(null);
      setMainImagePreview('');
      setColores([]);
      setColorForm({
        color: '',
        imagenUrl: '',
        imagenesAdicionales: [],
        talles: [],
        imageFile: null,
        imagePreview: '',
        imageAdicionalFiles: [],
        imageAdicionalPreviews: [],
      });
      setSelectedTalleId("");
      setTalleStock("");
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

  useEffect(() => {
    if (selectedWaistTypeId) {
      getTallesByTipoId(Number(selectedWaistTypeId)).then(setTalles).catch(() => setTalles([]));
      setSelectedTalleId("");
    } else {
      setTalles([]);
      setSelectedTalleId("");
    }
  }, [selectedWaistTypeId]);

  if (!isOpen) return null;

  // --- Color handlers ---
  const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setColorForm(prev => ({
      ...prev,
      color: e.target.value
    }));
  };

  const handleColorImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setColorForm(prev => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleColorImageAdicionalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      setColorForm(prev => ({
        ...prev,
        imageAdicionalFiles: [...prev.imageAdicionalFiles, ...files],
        imageAdicionalPreviews: [
          ...prev.imageAdicionalPreviews,
          ...files.map(f => URL.createObjectURL(f))
        ]
      }));
    }
  };

  const handleAddTalleStockToColor = () => {
    if (!selectedTalleId || talleStock === "" || Number(talleStock) < 0) return;
    const talleObj = talles.find(t => t.id === Number(selectedTalleId));
    if (!talleObj) return;
    if (colorForm.talles.some(ts => ts.talle.id === talleObj.id)) {
      alert("Ya agregaste ese talle para este color.");
      return;
    }
    setColorForm(prev => ({
      ...prev,
      talles: [...prev.talles, { talle: talleObj, stock: Number(talleStock) }]
    }));
    setSelectedTalleId("");
    setTalleStock("");
  };

  const handleRemoveTalleStockFromColor = (id: number) => {
    setColorForm(prev => ({
      ...prev,
      talles: prev.talles.filter(ts => ts.talle.id !== id)
    }));
  };

  const handleAddColor = async () => {
    if (!colorForm.color) {
      alert('Selecciona un color');
      return;
    }
    if (!colorForm.imageFile) {
      alert('Selecciona una imagen principal para el color');
      return;
    }
    if (colorForm.talles.length === 0) {
      alert('Agrega al menos un talle con stock para este color');
      return;
    }

    // Subir imagen principal del color
    let colorImageUrl = '';
    try {
      colorImageUrl = await uploadToCloudinary(colorForm.imageFile);
    } catch (err) {
      alert('Error al subir la imagen principal del color');
      return;
    }

    // Subir imágenes adicionales del color
    let imagenesAdicionales: string[] = [];
    if (colorForm.imageAdicionalFiles.length > 0) {
      try {
        imagenesAdicionales = await Promise.all(
          colorForm.imageAdicionalFiles.map(f => uploadToCloudinary(f))
        );
      } catch (err) {
        alert('Error al subir imágenes adicionales');
        return;
      }
    }

    setColores([
      ...colores,
      {
        color: colorForm.color,
        imagenUrl: colorImageUrl,
        imagenesAdicionales,
        talles: colorForm.talles,
        imageFile: null,
        imagePreview: '',
        imageAdicionalFiles: [],
        imageAdicionalPreviews: [],
      }
    ]);
    // Reset color form
    setColorForm({
      color: '',
      imagenUrl: '',
      imagenesAdicionales: [],
      talles: [],
      imageFile: null,
      imagePreview: '',
      imageAdicionalFiles: [],
      imageAdicionalPreviews: [],
    });
  };

  const handleRemoveColor = (colorIdx: number) => {
    setColores(colores.filter((_, idx) => idx !== colorIdx));
  };

  // --- Producto principal ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMainImageFile(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  // --- Submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('Solo un administrador puede agregar productos.');
      return;
    }
    setLoading(true);

    let mainImageUrl = '';
    if (mainImageFile) {
      try {
        mainImageUrl = await uploadToCloudinary(mainImageFile);
      } catch (err) {
        alert('Error al subir la imagen principal del producto');
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

    if (colores.length === 0) {
      alert('Debes agregar al menos un color con talles');
      setLoading(false);
      return;
    }

    // Construir el DTO para el backend
    const productoConColoresDTO: IProductRequest = {
      nombre: form.nombre,
      precio: Number(form.precio),
      descripcion: form.descripcion,
      marca: form.marca,
      imagenUrl: mainImageUrl,
      categoriaId: categoriaObj.id,
      colores: colores.map(c => ({
        color: c.color,
        imagenUrl: c.imagenUrl,
        imagenesAdicionales: c.imagenesAdicionales,
        talles: c.talles.map(ts => ({
          talleId: ts.talle.id,
          stock: ts.stock
        }))
      }))
    };

    try {
      await createProducto(productoConColoresDTO);
      alert('Producto agregado!');
      onClose();
    } catch (err: any) {
      if (err.response && err.response.status === 403) {
        alert('No tienes permisos para agregar productos. Debes ser administrador.');
      } else {
        alert('Error al agregar producto');
      }
      console.error('Error completo:', err);
    } finally {
      setLoading(false);
    }
  };

 if (!isLoggedIn || !isAdmin) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>✖</button>
        <h2>Agregar Producto</h2>
        <p style={{ color: 'red', fontWeight: 'bold' }}>
          Solo un administrador puede agregar productos.
        </p>
      </div>
    </div>
  );
}

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

            <label>Descripción:</label>
            <input type="text" name="descripcion" value={form.descripcion} onChange={handleInputChange} />

            <label>Subir imagen principal del producto:</label>
            <input type="file" name="imagen" accept="image/*" onChange={handleMainImageChange} />
            {mainImagePreview && (
              <img src={mainImagePreview} alt="preview" style={{ marginTop: 8, maxWidth: 120, borderRadius: 8 }} />
            )}
          </div>

          <div className={styles.inputColumn}>
            <label>Tipo:</label>
            <select
              name="tipo"
              required
              value={selectedTipoId}
              onChange={e => setSelectedTipoId(e.target.value ? Number(e.target.value) : "")}
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
          </div>

          {/* Colores */}
          <div className={styles.inputColumn}>
            <h4>Agregar Color</h4>
            <label>Color:</label>
            <select name="color" value={colorForm.color} onChange={handleColorChange}>
              <option value="">Seleccionar</option>
              {coloresDisponibles.map((color) => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>

            <label>Imagen principal del color:</label>
            <input type="file" accept="image/*" onChange={handleColorImageChange} />
            {colorForm.imagePreview && (
              <img src={colorForm.imagePreview} alt="preview color" style={{ marginTop: 8, maxWidth: 120, borderRadius: 8 }} />
            )}

            <label>Imágenes adicionales del color:</label>
            <input type="file" accept="image/*" multiple onChange={handleColorImageAdicionalChange} />
            {colorForm.imageAdicionalPreviews.length > 0 && (
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                {colorForm.imageAdicionalPreviews.map((url, idx) => (
                  <img key={idx} src={url} alt={`adicional-${idx}`} style={{ maxWidth: 60, borderRadius: 8 }} />
                ))}
              </div>
            )}

            <label>Tipo de Talle:</label>
            <select
              value={selectedWaistTypeId}
              onChange={e => setSelectedWaistTypeId(e.target.value ? Number(e.target.value) : "")}
              required
            >
              <option value="">Seleccionar</option>
              {waistTypes.map(wt => (
                <option key={wt.id} value={wt.id}>{wt.nombre}</option>
              ))}
            </select>

            {selectedWaistTypeId && (
              <>
                <label>Talle:</label>
                <select
                  value={selectedTalleId}
                  onChange={e => setSelectedTalleId(e.target.value ? Number(e.target.value) : "")}
                >
                  <option value="">Seleccionar</option>
                  {talles.map(t => (
                    <option key={t.id} value={t.id}>{t.valor}</option>
                  ))}
                </select>
                <label>Stock para este talle:</label>
                <input
                  type="number"
                  min={0}
                  value={talleStock}
                  onChange={e => setTalleStock(e.target.value)}
                />
                <button type="button" onClick={handleAddTalleStockToColor} disabled={!selectedTalleId || !talleStock}>
                  Agregar Talle
                </button>
              </>
            )}

            {colorForm.talles.length > 0 && (
              <div style={{ marginTop: 10 }}>
                <strong>Talles agregados para este color:</strong>
                <ul>
                  {colorForm.talles.map(ts => (
                    <li key={ts.talle.id}>
                      {ts.talle.valor} - Stock: {ts.stock}
                      <button type="button" style={{ marginLeft: 8 }} onClick={() => handleRemoveTalleStockFromColor(ts.talle.id)}>
                        Quitar
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button type="button" className={styles.yesButton} style={{ marginTop: 12 }} onClick={handleAddColor}>
              Agregar Color
            </button>

            {colores.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <strong>Colores agregados:</strong>
                <ul>
                  {colores.map((c, idx) => (
                    <li key={idx}>
                      <span style={{ fontWeight: 600 }}>{c.color}</span> - {c.talles.length} talles
                      <button type="button" style={{ marginLeft: 8 }} onClick={() => handleRemoveColor(idx)}>
                        Quitar
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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