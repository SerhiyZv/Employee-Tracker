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

    console.log(`connected as id  ${connection.threadId}`)
});

const questions = () => {
    inquirer.prompt([{
        name: 'questionList',
        type: 'list',
        message: 'What would ypu like to do?',
        choices: ['View All Employees', 'Add An Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department']
    }]).then((answer) => {
        if(answer.questionList == 'View All Employees'){
            
        }else if (answer.questionList == 'Add An Employee'){

        }else if (answer.questionList == 'Update Employee role'){

        }else if (answer.questionList == 'View All Roles'){

        }else if (answer.questionList == 'Add Role'){

        }else if (answer.questionList == 'View All Departments'){

        }else if (answer.questionList == 'Add Department'){

        }
    });
}

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