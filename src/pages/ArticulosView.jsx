import {
    Search,
    Plus,
    Save,
    X,
    AlertTriangle,
} from "lucide-react";
import { useState, useEffect } from "react";


const API_URL = "http://localhost:8080/api";


const getRubros = (depId) => ALL_RUBROS[depId] || [];
const getFamilias = (depId, rubroId) => ALL_FAMILIAS[`${depId}-${rubroId}`] || [];

/* ── Vista principal ── */
export function ArticulosView() {

    const [departamentos, setDepartamentos] = useState([]);
    const [rubros, setRubros] = useState([]);
    const [familias, setFamilias] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [articulos, setArticulos] = useState([]);
    const [selectedArticulo, setSelectedArticulo] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");


    // Estados de conexión
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const calcularPrecioVenta = (pc, m) => pc * (1 + m / 100);


    // traer artículos
    useEffect(() => {
        fetch(`${API_URL}/articulos`)
            .then((res) => {
                if (!res.ok) throw new Error("Error al intentar conectar con el backend.");
                return res.json();
            })
            .then((data) => {
                setArticulos(data);
                if (data.length > 0) {
                    setSelectedArticulo(data[0]);
                }
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    // Efectos para traer las tablas desde el backend
    useEffect(() => {
        fetch(`${API_URL}/departamentos`)
            .then(res => res.json())
            .then(data => setDepartamentos(data.map(d => ({ value: String(d.codDepartamento), label: d.descripcion }))));

        fetch(`${API_URL}/rubros`)
            .then(res => res.json())
            .then(data => setRubros(data.map(r => ({ value: String(r.codRubro), label: r.descripcion, codDepartamento: String(r.codDepartamento) }))));

        fetch(`${API_URL}/familias`)
            .then(res => res.json())
            .then(data => setFamilias(data.map(f => ({ value: String(f.codFamilia), label: f.descripcion, codRubro: String(f.codRubro), codDepartamento: String(f.codDepartamento) }))));

        fetch(`${API_URL}/marcas`)
            .then(res => res.json())
            .then(data => setMarcas(data.map(m => ({ value: String(m.codMarca), label: m.descripcion, codMarca: String(m.codMarca), }))));

    }, []);

    const handleEdit = () => {
        if (selectedArticulo) { setEditForm({ ...selectedArticulo }); setIsEditing(true); }
    };

    // ── Guardar datos en Java
    const handleSave = () => {
        if (editForm) {
            const updated = { ...editForm, precioVenta: calcularPrecioVenta(editForm.precioCosto, editForm.margen) };

            fetch(`${API_URL}/articulos`, {       
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updated)
            })
                .then((res) => {
                    if (!res.ok) throw new Error("No se pudo actualizar el artículo en el servidor.");
                    return res.json();
                })
                
                .then((savedData) => {
                    if (savedData === true) {

                        // Buscamos descripciones en estados locales
                        const depSel = departamentos.find(d => String(d.value) === String(editForm.codDepartamento));
                        const rubroSel = rubros.find(r => String(r.value) === String(editForm.codRubro));
                        const famSel = familias.find(f => String(f.value) === String(editForm.codFamilia));
                        const marcaSel = marcas.find(m => String(m.value) === String(editForm.marca));

                        // Construimos el artículo combinando los datos editados y los nombres de texto
                        const articuloReciente = {
                            ...updated, 
                            nombreDepartamento: depSel ? depSel.label : updated.nombreDepartamento,
                            nombreRubro: rubroSel ? rubroSel.label : updated.nombreRubro,
                            nombreFamilia: famSel ? famSel.label : updated.nombreFamilia,
                            nombreMarca: marcaSel ? marcaSel.label : updated.nombreMarca
                        };

                        //grabar en la lista general y en el detalle 
                        setArticulos((prev) =>
                            prev.map((a) => (a.idCodArticulo === updated.idCodArticulo ? articuloReciente : a))
                        );
                        setSelectedArticulo(articuloReciente);

                        setIsEditing(false);
                        setEditForm(null);

                    } else {
                        alert("El backend no pudo confirmar la persistencia.");
                    }
                })
        }
    };

    const handleCancel = () => { setIsEditing(false); setEditForm(null); };

    const setField = (field, value) => {
        if (!editForm) return;
        let updated = { ...editForm, [field]: value };
        if (field === "precioCosto" || field === "margen") {
            updated.precioVenta = calcularPrecioVenta(
                field === "precioCosto" ? value : updated.precioCosto,
                field === "margen" ? value : updated.margen,
            );
        }
        setEditForm(updated);
    };

    // Filtrando 'descripcion'
    const filteredArticulos = articulos.filter((a) => {
        const textoDescripcion = a.descripcion ? String(a.descripcion).toLowerCase() : "";
        const textoCodigo = a.codigo ? String(a.codigo) : "";
        const busqueda = searchTerm.toLowerCase();
        return textoDescripcion.includes(busqueda) || textoCodigo.includes(busqueda);
    });

    // Filtra los rubros que pertenecen al departamento seleccionado
    const getRubrosDinamicos = (depId) => {
        if (!depId) return [];
        return rubros.filter(r => String(r.codDepartamento) === String(depId));
    };

    // Filtra las familias que pertenecen al rubro seleccionado
    const getFamiliasDinamicas = (rubroId) => {
        if (!rubroId) return [];
        return familias.filter(f => String(f.codRubro) === String(rubroId));
    };

    const display = isEditing ? editForm : selectedArticulo;

    
    // Estilos rápidos
    const labelStyle = { color: "#666666" };
    const fieldStyle = { color: "#333333" };
    const inputCls = "w-full px-4 py-2 rounded-lg border outline-none";
    const inputSty = { borderColor: "#C8E6C9" };
    const inputFocus = (e) => (e.currentTarget.style.borderColor = "#4CAF50");
    const inputBlur = (e) => (e.currentTarget.style.borderColor = "#C8E6C9");

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center text-lg font-medium text-gray-600 bg-[#F0F8F4]">
                Cargando catálogo ...
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-red-600 bg-[#F0F8F4]">
                <AlertTriangle size={48} className="text-amber-500" />
                <p className="text-xl font-semibold">Error de conexión</p>
                <p className="text-sm text-gray-500 max-w-md text-center">{error}</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col" style={{ backgroundColor: "#F0F8F4" }}>
            {/* Header */}
            <div className="border-b px-8 py-6" style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9" }}>
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl" style={{ color: "#333333" }}>Artículos</h2>
                    <button
                        className="px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
                        style={{ backgroundColor: "#4CAF50", color: "#FFFFFF" }}
                    >
                        <Plus size={20} /> Nuevo Artículo
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* ── Lista de artículos ── */}
                <div className="w-80 border-r flex flex-col" style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9" }}>
                    <div className="p-4 border-b" style={{ borderColor: "#C8E6C9" }}>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18} style={{ color: "#666666" }} />
                            <input
                                type="text"
                                placeholder="Buscar por código o nombre..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border outline-none"
                                style={{ borderColor: "#C8E6C9", backgroundColor: "#F0F8F4" }}
                                onFocus={inputFocus}
                                onBlur={inputBlur}
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto">
                        {filteredArticulos.length === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-400">No hay artículos cargados</div>
                        ) : (
                            filteredArticulos.map((art) => {
                                const isSel = selectedArticulo?.idCodArticulo === art.idCodArticulo;
                                const isBajo = (art.stock ?? 0) < (art.stockCritico ?? 0);
                                return (
                                    <div
                                        key={art.idCodArticulo}
                                        onClick={() => { setSelectedArticulo(art); setIsEditing(false); setEditForm(null); }}
                                        className="p-4 border-b cursor-pointer transition-colors"
                                        style={{ borderColor: "#C8E6C9", backgroundColor: isSel ? "#E8F5E9" : "#FFFFFF" }}
                                    >
                                        <div className="flex items-start justify-between mb-0.5">
                                            <span className="text-xs" style={{ color: "#666666" }}>Código: {art.codigo}</span>
                                            {isBajo && <AlertTriangle size={14} style={{ color: "#FF9800" }} />}
                                        </div>
                                        <div className="text-sm font-medium" style={{ color: "#333333" }}>{art.descripcion}</div>
                                        <div className="text-xs mt-0.5" style={{ color: "#888888" }}>
                                            {art.nombreDepartamento ?? `Dep. ${art.codDepartamento}`}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* ── Panel de detalle ── */}
                <div className="flex-1 overflow-auto p-8">
                    {display ? (
                        <div className="max-w-4xl mx-auto">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl mb-2" style={{ color: "#333333" }}>{display.descripcion}</h3>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <span className="px-3 py-1 rounded text-sm" style={{ backgroundColor: "#E8F5E9", color: "#388E3C" }}>
                                            ID Sistema: {display.idCodArticulo}
                                        </span>
                                        <span className="px-3 py-1 rounded text-sm" style={{ backgroundColor: "#F3E5F5", color: "#7B1FA2" }}>
                                            {display.nombreDepartamento ?? `Dep. ${display.codDepartamento}`} › {display.nombreRubro ?? `Rubro ${display.codRubro}`} › {display.nombreFamilia ?? `Fam. ${display.codFamilia}`}
                                        </span>
                                        {(display.stock ?? 0) < (display.stockCritico ?? 0) && (
                                            <span className="px-3 py-1 rounded flex items-center gap-1 text-sm" style={{ backgroundColor: "#FFF3E0", color: "#FF9800" }}>
                                                <AlertTriangle size={14} /> Stock Bajo
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {!isEditing ? (
                                    <button onClick={handleEdit} className="px-6 py-2 rounded-lg transition-colors" style={{ backgroundColor: "#4CAF50", color: "#FFFFFF" }}>
                                        Editar
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button onClick={handleSave} className="px-5 py-2 rounded-lg flex items-center gap-2 transition-colors" style={{ backgroundColor: "#4CAF50", color: "#FFFFFF" }}><Save size={16} /> Guardar</button>
                                        <button onClick={handleCancel} className="px-5 py-2 rounded-lg flex items-center gap-2 transition-colors" style={{ backgroundColor: "#E0E0E0", color: "#333333" }}><X size={16} /> Cancelar</button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                {/* Información General */}
                                <div className="rounded-lg p-6 border" style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9" }}>
                                    <h4 className="mb-4" style={{ color: "#333333" }}>Información General</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block mb-1 text-sm" style={labelStyle}>Descripción / Nombre</label>
                                            {isEditing && editForm ? (
                                                <input type="text" value={editForm.descripcion} onChange={(e) => setField("descripcion", e.target.value)} className={inputCls} style={inputSty} onFocus={inputFocus} onBlur={inputBlur} />
                                            ) : (
                                                <div className="px-4 py-2" style={fieldStyle}>{display.descripcion}</div>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm" style={labelStyle}>Código de Artículo</label>
                                            {isEditing && editForm ? (
                                                <input type="number" value={editForm.codigo} onChange={(e) => setField("codigo", parseInt(e.target.value) || 0)} className={inputCls} style={inputSty} onFocus={inputFocus} onBlur={inputBlur} />
                                            ) : (
                                                <div className="px-4 py-2" style={fieldStyle}>{display.codigo}</div>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm" style={labelStyle}>Código de Barras</label>
                                            {isEditing && editForm ? (
                                                <input type="text" value={editForm.codigoBarra ?? ""} onChange={(e) => setField("codigoBarra", e.target.value)} className={inputCls} style={inputSty} onFocus={inputFocus} onBlur={inputBlur} />
                                            ) : (
                                                <div className="px-4 py-2" style={fieldStyle}>{display.codigoBarra}</div>
                                            )}
                                        </div>
                                        <div>
                                            <SelectField
                                                label="Marca"
                                                value={isEditing && editForm ? editForm.marca : display?.marca}
                                                textValue={display?.nombreMarca ?? `Marca ${display?.marca}`}
                                                options={marcas}
                                                onChange={(v) => isEditing && setField("marca", v)}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* ── Clasificación ── */}
                                <div className="rounded-lg p-6 border" style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9" }}>
                                    <h4 className="mb-4" style={{ color: "#333333" }}>Clasificación</h4>
                                    <div className="grid grid-cols-3 gap-4">

                                        {/* 1. DEPARTAMENTO */}
                                        <SelectField
                                            label="Departamento"
                                            value={isEditing && editForm ? editForm.codDepartamento : display?.codDepartamento}
                                            textValue={display?.nombreDepartamento}
                                            options={departamentos}
                                            onChange={(v) => isEditing && setField("codDepartamento", v)}
                                            disabled={!isEditing}
                                        />

                                        {/* 2. RUBRO */}
                                        <SelectField
                                            label="Rubro"
                                            value={isEditing && editForm ? editForm.codRubro : display?.codRubro}
                                            textValue={display?.nombreRubro}
                                            options={getRubrosDinamicos(isEditing && editForm ? editForm.codDepartamento : display?.codDepartamento)}
                                            onChange={(v) => isEditing && setField("codRubro", v)}
                                            disabled={!isEditing || !(isEditing && editForm?.codDepartamento)}
                                        />

                                        {/* 3. FAMILIA */}
                                        <SelectField
                                            label="Familia"
                                            value={isEditing && editForm ? editForm.codFamilia : display?.codFamilia}
                                            textValue={display?.nombreFamilia}
                                            options={getFamiliasDinamicas(isEditing && editForm ? editForm.codRubro : display?.codRubro)} // <── Pasamos solo el rubro
                                            onChange={(v) => isEditing && setField("codFamilia", v)}
                                            disabled={!isEditing || !(isEditing && editForm?.codRubro)} // <── Se habilita si hay un rubro seleccionado
                                        />
                                    </div>
                                </div>
                                {/* Precios y Márgenes */}
                                <div className="rounded-lg p-6 border" style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9" }}>
                                    <h4 className="mb-4" style={{ color: "#333333" }}>Precios y Márgenes</h4>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block mb-1 text-sm" style={labelStyle}>Precio Costo</label>
                                            {isEditing && editForm ? (
                                                <input type="number" step="0.01" value={editForm.precioCosto} onChange={(e) => setField("precioCosto", parseFloat(e.target.value) || 0)} className={inputCls} style={inputSty} onFocus={inputFocus} onBlur={inputBlur} />
                                            ) : (
                                                <div className="px-4 py-2" style={fieldStyle}>${(display.precioCosto ?? 0).toFixed(2)}</div>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm" style={labelStyle}>Margen (%)</label>
                                            {isEditing && editForm ? (
                                                <input type="number" step="0.1" value={editForm.margen} onChange={(e) => setField("margen", parseFloat(e.target.value) || 0)} className={inputCls} style={inputSty} onFocus={inputFocus} onBlur={inputBlur} />
                                            ) : (
                                                <div className="px-4 py-2" style={fieldStyle}>{display.margen}%</div>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm" style={labelStyle}>Precio de Venta</label>
                                            <div className="px-4 py-2 rounded-lg" style={{ color: "#4CAF50", backgroundColor: "#E8F5E9" }}>
                                                ${(display.precioVenta ?? 0).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Inventario */}
                                <div className="rounded-lg p-6 border" style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9" }}>
                                    <h4 className="mb-4" style={{ color: "#333333" }}>Inventario</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block mb-1 text-sm" style={labelStyle}>Stock Actual</label>
                                            <div className="px-4 py-2 rounded-lg" style={{
                                                backgroundColor: (display.stock ?? 0) < (display.stockCritico ?? 0) ? "#FFE8E8" : "#E8F5E9",
                                                color: (display.stock ?? 0) < (display.stockCritico ?? 0) ? "#d32f2f" : "#388E3C",
                                            }}>
                                                {display.stock} unidades
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm" style={labelStyle}>Stock Crítico</label>
                                            {isEditing && editForm ? (
                                                <input type="number" value={editForm.stockCritico} onChange={(e) => setField("stockCritico", parseInt(e.target.value) || 0)} className={inputCls} style={inputSty} onFocus={inputFocus} onBlur={inputBlur} />
                                            ) : (
                                                <div className="px-4 py-2 rounded-lg" style={{ backgroundColor: "#E3F2FD", color: "#2196F3" }}>
                                                    {display.stockCritico} unidades
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p style={{ color: "#666666" }}>Selecciona un artículo de la lista</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ── Componente Auxiliar SelectField para que funcione la Clasificación ── */
function SelectField({ label, value, textValue, options, onChange, disabled }) {
    return (
        <div>
            <label className="block mb-1 text-sm text-gray-500">{label}</label>
            {!disabled ? (
                <select
                    value={value !== undefined && value !== null ? String(value) : ""}
                    onChange={(e) => onChange(e.target.value)} // <── Retorna el valor como texto directamente
                    className="w-full px-4 py-2 rounded-lg border outline-none bg-white text-gray-800"
                    style={{ borderColor: "#C8E6C9" }}
                >
                    <option value="">Seleccione...</option>
                    {options && options.map((opt) => (
                        <option key={opt.value} value={String(opt.value)}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            ) : (
                <div className="px-4 py-2 text-gray-800 font-medium">
                    {textValue ?? `Código ${value}`}
                </div>
            )}
        </div>
    );
}