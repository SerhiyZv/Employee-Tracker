const mysql2 = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

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
                })
            })
        })
    })
}

const viewAllRoles = () => {
    connection.query(`SELECT * FROM role;`, (err, res) => {
        console.table(res);
        questions();
    });
};

const viewAllDepartments = () => {
    connection.query(`SELECT * FROM department;`, (err, res) => {
        console.table(res);
        questions();
    });
};

const addDepartment = () => {
    inquirer.prompt([
        {
            name: 'addDepartment',
            type: 'input',
            message: 'What is the name of the new deparment?'
        }
    ]).then((answer) => {
        const sql = `INSERT INTO department (name) VALUES (?)`;
        connection.query(sql, answer.addDepartment, (err, res) => {
            viewAllDepartments();
        });
    });
};



