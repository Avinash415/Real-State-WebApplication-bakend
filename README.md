# Real-State-WebApplication Backend

This repository contains the backend code for a Real Estate Web Application. The backend is built using Node.js, Express, and Prisma. It provides APIs for user registration, residency management, booking visits, and managing favorites.

## Features

- **User Management**:
  - Register a new user
  - Book a visit to a residency
  - View all bookings
  - Cancel a booking
  - Add a residency to favorites
  - View all favorite residencies

- **Residency Management**:
  - Create a new residency
  - View all residencies
  - View details of a specific residency

## Endpoints

### User Management

- **Register a new user**:
  - **Endpoint**: `/register`
  - **Method**: `POST`
  - **Description**: Registers a new user.
  - **Handler**: `createUser`

- **Book a visit to a residency**:
  - **Endpoint**: `/bookVisit/:id`
  - **Method**: `POST`
  - **Description**: Books a visit to a residency specified by the ID.
  - **Handler**: `bookVisit`

- **View all bookings**:
  - **Endpoint**: `/allBookings`
  - **Method**: `POST`
  - **Description**: Retrieves all bookings made by the user.
  - **Handler**: `getAllBookings`

- **Cancel a booking**:
  - **Endpoint**: `/removeBooking/:id`
  - **Method**: `POST`
  - **Description**: Cancels a booking specified by the ID.
  - **Handler**: `cancelBooking`

- **Add a residency to favorites**:
  - **Endpoint**: `/toFav/:rid`
  - **Method**: `POST`
  - **Description**: Adds a residency to the user's favorites.
  - **Handler**: `toFav`

- **View all favorite residencies**:
  - **Endpoint**: `/allFav`
  - **Method**: `POST`
  - **Description**: Retrieves all favorite residencies of the user.
  - **Handler**: `getAllFavorites`

### Residency Management

- **Create a new residency**:
  - **Endpoint**: `/create`
  - **Method**: `POST`
  - **Description**: Creates a new residency.
  - **Handler**: `createResidency`

- **View all residencies**:
  - **Endpoint**: `/allresd`
  - **Method**: `GET`
  - **Description**: Retrieves all residencies.
  - **Handler**: `getAllResidencies`

- **View details of a specific residency**:
  - **Endpoint**: `/:id`
  - **Method**: `GET`
  - **Description**: Retrieves details of a residency specified by the ID.
  - **Handler**: `getResidency`

## Getting Started

### Prerequisites

- Node.js
- npm or Yarn
- PostgreSQL or another database supported by Prisma

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Avinash415/Real-State-WebApplication-backend.git
