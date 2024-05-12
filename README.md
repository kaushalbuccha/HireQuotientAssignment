# Real-Time Chat Application Backend

This is the backend implementation of a real-time chat application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. The backend handles user authentication, real-time messaging, and integration with third-party APIs for language processing.

## Setup and Run Instructions

To set up and run the backend server, follow these steps:

1. Clone the repository to your local machine:
2. Navigate to the project directory:
3. Install dependencies:
4. Start the server:


The server will start running on the default port `5000`.

## API Route Descriptions

### POST /register

Registers a new user with the application.

#### Request Body

- `email` (String): User's email address.
- `password` (String): User's password.

#### Response

- `message` (String): Success message if registration is successful.

#### Logic

- Hashes the password using bcrypt before storing it in the database.
- Returns an error if the email address is already registered.

### POST /login

Logs in an existing user.

#### Request Body

- `email` (String): User's email address.
- `password` (String): User's password.

#### Response

- `token` (String): JWT token for authentication.

#### Logic

- Compares the hashed password stored in the database with the provided password using bcrypt.
- Generates a JWT token upon successful authentication.

### POST /logout

Logs out the currently authenticated user.

#### Response

- `message` (String): Success message upon logout.

#### Logic

- Updates the user's status to 'OFFLINE' in the database.

### POST /sendMessage

Sends a real-time message to another user.

#### Request Body

- `message` (String): Content of the message.
- `recipientId` (String): ID of the recipient user.

#### Response

- `message` (String): Success message if message is sent successfully.
- `error` (String): Error message if message sending fails.

#### Logic

- Checks if the sender is 'AVAILABLE'.
- Checks if the recipient is 'BUSY' and generates an appropriate response from the LLM API if needed.
- Saves the message to the MongoDB database.
- Emits the message to the recipient using Socket.io for real-time communication.


## Dependencies

- express: ^4.17.1
- socket.io: ^4.3.1
- mongoose: ^6.0.12
- jsonwebtoken: ^8.5.1
- bcrypt: ^5.0.1
- body-parser: ^1.19.0

## Contributors

- [Kaushal Buccha](https://github.com/kaushalbuccha)

