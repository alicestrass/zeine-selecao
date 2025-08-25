import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../services/api";
import { UploadCloud } from "lucide-react";

export default function NewProduct() {
    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        preco: '',
        categoria_id: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    // Busca as categorias da API
    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await api.get('/categorias');
                setCategories(response.data);
            } catch (error) {
                console.error("Erro ao buscar categorias", error);
            }
        }
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('nome', formData.nome);
        data.append('descricao', formData.descricao);
        data.append('preco', formData.preco);
        data.append('categoria_id', formData.categoria_id);
        if (imageFile) {
            data.append('imagem', imageFile);
        }

        try {
            await api.post('/produtos', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate('/produtos'); 
        } catch (error) {
            console.error("Erro ao cadastrar produto", error);
        }
    };

    return (
        <Layout>
            <div>
                <h2 className="text-3xl font-bold text-gray-800">Novo produto</h2>
                <p className="text-gray-600 mt-2">Cadastre um produto para venda no marketplace</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Coluna da Imagem */}
                <div className="lg:col-span-1">
                    <div className="w-full aspect-square bg-white rounded-lg shadow-md flex items-center justify-center border-2 border-dashed border-gray-300">
                        <label htmlFor="image-upload" className="cursor-pointer text-center">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                            ) : (
                                <div className="text-gray-500">
                                    <UploadCloud size={48} className="mx-auto" />
                                    <p className="mt-2">Selecione a imagem do produto</p>
                                </div>
                            )}
                            <input id="image-upload" type="file" className="hidden" onChange={handleImageChange} />
                        </label>
                    </div>
                </div>

                {/* Coluna dos Dados */}
                <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-6">Dados do produto</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-1">
                            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">TÍTULO</label>
                            <input type="text" name="nome" id="nome" value={formData.nome} onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500" required />
                        </div>
                        <div className="md:col-span-1">
                            <label htmlFor="preco" className="block text-sm font-medium text-gray-700">VALOR</label>
                            <input type="number" name="preco" id="preco" step="0.01" placeholder="R$ 0,00" value={formData.preco} onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500" required />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">DESCRIÇÃO</label>
                            <textarea name="descricao" id="descricao" rows="4" value={formData.descricao} onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500" required></textarea>
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="categoria_id" className="block text-sm font-medium text-gray-700">CATEGORIA</label>
                            <select name="categoria_id" id="categoria_id" value={formData.categoria_id} onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500" required>
                                <option value="">Selecione</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.nome}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end gap-4">
                        <button type="button" onClick={() => navigate('/produtos')} className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                            Cancelar
                        </button>
                        <button type="submit" className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">
                            Salvar e publicar
                        </button>
                    </div>
                </div>
            </form>
        </Layout>
    );
}