import app from "./app.js";
import responsavelRouter from './routes/responsavelRouter.js';

const PORT = process.env.PORT || 3334;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use('/api', responsavelRouter);
