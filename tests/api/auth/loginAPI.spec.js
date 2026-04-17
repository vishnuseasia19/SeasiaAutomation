const{test,expect,request}=require('@playwright/test');
const { resolve } = require('node:dns');
test('Login API test',async({request})=>{
    const response = await request.post('https://seasiaconnect.com/api/api/UserManagement/Login',
        {data :
          {userName: "H9SBNRPhUU1xl5oYF2i/0g==", password: "hJkEwuNZtvAMRBgnBM7Eyg=="}
        }
    );
    const respStatus=await response.status();
    console.log(respStatus);
    const respJson=await response.json();
    console.log(respJson);
    expect(respJson.userName).toBe('4076');

  expect(respJson.employeeInfo.firstName).toBe('Vishnu');

  expect(respJson.department).toBe('Raptors Prime');
   const emp = respJson.employeeInfo;

  expect(emp).toHaveProperty('firstName');
  expect(emp).toHaveProperty('emailId');
  expect(emp).toHaveProperty('employeeId');


});
