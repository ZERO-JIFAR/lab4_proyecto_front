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

interface ModalEditProdProps {
    isOpen: boolean;
    onClose: () => void;
    product?: IProduct;
}


interface TalleConStock {
    talle: ITalle;
    stock: number;
}

const ModalEditProd : React.FC<ModalEditProdProps> = ({ isOpen, onClose, product }) => {
    const [tipos, setTipos] = useState<ITipo[]>([]);
    const [categorias, setCategorias] = useState<ICategory[]>([]);
    const [selectedTipoId, setSelectedTipoId] = useState<number | "">("");
    const [filteredCategorias, setFilteredCategorias] = useState<ICategory[]>([]);
    const [waistTypes, setWaistTypes] = useState<IWaistType[]>([]);
    const [selectedWaistTypeId, setSelectedWaistTypeId] = useState<number | "">("");
    const [talles, setTalles] = useState<ITalle[]>([]);
    const [selectedTalleId, setSelectedTalleId] = useState<number | "">("");
    const [talleStock, setTalleStock] = useState<string>("");
    const [tallesConStock, setTallesConStock] = useState<TalleConStock[]>([]);
    const [form, setForm] = useState({
        nombre: '',
        precio: '',
        descripcion: '',
        color: '',
        marca: '',
        categoria: '',
        image: '',
        imageAdicional: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [imageAdicionalFile, setImageAdicionalFile] = useState<File | null>(null);
    const [imageAdicionalPreview, setImageAdicionalPreview] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const coloresDisponibles = ['Negro', 'Blanco', 'Rojo', 'Azul', 'Verde', 'Gris', 'Otros'];
    const marcasDisponibles = ['Nike', 'Adidas', 'Puma', 'Reebok', 'Vans', 'Fila', 'Otros'];

    useEffect(() => {
        if (isOpen && product) {
            // setear datos del formulario
            setForm({
                nombre: product.nombre,
                precio: String(product.precio),
                descripcion: product.descripcion || '',
                color: product.color || '',
                marca: product.marca || '',
                categoria: '', // todavía no lo seteamos
                image: product.imagenUrl || '',
                imageAdicional: product.imagenesAdicionales?.[0] || ''
            });

            getTipos().then(setTipos).catch(console.error);

            getCategorias()
                .then((cats) => {
                    setCategorias(cats);
                    const tipoId = product.categoria?.tipo?.id || '';
                    const categoriaId = product.categoria?.id || '';

                    setSelectedTipoId(tipoId); // Esto disparará el filtro

                    // Esperamos a que setFilteredCategorias se complete en el siguiente efecto
                    // pero guardamos la categoría para setearla después
                    setTimeout(() => {
                        setForm(prev => ({ ...prev, categoria: String(categoriaId) }));
                    }, 100); // pequeño delay para esperar el filtro
                })
                .catch(console.error);

            getWaistTypes()
                .then((wt) => {
                    setWaistTypes(wt);
                    const waistTypeId = product.talles?.[0]?.talle?.tipoTalle?.id || '';
                    const exists = wt.some(w => w.id === Number(waistTypeId));
                    if (exists) {
                        setSelectedWaistTypeId(Number(waistTypeId));
                    }
                })
                .catch(console.error);

            setTallesConStock(
                (product.talles || []).map(tp => ({
                    talle: tp.talle,
                    stock: tp.stock
                }))
            );

            if (product.imagenUrl) setImagePreview(product.imagenUrl);
            if (product.imagenesAdicionales?.[0]) setImageAdicionalPreview(product.imagenesAdicionales[0]);
        }
    }, [isOpen, product]);

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

    const handleImageAdicionalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageAdicionalFile(e.target.files[0]);
            setForm({ ...form, imageAdicional: e.target.files[0].name });
            setImageAdicionalPreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleAddTalleStock = () => {
        if (!selectedTalleId || talleStock === "" || Number(talleStock) < 0) return;
        const talleObj = talles.find(t => t.id === Number(selectedTalleId));
        if (!talleObj) return;
        if (tallesConStock.some(ts => ts.talle.id === talleObj.id)) {
            alert("Ya agregaste ese talle.");
            return;
        }
        setTallesConStock([...tallesConStock, { talle: talleObj, stock: Number(talleStock) }]);
        setSelectedTalleId("");
        setTalleStock("");
    };

    const handleRemoveTalleStock = (id: number) => {
        setTallesConStock(tallesConStock.filter(ts => ts.talle.id !== id));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    setLoading(true);

    let imageUrl = form.image;
    let imageAdicionalUrl = form.imageAdicional;

    // Subir imagen si hay una nueva
    if (imageFile) {
        try {
            imageUrl = await uploadToCloudinary(imageFile);
        } catch (err) {
            alert('Error al subir la imagen principal');
            setLoading(false);
            return;
        }
    }

    if (imageAdicionalFile) {
        try {
            imageAdicionalUrl = await uploadToCloudinary(imageAdicionalFile);
        } catch (err) {
            alert('Error al subir la imagen adicional');
            setLoading(false);
            return;
        }
    }

    // Esto evita enviar un "nombre de archivo" si no hay URL válida
    if (!imageAdicionalFile && !form.imageAdicional.startsWith('http')) {
        imageAdicionalUrl = '';
    }

    const categoriaObj = categorias.find(cat => cat.id === Number(form.categoria));
    if (!categoriaObj) {
        alert('Selecciona una categoría válida');
        setLoading(false);
        return;
    }

    if (tallesConStock.length === 0) {
        alert('Debes agregar al menos un talle con stock');
        setLoading(false);
        return;
    }

    const producto = {
        id: product?.id,
        nombre: form.nombre,
        cantidad: 0,
        precio: Number(form.precio),
        descripcion: form.descripcion,
        color: form.color,
        marca: form.marca,
        imagenUrl: imageUrl,
        imagenesAdicionales: imageAdicionalUrl ? [imageAdicionalUrl] : [],
        categoria: { id: categoriaObj.id }
    };

    // Crear un objeto para tallesConStock (no un array)
    const tallesConStockObj: Record<number, number> = {};
    tallesConStock.forEach(ts => {
        tallesConStockObj[ts.talle.id] = ts.stock;
    });

    const productoConTallesDTO = {
        producto,
        tallesConStock: tallesConStockObj
    };

    try {
        const APIURL = import.meta.env.VITE_API_URL;

        if (product?.id) {
            // PUT para editar
            await axios.put(`${APIURL}/productos/con-talles/${product.id}`, productoConTallesDTO, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('token')
                        ? `Bearer ${localStorage.getItem('token')}`
                        : undefined,
                },
            });
            alert('Producto actualizado!');
        } else {
            // POST para agregar
            await axios.post(`${APIURL}/productos/con-talles`, productoConTallesDTO, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('token')
                        ? `Bearer ${localStorage.getItem('token')}`
                        : undefined,
                },
            });
            alert('Producto agregado!');
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

                            <label>Subir imagen principal:</label>
                            <input type="file" name="imagen" accept="image/*" onChange={handleImageChange} />
                            {imagePreview && (
                                <img src={imagePreview} alt="preview" style={{ marginTop: 8, maxWidth: 120, borderRadius: 8 }} />
                            )}

                            <label>Subir imagen adicional:</label>
                            <input type="file" name="imagenAdicional" accept="image/*" onChange={handleImageAdicionalChange} />
                            {imageAdicionalPreview && (
                                <img src={imageAdicionalPreview} alt="preview adicional" style={{ marginTop: 8, maxWidth: 120, borderRadius: 8 }} />
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
                                    <button type="button" onClick={handleAddTalleStock} disabled={!selectedTalleId || !talleStock}>
                                        Agregar Talle
                                    </button>
                                </>
                            )}

                            {tallesConStock.length > 0 && (
                                <div style={{ marginTop: 10 }}>
                                    <strong>Talles agregados:</strong>
                                    <ul>
                                        {tallesConStock.map(ts => (
                                            <li key={ts.talle.id}>
                                                {ts.talle.valor} - Stock: {ts.stock}
                                                <button type="button" style={{ marginLeft: 8 }} onClick={() => handleRemoveTalleStock(ts.talle.id)}>
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

export default ModalEditProd ;
