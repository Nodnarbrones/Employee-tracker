const mysql = require('mysql2');
const inquirer = require('inquirer');
require('dotenv').config();
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
  
  connection.connect(function (err) {
    if (err) throw err;
   promptUser()
    
  });
  
  function promptUser() {
    inquirer.prompt([
      {
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a new department",
          "Add a new role",
          "Add a new employee",
          "Update an employee role",,
          "Done"
        ]
      }])
      .then(function (answer) {
        switch (answer.action) {
          case "View all departments":
            viewDepartments();
            break;
          case "View all roles":
            viewRoles();
            break;
          case "View all employees":
            viewEmployees();
            break;
          case "Add a new department":
            addDepartment();
            break;
          case "Add a new role":
            addRole();
            break;
          case "Add a new employee":
            addEmployee();
            break;
          case "Update an employee role":
            updateRole();
            break;
          case "exit":
            connection.end();
            break;
        }
      });
  };
  
  //called in addContent function if selected dept
  function addDepartment() {
    inquirer.prompt([
      {
        name: "addDept",
        message: "What is the name of the new department?"
      }
    ]).then(function (answer) {
      connection.query(
        "INSERT INTO department SET ?", {
        name: answer.addDept
      },
        function (err, res) {
          if (err) throw err;
          console.log(" Department Added!\n");
          promptUser();
        }
      );
    });
  }
  
  function viewDepartments() {
    connection.query(`SELECT * FROM department`, function (err, res) {
      if (err) throw err;
      console.table(res);
      promptUser   ();
    })
  };

  function viewRoles() {
    connection.query(`SELECT * FROM role`, function (err, res) {
      if (err) throw err;
      console.table(res);
      promptUser   ();
    })
  };

  function viewEmployees() {
    connection.query(`SELECT * FROM employee`, function (err, res) {
      if (err) throw err;
      console.table(res);
      promptUser   ();
    })
  };

  //add role requires quering department table to grab department id foreign key
  function addRole() {
    connection.query('select * FROM department', function (err, res) {
      inquirer.prompt([
        {
          type: 'input',
          name: 'roleTitle',
          message: 'What role would you like to add?'
        },
        {
          type: 'input',
          name: 'Salary',
          message: 'What is the salary for this role?'
        },
        {
          type: 'list',
          name: 'departmentId',
          message: 'What is the role department id?',
          choices: res.map(department => department.id)
        },
      ]) .then(data => {
        connection.query('insert INTO role set ?',{
          title: data.roleTitle,
          salary: data.Salary,
          department_id: data.departmentId
        })
        console.log('role added')
        promptUser()
      })
    } )
  }
// needs to query role table in order to get role id foreign key
  function addEmployee() {
    connection.query('select * FROM role', function (err, res) {
      inquirer.prompt([
        {
          type: 'input',
          name: 'firstName',
          message: 'What is the first name of the new Employee?'
        },
        {
          type: 'input',
          name: 'lastName',
          message: 'What is the last name of the new Employee?'
        },
        {
          type: 'list',
          name: 'roleId',
          message: 'What is the role id?',
          choices: res.map(role => role.id)
        },
        // manager id question here
      ]) .then(data => {
        connection.query('insert INTO employee set ?',{
          first_name: data.firstName,
          last_name: data.lastName,
          role_id: data.roleId
          //answer from manager id question placed into manager_id column here
        })
        console.log('employee added')
        promptUser()
      })
    } )
  }

//query employee table and prompt to select which employee to update THEN
//query role table and prompt to get existing list of role id's THEN
// connection.query update employee table where employee id or name to role id selected from role table query
  // function updateRole() {
  //   connection.query('select * FROM employee', (err, res) => {
  //     inquirer.prompt([
  //       //ask question to identify employee here
  //       {
  //         type: 'list',
  //         name: 'firstName',
  //         message: 'Which employee whould you like to edit?',
  //         choices: res.map(employee => employee.firstName)
  //       }
  //     ]) .then (data => {
  //       connection.query('select * FROM role', (err, res) => {
  //         inquirer.prompt([
  //           //ask question to identify role id here
  //           {
  //             type: 'list',
  //             name: 'roleId',
  //             message: 'What role would you like to give them?',
  //             choices: res.map(role => role.id)
  //         //   }
  //         // ]) .then (data => {
  //         //   connection.query('update employee WHERE first_name = ? set role_ id = ?', [question 1 answer here, questin 2 answer here])
  //         // })
  //       })
  //     })
  //   })
  // }