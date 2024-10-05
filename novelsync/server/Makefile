build:
	@go build -o bin/backend cmd/main.go

test:
	@go test -v ./...

run: build
	@./bin/backend

db-start:
	docker run -d -it --rm --name novel-sync -e POSTGRES_PASSWORD=asdf -e POSTGRES_DB=novelsync -p 127.0.0.1:5434:5432/tcp postgres:15-alpine

db-stop:
	docker stop novel-sync

migration:
	@migrate create -ext sql -dir cmd/migrate/migrations $(filter-out $@,$(MAKECMDGOALS))

migrate-up:
	@go run cmd/migrate/main.go up

migrate-down:
	@go run cmd/migrate/main.go down