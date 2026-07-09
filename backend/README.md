Start with creating env
```bash
cp .env.example .env
```

then run the db on docker
```bash
docker-compose up
```

Then run migrations up
```bash
npm run migrate:up
```

Then start the server
```bash
npm run start
```

Then you can access the server at http://localhost:3000