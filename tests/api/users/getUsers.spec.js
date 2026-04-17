const { test, expect } = require('@playwright/test');

let token;

test.beforeAll(async ({ request }) => {
  const loginResponse = await request.post(
    'https://seasiaconnect.com/api/api/UserManagement/Login',
    {
      data: {
        userName: 'H9SBNRPhUU1xl5oYF2i/0g==',
        password: 'hJkEwuNZtvAMRBgnBM7Eyg=='
      }
    }
  );
  expect(loginResponse.status()).toBe(200);
  const loginJson = await loginResponse.json();
  token = loginJson.token;
  expect(token).toBeTruthy(); // fail fast if login itself is broken
});

test('No. of leave', async ({ request }) => {
  const response = await request.get(
    'https://seasiaconnect.com/api/api/v1/LeaveManagement/GetLeaveAvailedByUserId',
    { headers: { Authorization: `Bearer ${token}` } }
  );
  expect(response.status()).toBe(200);
});
test('project tickets', async ({ request }) => {
  const projectResp = await request.post(
    'https://seasiaconnect.com/api/api/v1/Ticket/GetAllTicketForBoardFiltersAsync',
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: {
        projectId: "643509cf5a124096c871b85e",
        sprintId: "69ccb20282562d2848150bce",
        search: "",
        isUnassignee: false,
        issueType: "",
        userIds: []
      }
    }
  );

  const statusCode = projectResp.status();
  console.log('Status:', statusCode);
  expect(statusCode).toBe(200);

  // Parse the response JSON
  const responseData = await projectResp.json();
  
  // Format and display the data
  formatTicketData(responseData);
});

/**
 * Formats ticket data in a readable form for console output
 */
function formatTicketData(data) {
  console.log('\n' + '='.repeat(60));
  console.log(' TICKET DATA OVERVIEW');
  console.log('='.repeat(60));

  if (!data || !data.ticketOutputModels) {
    console.log('No ticket data found');
    return;
  }

  let totalTickets = 0;
  const statusCounts = {};

  // Process each status group
  data.ticketOutputModels.forEach(statusGroup => {
    const status = statusGroup.status;
    const tickets = statusGroup.tickets || [];
    const count = tickets.length;
    
    statusCounts[status] = count;
    totalTickets += count;

    // Only display statuses with tickets
    if (count > 0) {
      console.log('\n' + '='.repeat(60));
      console.log(` STATUS: ${status} (${count} tickets)`);
      console.log('='.repeat(60));

      tickets.forEach(ticket => {
        console.log(`\n  🔹 Ticket: ${ticket.ticketNumber || 'N/A'}`);
        console.log(`     Summary: ${ticket.summary || 'N/A'}`);
        console.log(`     Assignee: ${ticket.assigneeUserName || 'Unassigned'}`);
        console.log(`     Issue Type: ${ticket.issueType || 'N/A'}`);
        console.log(`     Priority: ${ticket.priority || 'N/A'}`);
        console.log(`     Estimated Hours (QA): ${ticket.estimatedHoursQA || '0'}`);
        console.log(`     Estimated Hours (Dev): ${ticket.estimatedHours || '0'}`);
        
        if (ticket.consumedHours) {
          console.log(`     Consumed Hours: ${ticket.consumedHours}`);
        }
        
        console.log(`     Created: ${formatDate(ticket.createdDate)}`);
        
        if (ticket.labelName) {
          console.log(`     Label: ${ticket.labelName}`);
        }
        
        console.log(`     ${'-'.repeat(50)}`);
      });
    }
  });

  // Summary Statistics
  console.log('\n\n' + '='.repeat(60));
  console.log(' SUMMARY STATISTICS');
  console.log('='.repeat(60));
  console.log(`\nTotal Tickets: ${totalTickets}`);
  console.log('\nTickets by Status:');
  
  Object.entries(statusCounts).forEach(([status, count]) => {
    if (count > 0) {
      console.log(`  • ${status}: ${count} tickets`);
    }
  });

  // Workload by Assignee
  printWorkloadByAssignee(data.ticketOutputModels);
}

/**
 * Prints workload summary grouped by assignee
 */
