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
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// -- Acesso a imagens --
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ----- Middleware de autenticação -----
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, 'jwt_token_key', (err, user) => {
        if (err) {
            console.error('Erro na verificação do token:', err);
            return res.sendStatus(403);
        }
        req.user = user; 
        next();
    });
};


// ----- Rotas de usuário ------

// -- Rota para novo usuário --

app.post('/register', async (req, res) => {
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
    const { email, senha } = req.body;
    if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    try {
        const userResult = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
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

        res.json({ token, user: { id: user.id, nome: user.nome, email: user.email } });

    } catch (error) {
        res.status(500).json({ error: 'Erro no servidor.' });
    }
});


// ----- Rotas de produtos -----

// -- Rota de criar produto --

app.post('/produtos', authenticateToken, upload.single('imagem'), async (req, res) => {
    const { nome, descricao, preco, status, categoria_id } = req.body;

    const usuario_id = req.user.userId;

    const imagem_url = req.file ? `/uploads/${req.file.filename}` : null;

    if (!nome || !preco || !categoria_id) {
        return res.status(400).json({ error: 'Nome, preço e categoria são obrigatórios.' });
    }

    try {
        const query = `
             INSERT INTO produtos (nome, descricao, preco, status, imagem_url, usuario_id, categoria_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *;
         `;

        const values = [nome, descricao, preco, status || 'ativo', imagem_url, usuario_id, categoria_id];

        const result = await db.query(query, values);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao cadastrar produto:', error);
        res.status(500).json({ error: 'Erro interno ao cadastrar o produto.' });
    }
});


// -- Rota de listar produtos com filtros --
app.get('/produtos', authenticateToken, async (req, res) => {
    const usuario_id = req.user.userId;
    const { search, status } = req.query; 

    let query = `
         SELECT p.*, c.nome as categoria_nome 
         FROM produtos p
         JOIN categorias c ON p.categoria_id = c.id
         WHERE p.usuario_id = $1
     `;
    const values = [usuario_id];

    if (search) {
        values.push(`%${search}%`);
        query += ` AND p.nome ILIKE $${values.length}`;
    }

    if (status) {
        values.push(status);
        query += ` AND p.status = $${values.length}`;
    }

    query += ' ORDER BY p.id DESC;';

    try {
        const result = await db.query(query, values);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erro ao listar produtos:', error);
        res.status(500).json({ error: 'Erro interno ao listar os produtos.' });
    }
});

// -- Rota de buscar produto por ID --
app.get('/produtos/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const usuario_id = req.user.userId;

    try {
        const query = `
            SELECT * FROM produtos WHERE id = $1 AND usuario_id = $2;
        `;
        const result = await db.query(query, [id, usuario_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Produto não encontrado ou não pertence a este usuário.' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        res.status(500).json({ error: 'Erro interno ao buscar o produto.' });
    }
});


// -- Rota de editar --
app.put('/produtos/:id', authenticateToken, upload.single('imagem'), async (req, res) => {
    const { id } = req.params;
    const { nome, descricao, preco, status, categoria_id } = req.body;
    const usuario_id = req.user.userId;

    try {
        const productCheck = await db.query('SELECT imagem_url FROM produtos WHERE id = $1 AND usuario_id = $2', [id, usuario_id]);
        if (productCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Produto não encontrado ou não pertence a este usuário.' });
        }

        const imagem_url = req.file ? `/uploads/${req.file.filename}` : productCheck.rows[0].imagem_url;

        const query = `
            UPDATE produtos 
            SET nome = $1, descricao = $2, preco = $3, status = $4, categoria_id = $5, imagem_url = $6
            WHERE id = $7 AND usuario_id = $8
            RETURNING *;
        `;
        const values = [nome, descricao, preco, status, categoria_id, imagem_url, id, usuario_id];

        const result = await db.query(query, values);

        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        res.status(500).json({ error: 'Erro interno ao atualizar o produto.' });
    }
});


// -- Rota para deletar produto --
app.delete('/produtos/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const usuario_id = req.user.userId;

    try {
        const query = `
            DELETE FROM produtos WHERE id = $1 AND usuario_id = $2 RETURNING *;
        `;
        const result = await db.query(query, [id, usuario_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Produto não encontrado ou não pertence a este usuário.' });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
        res.status(500).json({ error: 'Erro interno ao excluir o produto.' });
    }
});

// -- Rota de categorias --
app.get('/categorias', authenticateToken, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM categorias ORDER BY nome ASC');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar categorias.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});