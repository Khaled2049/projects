Commands:

1. To run in Docker:
   docker run --name basic-postgres --rm -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=4y7sV96vA9wv46VR -e PGDATA=/var/lib/postgresql/data/pgdata -v /tmp:/var/lib/postgresql/data -p 5432:5432 -it postgres:14.1-alpine

2. Create a migrations folder and run this to create the up down files.
   migrate create -ext sql -dir migrations create_books_table

3. migrate -path migrations -database "postgresql://postgres:4y7sV96vA9wv46VR@localhost:5432/novelsync?sslmode=disable" -verbose up