function printWorkloadByAssignee(ticketOutputModels) {
  const assigneeStats = {};

  ticketOutputModels.forEach(statusGroup => {
    const tickets = statusGroup.tickets || [];
    
    tickets.forEach(ticket => {
      const assignee = ticket.assigneeUserName || 'Unassigned';
      
      if (!assigneeStats[assignee]) {
        assigneeStats[assignee] = {
          tickets: 0,
          qaHours: 0,
          devHours: 0
        };
      }
      
      assigneeStats[assignee].tickets += 1;
      assigneeStats[assignee].qaHours += parseFloat(ticket.estimatedHoursQA || 0);
      assigneeStats[assignee].devHours += parseFloat(ticket.estimatedHours || 0);
    });
  });

  console.log('\n' + '='.repeat(60));
  console.log('👥 WORKLOAD BY ASSIGNEE');
  console.log('='.repeat(60));
  console.log('\n| Assignee           | Tickets | QA Hours | Dev Hours |');
  console.log('|'.padEnd(20, '-') + '|'.padEnd(9, '-') + '|'.padEnd(11, '-') + '|'.padEnd(12, '-') + '|');

  Object.entries(assigneeStats).forEach(([assignee, stats]) => {
    const name = assignee.padEnd(18, ' ');
    const tickets = String(stats.tickets).padStart(7, ' ');
    const qaHours = String(stats.qaHours).padStart(9, ' ');
    const devHours = String(stats.devHours).padStart(10, ' ');
    console.log(`| ${name} | ${tickets} | ${qaHours} | ${devHours} |`);
  });
}

/**
 * Formats ISO date string to readable date (YYYY-MM-DD)
 */
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  try {
    return dateString.split('T')[0];
  } catch {
    return dateString;
  }
}

// "test('project tickets', async ({ request }) => {

//   const projectResp = await request.post(
//     'https://seasiaconnect.com/api/api/v1/Ticket/GetAllTicketForBoardFiltersAsync',
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       },
//       data: {
//         projectId: "643509cf5a124096c871b85e",
//         sprintId: "69ccb20282562d2848150bce",
//         search: "",
//         isUnassignee: false,
//         issueType: "",
//         userIds: []
//       }
//     }
//   );

//   const statusCode = projectResp.status();
//   console.log('Status:', statusCode);

//   const text = await projectResp.text();
//   console.log('Raw Body:', text);

//   expect(statusCode).toBe(200);
 

// });"
// let token;
// test('No. of leave', async ({ request }) => {

//   const loginResponse = await request.post(
//     'https://seasiaconnect.com/api/api/UserManagement/Login',
//     {
//       data: {userName: "H9SBNRPhUU1xl5oYF2i/0g==", password: "hJkEwuNZtvAMRBgnBM7Eyg=="}
//     }
//   );
//   const loginrespJson = await loginResponse.json();
//   token = loginrespJson.token;
 
//   const response = await request.get(
//     'https://seasiaconnect.com/api/api/v1/LeaveManagement/GetLeaveAvailedByUserId',
//     {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     }
//   );

//   const respJson = await response.json();
//   console.log(respJson);

//   expect(response.status()).toBe(200);
// });



// // Store token at module level or pass via fixture


// test('GET all tickets for board filter', async ({ request }) => {

//   // 1. Send request with required body
//   const response = await request.post(
//     'https://seasiaconnect.com/api/api/v1/Ticket/GetAllTicketForBoardFilter',
//     {
//       data: {
//         projectId: '643509cf5a124096c871b85e',
//         sprintId:  '69ccb20282562d2848150bce',
//         search:    ''
//       },
//       headers: {
//         Authorization:  `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       }
//     }
//   );

//   // 2. Status assertion
//   expect(response.status()).toBe(200);

//   // 3. Parse body (Playwright can do this directly)
//   const body = await response.json();

//   // 4. Response structure assertions
//   expect(body).toHaveProperty('data');
//   expect(Array.isArray(body.data)).toBeTruthy();

//   // 5. If tickets exist, validate shape of first item
//   if (body.data.length > 0) {
//     const ticket = body.data[0];
//     expect(ticket).toHaveProperty('_id');
//     expect(ticket).toHaveProperty('title');
//     expect(ticket).toHaveProperty('status');
//   }

//   // 6. Optional: log for debug (remove in CI)
//   console.log(`Tickets returned: ${body.data?.length ?? 0}`);
// });

// // test('project tickets',async({request})=>{
// //   const projectResp = await request.post(
// //    'https://seasiaconnect.com/api/api/v1/Ticket/GetAllTicketForBoardFilter',
// //    {
// // //     data:
// // //    {projectId: "643509cf5a124096c871b85e", sprintId: "69ccb20282562d2848150bce", search: ""},
// //    headers: {
// //         Authorization: `Bearer ${token}`,
// //         'Content-Type': 'application/json'
// //       }
// //    });
// //    const statusCode = projectResp.status();
// //   console.log('Status:', statusCode); // ✅ FIX

// //   const text = await projectResp.text();
// //   console.log('Raw Body:', text);

// //   let body;
// //   try {
// //     body = JSON.parse(text);
// //   } catch {
// //     throw new Error('Response is not JSON');
// //   }

// //   expect(statusCode).toBe(200);
// //   });