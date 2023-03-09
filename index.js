const express = require('express'); 
const port = 8080;
const bodyParser = require('body-parser');
const connection = require('./database/database');
const Pergunta = require('./database/Pergunta');
const Resposta = require('./database/Resposta')

connection
    .authenticate()
    .then(() => {
        console.log('Conexão feita com banco de dados.'); 
    })
    .catch((error) => {
        console.log('Ocorreu um erro: '+ error);
    })

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())


app.get('/', async (req, res) => {

    // Pergunta.findAll({ raw: true, order: [
    //     ['id', 'DESC']
    // ] }).then((perguntas) => {
    //     console.log(perguntas);
    //     Resposta.count({
    //         where:{perguntaId: 51}
    //     }).then((count) =>{
    //         console.log(count);
    //         res.render('index',{
    //             perguntas: perguntas,
    //             count: count
    //         })
    //     })
      
    // })

    const perguntas = await Pergunta.findAll({
        raw: true, 
        order:[
            ['id', 'DESC']
        ]
    });

    const perguntaUser = await Pergunta.findAll({includes: Pergunta})
    // const respostaUser = await Resposta.findAll({where: {perguntaId: perguntaUser.id }})
    // const count = await respostaUser.count(id)

    console.log(perguntaUser);
    // console.log(count);

    res.render('index',{
        perguntas: perguntas,
        count: 1
    })
   
});

app.get('/perguntar', (req, res) => {
    const { create } = req.query;
    res.render('perguntar',{create: create})
});

app.post('/salvarpergunta', (req, res) => {
    const { titulo,  descricao } = req.body
    let create = req.body.create = false

    if (!titulo && !descricao) {
        res.redirect('/perguntar?create='+create)
        return
    }

    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then( () => {
        create = !create;
        res.redirect('/perguntar?create='+create)
    })
});

app.get('/pergunta/:id', (req, res) => {
    const { id } = req.params;
    Pergunta.findOne({
        where: {id: id}
    }).then( pergunta  => {

        if (!pergunta) {
            res.redirect('/');
          
        }

        Resposta.findAll({
            where: {perguntaId: pergunta.id},
            order: [
                ['id', 'DESC']
            ]
        }).then((respostas)=> {
            res.render('pergunta',{
                pergunta: pergunta,
                respostas: respostas
            });
        })

        
    })
})

app.post('/responder', (req, res) => {
    const { corpo, pergunta:perguntaId } = req.body

    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(()=>{
        res.redirect('/pergunta/'+perguntaId)
    })
})


app.listen(port, () => {
    console.log(`App rodando na porta: ${port}`);
});