// Variable Definitions & Dependencies
const inquirer = require('inquirer');
const db = require('./db/connection');

// Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    employee_tracker();
});

var employee_tracker = function () {
    inquirer.prompt([{
        // Begin Command Line
        type: 'list',
        name: 'prompt',
        message: 'What would you like to do?',
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Log Out']
    }]).then((answers) => {
        // Views the Department Table in the Database
        if (answers.prompt === 'View All Departments') {
            db.query(`SELECT department.id, department.name AS department FROM department`, (err, result) => {
                if (err) throw err;
                console.log("Viewing All Departments: ");
                console.table(result);
                employee_tracker();
            });
        } else if (answers.prompt === 'View All Roles') {
            db.query(`SELECT role.id, role.title, role.salary, department.name AS department FROM role JOIN department ON role.department_id = department.id ORDER BY role.id`, (err, result) => {
                if (err) throw err;
                console.log("Viewing All Roles: ");
                console.table(result);
                employee_tracker();
            });
        } else if (answers.prompt === 'View All Employees') {
            db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, CONCAT(manager.first_name, ' ', manager.last_name)AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON department.id = role.department_id LEFT JOIN employee manager ON manager.id = employee.manager_id ORDER BY employee.id`, (err, result) => {
                if (err) throw err;
                console.log("Viewing All Employees: ");
                console.table(result);
                employee_tracker();
            });
        } else if (answers.prompt === 'Add Department') {
            inquirer.prompt([{
                // Adding a Department
                type: 'input',
                name: 'department',
                message: 'What is the name of the department?',
                validate: departmentInput => {
                    if (departmentInput) {
                        return true;
                    } else {
                        console.log('Please Add A Department!');
                        return false;
                    }
                }
            }]).then((answers) => {
                db.query(`INSERT INTO department (name) VALUES (?)`, [answers.department], (err, result) => {
                    if (err) throw err;
                    console.log(`Added ${answers.department} to the database.`)
                    employee_tracker();
                });
            })
        } else if (answers.prompt === 'Add Role') {
            // Beginning with the database so that we may acquire the departments for the choice
            db.query(`SELECT * FROM department`, (err, result) => {
                if (err) throw err;

                inquirer.prompt([
                    {
                        // Adding A Role
                        type: 'input',
                        name: 'role',
                        message: 'What is the name of the role?',
                        validate: roleInput => {
                            if (roleInput) {
                                return true;
                            } else {
                                console.log('Please Add A Role!');
                                return false;
                            }
                        }
                    },
                    {
                        // Adding the Salary
                        type: 'input',
                        name: 'salary',
                        message: 'What is the salary of the role?',
                        validate: salaryInput => {
                            if (salaryInput) {
                                return true;
                            } else {
                                console.log('Please Add A Salary!');
                                return false;
                            }
                        }
                    },
                    {
                        // Department
                        type: 'list',
                        name: 'department',
                        message: 'Which department does the role belong to?',
                        choices: () => {
                            var array = [];
                            for (var i = 0; i < result.length; i++) {
                                array.push(result[i].name);
                            }
                            return array;
                        }
                    }
                ]).then((answers) => {
                    // Comparing the result and storing it into the variable
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].name === answers.department) {
                            var department = result[i];
                        }
                    }

                    db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [answers.role, answers.salary, department.id], (err, result) => {
                        if (err) throw err;
                        console.log(`Added ${answers.role} to the database.`)
                        employee_tracker();
                    });
                })
            });
        } else if (answers.prompt === 'Add Employee') {
            inquirer.prompt([
                {
                    // Adding Employee First Name
                    type: 'input',
                    name: 'firstName',
                    message: 'What is the employees first name?',
                    validate: firstNameInput => {
                        if (firstNameInput) {
                            return true;
                        } else {
                            console.log('Please Add A First Name!');
                            return false;
                        }
                    }
                },
                {
                    // Adding Employee Last Name
                    type: 'input',
                    name: 'lastName',
                    message: 'What is the employees last name?',
                    validate: lastNameInput => {
                        if (lastNameInput) {
                            return true;
                        } else {
                            console.log('Please Add A Salary!');
                            return false;
                        }
                    }
                }
            ]).then((answers) => {
                var params = [answers.firstName, answers.lastName];
                // Calling the database to acquire the roles
                db.query(`SELECT * FROM role`, (err, result) => {
                    if (err) throw err;
                    inquirer.prompt([
                        {
                            // Adding Employee Role
                            type: 'list',
                            name: 'role',
                            message: 'What is the employees role?',
                            choices: () => {
                                var array = [];
                                for (var i = 0; i < result.length; i++) {
                                    array.push(result[i].title);
                                }
                                var newArray = [...new Set(array)];
                                return newArray;
                            }
                        }
                    ]).then((answers) => {
                        // Comparing the result and storing it into the variable
                        for (var i = 0; i < result.length; i++) {
                            if (result[i].title === answers.role) {
                                var roleId = result[i].id;
                            }
                        }
                        params.push(roleId);
                        // grab roles from roles table
                        db.query(`SELECT * FROM employee`, (err, result) => {
                            if (err) throw err;
                            inquirer.prompt([
                                {
                                    // Adding Employee Manager
                                    type: 'list',
                                    name: 'employee',
                                    message: 'Who is the employees manager?',
                                    choices: () => {
                                        var array = [];
                                        for (var i = 0; i < result.length; i++) {
                                            var managerName = result[i].first_name + " " + result[i].last_name;
                                            array.push(managerName);
                                        }
                                        var newArray = [...new Set(array)];
                                        return newArray;
                                    }
                                }
                            ]).then((answers) => {
                                // Comparing the result and storing it into the variable
                                for (var i = 0; i < result.length; i++) {
                                    if ((result[i].first_name + " " + result[i].last_name) === answers.employee) {
                                        var managerId = result[i].id;
                                    }
                                }
                                params.push(managerId);
                                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, params, (err, result) => {
                                    if (err) throw err;
                                    console.log(`Added ${params[0]} ${params[1]} to the database.`)
                                    employee_tracker();
                                });
                            });
                        });
                    });
                });
            });
        } else if (answers.prompt === 'Update Employee Role') {
            // Calling the database to acquire the roles and managers
            db.query(`SELECT * FROM employee`, (err, result) => {
                if (err) throw err;
                inquirer.prompt([
                    {
                        // Choose an Employee to Update
                        type: 'list',
                        name: 'employee',
                        message: 'Which employees role do you want to update?',
                        choices: () => {
                            var array = [];
                            for (var i = 0; i < result.length; i++) {
                                var employeeName = result[i].first_name + " " + result[i].last_name;
                                array.push(employeeName);
                            }
                            var employeeArray = [...new Set(array)];
                            return employeeArray;
                        }
                    }
                ]).then((answers) => {
                    var params = [];
                    for (var i = 0; i < result.length; i++) {
                        if ((result[i].first_name + " " + result[i].last_name) === answers.employee) {
                            var employeeId = result[i].id;
                        }
                    }
                    params.push(employeeId, answers.employee);


                    db.query(`SELECT * FROM role`, (err, result) => {
                        if (err) throw err;
                        inquirer.prompt([
                            {
                                // Adding Employee Role
                                type: 'list',
                                name: 'role',
                                message: 'What is their new role?',
                                choices: () => {
                                    var array = [];
                                    for (var i = 0; i < result.length; i++) {
                                        array.push(result[i].title);
                                    }
                                    var newArray = [...new Set(array)];
                                    return newArray;
                                }
                            }
                        ]).then((answers) => {
                            // Comparing the result and storing it into the variable
                            for (var i = 0; i < result.length; i++) {
                                if (result[i].title === answers.role) {
                                    var roleId = result[i].id;
                                }
                            }
                            params.push(roleId);


                            db.query(`UPDATE employee SET ? WHERE ?`, [{ role_id: params[2] }, {id: params[0]}], (err, result) => {
                                if (err) throw err;
                                console.log(`Updated ${params[1]} role to the database.`)
                                employee_tracker();
                            });
                        })
                    });
                });
            });
        } else if (answers.prompt === 'Log Out') {
            db.end();
            console.log("Good-Bye!");
        }
    })
};