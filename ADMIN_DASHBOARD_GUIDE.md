# Admin Dashboard System - Complete Guide

## Overview

This is a fully structured, reusable admin dashboard system built with Flask (backend) and Next.js (frontend). The system is designed to be easily adaptable for other projects with minimal changes.

## Architecture

### Backend Structure (`server/app.py`)

#### Database Models

1. **User Model** - User authentication and roles
   - Fields: id, name, email, password, status (role), is_verified, etc.
   - Relationships: Has many bookings

2. **Booking Model** - Ride bookings
   - Fields: id, user_id, pickup_location, dropoff_location, car_type, price, status, ride_date
   - Status options: pending, confirmed, completed, cancelled

3. **ContentBlock Model** - Website content management
   - Fields: id, key (unique identifier), title, content, media_url, updated_by, timestamps
   - Used for managing editable website content

#### Authentication & Authorization

- `@token_required` - Decorator for JWT authentication
- `@role_required(['admin', 'moderator'])` - Decorator for role-based access control

#### API Endpoints

**User Management:**
- `GET /api/users` - Get all users (admin/moderator only)
- `PATCH /api/users/<id>/role` - Update user role (admin only)

**Booking Management:**
- `GET /api/bookings?status=&from=&to=` - Get bookings with filters (admin/moderator only)
- `PATCH /api/bookings/<id>/status` - Update booking status (admin/moderator only)

**Content Management:**
- `GET /api/content?key=` - Get content blocks (admin/moderator only)
- `POST /api/content` - Create content block (admin only)
- `PUT /api/content/<id>` - Update content block (admin only)
- `GET /api/public/content` - Public endpoint for website content

**Dashboard Analytics:**
- `GET /api/dashboard/summary` - Get summary statistics
- `GET /api/dashboard/charts?range=7d|30d|90d` - Get chart data

### Frontend Structure (`client/app/`)

#### Component Architecture

```
Components/
├── admin/
│   ├── AdminLayout.jsx      # Main dashboard layout with tabs
│   ├── StatsCard.jsx        # Reusable stat card component
│   ├── DataTable.jsx        # Reusable data table component
│   └── ChartPanel.jsx       # Chart components (Line, Bar, Pie)
└── [other components]

dashboard/
├── page.jsx                 # Main dashboard page
└── sections/
    ├── OverviewSection.jsx  # Dashboard overview with charts
    ├── UsersSection.jsx    # User management
    ├── BookingsSection.jsx  # Booking management
    └── ContentSection.jsx  # Content editing

lib/
└── api.js                   # Centralized API client
```

#### Key Features

1. **Reusable Components**
   - `StatsCard` - Display statistics with icons and trends
   - `DataTable` - Configurable table with actions
   - `ChartPanel` - Multiple chart types (Line, Bar, Pie)

2. **API Client** (`lib/api.js`)
   - Centralized API calls
   - Automatic token handling
   - Error handling

3. **Dashboard Sections**
   - **Overview**: Statistics cards, charts, analytics
   - **Users & Roles**: User management, role assignment
   - **Bookings**: Booking management, status updates
   - **Content**: Content block editing

## Usage Guide

### Setting Up Database

The database models will be created automatically when you run the Flask app. Make sure your database is configured in `app.py`:

```python
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://user:password@host:port/database"
```

### Creating Initial Admin User

You'll need to create an admin user manually or through a script. The user's `status` field should be set to `'admin'`.

### Using Content Blocks

1. Create content blocks via the admin dashboard or API
2. Use keys like `hero_title`, `about_text`, `footer_text`, etc.
3. Retrieve content on your website using `/api/public/content?key=hero_title`

### Customizing for Other Projects

#### Backend Customization

1. **Add New Models**: Follow the pattern of existing models
   ```python
   class YourModel(db.Model):
       # Define fields
       def to_dict(self):
           # Return dictionary representation
   ```

2. **Add New Endpoints**: Use decorators for protection
   ```python
   @app.route('/api/your-endpoint', methods=['GET'])
   @role_required(['admin', 'moderator'])
   def your_endpoint(current_user):
       # Your logic
   ```

3. **Modify Dashboard Summary**: Update `/api/dashboard/summary` to include your metrics

#### Frontend Customization

1. **Add New Dashboard Section**:
   - Create `dashboard/sections/YourSection.jsx`
   - Add tab in `AdminLayout.jsx`
   - Add case in `dashboard/page.jsx`

2. **Customize Components**:
   - Modify `StatsCard`, `DataTable`, `ChartPanel` as needed
   - Add new chart types in `ChartPanel.jsx`

3. **Add API Endpoints**:
   - Add functions to `lib/api.js`
   - Use the `apiRequest` helper function

## Features Implemented

✅ **Admin Role Management**
- Admins can promote users to moderator or admin
- Role-based access control throughout the system

✅ **Booking Management**
- View all bookings
- Filter by status
- Update booking status
- Track revenue

✅ **Content Management**
- Create and edit content blocks
- Manage website content dynamically
- Track who updated content and when

✅ **Data Visualization**
- Line charts for trends over time
- Bar charts for comparisons
- Pie charts for distributions
- Multiple time ranges (7d, 30d, 90d)

✅ **Systematic Code Structure**
- Reusable components
- Centralized API client
- Consistent error handling
- Clean separation of concerns

## Security Features

- JWT token authentication
- Role-based access control
- Email verification required
- Protected API endpoints
- Input validation

## Future Enhancements

Consider adding:
- User activity logs
- Content versioning/history
- Advanced filtering and search
- Export functionality (CSV, PDF)
- Email notifications
- File upload for content media
- Multi-language support

## Testing

To test the system:

1. Start Flask server: `python server/app.py`
2. Start Next.js dev server: `cd client && npm run dev`
3. Login as admin
4. Navigate to `/dashboard`
5. Test each section:
   - Overview: View statistics and charts
   - Users: Change user roles
   - Bookings: View and update bookings
   - Content: Edit content blocks

## Notes

- The system uses PostgreSQL database
- Make sure CORS is configured for your frontend URL
- Environment variables should be set for production
- The `status` field in User model serves as the role (admin/moderator/user)

