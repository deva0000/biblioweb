 // Replace with your actual Supabase Project URL and Anon Key
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';


const supabaseUrl = 'https://fyygxgzlxnerquwrfpzy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5eWd4Z3pseG5lcnF1d3JmcHp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY2NzYwNTcsImV4cCI6MjA0MjI1MjA1N30.OAASk220-J3v9aY3XmhPKY4QmAT9vgfb1oOhhfOUkCI';
const supabase = createClient(supabaseUrl, supabaseKey);
const container = document.getElementById('entries-container');
// Function to read entries from Supabase
window.readEntries = async function() {
    let { data, error } = await supabase.from('entries').select('*');
    if (error) {
    console.error('Error fetching entries:', error);
    } else {
    console.log('Entries:('+typeof data+")", data);
    // Display the data on your page
    for (let entry of data) {
        // Create a new div element
        let div = document.createElement('div');
        
        // Set the content of the div
        div.innerHTML = `
            <p>ID: ${entry.id}</p>
            <p>Created At: ${entry.created_at}</p>
            <p>Book Name: ${entry.book_name}</p>
        `;
        div.style.border = '2px solid white'; // Adjust thickness and style as needed
        div.style.padding = '10px'; // Optional: Add some padding for better appearance
        div.style.margin = '10px 0'; // Optional: Add some margin between divs

    
        // Append the div to the container
        container.appendChild(div);
    }
}
}

// Function to create a new entry in Supabase
window.createEntry = async function(entryData) {
    let { data, error } = await supabase.from('entries').insert([entryData]).select('*');
    if (error) {
    console.error('Error inserting entry:', error);
    } else {
    console.log('Entry added:', data);
    }
}

// Example usage
readEntries();

// Add an event listener to a button or form to create new entries
// createEntry({ title: 'New Entry', description: 'This is a test entry' });