<script>
    import { onMount } from 'svelte';
    import axios from 'axios';
  
    /**
    * @type {string | any[]}
    */
    let users = [];
  
    // Function to fetch users data from the server
    async function fetchUsers() {
      try {
        const response = await axios.get('http://localhost:8080/users');
        users = response.data;
        console.log('Users:', users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
  
    // Call fetchUsers function when component is mounted
    onMount(fetchUsers);
  </script>

<h1>Users</h1>

{#if users.length > 0}
  <ul>
    {#each users as user}
      {user.Email}
    {/each}
  </ul>
{:else}
  <p>No users found.</p>
{/if}