# IsaiThondar API

Express.js API with MongoDB for IsaiThondar - Ancient Music Group Event Manager

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Admin, Organizer, Member, and Guest roles
- **Event Management**: Create, manage, and join temple events
- **Expense Tracking**: Track and manage event expenses with approval workflow
- **Thevaram Collection**: Manage sacred hymns and pathigams
- **Temple Management**: Comprehensive temple information system
- **Instrument Database**: Detailed musical instrument catalog
- **File Upload**: Support for images and documents
- **Data Export**: CSV and PDF export capabilities
- **Search & Filtering**: Advanced search and filtering options
- **Pagination**: Efficient data pagination
- **Validation**: Comprehensive input validation
- **Security**: Rate limiting, CORS, and security headers

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone and setup**
   ```bash
   cd server
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/isai-thondar
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   CORS_ORIGIN=http://localhost:5173
   ```

3. **Start MongoDB**
   ```bash
   # Using MongoDB service
   sudo systemctl start mongod
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

4. **Seed Database (Optional)**
   ```bash
   npm run seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)
- `PUT /api/users/:id/status` - Update user status (Admin only)

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event (Admin/Organizer)
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/:id/join` - Join event
- `POST /api/events/:id/leave` - Leave event
- `GET /api/events/my/events` - Get user's events

### Expenses
- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/:id` - Get expense by ID
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `PUT /api/expenses/:id/reimburse` - Mark as reimbursed (Admin)
- `PUT /api/expenses/:id/approve` - Approve expense (Admin/Organizer)
- `GET /api/expenses/summary/:eventId` - Get expense summary

### Thevaram
- `GET /api/thevaram` - Get all pathigams
- `GET /api/thevaram/:id` - Get pathigam by ID
- `POST /api/thevaram` - Create pathigam (Admin/Organizer)
- `PUT /api/thevaram/:id` - Update pathigam
- `DELETE /api/thevaram/:id` - Delete pathigam
- `POST /api/thevaram/:id/like` - Toggle like
- `POST /api/thevaram/:id/comment` - Add comment
- `GET /api/thevaram/popular` - Get popular pathigams

### Temples
- `GET /api/temples` - Get all temples
- `GET /api/temples/:id` - Get temple by ID
- `POST /api/temples` - Create temple
- `PUT /api/temples/:id` - Update temple
- `DELETE /api/temples/:id` - Delete temple (Admin)
- `GET /api/temples/nearby` - Find nearby temples

### Instruments
- `GET /api/instruments` - Get all instruments
- `GET /api/instruments/:id` - Get instrument by ID
- `POST /api/instruments` - Create instrument (Admin)
- `PUT /api/instruments/:id` - Update instrument
- `DELETE /api/instruments/:id` - Delete instrument (Admin)
- `GET /api/instruments/category/:category` - Get by category
- `GET /api/instruments/popular` - Get popular instruments

### File Upload
- `POST /api/upload/image` - Upload image
- `POST /api/upload/document` - Upload document
- `POST /api/upload/audio` - Upload audio file

## Database Models

### User
- Authentication and profile information
- Role-based access control
- Temple association
- Status management

### Event
- Event details and scheduling
- Member management
- Instrument requirements
- Food arrangements
- Thevaram pathigam associations

### Expense
- Expense tracking and categorization
- Approval workflow
- Reimbursement management
- Receipt attachments

### ThevaramPathigam
- Sacred hymn content in multiple languages
- Audio attachments
- Like and comment system
- Verification workflow

### Temple
- Comprehensive temple information
- Location and contact details
- Deity information
- Facilities and timings

### Instrument
- Detailed instrument specifications
- Cultural significance
- Audio and video samples
- Availability for rent/sale

## Authentication & Authorization

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Roles
- **Admin**: Full system access
- **Organizer**: Can create/manage events and expenses
- **Member**: Can join events and add expenses
- **Guest**: Read-only access to public content

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```

## Validation

All endpoints include comprehensive input validation using express-validator. Validation errors are returned with detailed field-specific messages.

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers
- **Input Validation**: Comprehensive validation and sanitization
- **Password Hashing**: bcrypt with salt rounds
- **JWT Security**: Secure token generation and validation

## Development

### Running Tests
```bash
npm test
```

### Code Formatting
```bash
npm run format
```

### Database Seeding
```bash
npm run seed
```

This creates sample data including:
- 4 users with different roles
- 3 temples
- 2 events
- 3 expenses
- 2 Thevaram pathigams
- 3 instruments

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/isai-thondar |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | JWT expiration time | 7d |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:5173 |

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure MongoDB Atlas or production MongoDB
4. Set up proper CORS origins
5. Configure email service for notifications
6. Set up file storage (Cloudinary, AWS S3, etc.)
7. Configure reverse proxy (nginx)
8. Set up SSL certificates
9. Configure monitoring and logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details