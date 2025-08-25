import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";
import api from "../services/api";
import { Search } from "lucide-react";

export default function Dashboard() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [status, setStatus] = useState("");

    async function fetchProducts() {
        try {
            const response = await api.get('/produtos', {
                params: { search: searchTerm, status: status }
            });
            setProducts(response.data);
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
        }
    }

    useEffect(() => {
        fetchProducts();
    }, []); 

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        fetchProducts(); 
    };

    return (
        <Layout>
            <div>
                <h2 className="text-3xl font-bold text-gray-800">Seus produtos</h2>
                <p className="text-gray-600 mt-2">Acesse e gerencie a sua lista de produtos à venda</p>
            </div>

            <div className="mt-8 flex gap-8">
                {/* Formulário de Filtro */}
                <aside className="w-1/4">
                    <form onSubmit={handleFilterSubmit} className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-4">Filtrar</h3>
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Pesquisar"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                        <div className="relative mb-4">
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md appearance-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="">Status</option>
                                <option value="ativo">Ativo</option>
                                <option value="inativo">Inativo</option>
                                <option value="vendido">Vendido</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 transition">
                            Aplicar filtro
                        </button>
                    </form>
                </aside>

                {/* Grade de Produtos */}
                <main className="w-3/4">
                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <p>Nenhum produto encontrado.</p>
                        </div>
                    )}
                </main>
            </div>
        </Layout>
    );
}