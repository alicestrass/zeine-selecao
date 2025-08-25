import { Link } from 'react-router-dom';

const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(price);
};

const getStatusStyles = (status) => {
    switch (status) {
        case 'vendido':
            return 'bg-green-100 text-green-800';
        case 'desativado':
            return 'bg-gray-100 text-gray-800';
        case 'ativo':
        default:
            return 'bg-blue-100 text-blue-800';
    }
};


export default function ProductCard({ product }) {
    return (
        <Link to={`/produtos/editar/${product.id}`}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden group transition-transform transform hover:-translate-y-1">
                <div className="relative">
                    <img
                        src={`http://localhost:3001${product.imagem_url}`}
                        alt={product.nome}
                        className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusStyles(product.status)}`}>
                            {product.status.toUpperCase()}
                        </span>
                        <span className="px-2 py-1 text-xs font-bold rounded-full bg-gray-600 text-white">
                            {product.categoria_nome.toUpperCase()}
                        </span>
                    </div>
                </div>
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">{product.nome}</h3>
                    <p className="text-sm text-gray-600 mt-1 h-10 overflow-hidden">{product.descricao}</p>
                    <p className="text-xl font-bold text-gray-900 mt-4">{formatPrice(product.preco)}</p>
                </div>
            </div>
        </Link>
    );
}