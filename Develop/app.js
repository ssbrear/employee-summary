const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const { inherits } = require("util");

async function init() {
    // Figures out how many times to loop the questions
    const answer = await inquirer.prompt({
        type: 'input',
        message: 'How many team members are working on this project?',
        name: 'numMembers'
    })

    console.log(`\nThere are ${answer.numMembers} member of this team. Please give information about each member.\n`);
    let members = [];

    // Loops one time for each member
    for (let i = 0; i < answer.numMembers; i++) {
        const response = await inquirer.prompt([
            {
                type: 'input',
                message: 'Please insert your name: ',
                name: 'name'
            },
            {
                type: 'input',
                message: 'Please insert your employee id: ',
                name: 'id'
            },
            {
                type: 'input',
                message: 'Please insert your email:',
                name: 'email'
            },
            {
                type: 'list',
                message: 'Please indicate your role in this project:',
                name: 'role',
                choices: ['Manager', 'Engineer', 'Intern']
            }
        ]);

        // Checks for the role and asks additional questions
        if (response.role === 'Manager') {
            await inquirer
                .prompt(
                    {
                        type: 'input',
                        message: 'What is your office number?',
                        name: 'officeNumber'
                    }
                )
                .then(result => {
                    console.log("\n");
                    members.push(new Manager(response.name, response.id, response.email, result.officeNumber));
                });
        } else if (response.role === 'Engineer') {
            await inquirer
                .prompt(
                    {
                        type: 'input',
                        message: 'What is your Github username?',
                        name: 'github'
                    }
                )
                .then(result => {
                    console.log("\n");
                    members.push(new Engineer(response.name, response.id, response.email, result.github));
                });
        } else if (response.role === 'Intern') {
            await inquirer
                .prompt(
                    {
                        type: 'input',
                        message: 'What is the name of your academic institution?',
                        name: 'school'
                    }
                )
                .then(result => {
                    console.log("\n");
                    members.push(new Intern(response.name, response.id, response.email, result.school));
                });
        }
    }
    // Creates output directory if it doesn't exist
    if (!fs.existsSync('./output')) {
        fs.mkdirSync('./output');
    }
    // Creates a txt file in JSON format
    fs.writeFile('./output/members.txt', JSON.stringify(members, null, 4), (err) => {
        if (err) {
            throw err;
        }
        console.log("Text file of member info has been created in JSON format in the 'output' directory\n");
        render(members);
    });
    // Creates the HTML file
    fs.writeFile('./output/team.html', render(members), err => {
        if (err) {
            throw err;
        }
        console.log("HTML file of member info has been created in the 'output' directory\n");
    })
}

init();
