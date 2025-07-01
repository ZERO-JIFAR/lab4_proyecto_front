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
import axios from "axios";
import { IProduct } from '../../../../types/IProduct';
import { useAuth } from '../../../../context/AuthContext';

interface ModalEditProdProps {
    isOpen: boolean;
    onClose: () => void;
    product?: IProduct;
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

const ModalEditProd: React.FC<ModalEditProdProps> = ({ isOpen, onClose, product }) => {
    const [tipos, setTipos] = useState<ITipo[]>([]);
    const [categorias, setCategorias] = useState<ICategory[]>([]);
    const [selectedTipoId, setSelectedTipoId] = useState<number | "">("");
    const [filteredCategorias, setFilteredCategorias] = useState<ICategory[]>([]);
    const [waistTypes, setWaistTypes] = useState<IWaistType[]>([]);
    const [selectedWaistTypeId, setSelectedWaistTypeId] = useState<number | "">("");
    const [talles, setTalles] = useState<ITalle[]>([]);
    const { token } = useAuth();
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

    // Inicializa el formulario con los datos del producto
    useEffect(() => {
        if (isOpen && product) {
            setForm({
                nombre: product.nombre || '',
                precio: String(product.precio),
                descripcion: product.descripcion || '',
                marca: product.marca || '',
                categoria: product.categoria?.id ? String(product.categoria.id) : '',
            });
            setMainImagePreview(product.imagenUrl || '');
            setMainImageFile(null);

            // Colores
            setColores(
                (product.colores || []).map(c => ({
                    color: c.color,
                    imagenUrl: c.imagenUrl || '',
                    imagenesAdicionales: c.imagenesAdicionales || [],
                    talles: (c.talles || []).map(ts => ({
                        talle: {
                            id: ts.talleId,
                            valor: ts.talleValor ?? "",
                            nombre: ts.talleValor ?? ""
                        },
                        stock: ts.stock
                    })),
                    imageFile: null,
                    imagePreview: c.imagenUrl || '',
                    imageAdicionalFiles: [],
                    imageAdicionalPreviews: (c.imagenesAdicionales || []).map(url => url),
                }))
            );
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
    }, [isOpen, product]);

    useEffect(() => {
        if (isOpen) {
            getTipos().then(setTipos).catch(() => setTipos([]));
            getCategorias().then(setCategorias).catch(() => setCategorias([]));
            getWaistTypes().then(setWaistTypes).catch(() => setWaistTypes([]));
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

    if (!isOpen || !product) return null;

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
        if (!colorForm.imageFile && !colorForm.imagePreview) {
            alert('Selecciona una imagen principal para el color');
            return;
        }
        if (colorForm.talles.length === 0) {
            alert('Agrega al menos un talle con stock para este color');
            return;
        }

        // Subir imagen principal del color si es nueva
        let colorImageUrl = colorForm.imagenUrl;
        if (colorForm.imageFile) {
            try {
                colorImageUrl = await uploadToCloudinary(colorForm.imageFile);
            } catch (err) {
                alert('Error al subir la imagen principal del color');
                return;
            }
        } else if (colorForm.imagePreview) {
            colorImageUrl = colorForm.imagePreview;
        }

        // Subir imágenes adicionales del color si son nuevas
        let imagenesAdicionales: string[] = colorForm.imagenesAdicionales || [];
        if (colorForm.imageAdicionalFiles.length > 0) {
            try {
                const nuevas = await Promise.all(
                    colorForm.imageAdicionalFiles.map(f => uploadToCloudinary(f))
                );
                imagenesAdicionales = [...imagenesAdicionales, ...nuevas];
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
        setLoading(true);

        let mainImageUrl = mainImagePreview;
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

        // --- CAMBIO: Solo obligar colores/talles si el producto no tiene ninguno ---
        const productoYaTieneColoresYtalles = (product.colores && product.colores.length > 0 && product.colores.some(c => c.talles && c.talles.length > 0));
        const nuevosColoresIngresados = colores.length > 0;

        if (!productoYaTieneColoresYtalles && !nuevosColoresIngresados) {
            alert('Debes agregar al menos un color con talles');
            setLoading(false);
            return;
        }

        // Construir el DTO para el backend
        const productoConColoresDTO = {
            nombre: form.nombre,
            precio: Number(form.precio),
            descripcion: form.descripcion,
            marca: form.marca,
            imagenUrl: mainImageUrl,
            categoriaId: categoriaObj.id,
            colores: nuevosColoresIngresados ? colores.map(c => ({
                color: c.color,
                imagenUrl: c.imagenUrl,
                imagenesAdicionales: c.imagenesAdicionales,
                talles: c.talles.map(ts => ({
                    talleId: ts.talle.id,
                    stock: ts.stock
                }))
            })) : product.colores // Si no hay nuevos colores, manda los existentes
        };

        try {
            const APIURL = import.meta.env.VITE_API_URL;
            if (product?.id) {
                // PUT para editar producto con colores y talles
                await axios.put(`${APIURL}/productos/con-colores/${product.id}`, productoConColoresDTO, {
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                });
                alert('Producto actualizado!');
            }
            onClose();
        } catch (err: any) {
            console.error('Error completo:', err);
            if (axios.isAxiosError(err)) {
                const message = err.response?.data?.message || err.message;
                alert(`Error al guardar producto: ${message}`);
            } else {
                alert(`Error inesperado: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose}>✖</button>
                <h2>Editar Producto</h2>
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

export default ModalEditProd;