require('dotenv').config();          //load .env 
const express  = require('express');  
const mongoose = require('mongoose'); 
const cors     = require('cors');

const todosRouter = require('./routes/todos');

const app  = express();
const PORT = process.env.PORT || 5050;

//middleware
app.use(cors());   
app.use(express.json()); 

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

//todo
app.use('/todos', todosRouter);

app.get('/', (_req, res) => res.send('API is running!'));

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

const userRoutes = require('./routes/user');
app.use('/api/auth', userRoutes);
