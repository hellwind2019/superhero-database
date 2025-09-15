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
## Database Schema

### Table: `hero_images`

| Column     | Type    | Description                |
|------------|---------|----------------------------|
| id         | SERIAL  | Primary key                |
| hero_id    | INT     | References hero (required) |
| image_url  | TEXT    | URL to the image           |
| caption    | TEXT    | Optional image caption     |

### Table: `superheroes`

| Column              | Type    | Description                        |
|---------------------|---------|------------------------------------|
| id                  | SERIAL  | Primary key                        |
| nickname            | TEXT    | Superhero nickname (required)      |
| real_name           | TEXT    | Real name of the superhero         |
| origin_description  | TEXT    | Description of origin              |
| superpowers         | TEXT    | List or description of superpowers |
| catch_phrase        | TEXT    | Catch phrase                       |

## Assumptions

- The PostgreSQL database and tables (`hero_images`, `superheroes`) are already created and accessible.
- The `.env` file contains valid credentials for both PostgreSQL and Firebase.
- The ServiceAccound .json file is provided.

