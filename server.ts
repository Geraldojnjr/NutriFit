import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mariadb from 'mariadb';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import multer from 'multer';
import { dbConfig } from './src/integrations/database/config.js';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8083'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Add security headers middleware
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: blob: *; " +
    "connect-src 'self' *;"
  );
  next();
});

// Configure multer for file uploads
const uploadDir = join(__dirname, 'uploads');
console.log('Upload directory path:', uploadDir);

// Ensure uploads directory exists with proper permissions
if (!fs.existsSync(uploadDir)) {
  console.log('Creating uploads directory...');
  fs.mkdirSync(uploadDir, { recursive: true, mode: 0o755 });
} else {
  console.log('Uploads directory already exists');
  // Ensure directory has correct permissions
  fs.chmodSync(uploadDir, 0o755);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Destination called with file:', file.originalname);
    if (!fs.existsSync(uploadDir)) {
      console.error('Upload directory does not exist!');
      cb(new Error('Upload directory does not exist'));
      return;
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop();
    console.log('Generated filename:', filename);
    cb(null, filename);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    console.log('File filter called with:', file.originalname, 'Type:', file.mimetype);
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      cb(new Error('Only image files are allowed!'));
      return;
    }
    cb(null, true);
  }
});

// Serve uploaded files
app.use('/uploads', express.static(uploadDir));

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Create connection pool with minimal configuration
const pool = mariadb.createPool({
  host: 'db',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'recipe_manager',
  connectionLimit: 1
});

// Test database connection on startup
const testConnection = async () => {
  let conn;
  try {
    console.log('Attempting to connect to database...');
    
    // Try pool connection
    conn = await pool.getConnection();
    console.log('Pool connection successful');
    
    // Test query
    const result = await conn.query('SELECT 1');
    console.log('Test query successful:', result);
    
    conn.release();
  } catch (err) {
    console.error('Database connection failed:', err);
    if (err instanceof Error) {
      console.error('Error details:', err.message);
      console.error('Error stack:', err.stack);
    }
  }
};

testConnection();

// File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    console.log('Upload request received');
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    
    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Verify file was actually saved
    const filePath = join(uploadDir, req.file.filename);
    if (!fs.existsSync(filePath)) {
      console.error('File was not saved to disk:', filePath);
      return res.status(500).json({ error: 'File was not saved properly' });
    }
    
    const fileUrl = `/uploads/${req.file.filename}`;
    console.log('File uploaded successfully:', fileUrl);
    return res.json({ url: fileUrl });
  } catch (err) {
    console.error('Error uploading file:', err);
    if (err instanceof Error) {
      console.error('Error details:', err.message);
      console.error('Error stack:', err.stack);
    }
    return res.status(500).json({ error: 'Failed to upload file', details: err instanceof Error ? err.message : 'Unknown error' });
  }
});

