const Redis = require('ioredis');
const client = Redis.createClient();

function addValueToQueue() {
  console.log("======Starting To Adding Values To Queue======")
  function checkQueueSize() {
    // To get the size of the queue in Redis
    client.llen('myQueue', (err, size) => {
      if (!err) {
        console.log('Size of queue:', size);
        if (size > 6) {
          console.log("======Starting To Popping (From Left) Queue======")
          popFirstQueue();
        } else {
          // If the size is less than 5, add ose value to the queue
          const newValue = size; // You can customize how you generate the new value
          client.rpush('myQueue', newValue);
          console.log(`Added element ${newValue} to the queue.`);
          // Call the function again after a delay
          setTimeout(checkQueueSize, 3000);
        }
      } else {
        console.error('Error getting size of queue from Redis:', err);
      }
    });
  }

  // Initial call to start the process
  checkQueueSize();
}

// Example usage
addValueToQueue();

// Function to print the elements of a queue
function printQueue(queue) {
  while (queue.length > 0) {
    console.log(queue.shift());
  }
}

function popFirstQueue() {
  setTimeout(() => {
    client.lpop('myQueue', (err, removedElement) => {
      if (!err) {
        console.log("=================================");
        console.log('Removed element:', removedElement);
        rangeOfQueue();
      } else {
        console.error('Error removing element from Redis:', err);
      }
    });
  }, 3000);
}

function rangeOfQueue() {
  client.lrange('myQueue', 0, -1, (err, reply) => {
    if (!err) {
      console.log('Updated queue after removal:');
      printQueue(reply);
      sizeOfQueue();
    } else {
      console.error('Error fetching updated data from Redis:', err);
    }
  });
}

function sizeOfQueue() {
  // To get the size of the queue in Redis
  client.llen('myQueue', (err, size) => {
    if (!err) {
      console.log('Size of queue:', size);
      console.log("=================================");
      if (size > 0) {
        popFirstQueue();
      } else {
        console.log('Queue is empty. Closing Redis connection.');
        client.quit(); // Close the Redis connection
      }
    } else {
      console.error('Error getting size of queue from Redis:', err);
    }
  });
}
