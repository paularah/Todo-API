const expect = require('expect');
const request = require('supertest');
const {app} = require('./../server');
const{Todo} = require('./../models/todo');
const {ObjectID} = require('mongodb');

const todos = [
    {
    _id: new ObjectID,
    text: 'First doc text',
    completed: false
}, 
{
_id: new ObjectID,
text: "second doc text",
completed: true
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
            expect(res.body.todo.text).toBe(text)
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
        let id = todos[0]._id.toHexString();
        request(app)
        .get(`/todos/${id}`)
        .expect(200)
        .expect((res) => {
           expect(res.body.todo.text).toBe(todos[0].text); 
        })
        .end(done);
    })

    it('should return a 404 if todo not found', (done) => {
        let testId = new ObjectID().toHexString();
        request(app)
        .get(`/todos/${testId}`)
        .expect(404)
        .end(done);
    });

    it('Shoudl return a 404 for invalid Object ID', (done) => {
        request(app)
        .get('/todos/2343')
        .expect(400)
        .end(done);
    });
});


describe('DELETE /todos:id', () => {
    it('should delete a todo from the db', (done) => {
        let id = todos[0]._id.toHexString();
        request(app)
        .delete(`/todos/${id}`)
        .expect(200)
        .expect(res => {
            expect(res.body.todo.text).toBe(todos[0].text)
        })
        .end(done); 
    });

    it('should return a 404 if todo not found', (done) => {
            let hexId = new ObjectID().toHexString();
            request(app)
            .delete(`/todos/${hexId}`)
            .expect(404)
            .end((err, res) => {
                if (err){
                    return done(err);
                }
        })
        .end(done);      
    })

    it('should return 400 for an invalid id',(done) => {
        request(app)
        .delete('/todos/23344')
        .expect(400)
        .end(done);
    })
})


describe('PATCH /todos/:id', () => {
    it('should update the todo db', (done) => {
        let text = 'welcome to test patch';
        let id = todos[0]._id.toHexString();
        request(app)
        .patch(`/todos/${id}`)
        .send({
            text:text,
            completed:true
        })
        .expect(200)
        .expect(res => {
            console.log(res)
            expect(res.body.todo.text).toBe(text)
            expect(res.body.todo.completed).toBe(true)
            expect(typeof res.body.todo.completedAt).toBe('number')

        })
        .end(done);
    })

    it('should erase the timetamp for an uncompeted todo', (done) => {
        let id = todos[1]._id.toHexString();
        request(app)
        .patch(`/todos/${id}`)
        .send({
            completed: false
        })
        .expect(200)
        .expect(res => {
            expect(res.body.todo.completed).toBe(false)
            expect(res.body.todo.completedAt).toBe(null)
        })
        .end(done);
    })

    it('should return a 404 for an not in the db', (done) => {
        let id =  new ObjectID().toHexString();
        request(app)
        .patch(`/todos/${id}`)
        .send({
            text: 'some random text',
            completed: true,
            filter: 'yes'
        })
        .expect(404)
        .end(done);
    })
});