# Car Listing Challenge

## Project Overview
This is a full-stack web application built with **Next.js** and **Prisma ORM** that allows users to upload car inventory data via Excel files. The system processes, validates, and stores valid entries in a PostgreSQL database while generating an error report for incorrect data.

The key features of this application include:
- **Excel File Upload**: Users can upload `.xls` or `.xlsx` files containing car inventory data.
- **Data Validation & Error Handling**: The system validates required fields and ensures data integrity.
- **Error Report Generation**: Invalid entries are returned in a downloadable Excel file with an extra column indicating errors.
- **Database Storage**: Valid data is saved in a PostgreSQL database.
- **Paginated Car Listing**: Users can view stored car listings in a paginated format.
- **Docker Support**: The application can be run using Docker for an easy setup.

---

## Setup Instructions
### **Prerequisites**
Ensure you have the following installed on your machine:
- **Docker & Docker Compose** (Recommended for an easy setup)

### **Clone the repository**
```sh
git clone https://github.com/augustogehrke/car-listing-challenge.git
cd car-listing-challenge
```

### **Run the application using Docker**
```sh
docker-compose up --build
```
This command will:
- Start a **PostgreSQL** database container.
- Run Prisma migrations to set up the database schema.
- Start the **Next.js** application in development mode.


The application will be accessible at `http://localhost:3000`.

---

## Technical Decisions
### **Next.js for Full-stack Development**
- Utilized **App Router (`src/app`)** for API endpoints (`/api/uploads` and `/api/cars`).
- Server Components and React hooks ensure efficient rendering and performance.
- API routes handle file uploads, data validation, and database interactions.

### **Prisma ORM for Database Management**
- **Typed Queries & Schema Migrations**: Prisma simplifies database management and provides an easy-to-use schema.
- **PostgreSQL** was chosen for its performance, reliability, and relational capabilities. But for this challenge a NoSQL database would also work.
- **Data Integrity**: Uses constraints like `UNIQUE` for VIN numbers and ensures valid relationships between entities.

### **File Upload & Processing**
- **File processing is done in-memory**, avoiding unnecessary disk storage.
- Used `exceljs` library to parse and validate uploaded files.
- **Error handling**: Generates an error report in Excel format with an extra column detailing validation issues and error cells highlighted in red.

### **Docker for Containerized Deployment**
- **PostgreSQL and Next.js run in separate containers.**
- Prisma is pre-configured to work inside the container environment.
- `sh -c "[ -f .env ] || cp .env.example .env && npx prisma migrate deploy && npm run dev"` ensures that environment variables and migrations are correctly set up when the container starts.

---

## Assumptions Made
- **Only `.xls` and `.xlsx` files** are accepted for uploads.
- **Maximum file size is 10MB** to prevent performance issues. The validation was added to the frontend and api.
- VIN numbers are unique and used to update existing records via `upsert`. As the other values can change, it also avoids duplication of records.
- The system is expected to run **inside a Dockerized environment**.
- The UI prioritizes **functionality over design**, as per challenge instructions.
- Users may re-upload corrected error files to be processed again.
- If you import an Excel file with different columns, a message will be displayed showing the necessary headers.
- To avoid unnecessary clicks, when selecting a file, the sending is already done and if there are records with errors, the Excel file with only the data to adjust is also downloaded automatically.

---

## Future Improvements
- **Enhance UI/UX** - Improve frontend design, loaders, and styling.
- **Admin Dashboard** - Add an interface for manually editing or deleting car listings.
- **Advanced File Validation** - Implement AI-based anomaly detection for price and mileage inconsistencies.
- **Authentication & Authorization** - Add user roles for managing data (admin, editor, viewer, etc.).
- **Background Processing** - Use a queue system (e.g., BullMQ, Redis) to handle large file uploads efficiently.
- **RESTful API Enhancements** - Add sorting, filtering, and additional endpoints for better API usage.
- **Unit & Integration Testing** - Improve test coverage using Jest and React Testing Library.

---

## Technologies Used
- **Next.js** - Full-stack React framework
- **Prisma ORM** - Database management
- **PostgreSQL** - Relational database
- **Docker & Docker Compose** - Containerized deployment
- **exceljs** - Excel file parsing
- **Tailwind CSS** - Styling framework
- **TypeScript** - Static typing for maintainability
- **Eslint** - To ensure code standardization
