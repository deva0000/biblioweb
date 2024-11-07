// Replace with your actual Supabase Project URL and Anon Key
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
console.log(window.location.pathname)

const supabaseUrl = 'https://fyygxgzlxnerquwrfpzy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5eWd4Z3pseG5lcnF1d3JmcHp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY2NzYwNTcsImV4cCI6MjA0MjI1MjA1N30.OAASk220-J3v9aY3XmhPKY4QmAT9vgfb1oOhhfOUkCI';
const supabase = createClient(supabaseUrl, supabaseKey);
export { supabase };



let currentPage = 1;
let container = document.getElementById('entries-container-books');



// Function to read entries from Supabase
window.readEntries = async function (table, page = 0) {
    const limit = 10; // Load 10 entries per page
    const offset = page * limit;


    let { data, error } = await supabase.from(table).select('*').order('book_name', { ascending: true }).range(offset, offset + limit - 1);
    if (error) {
        console.error('Error fetching entries:', error);
        return []; // Return empty array if there's an error
    } else {
        console.log('Entries:', data);
        return data;
    }
}
window.loadPage = async function (page = 0) {
    let row = 0
    currentPage = page;
    container.innerHTML = ''; // Clear previous entries

    // Add a temporary placeholder while waiting for server response
    let placeholderDiv = document.createElement('div');
    placeholderDiv.style.borderBottom = '1px solid black';
    placeholderDiv.style.padding = '10px';
    placeholderDiv.style.marginTop = '10px';
    placeholderDiv.style.width = '30vw';
    placeholderDiv.innerHTML = '<p>Loading...</p>';
    container.appendChild(placeholderDiv);

    // Await the entries from Supabase
    const entries = await window.readEntries("books", currentPage);

    // Remove the placeholder once data is loaded
    container.innerHTML = '';

    if (entries.length < 1) {
        // Show "No entries available" if no data is returned
        let noEntriesDiv = document.createElement('div');
        noEntriesDiv.style.borderBottom = '1px solid black';
        noEntriesDiv.style.padding = '10px';
        noEntriesDiv.style.marginTop = '10px';
        noEntriesDiv.style.width = '30vw';
        noEntriesDiv.innerHTML = '<p>No entries available</p>';
        container.appendChild(noEntriesDiv);
    } else {
        // Populate entries if available

        for (let entry of entries) {
            let moderatorContent = "";
            if (globalThis.is_moderator) {
                moderatorContent = `<p>Identificação: ${entry.id}</p>`;
            }

            // Create a new div element
            let div = document.createElement('div');

            // Set the content of the div
            div.innerHTML = `
                
                <!-- <p>Created At: ${entry.created_at}</p>-->
                <p>Título: ${entry.book_name}</p>
                <p>Gênero: ${entry.genre}</p>
                <p>Autor: ${entry.author}</p>
                <p>Data de lançamento: ${entry.release_date}</p>
                <p>Disponibilidade: ${entry.is_available ? "Disponível" : "Alugado"}</p>
                <p>${moderatorContent}</p>
            `;
            div.style.padding = '10px';
            div.style.margin = '10px 0';
            div.style.width = '30vw';
            if (row % 2 == 0) {
                div.style.backgroundColor = '#E0E0E0';
            }
            row++
            // Append the div to the container
            container.appendChild(div);
            if (container.children.length == 1) {
                div.style.marginTop = '0';
            }
        }

        /*  for (let entry of entries) {
              let div = document.createElement('div');
              div.style.borderBottom = '0px solid black';
              div.style.padding = '10px';
              div.style.marginTop = '10px';
              div.style.width = '30vw';
              if (row % 2 == 0) {
                  div.style.backgroundColor = '#E0E0E0';
              }
              row++
  
              let html = '';
              for (let key in entry) {
                  html += `<p>${key}: ${entry[key]}</p>`;
              }
              div.innerHTML = html;
  
              container.appendChild(div);
          }*/
    }
}
window.getCookieValue = function (name) {
    return (document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || '');
}






// Function to create a new entry in Supabase
window.createEntry = async function (table, entryData) {
    let { data, error } = await supabase.from(table).insert([entryData]).select('*');
    if (error) {
        console.error('Error inserting entry:', error); // Log error
        return { data: null, error }; // Return error for external handling
    } else {
        console.log('Entry added:', data);
        return { data, error: null }; // Return data if no error
    }
}


window.deleteEntry = async function (table, id_to_delete) {
    let { data, error } = await supabase.from(table).delete().eq('id', id_to_delete);
    if (error) {
        console.error('Error inserting entry:', error);
    } else {
        console.log('Entry deleted:', data);
    }
    window.location.reload();
}

if (document.getElementById('add_book')) {
    document.getElementById('add_book').addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Get the form data
        let book_name = document.getElementById('book_name').value;
        let author = document.getElementById('author').value;
        let genre = document.getElementById('genre').value;
        let release_date = document.getElementById('release_date').value;

        // Call createEntry with the form data
        await createEntry("books", { book_name: book_name, author: author, genre: genre, release_date: release_date });
        window.location.reload();
    });
}

