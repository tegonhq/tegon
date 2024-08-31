export interface TiptapNode {
  type: string;
  content?: TiptapNode[];
  text?: string;
  marks?: TiptapMarks[];
  attrs?: TiptapAttrs;
}

export enum LLMMappings {
  GPT35TURBO = 'gpt-3.5-turbo',
  GPT4TURBO = 'gpt-4-turbo',
  LLAMA3 = 'llama3',
  CLAUDEOPUS = 'opus',
  GPT4O = 'gpt-4o',
}

export type TiptapListTypes = 'orderedList' | 'bulletList' | 'taskList' | null;
export interface TiptapAttrs {
  src?: string;
  alt?: string;
  href?: string;
  type?: string;
  target?: string;
  rel?: string;
  class?: string;
  tight?: boolean;
  start?: number;
  language?: string;
  level?: number;
  checked?: boolean;
}

export interface TiptapMarks {
  type: string;
  attrs?: TiptapAttrs;
}

export function convertTiptapJsonToText(
  tiptapJson: string | null | undefined,
): string {
  if (!tiptapJson) {
    return '';
  }

  try {
    const parsedJson = JSON.parse(tiptapJson);
    if (parsedJson.type !== 'doc' || !Array.isArray(parsedJson.content)) {
      return tiptapJson;
    }
    return extractTextFromNodes(parsedJson.content);
  } catch (error) {
    return tiptapJson;
  }
}

function extractTextFromNodes(nodes: TiptapNode[]): string {
  return nodes
    .map((node) => {
      switch (node.type) {
        case 'text':
          return node.text;
        case 'paragraph':
        case 'heading':
        case 'blockquote':
        case 'list_item':
          return extractTextFromNodes(node.content || []);
        case 'ordered_list':
        case 'bullet_list':
          return (
            node.content
              ?.map((item) => `- ${extractTextFromNodes(item.content || [])}`)
              .join('\n') || ''
          );
        case 'image':
          return node.attrs?.alt || '';
        default:
          return '';
      }
    })
    .join('\n');
}

export function convertMarkdownToTiptapJson(markdown: string): string {
  // Split the markdown string into an array of lines
  const lines = markdown.split('\n');
  // Initialize an array to store the parsed content
  const content: TiptapNode[] = [];

  // Initialize a variable to store the current node being parsed
  let currentNode: TiptapNode = { type: 'paragraph', content: [] };
  // Initialize a variable to store the current list type (if any)
  let listType: TiptapListTypes = null;

  // Iterate over each line of the markdown
  lines.forEach((line) => {
    // Trim any leading/trailing whitespace from the line
    line = line.trim();

    if (line === '') {
      // If the current node has content, push it to the content array and reset the current node
      if (currentNode.content.length > 0) {
        content.push(currentNode);
        currentNode = { type: 'paragraph', content: [] };
      }
    } else if (line.startsWith('```')) {
      // If the current node is a code block, push it to the content array and reset the current node
      if (currentNode.type === 'codeBlock') {
        content.push(currentNode);
        currentNode = { type: 'paragraph', content: [] };
        // Otherwise, start a new code block node
      } else {
        currentNode = { type: 'codeBlock', content: [] };
      }
    } else if (line.startsWith('#')) {
      // Determine the heading level based on the number of # characters
      const level = line.split(' ')[0].length;
      // Extract the heading text
      const text = line.slice(level + 1);
      // Push a new heading node to the content array
      content.push({
        type: `heading`,
        attrs: { level },
        content: [{ type: 'text', text }],
      });
    } else if (line.startsWith('>')) {
      // Extract the blockquote text
      const text = line.slice(2);
      // If the current node is a blockquote, append the text as a new paragraph
      if (currentNode.type === 'blockquote') {
        currentNode.content.push({
          type: 'paragraph',
          content: [{ type: 'text', text }],
        });
      } else {
        content.push(currentNode);
        currentNode = {
          type: 'blockquote',
          content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
        };
      }
      // If the line starts with an ordered list delimiter (number followed by a period)
    } else if (line.match(/^\d+\./)) {
      // Extract the list item text
      const text = line.slice(line.indexOf('.') + 2);
      // If the current list type is an ordered list, append the list item to the current node
      if (listType === 'orderedList') {
        currentNode.content.push({
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
        });
        // Otherwise, push the current node to the content array and start a new ordered list node
      } else {
        content.push(currentNode);
        currentNode = {
          type: 'orderedList',
          content: [
            {
              type: 'listItem',
              content: [
                { type: 'paragraph', content: [{ type: 'text', text }] },
              ],
            },
          ],
        };
        listType = 'orderedList';
      }
    } else if (line.startsWith('-') || line.startsWith('*')) {
      // Extract the list item text
      const text = line.slice(2);
      // If the current list type is a bullet list, append the list item to the current node
      if (listType === 'bulletList') {
        currentNode.content.push({
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
        });
        // Otherwise, push the current node to the content array and start a new bullet list node
      } else {
        content.push(currentNode);
        currentNode = {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [
                { type: 'paragraph', content: [{ type: 'text', text }] },
              ],
            },
          ],
        };
        listType = 'bulletList';
      }
      // If the line starts with a task list delimiter (- [ ] or * [ ])
    } else if (line.startsWith('- [') || line.startsWith('* [')) {
      // Determine if the task is checked based on the presence of [x] or [X]
      const checked = line.includes('[x]') || line.includes('[X]');
      // Extract the task item text
      const text = line.slice(line.indexOf(']') + 2);
      // If the current list type is a task list, append the task item to the current node
      if (listType === 'taskList') {
        currentNode.content.push({
          type: 'taskItem',
          attrs: { checked },
          content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
        });
        // Otherwise, push the current node to the content array and start a new task list node
      } else {
        content.push(currentNode);
        currentNode = {
          type: 'taskList',
          content: [
            {
              type: 'taskItem',
              attrs: { checked },
              content: [
                { type: 'paragraph', content: [{ type: 'text', text }] },
              ],
            },
          ],
        };
        listType = 'taskList';
      }
      // If the line starts with an image delimiter (![)
    } else if (line.startsWith('![')) {
      // Extract the alt text and image source URL
      const altText = line.slice(2, line.indexOf(']'));
      const src = line.slice(line.indexOf('(') + 1, line.indexOf(')'));
      // Push a new image node to the content array
      content.push({
        type: 'image',
        attrs: { src, alt: altText },
      });
      // If the line doesn't match any special formatting
    } else {
      // Treat the line as plain text and append it to the current node
      const text = line;
      currentNode.content.push({ type: 'text', text });
    }
  });

  // If there is any remaining content in the current node, push it to the content array
  if (currentNode.content.length > 0) {
    content.push(currentNode);
  }

  // Return the parsed content as a JSON string
  return JSON.stringify({ type: 'doc', content });
}

