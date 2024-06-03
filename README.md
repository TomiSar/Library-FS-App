# Spring Boot Library Application for React

## Start backend (localhost:8080) frontend folder
- mvn spring-boot:run

## Start frontend (localhost:3000) frontend folder
- npm install
- cd frontend
- npm run dev

## Docs Stripe
- https://docs.stripe.com/testing#cards

## Database initialization
- use files in scripts folder and execute sql scripts to create sample data  
- reactlibrarydatabase
- Tables: book, checkout, history, messages, review 

## Project API endpoints (Books)
- http://localhost:8080/api/books 										(GET all books)
- http://localhost:8080/api/book/bookId									(GET a single Book)
- http://localhost:8080/api/books/secure/checkout?bookId 				(PUT checkout to book)
- http://localhost:8080/api/books/secure/ischeckedout/byuser?bookId		(GET  book is checked out by user)
- http://localhost:8080/api/books/secure/currentloans/count 			(GET users current loans count)
- http://localhost:8080/api/books 										(GET books current loans count)
- http://localhost:8080/api/books/secure/return?bookId 					(PUT return book)
- http://localhost:8080/api/books/secure/renew/loan?bookId 				(PUT renew loan)

## Project API endpoints (Reviews)
- http://localhost:8080/reviews 								(GET all reviews)
- http://localhost:8080/api/reviews/bookId 						(GET a single review)
- http://localhost:8080/api/reviews/search/findByBookId?bookId	(GET all reviews single book)
- http://localhost:8080/reviews									(POST new review)

## Project API endpoints (Messages)
- http://localhost:8080/messages 								(GET all reviews)