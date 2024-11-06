 // Replace with your actual Supabase Project URL and Anon Key
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';


const supabaseUrl = 'https://fyygxgzlxnerquwrfpzy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5eWd4Z3pseG5lcnF1d3JmcHp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY2NzYwNTcsImV4cCI6MjA0MjI1MjA1N30.OAASk220-J3v9aY3XmhPKY4QmAT9vgfb1oOhhfOUkCI';
const supabase = createClient(supabaseUrl, supabaseKey);
export { supabase };
let container = document.getElementById('entries-container');
// Function to read entries from Supabase
window.readEntries = async function(table) {
    let { data, error } = await supabase.from(table).select('*');
    if (error) {
    console.error('Error fetching entries:', error);    
    return []; // Return empty array if there's an error
    } else {
    console.log('Entries:('+typeof data+")", data);
    // Display the data on the console
    return data
}
}


for (let entry of await window.readEntries("books")) {
    let div = document.createElement('div');
    div.style.border = '2px solid white';
    div.style.padding = '10px';
    div.style.margin = '10px 0';
    div.style.width = '30vw';

    // Build the inner HTML dynamically based on entry data
    div.innerHTML = Object.keys(entry)
        .map(key => `<p>${key}: ${entry[key]}</p>`)
        .join('');

    container.appendChild(div);
}



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

    // Call createEntry with the form data
    createEntry("books",{ book_name: book_name, author: author });

});


document.getElementById('delete_book').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get the form data
    let book_id = document.getElementById('book_id').value;


    // Call createEntry with the form data
    deleteEntry("books", book_id);

});