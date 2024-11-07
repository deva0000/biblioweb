 // Replace with your actual Supabase Project URL and Anon Key
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';


const supabaseUrl = 'https://fyygxgzlxnerquwrfpzy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5eWd4Z3pseG5lcnF1d3JmcHp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY2NzYwNTcsImV4cCI6MjA0MjI1MjA1N30.OAASk220-J3v9aY3XmhPKY4QmAT9vgfb1oOhhfOUkCI';
const supabase = createClient(supabaseUrl, supabaseKey);
export { supabase };



let currentPage = 1;
let container = document.getElementById('entries-container-books');



// Function to read entries from Supabase
window.readEntries = async function(table, page = 0) {
    const limit = 10; // Load 10 entries per page
    const offset = page * limit;

    let { data, error } = await supabase.from(table).select('*').range(offset, offset + limit - 1);
    if (error) {
        console.error('Error fetching entries:', error);
        return []; // Return empty array if there's an error
    } else {
        console.log('Entries:', data);
        return data;
    }
}


async function loadPage(page = 0) {
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
            let div = document.createElement('div');
            div.style.borderBottom = '1px solid black';
            div.style.padding = '10px';
            div.style.marginTop = '10px';
            div.style.width = '30vw';

            // Build the inner HTML dynamically based on entry data
            div.innerHTML = Object.keys(entry)
                .map(key => `<p>${key}: ${entry[key]}</p>`)
                .join('');

            container.appendChild(div);
        }
    }
}

// Load the first page on initial load
loadPage();




// Function to create a new entry in Supabase
window.createEntry = async function(table,entryData) {
    let { data, error } = await supabase.from(table).insert([entryData]).select('*');
    if (error) {
    console.error('Error inserting entry:', error);
    } else {
    console.log('Entry added:', data);
    }
    window.location.reload();
}

window.deleteEntry = async function(table,id_to_delete){
    let { data, error } = await supabase.from(table).delete().eq('id', id_to_delete);
    if (error) {
        console.error('Error inserting entry:', error);
    } else {
        console.log('Entry deleted:', data);
    }
    window.location.reload();
}

window.getCookieValue = function(name) {
    return (document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || '');
}
  

document.getElementById('add_book').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get the form data
    let book_name = document.getElementById('book_name').value;
    let author = document.getElementById('author').value;
    let genre = document.getElementById('genre').value;
    let release_date = document.getElementById('release_date').value;

    // Call createEntry with the form data
    createEntry("books",{ book_name: book_name, author: author, genre: genre, release_date: release_date });

});


document.getElementById('delete_book').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get the form data
    let book_id = document.getElementById('book_id').value;


    // Call createEntry with the form data
    deleteEntry("books", book_id);

});



//Page nav buttons

window.nextPage = function () {
    currentPage += 1;
    loadPage(currentPage);

    // Show "Previous" button if we are on the second page or beyond
    document.getElementById('previous-button').style.display = currentPage > 0 ? "inline" : "none";
    window.scrollTo(0, 0); // Scroll to the top
}

 window.previousPage = function() {
    if (currentPage > 0) {
        currentPage -= 1;
        loadPage(currentPage);
    }

    // Hide "Previous" button if we're back on the first page
    document.getElementById('previous-button').style.display = currentPage > 0 ? "inline" : "none";
    window.scrollTo(0, 0); // Scroll to the top
}

