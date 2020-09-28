const inquirer = require("inquirer");
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "ngozika1",
  database: "employee_db",
});

connection.connect(function (err) {
  if (err) {
    console.log("error connecting:" + err.stack);
    return;
  }
  console.log("connected as id" + connection.threadId);
  menuPrompt();
});
function menuPrompt() {
  inquirer
    .prompt({
      type: "list",
      name: "promptChoice",
      message: "Make a selection:",
      choices: [
        "View All Employees",
        "View Roles",
        "View Departments",
        "Add Employee",
        "Add Roles",
        "Add Departments",
        "Update Employee Role",
        "Exit Program",
      ],
    })
    .then((answer) => {
      switch (answer.promptChoice) {
        case "View All Employees":
          EmployeeList();
          break;

        case "View Roles":
          queryRolesOnly();
          break;

        case "View Departments":
          viewAllDepartments();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Add Roles":
          addRole();
          break;

        case "Add Departments":
          addDepartment();
          break;

        case "Update Employee Role":
          updateEmployeeRole();
          break;

        case "Exit Program":
          process.exit();
      }
    });
}
function EmployeeList() {
  var sqlStart = "SELECT * FROM employee";
  connection.query(sqlStart, function (err, result) {
    if (err) throw err;

    console.table(result);
    menuPrompt();
  });
}
function queryRolesOnly() {
  var sqlStart = "SELECT * FROM role";
  connection.query(sqlStart, function (err, result) {
    if (err) throw err;

    console.table(result);
    menuPrompt();
  });
}
function viewAllDepartments() {
  var sqlStr = "SELECT * FROM department";
  connection.query(sqlStr, function (err, result) {
    if (err) throw err;

    console.table(result);
    menuPrompt();
  });
}
function addEmployee() {
  const newEmployee = {
    firstName: "",
    lastName: "",
    roleId: 0,
  };
  inquirer
    .prompt([
      {
        name: "firstName",
        message: "Enter first name: ",
      },
      {
        name: "lastName",
        message: "Enter last name: ",
      },
    ])
    .then((answers) => {
      newEmployee.firstName = answer.firstName;
      newEmployee.lastName = answer.lastName;

      const query = "SELECT role.title, role.id FROM role";
      connection.query(query, (err, res) => {
        if (err) throw err;

        const roles = [];
        const roleNames = [];
        for (let i = 0; i < res.length; i++) {
          roles.push({
            id: res[i].id,
            title: res[i].title,
          });
          roleNames.push(res[i].title);
        }
        inquirer
          .prompt({
            type: "list",
            name: "rolePromptChoice",
            message: "Select Role:",
            choices: roleNames,
          })
          .then((answer) => {
            const chosenRole = answer.rolePromptChoice;
            let chosenRoleId;
            for (let i = 0; i < roles.length; i++) {
              if (roles[i].title === chosenRole) {
                chosenRoleId = roles[i].id;
              }
            }
            newEmployee.roleId = chosenRoleId;

            const query = "INSERT INTO employee SET ?";
            connection.query(
              query,
              {
                first_name: newEmployee.firstName,
                last_name: newEmployee.lastName,
                role_id: newEmployee.roleId || 0,
              },
              (err, res) => {
                console.log("Employee Added");
                setTimeout(EmployeeList, 500);
              }
            );
          });
      });
    });
}
function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: "What is the new department's name?",
      },
    ])
    .then(function (data) {
      connection.query(
        "INSERT INTO department SET ?",
        {
          Ename: data.department,
        },
        function (err, res) {
          if (err) throw err;
          viewAllDepartments();
        }
      );
    });
}
//-----------------------------------------------------------------------------------------------------------------------------
function addRole() {
  console.log("-------------------------------------");
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;

    const myDeps = res.map(function (deps) {
      return {
        name: deps.name,
        value: deps.id,
      };
    });

    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "What is the new role's title?",
        },
        {
          type: "input",
          name: "salary",
          message: "What is the new role's salary?",
        },
        {
          type: "list",
          name: "department",
          message: "What is the new role's department?",
          choices: myDeps,
        },
      ])
      .then(function (data) {
        connection.query(
          "INSERT INTO role SET ?",
          {
            title: data.title,
            salary: data.salary,
            department_id: data.department,
          },
          function (err, res) {
            if (err) throw err;
            queryRolesOnly();
          }
        );
      });
  });
}
//-----------------------------------------------------------------------------------------------------------------------------

function updateEmployeeRole() {
  const updatedEmployee = {
    id: 0,
    roleID: 0,
  };

  const query = `
    SELECT id, concat(employee.first_name, " ", employee.last_name) AS employee_full_name
    FROM employee ;`;
  connection.query(query, (err, res) => {
    if (err) throw err;

    let employees = [];
    let employeesNames = [];
    for (let i = 0; i < res.length; i++) {
      employees.push({
        id: res[i].id,
        fullName: res[i].employee_full_name,
      });
      employeesNames.push(res[i].employee_full_name);
    }

    inquirer
      .prompt({
        type: "list",
        name: "employeePromptChoice",
        message: "Select employee to update:",
        choices: employeesNames,
      })
      .then((answer) => {
        const chosenEmployee = answer.employeePromptChoice;
        let chosenEmployeeID;
        for (let i = 0; i < employees.length; i++) {
          if (employees[i].fullName === chosenEmployee) {
            chosenEmployeeID = employees[i].id;
            break;
          }
        }

        updatedEmployee.id = chosenEmployeeID;

        const query = `SELECT role.title, role.id FROM role;`;
        connection.query(query, (err, res) => {
          if (err) throw err;

          const roles = [];
          const rolesNames = [];
          for (let i = 0; i < res.length; i++) {
            roles.push({
              id: res[i].id,
              title: res[i].title,
            });
            rolesNames.push(res[i].title);
          }

          inquirer
            .prompt({
              type: "list",
              name: "rolePromptChoice",
              message: "Select Role:",
              choices: rolesNames,
            })
            .then((answer) => {
              const chosenRole = answer.rolePromptChoice;
              let chosenRoleID;
              for (let i = 0; i < roles.length; i++) {
                if (roles[i].title === chosenRole) {
                  chosenRoleID = roles[i].id;
                }
              }

              updatedEmployee.roleID = chosenRoleID;

              const query = `UPDATE employee SET ? WHERE ?`;
              connection.query(
                query,
                [
                  {
                    role_id: updatedEmployee.roleID,
                  },
                  {
                    id: updatedEmployee.id,
                  },
                ],
                (err, res) => {
                  if (err) throw err;
                  console.log("Employee Role Updated");

                  setTimeout(EmployeeList, 500);
                }
              );
            });
        });
      });
  });
}
