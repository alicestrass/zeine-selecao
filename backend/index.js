const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./db');

const multer = require('multer');
const path = require('path');

const app = express();
const port = 3001; 

app.use(cors());
app.use(express.json()); 

app.get('/', (req, res) => {
  res.send('API do Marketplace está no ar!');
});

// ----- Upload de imagens -----
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Salva na pasta 'uploads/'
    },
    filename: function (req, file, cb) {
        // Cria um nome de arquivo único para evitar conflitos
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// -- Acesso a imagens --
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// ----- Rotas de usuário ------

// -- Rota para novo usuário --

app.post('/register', async (req, res) => {
    console.log('CORPO DA REQUISIÇÃO RECEBIDO:', req.body);
    const { nome, email, senha, telefone } = req.body;
    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        const newUser = await db.query(
            'INSERT INTO usuarios (nome, email, senha, telefone) VALUES ($1, $2, $3, $4) RETURNING id, nome, email',
            [nome, email, senhaHash, telefone]
        );

        res.status(201).json(newUser.rows[0]);
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Este e-mail já está em uso.' });
        }
        res.status(500).json({ error: 'Erro ao registrar usuário.' });
    }
});

// -- Rota para login --
app.post('/login', async (req, res) => {
    const { email, senha} = req.body;
    if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    try {
        const userResult = await db.query('SELECT * FROM Usuario WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        const user = userResult.rows[0];
        const isMatch = await bcrypt.compare(senha, user.senha);

        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        const payload = { userId: user.id, name: user.nome };
        const token = jwt.sign(payload, 'jwt_token_key', { expiresIn: '1h' });

        res.json({ token, user: {id: user.id, nome: user.nome, email: user.email} });

    } catch (error) {
        res.status(500).json({ error: 'Erro no servidor.' });
    }
});


// ----- Rotas de produtos -----

// -- Rota de criar produto --

// app.post('/produtos', authenticateToken, upload.single('imagem'), async (req, res) => {
//     const { nome, descricao, preco, status, categoria_id } = req.body;
    
//     const usuario_id = req.user.userId;

//     const imagem_url = req.file ? `/uploads/${req.file.filename}` : null;

//     if (!nome || !preco || !categoria_id) {
//         return res.status(400).json({ error: 'Nome, preço e categoria são obrigatórios.' });
//     }

//     try {
//         const query = `
//             INSERT INTO produtos (nome, descricao, preco, status, imagem_url, usuario_id, categoria_id)
//             VALUES ($1, $2, $3, $4, $5, $6, $7)
//             RETURNING *;
//         `;
        
//         const values = [nome, descricao, preco, status || 'ativo', imagem_url, usuario_id, categoria_id];
        
//         const result = await db.query(query, values);

//         res.status(201).json(result.rows[0]);
//     } catch (error) {
//         console.error('Erro ao cadastrar produto:', error);
//         res.status(500).json({ error: 'Erro interno ao cadastrar o produto.' });
//     }
// });


// -- Rota de listar produtos com filtros --
// app.get('/produtos', authenticateToken, async (req, res) => {
//     const usuario_id = req.user.userId;
//     const { search, status } = req.query; // (ex: /produtos?search=livro&status=ativo)

//     let query = `
//         SELECT p.*, c.nome as categoria_nome 
//         FROM produtos p
//         JOIN categorias c ON p.categoria_id = c.id
//         WHERE p.usuario_id = $1
//     `;
//     const values = [usuario_id];

//     if (search) {
//         values.push(`%${search}%`); 
//         query += ` AND p.nome ILIKE $${values.length}`; 
//     }

//     if (status) {
//         values.push(status);
//         query += ` AND p.status = $${values.length}`;
//     }
    
//     query += ' ORDER BY p.id DESC;'; 

//     try {
//         const result = await db.query(query, values);
//         res.status(200).json(result.rows);
//     } catch (error) {
//         console.error('Erro ao listar produtos:', error);
//         res.status(500).json({ error: 'Erro interno ao listar os produtos.' });
//     }
// });

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});