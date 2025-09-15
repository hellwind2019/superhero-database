# Superhero Database Backend

This is the backend for the Superhero Database project. It is built with Node.js, Express, PostgreSQL, and Firebase Storage for image handling.

## How to Run

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Configure environment variables:**
   - Create a `.env` file in the project root (if not present).
   - Add your PostgreSQL connection string:
     ```
     DATABASE_URL=postgresql://<user>:<password>@<host>/<dbname>
     ```
   - Add any other required environment variables (e.g., Firebase credentials).

3. **Set up the database:**
   - Ensure your PostgreSQL database is running and accessible.
   - Create the necessary tables (see assumptions below).

4. **Run the server:**
   ```sh
   npm start
   ```
   or, for development with auto-reload:
   ```sh
   npm run dev
   ```