// GET /api/recipes
app.get('/api/recipes', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log('Fetching recipes from database...');
    const rows = await conn.query('SELECT * FROM recipes');
    console.log(`Found ${rows.length} recipes`);
    
    // Format recipes according to frontend's expected structure
    const recipes = rows.map(recipe => {
      try {
        // Parse ingredients and steps from JSON strings
        let ingredients = [];
        let steps = [];
        
        try {
          ingredients = typeof recipe.ingredients === 'string' 
            ? JSON.parse(recipe.ingredients.replace(/\\/g, ''))
            : recipe.ingredients;
        } catch (e) {
          console.error('Error parsing ingredients:', e);
          ingredients = [];
        }
        
        try {
          steps = typeof recipe.steps === 'string'
            ? JSON.parse(recipe.steps.replace(/\\/g, ''))
            : recipe.steps;
        } catch (e) {
          console.error('Error parsing steps:', e);
          steps = [];
        }

        console.log('Recipe image_url:', recipe.image_url);
        
        const formattedRecipe = {
          id: recipe.id,
          name: recipe.name,
          ingredients: Array.isArray(ingredients) ? ingredients : [],
          steps: Array.isArray(steps) ? steps : [],
          imageUrl: recipe.image_url || undefined,
          videoUrl: recipe.video_url || undefined,
          nutrition: {
            calories: Number(recipe.calories) || 0,
            protein: Number(recipe.protein) || 0,
            fat: Number(recipe.fat) || 0,
            carbs: Number(recipe.carbs) || 0
          },
          createdAt: new Date(recipe.created_at).getTime(),
          updatedAt: new Date(recipe.updated_at).getTime()
        };

        console.log('Formatted recipe:', formattedRecipe);
        return formattedRecipe;
      } catch (err) {
        console.error('Error parsing recipe:', err);
        console.error('Recipe data:', recipe);
        throw err;
      }
    });
    
    res.json(recipes);
  } catch (err) {
    console.error('Error fetching recipes:', err);
    if (err instanceof Error) {
      console.error('Error details:', err.message);
      console.error('Error stack:', err.stack);
    }
    res.status(500).json({ error: 'Failed to fetch recipes', details: err instanceof Error ? err.message : 'Unknown error' });
  } finally {
    if (conn) conn.release();
  }
});

// POST /api/recipes
app.post('/api/recipes', async (req, res) => {
  let conn;
  try {
    const recipe = req.body;
    console.log('Received recipe data:', recipe);
    
    // Ensure ingredients and steps are arrays and properly stringified
    const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
    const steps = Array.isArray(recipe.steps) ? recipe.steps : [];
    
    conn = await pool.getConnection();
    
    // First, insert the recipe and get the UUID
    const uuidResult = await conn.query('SELECT UUID() as uuid');
    const recipeId = uuidResult[0].uuid;
    
    // Now insert the recipe with the generated UUID
    await conn.query(
      'INSERT INTO recipes (id, name, ingredients, steps, image_url, video_url, calories, protein, fat, carbs, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [
        recipeId,
        recipe.name,
        JSON.stringify(ingredients),
        JSON.stringify(steps),
        recipe.imageUrl || null,
        recipe.videoUrl || null,
        recipe.nutrition?.calories || 0,
        recipe.nutrition?.protein || 0,
        recipe.nutrition?.fat || 0,
        recipe.nutrition?.carbs || 0
      ]
    );
    
    // Fetch the newly created recipe
    const newRecipeResult = await conn.query('SELECT * FROM recipes WHERE id = ?', [recipeId]);
    const newRecipe = newRecipeResult[0];
    
    if (!newRecipe) {
      throw new Error('Failed to fetch newly created recipe');
    }
    
    // Format the response according to frontend's expected structure
    const formattedRecipe = {
      id: newRecipe.id,
      name: newRecipe.name,
      ingredients: typeof newRecipe.ingredients === 'string' 
        ? JSON.parse(newRecipe.ingredients)
        : Array.isArray(newRecipe.ingredients) 
          ? newRecipe.ingredients 
          : [],
      steps: typeof newRecipe.steps === 'string'
        ? JSON.parse(newRecipe.steps)
        : Array.isArray(newRecipe.steps)
          ? newRecipe.steps
          : [],
      imageUrl: newRecipe.image_url || undefined,
      videoUrl: newRecipe.video_url || undefined,
      nutrition: {
        calories: Number(newRecipe.calories) || 0,
        protein: Number(newRecipe.protein) || 0,
        fat: Number(newRecipe.fat) || 0,
        carbs: Number(newRecipe.carbs) || 0
      },
      createdAt: new Date(newRecipe.created_at).getTime(),
      updatedAt: new Date(newRecipe.updated_at).getTime()
    };
    
    console.log('Recipe inserted successfully:', formattedRecipe);
    res.status(201).json(formattedRecipe);
    return;
  } catch (err) {
    console.error('Error creating recipe:', err);
    if (err instanceof Error) {
      console.error('Error details:', err.message);
      console.error('Error stack:', err.stack);
    }
    res.status(500).json({ error: 'Failed to create recipe', details: err instanceof Error ? err.message : 'Unknown error' });
    return;
  } finally {
    if (conn) conn.release();
  }
});

