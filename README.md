# URL Shortener

A simple, fast, and efficient URL shortening service built with Node.js, Express.js, and SQLite. This application provides a clean interface to convert long URLs into manageable, short links and redirects users to the original URL when they access the short link.

## Features

- **Shorten URLs**: Convert any long URL into a unique, short link.
- **URL Redirection**: Accessing a short link automatically redirects to the original URL.
- **Persistent Storage**: Uses a file-based SQLite database to store URL mappings, ensuring data persists across server restarts.
- **RESTful API**: A clear and simple API for creating short links.
- **User-Friendly Frontend**: A responsive and intuitive web interface for users to shorten their URLs.
- **Organized Codebase**: The project is structured into logical modules for easy maintenance and scalability.

## API Endpoints

The application exposes the following API endpoints:

### 1\. Shorten a URL

- **Endpoint**: POST /shorten
- **Description**: Takes a long URL and returns a shortened version.

### 2\. Redirect to Original URL

- **Endpoint**: GET /:shortCode
- **Description**: Redirects the user to the original URL associated with the shortCode.
- **Response**:
  - If the shortCode exists, it returns a 302 Found redirect.
  - If the shortCode does not exist, it returns a 404 Not Found error page.