if (document.getElementById('delete_book')) {
    document.getElementById('delete_book').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Get the form data
        let book_id = document.getElementById('book_id').value;


        // Call createEntry with the form data
        deleteEntry("books", book_id);

    });
}



//Page nav buttons

window.nextPage = function () {
    currentPage += 1;
    window.loadPage(currentPage);

    // Show "Previous" button if we are on the second page or beyond
    document.getElementById('previous-button').style.display = currentPage > 0 ? "inline" : "none";
    window.scrollTo(0, 0); // Scroll to the top
}

window.previousPage = function () {
    if (currentPage > 0) {
        currentPage -= 1;
        window.loadPage(currentPage);
    }

    // Hide "Previous" button if we're back on the first page
    document.getElementById('previous-button').style.display = currentPage > 0 ? "inline" : "none";
    window.scrollTo(0, 0); // Scroll to the top
}

//Add User
if (document.getElementById('register_user')) {
    document.getElementById('register_user').addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Get the form data
        let email = document.getElementById('user_email').value;
        let password = document.getElementById('user_password').value;
        let full_name = document.getElementById('user_full_name').value;
        let student_card = document.getElementById('user_carteirinha').value;
        let student_card_turma = document.getElementById('user_carteirinha_turma').value;
        let is_moderator = document.getElementById('user_is_moderator').checked;

        const { data, error } = await createEntry("users", {
            user_email: email,
            user_password: password,
            user_full_name: full_name,
            user_carteirinha_mat: student_card,
            user_carteirinha_turma: student_card_turma,
            user_is_moderator: is_moderator
        });

        if (error) {
            console.error("THERE WAS THIS ERROR RIGHT HERE: " + error.message);
            showError("Error:\n\n\n\n" + error.message);
        } else {
            showError("Usúario cadastrado com sucesso");

        }


    });
}

