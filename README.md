# Library Management system

### Key Features



- Registration and authentication (Sign-up and Login).


#### **Role-based access**
     - **Admin**
     - **Librarian**
     - **User**

#### **Book Management**
   - Categorization by genre (e.g., Fiction, Science Fiction, Romance, etc.).
   - Real-time availability status (Available or Not Available).
   - Track book details (e.g., author, genre, ISBN, publication year).

#### **Borrowing System**
   - Users can borrow books.
   - Track borrowing details:
     - Borrow date, due date, return date.
     - Return status.
     - Calculate and manage late fine amounts for overdue returns.

#### **Reservation System**
   - Users can reserve books that are currently not available.
   - Track reservation status (Collected or Not Collected).
   - Automatically notify users when a reserved book becomes available.

#### **Cart Functionality**
   - Allow users to add books to a cart for borrowing or reservation.

#### **Fine Management**
   - Track and record late fines for overdue books.
   - Users can view and pay fines.

#### **Notification System**
   - Generate and send notifications for:
     - Approaching due dates for borrowed books.
     - Outstanding fines.
     - Availability of reserved books.
   - Notifications marked as read/unread.

#### **User Analytics**
   - Allow users to track their book-reading history:
     - Books read.
     - Finished or unfinished status.
     - Ratings and reviews.

---

#### For Users:
- **Search and browse books** by title, author, genre, or ISBN.
- Add books to a **personal cart** for later actions.
- Borrow or reserve books with clearly displayed due dates and statuses.
- View and settle fines directly through the system.
- Receive **real-time notifications**.

#### For Librarians:
- Manage book inventories (add/edit/delete).
- Oversee borrowing and reservations.
- Process returned books and resolve fines.

#### For Admins:
- Manage user accounts (CRUD operations).
- Add librarian's and other admin's
- Define and update roles and privileges.

---

#### UI design 
##### For users
- Registration and login page
  - Registration: `name, email, phone_number, role, password, confirm_password`
  - Login: `email, password`
- Dashboard page
  - Current books that user is reading
  - Books that the user has read
  - Recommended books
- Books page
  - List of books categorized by genre
  - Search functionality for book
- When the user clicks on a book
  - They can view the book's information: `title, author, genre, publication year, status, description, cover_image, borrowing inforation, reservation information, cart information, booksread (reviews) information`
  - They can add the book to a cart or remove it
  - They can reserve the book for borrowing or cancel reservation
  - They can borrow the book or return it
  - They can make a review on the book
- If they click to borrow or return the book
  - A qr code will appear that the librarian can scan to verify the borrowed book
- Profile page
  - View and update profile information
- Notifications page
  - List of notifications for the user
  - Two columns one with read the the other wuth unread
    - When the user clicks on a notification it is automatically marked as read
- Borrow page
  - A list of books that the user has borrowed
    - Current borrows (List of books that user has not returned)
    - Past borrows (List of books that the user has returned)
  - For each book also display the information like the due_date, and the fine (0 if the due_date has not passed) and a button to pay the fine
  - At the top of the page there will be a total fine with a button to pay the fine
    - If the user clicks the button to pay the fine then a list of borrowed books with fine will appear and the user can select how much books (and in respect fine) the user wants to pay the fine for.
  - Cart page
    - List of books that the user has carted 
    - A search bar to search for books in the carted page
    - And also a button to remove the book from the cart
  - Reservation page
    - List of books that the user has reserved
    - Also show the information if the the book is available or not
    - Also a button to remove the book from the reservation list
    - And a search bar to search for books from the reservation list
##### Librarians
- Everything for user's
- Also a page that can scan the qr code to approve a book for borrowing or returning
- Another page to view all the user's info (but they cannot update or delete a user's info, just view)
  - A search bar to search for the user's info
  - And when the person click on a user the full information of the user comes out
- Adding, updating or deleting a book
- Get a list of user's who have borrowed a book (when the book is clicked)
##### Admin
- Everything for user's and librarians
- A page that can add a user or librarian
- The same page that can view user's info (just like in librarian) but can also update or delete a user's info