// PUT /api/recipes/:id
app.put('/api/recipes/:id', async (req, res) => {
  let conn;
  try {
    const { id } = req.params;
    const recipe = req.body;
    console.log(`Updating recipe ${id} with data:`, recipe);
    
    // Ensure ingredients and steps are arrays
    const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
    const steps = Array.isArray(recipe.steps) ? recipe.steps : [];
    
    conn = await pool.getConnection();
    const result = await conn.query(
      'UPDATE recipes SET name = ?, ingredients = ?, steps = ?, image_url = ?, video_url = ?, calories = ?, protein = ?, fat = ?, carbs = ?, updated_at = NOW() WHERE id = ?',
      [
        recipe.name,
        JSON.stringify(ingredients),
        JSON.stringify(steps),
        recipe.imageUrl || null,
        recipe.videoUrl || null,
        recipe.nutrition.calories || 0,
        recipe.nutrition.protein || 0,
        recipe.nutrition.fat || 0,
        recipe.nutrition.carbs || 0,
        id
      ]
    );
    
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Recipe not found' });
      return;
    }
    
    // Fetch the updated recipe
    const [updatedRecipe] = await conn.query('SELECT * FROM recipes WHERE id = ?', [id]);
    
    // Format the response according to frontend's expected structure
    const formattedRecipe = {
      id: updatedRecipe.id,
      name: updatedRecipe.name,
      ingredients: typeof updatedRecipe.ingredients === 'string' ? JSON.parse(updatedRecipe.ingredients) : updatedRecipe.ingredients,
      steps: typeof updatedRecipe.steps === 'string' ? JSON.parse(updatedRecipe.steps) : updatedRecipe.steps,
      imageUrl: updatedRecipe.image_url || undefined,
      videoUrl: updatedRecipe.video_url || undefined,
      nutrition: {
        calories: Number(updatedRecipe.calories) || 0,
        protein: Number(updatedRecipe.protein) || 0,
        fat: Number(updatedRecipe.fat) || 0,
        carbs: Number(updatedRecipe.carbs) || 0
      },
      createdAt: new Date(updatedRecipe.created_at).getTime(),
      updatedAt: new Date(updatedRecipe.updated_at).getTime()
    };
    
    console.log('Recipe updated successfully:', formattedRecipe);
    res.json(formattedRecipe);
  } catch (err) {
    console.error('Error updating recipe:', err);
    if (err instanceof Error) {
      console.error('Error details:', err.message);
      console.error('Error stack:', err.stack);
    }
    res.status(500).json({ error: 'Failed to update recipe', details: err instanceof Error ? err.message : 'Unknown error' });
  } finally {
    if (conn) conn.release();
  }
});

// DELETE /api/recipes/:id
app.delete('/api/recipes/:id', async (req, res) => {
  let conn;
  try {
    const { id } = req.params;
    console.log(`Deleting recipe ${id}`);
    
    conn = await pool.getConnection();
    const result = await conn.query('DELETE FROM recipes WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Recipe not found' });
      return;
    }
    
    console.log('Recipe deleted successfully:', result);
    res.json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    console.error('Error deleting recipe:', err);
    if (err instanceof Error) {
      console.error('Error details:', err.message);
      console.error('Error stack:', err.stack);
    }
    res.status(500).json({ error: 'Failed to delete recipe', details: err instanceof Error ? err.message : 'Unknown error' });
  } finally {
    if (conn) conn.release();
  }
});

// Serve static files from the dist directory
app.use(express.static(join(__dirname, 'dist')));

// Handle client-side routing
app.use((req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    next();
  } else {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
  }
});

// Start server
const port = process.env.PORT || 8083; // Use port 8083
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 