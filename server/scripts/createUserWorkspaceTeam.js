/** Copyright (c) 2024, Tegon, all rights reserved. **/

const crypto = require('crypto');
const readline = require('readline');

const axios = require('axios');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const host = 'http://localhost:3000/api';

function generateRandomPassword(length = 10) {
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numberChars = '0123456789';
  const specialChars = '!@#$%^&*()_+';

  let password = '';

  // Ensure at least one character from each required category
  password += lowercaseChars[crypto.randomInt(0, lowercaseChars.length)];
  password += uppercaseChars[crypto.randomInt(0, uppercaseChars.length)];
  password += numberChars[crypto.randomInt(0, numberChars.length)];
  password += specialChars[crypto.randomInt(0, specialChars.length)];

  // Generate remaining characters randomly
  const remainingChars = length - 4;
  const allChars = lowercaseChars + uppercaseChars + numberChars + specialChars;
  for (let i = 0; i < remainingChars; i++) {
    password += allChars[crypto.randomInt(0, allChars.length)];
  }

  // Shuffle the password characters
  password = password
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('');

  return password;
}

async function createUser(email, password = null) {
  try {
    const finalPassword = password ? password : generateRandomPassword(10);
    const userResponse = await axios.post(`${host}/auth/signup`, {
      formFields: [
        {
          id: 'email',
          value: email,
        },
        {
          id: 'password',
          value: finalPassword,
        },
      ],
    });

    if (userResponse.data.status === 'FIELD_ERROR') {
      throw userResponse.data;
    }
    console.log('User created successfully.');
    return { email, password: finalPassword };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

let accessToken;

async function signIn(email, password, adminUser = false) {
  try {
    const response = await axios.post(
      `${host}/auth/signin`,
      {
        formFields: [
          {
            id: 'email',
            value: email,
          },
          {
            id: 'password',
            value: password,
          },
        ],
      },
      { headers: {} },
    );

    if (adminUser) {
      accessToken = response.headers['st-access-token'];
      if (!accessToken) {
        throw 'Invalid Password';
      }
    }
    console.log('Signed in successfully. Access token:', accessToken);
    return response.data;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}

async function createOrGetWorkspace(workspaceName) {
  try {
    // Check if the workspace already exists
    const response = await axios.get(
      `${host}/v1/workspaces/name/${workspaceName}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    if (response.data) {
      // Workspace already exists, return the first workspace found
      return response.data;
    }
    // Workspace doesn't exist, create a new one
    const workspaceResponse = await axios.post(
      `${host}/v1/workspaces`,
      {
        name: workspaceName,
        slug: workspaceName.toLowerCase().replace(/\s+/g, ''),
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    return workspaceResponse.data;
  } catch (error) {
    console.error('Error creating or getting workspace:', error);
    throw error;
  }
}

async function getOrCreateTeam(teamName, teamIdentifier = null, workspaceId) {
  try {
    // Check if the workspace already exists
    const response = await axios.get(
      `${host}/v1/teams/name/${teamName}?workspaceId=${workspaceId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    if (response.data) {
      // Workspace already exists, return the first workspace found
      return response.data;
    }

    if (!teamIdentifier) {
      teamIdentifier = await new Promise((resolve) => {
        rl.question('Enter the team identifier: ', resolve);
      });
    }
    // Workspace doesn't exist, create a new one
    const workspaceResponse = await axios.post(
      `${host}/v1/teams?workspaceId=${workspaceId}`,
      {
        name: teamName,
        identifier: teamIdentifier,
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    return workspaceResponse.data;
  } catch (error) {
    console.error('Error creating or getting workspace:', error);
    throw error;
  }
}

async function addUserWorkspaceTeam(userEmails, workspace, team) {
  try {
    const userPromises = userEmails.map(async (email) => {
      const userResponse = await axios.get(
        `${host}/v1/users/email?email=${email}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      const user = userResponse.data;
      await axios.post(
        `${host}/v1/workspaces/${workspace.id}/add_users`,
        {
          userId: user.id,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      const userOnWorkspace = await axios.post(
        `${host}/v1/teams/${team.id}/add_member?workspaceId=${workspace.id}`,
        {
          userId: user.id,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      return { user, userOnWorkspace };
    });

    const users = await Promise.all(userPromises);

    return { users };
  } catch (error) {
    console.error('Error creating user, workspace, and team:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('Welcome to the User, Workspace, and Team Creation Script!');

    // Prompt for initial setup
    const initialSetup = await new Promise((resolve) => {
      rl.question('Is this initial setup (yes/no): ', (answer) => {
        resolve(answer.toLowerCase() === 'yes');
      });
    });

    // Prompt for admin email and password
    const adminEmail = await new Promise((resolve) => {
      rl.question('Enter your email: ', resolve);
    });
    const adminPassword = await new Promise((resolve) => {
      rl.question('Enter your password: ', resolve);
    });

    // Create admin user if initial setup
    if (initialSetup) {
      console.log(adminEmail, adminPassword);
      await createUser(adminEmail, adminPassword);
    }

    // Sign in as admin
    await signIn(adminEmail, adminPassword, true);

    while (true) {
      // Display menu options
      console.log('\nOptions:');
      console.log('1. Create Workspace');
      console.log('2. Create Team');
      console.log('3. Create Multiple Users');
      console.log('4. Add Users to Workspace and Team');
      console.log('5. Exit');

      // Prompt for user choice
      const option = await new Promise((resolve) => {
        rl.question('Enter your choice (1-5): ', resolve);
      });

      if (option === '1') {
        // Create workspace
        const workspaceName = await new Promise((resolve) => {
          rl.question('Enter the workspace name: ', resolve);
        });
        await createOrGetWorkspace(workspaceName);
        console.log(`Workspace ${workspaceName} created successfully.`);
      } else if (option === '2') {
        // Create team
        const workspaceName = await new Promise((resolve) => {
          rl.question('Enter the workspace name: ', resolve);
        });
        const workspace = await createOrGetWorkspace(workspaceName);

        const teamName = await new Promise((resolve) => {
          rl.question('Enter the team name: ', resolve);
        });
        const teamIdentifier = await new Promise((resolve) => {
          rl.question('Enter the team identifier: ', resolve);
        });

        await getOrCreateTeam(teamName, teamIdentifier, workspace.id);
        console.log(`Team ${teamName} created successfully.`);
      } else if (option === '3') {
        // Create multiple users
        const userEmailsInput = await new Promise((resolve) => {
          rl.question('Enter user emails (comma-separated): ', resolve);
        });
        const userEmails = userEmailsInput
          .split(',')
          .map((email) => email.trim());

        for (const email of userEmails) {
          const userDetails = await createUser(email);
          console.log(userDetails);
        }

        console.log('Users created successfully.');
      } else if (option === '4') {
        // Add users to workspace and team
        const userEmailsInput = await new Promise((resolve) => {
          rl.question('Enter user emails (comma-separated): ', resolve);
        });
        const userEmails = userEmailsInput
          .split(',')
          .map((email) => email.trim());
        const workspaceName = await new Promise((resolve) => {
          rl.question('Enter the workspace name: ', resolve);
        });
        const workspace = await createOrGetWorkspace(workspaceName);
        const teamName = await new Promise((resolve) => {
          rl.question('Enter the team name: ', resolve);
        });
        const team = await getOrCreateTeam(teamName, null, workspace.id);
        await addUserWorkspaceTeam(userEmails, workspace, team);
        console.log('Users added to workspace and team successfully.');
      } else if (option === '5') {
        // Exit the script
        break;
      } else {
        console.log('Invalid option. Please try again.');
      }
    }

    rl.close();
  } catch (error) {
    console.error('Error:', error);
    rl.close();
  }
}

main();
