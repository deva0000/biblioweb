// Replace with your actual Supabase Project URL and Anon Key
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fyygxgzlxnerquwrfpzy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5eWd4Z3pseG5lcnF1d3JmcHp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY2NzYwNTcsImV4cCI6MjA0MjI1MjA1N30.OAASk220-J3v9aY3XmhPKY4QmAT9vgfb1oOhhfOUkCI';
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to read entries from Supabase
async function readEntries() {
    let { data, error } = await supabase
    .from('entries')
    .select('*');
    if (error) {
    console.error('Error fetching entries:', error);
    } else {
    console.log('Entries:', data);
    // Display the data on your page
    }
}

// Function to create a new entry in Supabase
async function createEntry(entryData) {
    let { data, error } = await supabase
    .from('entries')
    .insert([entryData]);
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