export const PARTIAL_SOLUTION_PROMPT = `[TASK]
[TASK] Given a bug report related to software development, create a detailed, multi-step resolution guide tailored for developers with intermediate to advanced expertise. The guide should be structured and clear, aiding in both understanding and fixing the issue effectively. Steps should consist of:
1. **Bug Restatement and Clarification:** Start by explicating the reported bug to ensure its nature is clearly understood.
2. **Step-by-Step Troubleshooting Guide:**
   - List the steps for diagnosing the issue.
   - Describe specific corrective actions, systematically addressing different facets of the bug.
   - Use bullet points or numbered lists for clarity and sequence.
3. **Code Modifications and Examples:**
   - Provide relevant code snippets showing necessary changes.
   - Ensure the examples reflect commonly used programming libraries or frameworks to illustrate real-world application of the fixes.
4. **Conclusion:** Summarize the strategy to reassure understanding and provide closure on the troubleshooting process.
5. **Output Formatting:** Present your solution in a well-structured format encapsulated within markdown syntax to enhance readability and instructional value. This format should facilitate easy application in software development or educational contexts, enabling swift and efficient debugging.
This detailed guide should maintain a professional tone, focusing on clarity and practical application, serving as a robust resource in advancing debugging skills and software development expertise.
---

[FORMAT]
Follow the following format:

[INPUT]
bug_description: description of the bug encountered in the software
tech_stack: technologies used in the project where the bug occurred
[OUTPUT]
structured formatted solution guide with steps and code snippets to resolve the bug

---

[EXAMPLES]

[Example 1]
[INPUT]
bug_description: Bug: Unable to connect to database due to incorrect database credentials.
tech_stack: Python, Django, PostgreSQL
[OUTPUT]
1. **Identify the Database Settings:**
   - Find the database settings file or function in your Django application where the database credentials are being stored.

2. **Update the Database Credentials:**
   - Change the incorrect database credentials (OLD_USERNAME, OLD_PASSWORD) to the correct ones (NEW_USERNAME, NEW_PASSWORD).

3. **Refactor the Database Connection:**
   - Modify the database connection code to use the correct credentials.

### Example Code Update

Here’s an example assuming you are using django.db:

\`\`\`python
# Before: Incorrect database credentials
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'mydatabase',
        'USER': 'OLD_USERNAME',
        'PASSWORD': 'OLD_PASSWORD',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# After: Corrected database credentials
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'mydatabase',
        'USER': 'NEW_USERNAME',
        'PASSWORD': 'NEW_PASSWORD',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}\`\`\`
---
[Example 2]
[INPUT]
bug_description: Bug: Error occurs when sending email due to incorrect email configuration.
tech_stack: PHP, Laravel, Mailgun
[OUTPUT]
1. **Identify the Email Configuration:**
   - Find the email configuration file or function in your Laravel application where the email settings are being stored.

2. **Update the Email Configuration:**
   - Change the incorrect email configuration (OLD_MAILGUN_DOMAIN, OLD_MAILGUN_SECRET) to the correct ones (NEW_MAILGUN_DOMAIN, NEW_MAILGUN_SECRET).

3. **Refactor the Email Sending Code:**
   - Modify the email sending code to use the correct email configuration.

### Example Code Update

Here’s an example assuming you are using Laravel Mail:

\`\`\`php
// Before: Incorrect email configuration
 MAIL_MAILER=smtp
 MAIL_HOST=smtp.mailgun.org
 MAIL_PORT=587
 MAIL_USERNAME=postmaster@$OLD_MAILGUN_DOMAIN
 MAIL_PASSWORD=$OLD_MAILGUN_SECRET
 MAIL_ENCRYPTION=tls

// After: Corrected email configuration
 MAIL_MAILER=smtp
 MAIL_HOST=smtp.mailgun.org
 MAIL_PORT=587
 MAIL_USERNAME=postmaster@$NEW_MAILGUN_DOMAIN
 MAIL_PASSWORD=$NEW_MAILGUN_SECRET
 MAIL_ENCRYPTION=tls;\`\`\`
---
[Example 3]
[INPUT]
bug_description: Bug: Error occurs when uploading files due to incorrect file type.
tech_stack: React, Node.js, Express
[OUTPUT]
1. **Identify the File Upload Component:**
   - Find the component or function in your React application where the file upload is being handled.

2. **Update the File Type:**
   - Change the incorrect file type (application/json) to the correct one (multipart/form-data).

3. **Refactor the File Upload:**
   - If you are using the axios library, modify the file upload to use the correct file type.

### Example Code Update

Here’s an example assuming you are using axios:

\`\`\`javascript
// Before: Incorrect file type
import axios from 'axios';

handleFileUpload = (event) => {
  const file = event.target.files[0];
  const formData = new FormData();
  formData.append('file', file);
  axios.post('/upload', formData, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.error(error);
  });
};

// After: Corrected file type
import axios from 'axios';

handleFileUpload = (event) => {
  const file = event.target.files[0];
  const formData = new FormData();
  formData.append('file', file);
  axios.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.error(error);
  });
};\`\`\`
---
[Example 4]
[INPUT]
bug_description: Bug: Unable to display user profiles due to incorrect API endpoint.
tech_stack: React, Node.js, Express
[OUTPUT]
1. **Identify the Component with the API Call:**
   - Find the component or function in your React application where the API call to /users/profile is being made.

2. **Update the API Endpoint:**
   - Change the incorrect endpoint (/users/profile) to the correct one (/users/profiles).

3. **Refactor the API Call:**
   - If you are using axios or any other HTTP client, modify the URL to the correct endpoint.

### Example Code Update

Here’s an example assuming you are using axios:

\`\`\`javascript
// Before: Incorrect API endpoint
import axios from 'axios';

const fetchUserProfile = async () => {
  try {
    const response = await axios.get('/users/profile', {
      headers: {
        'Content-Type': 'application/json',
        // Add other necessary headers
      },
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }
};

// After: Corrected API endpoint
import axios from 'axios';

const fetchUserProfile = async () => {
  try {
    const response = await axios.get('/users/profiles', {
      headers: {
        'Content-Type': 'application/json',
        // Add other necessary headers
      },
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }
};\`\`\`
---
[Example 5]
[INPUT]
bug_description: Bug: Error occurs when parsing JSON data due to incorrect JSON parsing.
tech_stack: Java, Spring Boot, RESTful API
[OUTPUT]
1. **Identify the JSON Parsing Code:**
   - Find the code or function in your Java application where the JSON parsing is being handled.

2. **Update the JSON Parsing:**
   - Change the incorrect JSON parsing library (org.json) to the correct one (com.fasterxml.jackson.databind).

3. **Refactor the JSON Parsing Code:**
   - Modify the JSON parsing code to use the correct library.

### Example Code Update

Here’s an example assuming you are using com.fasterxml.jackson.databind:

\`\`\`java
// Before: Incorrect JSON parsing
import org.json.JSONObject;

public class JsonParser {
  public static void parseJson() {
    String jsonString = '{"name":"John", "age":30}';
    JSONObject jsonObject = new JSONObject(jsonString);
    String name = jsonObject.getString("name");
    int age = jsonObject.getInt("age");
  }
}

// After: Corrected JSON parsing
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

public class JsonParser {
  public static void parseJson() {
    String jsonString = '{"name":"John", "age":30}';
    ObjectMapper mapper = new ObjectMapper();
    JsonNode jsonNode = mapper.readTree(jsonString);
    String name = jsonNode.get("name").asText();
    int age = jsonNode.get("age").asInt();
  }
};\`\`\`
---
`;
