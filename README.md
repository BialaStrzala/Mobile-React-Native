# BookTracker

A mobile book tracking application built with React Native and Expo, featuring user authentication, book management, and reading progress tracking.

## Tech Stack

- **Framework**: React Native with Expo SDK 54
- **Backend**: Supabase (PostgreSQL database + real-time features)
- **Authentication**: Supabase Auth
- **Language**: TypeScript

## Features

### Authentication
- User registration and login
- Secure authentication with Supabase
- Persistent login sessions

### Book Management
- **Add New Books**: Create new book entries with title and author
- **Browse All Books**: View all books in the database with filtering options
- **Book Details**: View detailed information about any book
- **Personal Book List**: Manage your own reading list

### Reading Progress Tracking
- **Status Management**: Track books as Planning, Reading, Finished, or Discontinued
- **Rating System**: Rate books on a 5-star scale
- **Notes**: Add personal notes for each book
- **Statistics**: View reading statistics and progress

### User Interface
- **Tabbed Navigation**: Home, My Books, Profile, All Books tabs
- **Drawer Navigation**: Quick access to main sections
- **Responsive Grid**: Books displayed in a clean 3-column grid layout
- **Filtering**: Sort books by Title, Author, or Newest
- **Pagination**: Load more books functionality

### Profile & Settings
- **Reading Statistics**: Total books, books by status, average ratings
- **User Profile**: View account information and reading history
- **Settings**: Update username, email, and password
- **Latest Book Display**: Showcase most recently added book