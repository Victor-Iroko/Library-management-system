import { notificationType, reservationStatusEnum } from "@prisma/client";
import { bookClient, booksReadClient, borrowClient, cartClient, isbnClient, notificationClient, reservationClient, userClient } from "./client";




// const users = await userClient.createMany({
//     data: [
//         { name: 'John Doe', email: 'john.doe@example.com', password: 'password123', role: 'USER', phone_number: '1234567890' },
//         { name: 'Jane Smith', email: 'jane.smith@example.com', password: 'password456', role: 'USER' },
//         { name: 'Libby Brooks', email: 'libby.brooks@example.com', password: 'password789', role: 'LIBRARIAN' },
//         { name: 'Adam Watson', email: 'adam.watson@example.com', password: 'admin123', role: 'ADMIN' },
//         { name: 'Nancy Drew', email: 'nancy.drew@example.com', password: 'password000', role: 'USER', phone_number: '9876543210' },
//         // Additional users
//         { name: 'Harry Potter', email: 'harry.potter@example.com', password: 'magic123', role: 'USER' },
//         { name: 'Ron Weasley', email: 'ron.weasley@example.com', password: 'chess123', role: 'USER' },
//         { name: 'Hermione Granger', email: 'hermione.granger@example.com', password: 'books123', role: 'LIBRARIAN' },
//         { name: 'Albus Dumbledore', email: 'albus.dumbledore@example.com', password: 'elder123', role: 'ADMIN' },
//         { name: 'Draco Malfoy', email: 'draco.malfoy@example.com', password: 'pureblood123', role: 'USER' },
//     ],
// });

// console.log(users);

// messed up didn't hash the password the first time had to hash it now
// const dbUsers = await userClient.findMany();
// for (const user of dbUsers) {
//     const result = await userClient.update({where: {id: user.id}, data: {password: user.password}})
//     console.log(result);
    
// }






// const books = await bookClient.createMany({
//     data: [
//         { title: '1984', author: 'George Orwell', genre: 'Fiction', publication_year: new Date('1949-06-08'), description: 'A dystopian novel', status: 'Available' },
//         { title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Fiction', publication_year: new Date('1960-07-11'), description: 'A novel about racism and justice', status: 'Not_available' },
//         { title: 'A Brief History of Time', author: 'Stephen Hawking', genre: 'Non_Fiction', publication_year: new Date('1988-01-01'), description: 'Exploration of the cosmos' },
//         { title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy', publication_year: new Date('1937-09-21'), description: 'A prequel to The Lord of the Rings' },
//         { title: 'The Catcher in the Rye', author: 'J.D. Salinger', genre: 'Fiction', publication_year: new Date('1951-07-16'), description: 'The story of Holden Caulfield', status: 'Available' },
//         // Additional books
//         { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Fiction', publication_year: new Date('1925-04-10'), description: 'A critique of the American Dream' },
//         { title: 'Brave New World', author: 'Aldous Huxley', genre: 'Science_Fiction', publication_year: new Date('1932-08-01'), description: 'A dystopian society', status: 'Not_available' },
//         { title: 'The Art of War', author: 'Sun Tzu', genre: 'Non_Fiction', publication_year: new Date('500-01-01'), description: 'Ancient military treatise' },
//         { title: 'Pride and Prejudice', author: 'Jane Austen', genre: 'Fiction', publication_year: new Date('1813-01-28'), description: 'A romantic novel' },
//         { title: 'The Alchemist', author: 'Paulo Coelho', genre: 'Fiction', publication_year: new Date('1988-01-01'), description: 'A journey of self-discovery', status: 'Available' },
//     ],
// });

// console.log(books);


// const bookIds = await bookClient.findMany({select: {id: true}})
// const isbns = [
//     '978-3-16-148470',
//     '978-3-16-148471',
//     '978-3-16-148472',
//     '978-3-16-148473',
//     '978-3-16-148474',
//     '978-3-16-148475',
//     '978-3-16-148476',
//     '978-3-16-148477',
//     '978-3-16-148478',
//     '978-3-16-148479',
//   ];
// const data = bookIds.slice(0, isbns.length).map((book, index) => ({
//         isbn: isbns[index],
//         bookId: book.id,
//     }));
// const isbnEntries = await isbnClient.createMany({data});
// console.log(isbnEntries)



