// Install dependencies
const mysql2 = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

// Definition of connection to SQL Server
const connection = mysql2.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'employee_trackerdb'
});

connection.connect((err) => {
    if (err) {
        console.error(`error connecting: ${err.stack}`);
        return;
    }

    //console.log(`connected as id  ${connection.threadId}`)
    //User questions
    questions();
});

// Run inquirer for user selection
const questions = () => {
    inquirer.prompt([{
        name: 'questionList',
        type: 'list',
        message: 'What would ypu like to do?',
        choices: ['View All Employees', 'Add An Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
    }]).then((answer) => {
       
        switch(answer.questionList){
            case 'View All Employees':
                viewAllEmployee();
                break;
            
            case 'Add An Employee':
                addAnEmployee();
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
                viewAllDepartments();
                break;

            case 'Add Department':
                addDepartment();
                break;

            case 'Quit':
                connection.end();

                console.log("Session finished")
                break;
        }
    });
}

// View All Employees function is running query 
const viewAllEmployee = () => {
    connection.query(`SELECT employee.id, employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS 'Title', department.name AS 'Department',
    CONCAT('$', format(role.salary,0)) AS Salary, CONCAT(manager.first_name, ' ', manager.last_name) AS Manager
    FROM employee
    INNER JOIN role ON employee.role_id = role.id
    INNER JOIN department ON role.department_id = department.id 
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id
    ORDER BY employee.id ASC;`, (err, res) => {
        console.table(res);
        questions();
    });
};

// Add Role function with query to push data in to the DB
const addRole = () => {
    const departments = [];

    connection.query(`SELECT * FROM department`, (err, res) => {
        res.forEach((department) => {
            departments.push ({
                "value": department.id,
                "name": department.name
            });
        });
    });

    inquirer.prompt([
        {
            name: 'roleTitle',
            type: 'input',
            message: 'What is the name of the role?',
        },
        {
            name: 'roleSalary',
            type: 'input',
            message: 'What is the salary of the role?',
        },
        {
            name: 'departmentId',
            type: 'list',
            message: 'Which department does the role belong to?',
            choices: departments,
        },
    ]).then((answer) => {
        departments.forEach((department) => {
            if (department.value === answer.departmentId)
            {
                const sql = `INSERT INTO role (title,salary, department_id) VALUES ('${answer.roleTitle}', ${parseInt(answer.roleSalary)}, ${parseInt(answer.departmentId)})`;
                connection.query(sql, (err, res) => {
                    viewAllRoles();
                });
            }
        });
    });
}

// Add an Employee function with Query to push data in the DB
const addAnEmployee = () => {
    const roles = [];
    const managers = [];

    connection.query(`SELECT * FROM role`, (err, res) => {
        res.forEach((role) => {
            roles.push ({
                "value": role.id,
                "name": role.title
            });
        });

        connection.query(`SELECT * FROM employee`, (err, res) => {
            res.forEach((employee) => {
                managers.push ({
                    "value": employee.id,
                    "name": employee.first_name + " " + employee.last_name
                });
            });

            inquirer.prompt([
                {
                    name: 'firstName',
                    type: 'input',
                    message: 'What is the employee\'s first name?',
                },
                {
                    name: 'lastName',
                    type: 'input',
                    message: 'What is the employee\'s last name?',
                },
                {
                    name: 'role',
                    type: 'list',
                    message: 'What is the employee\'s role?',
                    choices: roles,
                },
                {
                    name: 'manager',
                    type: 'list',
                    message: 'What is the employee\'s manager?',
                    choices: managers,
                }
            ]).then((answer) => {
                const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answer.firstName}', '${answer.lastName}', ${parseInt(answer.role)}, ${parseInt(answer.manager)})`;
                    connection.query(sql, (err, res) => {
                        viewAllEmployee();
                    });
            });
        });
    });
}

// Update Employee Role function with Query to push data into the DB
const updateEmployeeRole = () => {
    const employees = [];
    const roles = [];

    connection.query(`SELECT * FROM employee`, (err, res) => {
        res.forEach((employee) => {
            employees.push ({
                "value": employee.id,
                "name": employee.first_name + " " + employee.last_name
            });
        });

        connection.query(`SELECT * FROM role`, (err, res) => {
            res.forEach((role) => {
                roles.push ({
                    "value": role.id,
                    "name": role.title
                });
            });

            inquirer.prompt([
                {
                    type: "list",
                    name: "employee",
                    message: "Select the Employee you would like to update their role for.",
                    choices: employees,
                },
                {
                    type: "list",
                    name: "role",
                    message: "What is the employee's role?",
                    choices: roles,
                }
            ]).then((answer) => {
                employees.forEach((employees) => {
                    if (employees.value === answer.employee)
                    {
                        const sql = `UPDATE employee SET employee.role_id = ? WHERE employee.id =?`;
                        connection.query(sql, [answer.role, answer.employee], (err, res) => {
                            viewAllEmployee()
                        });
                    }
                });
            });
        });
    });
}

// View  All Roles function with query to display all data from role table
const viewAllRoles = () => {
    connection.query(`SELECT * FROM role;`, (err, res) => {
        console.table(res);
        questions();
    });
};

// View  All Roles function with query to display all data from department table
const viewAllDepartments = () => {
    connection.query(`SELECT * FROM department;`, (err, res) => {
        console.table(res);
        questions();
    });
};

// Add Department function with  query to push data to the DB
const addDepartment = () => {
    inquirer.prompt([
        {
            name: 'addDepartment',
            type: 'input',
            message: 'What is the name of the new department?'
        }
    ]).then((answer) => {
        const sql = `INSERT INTO department (name) VALUES (?)`;
        connection.query(sql, answer.addDepartment, (err, res) => {
            viewAllDepartments();
        });
    });
};



