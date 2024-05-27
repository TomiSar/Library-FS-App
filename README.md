# Spring Boot Library Application for React

## Start backend (localhost:8080) frontend folder
- mvn spring-boot:run

## Start frontend (localhost:3000) frontend folder
- npm install
- cd frontend
- npm run dev

## Database initialization
- use files in scripts folder and execute sql scripts to create sample data  
- reactlibrarydatabase
- Tables: book, checkout, history, messages, review 

## Project API endpoints (Books)
- http://localhost:8080/api/books 		(GET all books)
- http://localhost:8080/api/book/id 	(GET a single Book)