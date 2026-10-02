import { API_BASE_URL } from '../config/confURL.js';
import { Search, Plus, Save, X, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

const API_URL = API_BASE_URL;

export function ArticulosView() {
    const [departamentos, setDepartamentos] = useState([]);
    const [rubros, setRubros] = useState([]);
    const [familias, setFamilias] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [articulos, setArticulos] = useState([]);

    const [selectedArticulo, setSelectedArticulo] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [editForm, setEditForm] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const calcularPrecioVenta = (pc, m) => pc * (1 + m / 100);

    useEffect(() => {
        fetch(`${API_URL}/articulos`)
            .then((res) => {
                if (!res.ok) throw new Error("Error al intentar conectar con el backend.");
                return res.json();
            })
            .then((data) => {
                setArticulos(data);
                if (data.length > 0) setSelectedArticulo(data[0]);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

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
            .then(data => setMarcas(data.map(m => ({ value: String(m.codMarca), label: m.descripcion }))));
    }, []);

    // ── Iniciar creación de nuevo artículo ──
    const handleNew = () => {
        const emptyForm = {
            codigo: "",
            codigoBarra: "",
            descripcion: "",
            codDepartamento: "",
            codRubro: "",
            codFamilia: "",
            marca: "",
            precioCosto: 0,
            margen: 0,
            precioVenta: 0,
            stock: 0,
            stockCritico: 0
        };
        setEditForm(emptyForm);
        setIsEditing(true);
        setIsCreating(true);
    };

    // ── Iniciar edición de artículo existente ──
    const handleEdit = () => {
        if (selectedArticulo) {
            setEditForm({ ...selectedArticulo });
            setIsEditing(true);
            setIsCreating(false);
        }
    };

    // ── Guardar (Crear o Modificar) ──
    const handleSave = () => {
        if (!editForm) return;

        const updated = {
            ...editForm,
            codigo: Number(editForm.codigo) || 0,
            precioCosto: Number(editForm.precioCosto) || 0,
            margen: Number(editForm.margen) || 0,
            precioVenta: calcularPrecioVenta(Number(editForm.precioCosto) || 0, Number(editForm.margen) || 0),
            stock: Number(editForm.stock) || 0,
            stockCritico: Number(editForm.stockCritico) || 0
        };

        const method = isCreating ? "POST" : "PUT";

        fetch(`${API_URL}/articulos`, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updated)
        })
            .then((res) => {
                if (!res.ok) throw new Error(isCreating ? "No se pudo crear el artículo." : "No se pudo actualizar el artículo.");
                return res.json();
            })
            .then((savedData) => {
                const depSel = departamentos.find(d => String(d.value) === String(editForm.codDepartamento));
                const rubroSel = rubros.find(r => String(r.value) === String(editForm.codRubro));
                const famSel = familias.find(f => String(f.value) === String(editForm.codFamilia));
                const marcaSel = marcas.find(m => String(m.value) === String(editForm.marca));

                const articuloFinal = {
                    ...updated,
                    ...(typeof savedData === "object" && savedData !== null ? savedData : {}),
                    nombreDepartamento: depSel ? depSel.label : updated.nombreDepartamento,
                    nombreRubro: rubroSel ? rubroSel.label : updated.nombreRubro,
                    nombreFamilia: famSel ? famSel.label : updated.nombreFamilia,
                    nombreMarca: marcaSel ? marcaSel.label : updated.nombreMarca
                };

                if (isCreating) {
                    setArticulos((prev) => [...prev, articuloFinal]);
                } else {
                    setArticulos((prev) =>
                        prev.map((a) => (a.idCodArticulo === updated.idCodArticulo ? articuloFinal : a))
                    );
                }

                setSelectedArticulo(articuloFinal);
                setIsEditing(false);
                setIsCreating(false);
                setEditForm(null);
            })
            .catch((err) => alert(err.message));
    };

    const handleCancel = () => {
        setIsEditing(false);
        setIsCreating(false);
        setEditForm(null);
    };

    const setField = (field, value) => {
        if (!editForm) return;
        let updated = { ...editForm, [field]: value };
        if (field === "precioCosto" || field === "margen") {
            const pc = field === "precioCosto" ? parseFloat(value) || 0 : parseFloat(updated.precioCosto) || 0;
            const m = field === "margen" ? parseFloat(value) || 0 : parseFloat(updated.margen) || 0;
            updated.precioVenta = calcularPrecioVenta(pc, m);
        }
        setEditForm(updated);
    };

    const filteredArticulos = articulos.filter((a) => {
        const textoDescripcion = a.descripcion ? String(a.descripcion).toLowerCase() : "";
        const textoCodigo = a.codigo ? String(a.codigo) : "";
        const busqueda = searchTerm.toLowerCase();
        return textoDescripcion.includes(busqueda) || textoCodigo.includes(busqueda);
    });

    const getRubrosDinamicos = (depId) => depId ? rubros.filter(r => String(r.codDepartamento) === String(depId)) : [];
    const getFamiliasDinamicas = (rubroId) => rubroId ? familias.filter(f => String(f.codRubro) === String(rubroId)) : [];

    const display = isEditing ? editForm : selectedArticulo;

    const labelStyle = { color: "#666666" };
    const fieldStyle = { color: "#333333" };
    const inputCls = "w-full px-3 py-1.5 rounded border text-xs outline-none bg-white";
    const inputSty = { borderColor: "#C8E6C9" };

    if (loading) return <div className="p-8 text-center text-gray-600">Cargando catálogo...</div>;
    if (error) return <div className="p-8 text-center text-red-600">Error: {error}</div>;

    return (
        <div className="h-full flex flex-col p-4 gap-4 overflow-y-auto" style={{ backgroundColor: "#F0F8F4" }}>
            
            {/* ── Encabezado Principal ── */}
            <div className="flex justify-between items-center bg-white px-5 py-3 rounded-lg border shadow-sm" style={{ borderColor: "#C8E6C9" }}>
                <h2 className="text-xl font-bold" style={{ color: "#333333" }}>Gestión de Artículos</h2>
                <button 
                    onClick={handleNew}
                    disabled={isEditing}
                    className="px-4 py-1.5 rounded-lg flex items-center gap-2 text-white text-xs font-medium transition-colors disabled:opacity-50" 
                    style={{ backgroundColor: "#4CAF50" }}
                >
                    <Plus size={16} /> Nuevo Artículo
                </button>
            </div>

            {/* ── SECCIÓN SUPERIOR: Listado Compacto y Scrollable Verticalmente ── */}
            <div className="bg-white p-3 rounded-lg border flex flex-col gap-2 shadow-sm" style={{ borderColor: "#C8E6C9" }}>
                <div className="flex justify-between items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={15} style={{ color: "#666666" }} />
                        <input
                            type="text"
                            placeholder="Buscar por código o nombre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 rounded border text-xs outline-none"
                            style={{ borderColor: "#C8E6C9", backgroundColor: "#F0F8F4" }}
                        />
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{filteredArticulos.length} registros</span>
                </div>

                {/* Tabla/Listado Vertical Compacto */}
                <div className="max-h-60 overflow-y-auto border rounded divide-y" style={{ borderColor: "#E0E0E0" }}>
                    {filteredArticulos.length === 0 ? (
                        <div className="p-3 text-xs text-gray-400 text-center">No se encontraron artículos</div>
                    ) : (
                        filteredArticulos.map((art) => {
                            const isSel = !isCreating && selectedArticulo?.idCodArticulo === art.idCodArticulo;
                            const isBajo = (art.stock ?? 0) < (art.stockCritico ?? 0);
                            return (
                                <div
                                    key={art.idCodArticulo ?? art.codigo}
                                    onClick={() => { 
                                        setSelectedArticulo(art); 
                                        setIsEditing(false); 
                                        setIsCreating(false);
                                        setEditForm(null); 
                                    }}
                                    className="px-3 py-1.5 flex items-center justify-between text-xs cursor-pointer transition-colors hover:bg-gray-50"
                                    style={{ backgroundColor: isSel ? "#E8F5E9" : "transparent" }}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono font-semibold text-gray-500 w-16">#{art.codigo}</span>
                                        <span className="font-medium text-gray-800">{art.descripcion}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-gray-400 text-[11px] hidden sm:inline">
                                            {art.nombreDepartamento ?? `Dep. ${art.codDepartamento}`}
                                        </span>
                                        {isBajo && (
                                            <span className="flex items-center gap-1 text-[11px] text-amber-600 font-medium">
                                                <AlertTriangle size={12} /> Stock bajo
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* ── SECCIÓN INFERIOR: Formulario Compacto de Detalles / Alta ── */}
            {display ? (
                <div className="bg-white p-4 rounded-lg border flex flex-col gap-3 shadow-sm" style={{ borderColor: "#C8E6C9" }}>
                    
                    {/* Barra de Acciones del Detalle */}
                    <div className="flex justify-between items-center border-b pb-2" style={{ borderColor: "#E0E0E0" }}>
                        <div>
                            <h3 className="text-base font-bold text-gray-800">
                                {isCreating ? "Crear Nuevo Artículo" : display.descripcion || "Sin Descripción"}
                            </h3>
                            {!isCreating && (
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] px-1.5 py-0.5 rounded font-mono" style={{ backgroundColor: "#E8F5E9", color: "#388E3C" }}>
                                        ID: {display.idCodArticulo}
                                    </span>
                                    <span className="text-[11px] text-gray-500">
                                        {display.nombreDepartamento ?? `Dep. ${display.codDepartamento}`} › {display.nombreRubro ?? `Rubro ${display.codRubro}`} › {display.nombreFamilia ?? `Fam. ${display.codFamilia}`}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div>
                            {!isEditing ? (
                                <button onClick={handleEdit} className="px-4 py-1.5 rounded text-white text-xs transition-colors" style={{ backgroundColor: "#4CAF50" }}>
                                    Editar Artículo
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button onClick={handleSave} className="px-3 py-1.5 rounded flex items-center gap-1 text-white text-xs font-medium" style={{ backgroundColor: "#4CAF50" }}>
                                        <Save size={14} /> {isCreating ? "Crear Artículo" : "Guardar Cambios"}
                                    </button>
                                    <button onClick={handleCancel} className="px-3 py-1.5 rounded flex items-center gap-1 text-xs" style={{ backgroundColor: "#E0E0E0", color: "#333333" }}>
                                        <X size={14} /> Cancelar
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Grilla Compacta de Campos */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        
                        {/* Bloque Identificación */}
                        <div>
                            <label className="block text-[11px] mb-1" style={labelStyle}>Descripción</label>
                            {isEditing && editForm ? (
                                <input type="text" value={editForm.descripcion} onChange={(e) => setField("descripcion", e.target.value)} className={inputCls} style={inputSty} placeholder="Nombre del artículo" />
                            ) : (
                                <div className="py-1 font-medium" style={fieldStyle}>{display.descripcion}</div>
                            )}
                        </div>
                        <div>
                            <label className="block text-[11px] mb-1" style={labelStyle}>Código</label>
                            {isEditing && editForm ? (
                                <input type="number" value={editForm.codigo} onChange={(e) => setField("codigo", e.target.value)} className={inputCls} style={inputSty} placeholder="Código interno" />
                            ) : (
                                <div className="py-1 font-medium" style={fieldStyle}>{display.codigo}</div>
                            )}
                        </div>
                        <div>
                            <label className="block text-[11px] mb-1" style={labelStyle}>Código de Barras</label>
                            {isEditing && editForm ? (
                                <input type="text" value={editForm.codigoBarra ?? ""} onChange={(e) => setField("codigoBarra", e.target.value)} className={inputCls} style={inputSty} placeholder="EAN / Código barra" />
                            ) : (
                                <div className="py-1 font-medium" style={fieldStyle}>{display.codigoBarra || "-"}</div>
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

                        {/* Bloque Categorización */}
                        <div>
                            <SelectField
                                label="Departamento"
                                value={isEditing && editForm ? editForm.codDepartamento : display?.codDepartamento}
                                textValue={display?.nombreDepartamento}
                                options={departamentos}
                                onChange={(v) => isEditing && setField("codDepartamento", v)}
                                disabled={!isEditing}
                            />
                        </div>
                        <div>
                            <SelectField
                                label="Rubro"
                                value={isEditing && editForm ? editForm.codRubro : display?.codRubro}
                                textValue={display?.nombreRubro}
                                options={getRubrosDinamicos(isEditing && editForm ? editForm.codDepartamento : display?.codDepartamento)}
                                onChange={(v) => isEditing && setField("codRubro", v)}
                                disabled={!isEditing || !(isEditing && editForm?.codDepartamento)}
                            />
                        </div>
                        <div>
                            <SelectField
                                label="Familia"
                                value={isEditing && editForm ? editForm.codFamilia : display?.codFamilia}
                                textValue={display?.nombreFamilia}
                                options={getFamiliasDinamicas(isEditing && editForm ? editForm.codRubro : display?.codRubro)}
                                onChange={(v) => isEditing && setField("codFamilia", v)}
                                disabled={!isEditing || !(isEditing && editForm?.codRubro)}
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] mb-1" style={labelStyle}>Precio Costo</label>
                            {isEditing && editForm ? (
                                <input type="number" step="0.01" value={editForm.precioCosto} onChange={(e) => setField("precioCosto", e.target.value)} className={inputCls} style={inputSty} />
                            ) : (
                                <div className="py-1 font-medium" style={fieldStyle}>${(display.precioCosto ?? 0).toFixed(2)}</div>
                            )}
                        </div>

                        {/* Bloque Precios & Stock */}
                        <div>
                            <label className="block text-[11px] mb-1" style={labelStyle}>Margen (%)</label>
                            {isEditing && editForm ? (
                                <input type="number" step="0.1" value={editForm.margen} onChange={(e) => setField("margen", e.target.value)} className={inputCls} style={inputSty} />
                            ) : (
                                <div className="py-1 font-medium" style={fieldStyle}>{display.margen}%</div>
                            )}
                        </div>
                        <div>
                            <label className="block text-[11px] mb-1" style={labelStyle}>Precio Venta</label>
                            <div className="py-1 font-bold text-green-600">${(display.precioVenta ?? 0).toFixed(2)}</div>
                        </div>
                        <div>
                            <label className="block text-[11px] mb-1" style={labelStyle}>Stock Crítico</label>
                            {isEditing && editForm ? (
                                <input type="number" value={editForm.stockCritico} onChange={(e) => setField("stockCritico", e.target.value)} className={inputCls} style={inputSty} />
                            ) : (
                                <div className="py-1 font-medium" style={fieldStyle}>{display.stockCritico} un.</div>
                            )}
                        </div>
                        <div>
                            <label className="block text-[11px] mb-1" style={labelStyle}>Stock Actual</label>
                            {isEditing && editForm ? (
                                <input type="number" value={editForm.stock} onChange={(e) => setField("stock", e.target.value)} className={inputCls} style={inputSty} />
                            ) : (
                                <div className="py-1 font-medium">
                                    <span className={(display.stock ?? 0) < (display.stockCritico ?? 0) ? "text-red-500 font-bold" : "text-gray-800"}>
                                        {display.stock} un.
                                    </span>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            ) : (
                <div className="bg-white p-6 rounded-lg text-center text-xs text-gray-500 border" style={{ borderColor: "#C8E6C9" }}>
                    Seleccioná un artículo del listado superior para consultar o editar sus datos, o hacé clic en "Nuevo Artículo" para dar uno de alta.
                </div>
            )}
        </div>
    );
}

function SelectField({ label, value, textValue, options, onChange, disabled }) {
    return (
        <div>
            <label className="block text-[11px] mb-1 text-gray-500">{label}</label>
            {!disabled ? (
                <select
                    value={value !== undefined && value !== null ? String(value) : ""}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-2 py-1.5 rounded border text-xs outline-none bg-white text-gray-800"
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
                <div className="py-1 font-medium text-gray-800 text-xs">
                    {textValue ?? (value ? `Código ${value}` : "-")}
                </div>
            )}
        </div>
    );
}