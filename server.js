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
        // if(answer.questionList == 'View All Employees'){
            
        // }else if (answer.questionList == 'Add An Employee'){

        // }else if (answer.questionList == 'Update Employee role'){

        // }else if (answer.questionList == 'View All Roles'){

        // }else if (answer.questionList == 'Add Role'){

        // }else if (answer.questionList == 'View All Departments'){

        // }else if (answer.questionList == 'Add Department'){

        // }
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