// function generateRandomDates(count, startDate, endDate) {
//     const start = new Date(startDate).getTime();
//     const end = new Date(endDate).getTime();

//     const dates = Array.from({ length: count }, () => {
//         const randomTime = Math.floor(Math.random() * (end - start + 1)) + start;
//         return new Date(randomTime).toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'
//     });

//     return dates;
// }

// function generateRandomIntegers(count, min, max) {
//     return Array.from({ length: count }, () =>
//         Math.floor(Math.random() * (max - min + 1)) + min
//     );
// }


// const userIds = (await userClient.findMany({select: {id: true}})).map(user => user.id)
// const bookIds = (await bookClient.findMany({select: {id: true}})).map(book => book.id)
// const due_date = generateRandomDates(10, "2020-01-01", "2025-12-31");
// const randomFineAmounts = generateRandomIntegers(10, 1000, 5000);
// const returned = [true, false]

// const data = Array.from({ length: 10 }, (_, i) => ({
//     user_id: userIds[i % userIds.length], // Rotate through user IDs (avoids out-of-bounds)
//     book_id: bookIds[Math.floor(Math.random() * bookIds.length)], // Random book ID
//     due_date: new Date(due_date[i]), // Random due date
//     fine_amount: randomFineAmounts[i], // Random fine amount
//     returned: returned[Math.floor(Math.random() * bookIds.length)],
// }));

// // Step 4: Insert the borrowings
// const borrowings = await borrowClient.createMany({data});

// console.log("Generated borrowings:", borrowings);



// const status = [...Object.values(reservationStatusEnum)]
// const userIds = (await userClient.findMany({select: {id: true}})).map(user => user.id)
// const bookIds = (await bookClient.findMany({select: {id: true}})).map(book => book.id)
// const data = Array.from({ length: 10 }, (_, i) => ({
//     user_id: userIds[i % userIds.length], // Rotate through user IDs (avoids out-of-bounds)
//     book_id: bookIds[Math.floor(Math.random() * bookIds.length)], // Random book ID
//     reservation_status: status[Math.floor(Math.random() * status.length)]
// }));
// const reservations = await reservationClient.createMany({data})
// console.log(reservations);




// const userIds = (await userClient.findMany({select: {id: true}})).map(user => user.id)
// const bookIds = (await bookClient.findMany({select: {id: true}})).map(book => book.id)
// const data = Array.from({ length: 10 }, (_, i) => ({
//     user_id: userIds[Math.floor(Math.random() * userIds.length)], // Rotate through user IDs (avoids out-of-bounds)
//     book_id: bookIds[Math.floor(Math.random() * bookIds.length)], // Random book ID
// }));
// const cart = await cartClient.createMany({data})
// console.log(cart);




// const userIds = (await userClient.findMany({select: {id: true}})).map(user => user.id)
// const type = [...Object.values(notificationType)]
// const is_read = [true, false]
// const data = Array.from({ length: 10 }, (_, i) => ({
//     user_id: userIds[Math.floor(Math.random() * userIds.length)], // Rotate through user IDs (avoids out-of-bounds)
//     type: type[Math.floor(Math.random() * type.length)],
//     content: 'This is a notification',
//     is_read: is_read[Math.floor(Math.random() * is_read.length)]
// }));

// const notification = await notificationClient.createMany({data})
// console.log(notification);





// function generateRandomIntegers(count, min, max) {
//     return Array.from({ length: count }, () =>
//         Math.floor(Math.random() * (max - min + 1)) + min
//     );
// }

// const userIds = (await userClient.findMany({select: {id: true}})).map(user => user.id)
// const bookIds = (await bookClient.findMany({select: {id: true}})).map(book => book.id)
// const finished = [true, false]
// const rating = generateRandomIntegers(10, 1, 5)
// const data = Array.from({ length: 10 }, (_, i) => ({
//     user_id: userIds[i % userIds.length], // Rotate through user IDs (avoids out-of-bounds)
//     book_id: bookIds[Math.floor(Math.random() * bookIds.length)], // Random book ID
//     finished: finished[Math.floor(Math.random() * finished.length)],
//     rating: rating[Math.floor(Math.random() * rating.length)],
//     review: "This is a review",
// }));

// const bookRead = await booksReadClient.createMany({data})
// console.log(bookRead);


