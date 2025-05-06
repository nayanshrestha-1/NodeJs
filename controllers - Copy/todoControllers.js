var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// Connect to the database
mongoose.connect('mongodb+srv://nayanshrestha98:iRIHX1xAJwZZOAbi@cluster0.gqrvilk.mongodb.net/todo');

// Create a schema - blueprint
var todoSchema = new mongoose.Schema({
    item: String
});

var Todo = mongoose.model('Todo', todoSchema);

var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = function(app){

    // GET route to fetch todos from MongoDB
    app.get('/todo', async function(req, res) {
        try {
            const todos = await Todo.find({}); // Fetch data from MongoDB
            res.render('todo', { todos: todos });
        } catch (err) {
            console.error(err);
            res.status(500).send('Error fetching todos.');
        }
    });

    // POST route to add a new todo item to MongoDB
    app.post('/todo', urlencodedParser, async function(req, res){
        try {
            const newTodo = new Todo(req.body); // Create a new Todo instance
            await newTodo.save(); // Save it to MongoDB
            res.redirect('/todo'); // Redirect after saving
        } catch (err) {
            console.error(err);
            res.status(500).send('Error saving todo item.');
        }
    });

    // DELETE route to remove a todo item from MongoDB
    app.delete('/todo/:item', async function(req, res){
        try {
            // Delete item from MongoDB
            const result = await Todo.deleteOne({ item: req.params.item.replace(/-/g, ' ') });
            res.json(result);
        } catch (err) {
            console.error(err);
            res.status(500).send('Error deleting todo item.');
        }
    });
};