window.deleteUser = async function (email) {
    //fetch data based on email
    let { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_email', email)
        .single(); // Use single to return just one record

    //logs any error (yet to see something happen)
    if (error) {
        console.error('Error fetching user:', error.message);
        return { data: null, error };
    }

    //logs the user that will be deleted
    console.log('User data to be deleted:', data);

    //deletes user and stores errors inside the deleteError var
    let { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('user_email', email);

    //logs the error if it exists
    if (deleteError) {
        console.error('Error deleting user:', deleteError);
        return { data: null, error: deleteError };
    }

    //return confirmation that the user has been deleted
    console.log(`User with email ${email} deleted.`);
    return { data, error: null };
}

window.fetchUser = async function (mat) {
    //fetch data based on mat id
    let { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_carteirinha_mat', mat)
        .single(); // Use single to return just one record

    //logs any error (yet to see something happen)
    if (error) {
        console.error('Error fetching user:', error.message);
        return { data: null, error };
    }

    //logs the user 
    console.log('User data: ', data)
    return { data, error: null };

}



if (document.getElementById('delete_user')) {
    document.getElementById('delete_user').addEventListener('submit', async function (event) {
        event.preventDefault();

        let userEmail = document.getElementById('delete_user_email').value;

        const { data, error } = await deleteUser(userEmail);

        if (error) {
            console.error("Error deleting user: " + error.message);
            showError("Error:\n\n" + error.message);
        } else {
            showError("Usuário deletado com sucesso");
            document.getElementById('delete_user_email').value = '';
        }
    });
}

if (document.getElementById('fetch_user')) {
    document.getElementById('fetch_user').addEventListener('submit', async function (event) {
        event.preventDefault();

        let userMatricula = document.getElementById('fetch_user_mat').value;
        console.log("Getting info from mat " + document.getElementById('fetch_user_mat').value)

        const { data, error } = await fetchUser(userMatricula);
        console.log(data.user_rented_books)
        const rentedBookIds = data.user_rented_books;
        // Fetch book titles based on IDs

        const bookTitles = [];
        for (const bookId of rentedBookIds) {
            let { data: bookData, error } = await supabase
                .from("books")
                .select("book_name")
                .eq("id", bookId)
                .single();
                if (error) {
                    console.error(`Error fetching book with ID ${bookId}:`, error);
                    bookTitles.push("Unknown Book"); // Default title if there's an error
                } else {
                    bookTitles.push("\n"+bookData.book_name);

                }
        }
    

        if (error) {
        console.error("Error fetching user: " + error.message);
        showError("Error:\n\n" + error.message);
    } else {
        showError(`Nome: ${data.user_full_name}\nEmail: ${data.user_email}\nPermissões: ${data.user_is_moderator ? "Moderador" : "Usuário"}\nMatrícula: ${data.user_carteirinha_mat}\nTurma: ${data.user_carteirinha_turma}\n\nLivros Alugados: ${bookTitles}`);
        document.getElementById('fetch_user_mat').value = '';
    }
});
}

//Rental

if (document.getElementById('rental-form')) {
    document.getElementById('rental-form').addEventListener('submit', async function (event) {
        event.preventDefault();

        const studentCardId = document.getElementById('student-card-id').value;
        const bookId = document.getElementById('book-id').value;


        // Check if the book is available
        const { data: bookData, error: availabilityError } = await supabase
            .from('books')  // Assuming the books table is named 'books'
            .select('is_available')  // Check availability status
            .eq('id', bookId)
            .single();

        const resultDiv = document.getElementById('result');

        if (availabilityError) {
            resultDiv.textContent = `Error checking availability: ${availabilityError.message}`;
            return;
        }

        if (!bookData || !bookData.is_available) {
            resultDiv.textContent = 'Error: The book is not available.';
            return;
        }

        // Calculate the return date (15 days from now)
        const returnDate = new Date();
        returnDate.setDate(returnDate.getDate() + 15);  // Add 15 days

        // Convert to ISO string (timestampz format)
        const returnDateString = returnDate.toISOString();

        // Rent the book to the student (update the book's availability)
        const { data: rentData, error: rentError } = await supabase
            .from('books')
            .update({ is_available: false, rented_by: studentCardId, rented_at: new Date(), return_date: returnDateString })
            .eq('id', bookId);

        if (rentError) {
            resultDiv.textContent = `Error renting the book: ${rentError.message}`;
            return;
        }
        console.log(rentData)

        // Success
        resultDiv.textContent = `Êxito. O livro foi alugado para a Matrícula: ${studentCardId}.`;
    });
}

window.searchBooks = async function () {
    const searchQuery = document.getElementById('search-bar').value.trim().toLowerCase();

    // Clear previous entries
    container.innerHTML = 'Loading...';

    // Fetch books where the title matches the search query
    const { data: books, error } = await supabase
        .from('books')
        .select('*')
        .ilike('book_name', `%${searchQuery}%`);  // ilike is case-insensitive

    if (error) {
        console.error('Error searching books:', error);
        container.innerHTML = 'Error fetching results.';
        return;
    }

    // If no books are found, show "No results found"
    if (!books.length) {
        container.innerHTML = '<p>No results found</p>';
        return;
    }

    // Display the search results
    container.innerHTML = '';  // Clear loading text
    let search_row = 0
    for (let book of books) {
        // Create a new div element
        let div = document.createElement('div');

        // Set the content of the div

        let moderatorContent = "";
        if (globalThis.is_moderator) {
            moderatorContent = `<p>Identificação: ${book.id}</p>`;
        }

        // Set the content of the div
        div.innerHTML = `
            <!-- <p>Created At: ${book.created_at}</p>-->
            <p>Título: ${book.book_name}</p>
            <p>Gênero: ${book.genre}</p>
            <p>Autor: ${book.author}</p>
            <p>Data de lançamento: ${book.release_date}</p>
            <p>Disponibilidade: ${book.is_available ? "Disponível" : "Alugado"}</p>
            <p>${moderatorContent}</p>
                `;



        div.style.padding = '10px';
        div.style.margin = '10px 0';
        div.style.width = '30vw';
        if (search_row % 2 == 0) {
            div.style.backgroundColor = '#E0E0E0';
        }
        search_row++
        // Append the div to the container
        container.appendChild(div);
        if (container.children.length == 1) {
            div.style.marginTop = '0';
        }
    }
}


//Return form

if (document.getElementById('return-form')) { 
    document.getElementById('return-form').addEventListener('submit', async function (event) { 
        event.preventDefault();

        const studentCardId = document.getElementById('return-student-card-id').value;
        const bookId = document.getElementById('return-book-id').value;
        console.log("Trying to return with ID:" + studentCardId + "and Book" + bookId)

        // Check if the book is currently rented by this student
        const { data: bookData, error: rentCheckError } = await supabase
            .from('books')  // Ensure this table is correct
            .select('is_available, rented_by')  // Retrieve rental status and rented_by field
            .eq('id', bookId)
            .single();

        const resultDiv = document.getElementById('result');

        if (rentCheckError) {
            resultDiv.textContent = `Error checking rental status: ${rentCheckError.message}`;
            return;
        }

        if (!bookData || bookData.is_available || bookData.rented_by != studentCardId) {
            resultDiv.textContent = 'Erro: Este livro não está alugado ou está alugado por outro estudante.';
            return;
        }

        // Update the book's status to available and clear rental information
        const { data: returnData, error: returnError } = await supabase
            .from('books')
            .update({ 
                is_available: true, 
                rented_by: null, 
                rented_at: null, 
                return_date: null 
            })
            .eq('id', bookId);

        if (returnError) {
            resultDiv.textContent = `Error returning the book: ${returnError.message}`;
            return;
        }
        console.log("Book returned: " + returnData)

        // Success
        resultDiv.textContent = `Êxito. O livro foi devolvido pela a Matrícula: ${studentCardId}.`;
    });
}
