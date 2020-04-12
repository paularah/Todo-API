const expect = require('expect');
const request = require('supertest');
const {app} = require('./../server');
const{Todo} = require('./../models/todo');
const {ObjectID} = require('mongodb');

const todos = [
    {
    _id: new ObjectID,
    text: 'First doc text'
}, 
{
_id: new ObjectID,
text: "second doc text"
}
];

beforeEach((done) => {
    Todo.deleteMany({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
})


describe('POST /todos', () =>{
    it('should create a new todo doc', (done) => {
        let text = 'testing todo text';
        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res) => {
            console.log(res);
            expect(res.body.text).toBe(text)
        })
        .end((err, res) => {
            if (err){
                return done(err)
            }
            Todo.find({text}).then((todos) =>{
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch(e => done(e));
        })
    })
})

describe('GET / todos', () =>{
    it('should get all todos', (done) => {
       request(app)
       .get('/todos')
       .expect(200)
       .expect((res) => {
           expect(res.body.todos.length).toBe(2)
       })
       .end(done);
    })
})

describe('GET /todos/id', () => {
    it('should return the doc', (done) => {

    })
})