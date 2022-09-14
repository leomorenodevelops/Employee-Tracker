-- Inserts name of departments into deparment table
INSERT INTO department(name)
VALUES
('Engineering'), 
('Finance'), 
('Legal'), 
('Sales');

-- Inserts roles of employees into role table
INSERT INTO role(title, salary, department_id)
VALUES
('Sales Lead', 100000, 4),
('Salesperson', 80000, 4),
('Lead Engineer', 150000, 1),
('Software Engineer', 120000, 1),
('Account Manager', 160000, 2),
('Accountant', 125000, 2),
('Legal Team Lead', 250000, 3),
('Lawyer', 190000, 3);

-- Inserts employee information into employee table
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
('John', 'Doe', 'Sales Lead', null),
('Mike', 'Chan', 'Salesperson', 1),
('Ashley', 'Rodriguez', 'Lead Engineer', null),
('Kevin', 'Tupik', 'Software Engineer', 3),
('Kunal', 'Singh', 'Account Manager', null),
('Malia', 'Brown', 'Accountant', 5),
('Sarah', 'Lourd', 'Legal Team Lead', null),
('Tom', 'Allen', 'Lawyer', 7);