## Configuration

The server is configured with these credentials:

```javascript
Application ID: "Jn2nFHOhB493ymQJuBrN75XlQyjd1NvIbpULEnsp"
JavaScript Key: "wJk6F64XHBPRN7Qc1udFlcxBbOcw8UAUCilVXFYC"
Server URL: "https://parseapi.back4app.com/"
```

## API Endpoints

### Authentication

- `/login` - POST: User login
- `/register` - POST: User registration
- `/logout` - POST: User logout

### Posts

- `/posts` - GET: Fetch posts feed
- `/posts` - POST: Create new post
- `/posts/:id` - GET: Get single post
- `/posts/:id/like` - POST: Toggle post like
- `/posts/:id/comment` - POST: Add comment

## Running the Server

### Development Mode

1. Install dependencies:

```bash
npm install
```

2. Run the server:

```bash
npm run dev
```
