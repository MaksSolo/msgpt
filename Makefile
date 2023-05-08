build:
	docker build -t msbot .
run:
	docker run -d -p 3000:3000 --name msbot --rm msbot