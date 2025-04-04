.PHONY: install lint test dev

install:
	npm install -g concurrently
	cd feels-like-backend && npm install
	cd feels-like-frontend && npm install

lint:
	cd feels-like-backend && npm run lint
	cd feels-like-frontend && npm run lint

clean:
	cd feels-like-backend && npm run clean

test:
	cd feels-like-backend && npm run test

db:
	docker compose up -d db

dev: db
	npx concurrently -k "cd feels-like-backend && npm run dev" "cd feels-like-frontend && npm run dev"
