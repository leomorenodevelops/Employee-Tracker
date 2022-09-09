// Node modules
const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');

// Connection information for sql database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Subarusti06',
    database: 'employee_db'
});

// Connect to mysql server and database
connection.connect(function(err) {
    if(err) throw err;
    console.log('SQL connected');

    // Add start function
    start(); 
});

// Begins command line prompts
function start() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'start',
                message: 'What would you like to do?',
                choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
            }
        ]).then (function(res) {
            switch(res.start) {
                case 'View All Employees':
                    viewAllEmployees();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Update Employee Role':
                    updateEmployeeRole();
                    break;
                case 'View All Roles':
                    viewAllRoles();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'View All Departments':
                    viewAllDepts();
                    break;
                case 'Add Department':
                    addDept();
                    break;
                case 'Quit':
                    console.log('===============');
                    console.log('All done');
                    console.log('===============');
                    break;
                default:
                    console.log('default');
            }
        });
}

// Function for View All Employees
function viewAllEmployees() {
    connection.query('SELECT e.id AS ID, e.first_name AS First, e.last_name AS Last, e.role_id AS Role, r.salary AS Salary, m.last_name AS Manager, d.name AS Department FROM employee e LEFT JOIN employee m ON e.manager_id = m.id LEFT JOIN role r ON e.role_id = r.title LEFT JOIN department d on r.department_id = d.id', function(err, results) {
        if(err) throw err;
        console.table(results);
        start();
    });
}

// Function for View All Departments
function viewAllDepts() {
    // query database for all deparments
    connection.query('SELECT * FROM department', function(err, results) {
        if(err) throw err;
        // Prompts user to choose department they want to view
        inquirer
            .prompt([
                {
                    name: 'choice',
                    type: 'list',
                    choices: function() {
                        let choiceArray = [];
                        for(i=0; i < results.length; i++) {
                            choiceArray.push(results[i].name);
                        }
                        return choiceArray;
                    },
                    message: 'Select department'
                }
            ]).then (function(answer) {
                connection.query('SELECT e.id AS ID, e.first_name AS First, e.last_name AS Last, e.role_id AS Role, r.salary AS Salary, m.last_name AS Manager, d.name AS Department FROM employee e LEFT JOIN employee m ON e.manager_id = m.id LEFT JOIN role r ON e.role_id = r.title LEFT JOIN department d on r.department_id = d.id WHERE d.name =?', [answer.choice], function(err, results) {
                    if(err) throw err;
                    console.table(results);
                    start();
                })
            });
    });
}

// Function for view all roles
function viewAllRoles() {
    // Query database for all roles
    connection.query('SELECT title FROM role', function(err, results) {
        if(err) throw err;
        // Prompts user to choose role they want to view
        inquirer
            .prompt([
                {
                    name: 'choice',
                    type: 'list',
                    choices: function() {
                        let choiceArray = [];
                        for(i=0; i < results.length; i++) {
                            choiceArray.push(results[i].title);
                        }
                        return choiceArray;
                    },
                    message: 'Select role'
                }
            ]).then (function(answer) {
                console.log(answer.choice);
                connection.query('SELECT e.id AS ID, e.first_name AS First, e.last_name AS Last, e.role_id AS Role, r.salary AS Salary, m.last_name AS Manager, d.name AS Department FROM employee e LEFT JOIN employee m ON e.manager_id = m.id LEFT JOIN role r ON e.role_id = r.title LEFT JOIN department d on r.department_id = d.id WHERE e.role_id =?', [answer.choice], function(err, results) {
                    if(err) throw err;
                    console.table(results);
                    start();
                })
            });
    });
}