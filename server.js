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
        choices: ['View All Employees', 'Add An Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department']
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

            default:
                break;
        }
    });
}

const viewAllEmployee = () => {
    connection.query(`SELECT * FROM employee;`, (err, res) => {
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

const init = async () => {
    console.log('Welcome To The Employee Content Management system!');
    try {
        questions();
    } catch (err) {
        console.log(err);
        console.log('The was an error with user input')
    }
};

init();