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

// Function to add a department
function addDept() {
    // Prompt info for department
    inquirer
        .prompt([
            {
                name: 'department',
                type: 'input',
                message: 'What is the name of the department?'
            }
        ]).then (function(answer) {
            // Inserts department values as defult id and name
            connection.query('INSERT INTO department VALUES (DEFAULT, ?)',
            [answer.department],
            function(err) {
                if(err) throw err;
                console.log('===============');
                console.log('Added ' + answer.department + ' to the database');
                console.log('===============');
                start();
            })
        });
}

// Function to add an employee role
function addRole() {
    // Prompt info for role
    inquirer
        .prompt([
            {
                name: 'role',
                type: 'input',
                message: 'What is the title of the role?'
            },
            {
                name: 'salary',
                type: 'number',
                message: 'What is the salary of the role?',
                validate: function(value) {
                    if(isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: 'department_id',
                type: 'number',
                message: 'What is the department ID',
                validate: function(value) {
                    if(isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function(answer) {
            connection.query('INSERT INTO role SET ?', 
                {
                    title: answer.role,
                    salary: answer.salary,
                    department_id: answer.department_id
                },
                function(err) {
                    if(err) throw err;
                    console.log('===============');
                    console.log('Added' + answer.role + 'to the database');
                    console.log('===============');
                    start();
                    
                }
            )
        })
}

// Function to add an employee
function addEmployee() {
    connection.query('SELECT * FROM role', function(err, results) {
        if(err) throw err;
        // Prompts user to new employee info
        inquirer
            .prompt([
                {
                    name: 'firstName',
                    type: 'input',
                    message: 'Enter employee first name'
                },
                {
                    name: 'lastName',
                    type: 'input',
                    message: 'Enter employee last name'
                },
                {
                    name: 'role',
                    type: 'list',
                    choices: function() {
                        let choiceArray = [];
                        for(i=0; i < results.length; i++) {
                            choiceArray.push(results[i].title);
                        }
                        return choiceArray;
                    },
                    message: 'Select title'
                },
                {
                    name: 'manager',
                    type: 'number',
                    validate: function(value) {
                        if(isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    },
                    message: 'Enter manager ID',
                    default: '1'
                }
            ]).then(function(answer) {
                // Answer is an object with key values from inquirer prompt
                connection.query('INSERT INTO employee SET ?',
                    {
                        first_name: answer.firstName,
                        last_name: answer.lastName,
                        role_id: answer.role,
                        manager_id: answer.manager
                    }
                )
                console.log('===============');
                console.log('Employee added successfully');
                console.log('===============');
                start();
            });
    });
}